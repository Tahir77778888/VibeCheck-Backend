const nodemailer = require('nodemailer');
// baaki imports...

router.post('/submit', async (req, res) => {
    try {
        const { username, scores, comment, polls, customAnswer, senderName } = req.body;

        // 1. Pehle Rating save karo (Tumhara purana logic)
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User nahi mila" });

        const newRating = new Rating({
            userId: user._id,
            scores,
            comment,
            polls,
            customAnswer,
            senderName
        });
        await newRating.save();

        // 2. 📧 EMAIL NOTIFICATION LOGIC (NAYA)
        if (user.email) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Ek premium dark-mode email template
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: '💌 You got hyped up on VibeCheck!',
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #000; color: #fff; border-radius: 12px; max-width: 500px; margin: auto;">
                        <h2 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">VibeCheck 📈</h2>
                        <p style="font-size: 16px; color: #a8a8a8; text-align: center;">Someone just dropped a secret message on your profile.</p>
                        
                        <div style="background-color: #121212; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #bc1888; border-top: 1px solid #333; border-right: 1px solid #333; border-bottom: 1px solid #333;">
                            <p style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: ${senderName !== 'Anonymous' ? '#1ed760' : '#bc1888'}">
                                ${senderName !== 'Anonymous' ? senderName : 'Someone'} says:
                            </p>
                            <p style="font-size: 16px; margin: 0; font-style: italic; line-height: 1.5;">"${comment}"</p>
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://check-my-vibes.netlify.app/${username}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(45deg, #f09433, #bc1888); color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">
                                View Full Analytics
                            </a>
                        </div>
                    </div>
                `
            };

            // Background mein email bhej do
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.error("Email error:", error);
                else console.log("Email bheja gaya:", info.response);
            });
        }

        res.json({ success: true, message: "Rating submitted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});