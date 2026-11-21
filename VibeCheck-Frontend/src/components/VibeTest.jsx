import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

const CARD_THEMES = {
    noir: {
        name: 'Noir 🖤',
        bg: 'linear-gradient(165deg, #141414 0%, #050505 60%, #1c1c1c 100%)',
        border: 'rgba(255, 255, 255, 0.25)',
        accent: 'linear-gradient(45deg, #ffffff, #a1a1aa)',
        tagBg: 'rgba(255, 255, 255, 0.1)',
        tagColor: '#e4e4e7'
    },
    velvet: {
        name: 'Velvet 🌹',
        bg: 'linear-gradient(165deg, #2b0816 0%, #090507 60%, #3a091c 100%)',
        border: 'rgba(255, 65, 108, 0.5)',
        accent: 'linear-gradient(45deg, #ff416c, #ff85a2)',
        tagBg: 'rgba(255, 65, 108, 0.2)',
        tagColor: '#ff85a2'
    },
    gold: {
        name: 'Gold ✨',
        bg: 'linear-gradient(165deg, #241a08 0%, #080705 60%, #2e2009 100%)',
        border: 'rgba(245, 176, 65, 0.5)',
        accent: 'linear-gradient(45deg, #f5b041, #fceabb)',
        tagBg: 'rgba(245, 176, 65, 0.18)',
        tagColor: '#f8c471'
    }
};

const TESTS_DATA = {
    'villain-arc': {
        title: 'Your Villain Arc 🐺',
        category: "MEN'S CORNER",
        defaultTheme: 'noir',
        questions: [
            {
                q: "Someone disrespects you in front of a group. Your instant move?",
                options: [
                    { text: "Dead silence, cold eye contact, let them look foolish", score: 3 },
                    { text: "Drop one razor-sharp comeback that ends the conversation", score: 4 },
                    { text: "Smile, remember it forever, and outgrow them completely", score: 2 },
                    { text: "Brush it off — they aren't worth my energy", score: 1 }
                ]
            },
            {
                q: "It's 6 AM. Everyone else is asleep. What's driving you?",
                options: [
                    { text: "Proving every single doubter wrong", score: 4 },
                    { text: "Building an empire in complete silence", score: 3 },
                    { text: "Discipline — no mood swings, just execution", score: 2 },
                    { text: "Honestly, I'm still awake from last night's ideas", score: 1 }
                ]
            },
            {
                q: "How do you handle a major setback or heartbreak?",
                options: [
                    { text: "Disappear for 6 months, come back unrecognizable", score: 4 },
                    { text: "Channel all of it into the gym and work", score: 3 },
                    { text: "Analyze what went wrong so it never happens again", score: 2 },
                    { text: "Talk it out with my closest circle and reset", score: 1 }
                ]
            },
            {
                q: "Pick your power motto:",
                options: [
                    { text: "Move in silence. Let results make the noise.", score: 3 },
                    { text: "They laughed at the vision, they'll pay for the view.", score: 4 },
                    { text: "Stay calm, stay dangerous, stay kind.", score: 2 },
                    { text: "Chaos is a ladder.", score: 1 }
                ]
            }
        ],
        getResult: (total) => {
            if (total <= 6) return { badge: "The Unbothered Stoic 🗿", motto: "Peace is the ultimate flex.", desc: "You don't chase, you don't beg, and nobody can rattle your frame." };
            if (total <= 10) return { badge: "The Silent Strategist ♟️", motto: "Always 3 moves ahead.", desc: "Calm on the outside, calculating everything on the inside. Lethal focus." };
            if (total <= 13) return { badge: "The Relentless Hustler 🔥", motto: "Obsession beats talent.", desc: "Heartbreak, doubt, pressure — you turn all of it into pure fuel." };
            return { badge: "The Dark Mastermind 🐺", motto: "They created a monster.", desc: "Zero mercy for mediocrity. Your villain arc is everyone else's wake-up call." };
        }
    },

    'rizz-check': {
        title: 'Rizz & Presence Check 🥂',
        category: "MEN'S CORNER",
        defaultTheme: 'gold',
        questions: [
            {
                q: "You make eye contact with someone attractive across a cafe. You:",
                options: [
                    { text: "Hold it for 2 seconds, slight smirk, look away", score: 4 },
                    { text: "Walk over with a smooth, effortless opener", score: 3 },
                    { text: "Smile warmly like a normal human", score: 2 },
                    { text: "Panic and aggressively stare at my coffee", score: 1 }
                ]
            },
            {
                q: "Your go-to texting style when you like someone:",
                options: [
                    { text: "Playful teasing + late-night voice notes", score: 4 },
                    { text: "Short, mysterious, high-value replies", score: 3 },
                    { text: "Witty banter and actually remembering details", score: 2 },
                    { text: "Memes and hoping for the best", score: 1 }
                ]
            },
            {
                q: "What's your biggest unspoken flex?",
                options: [
                    { text: "My voice and calm eye contact", score: 4 },
                    { text: "My style, scent, and clean aesthetic", score: 3 },
                    { text: "My humor — I can make anyone laugh in 10 seconds", score: 2 },
                    { text: "My loyalty and emotional intelligence", score: 1 }
                ]
            },
            {
                q: "First date vibe:",
                options: [
                    { text: "Dim-lit rooftop / speakeasy with jazz", score: 4 },
                    { text: "Late-night drive + street coffee + deep talks", score: 3 },
                    { text: "Artisanal cafe + bookstore walk", score: 2 },
                    { text: "Bowling or arcade to keep it competitive", score: 1 }
                ]
            }
        ],
        getResult: (total) => {
            if (total <= 6) return { badge: "Golden Retriever Rizz ☀️", motto: "Effortlessly likable.", desc: "Warm, funny, and zero pretension. People feel instantly hooked by your vibe." };
            if (total <= 10) return { badge: "Old Money Calm 🥂", motto: "Quiet luxury energy.", desc: "Classy, composed, and observant. You don't try to impress — you just do." };
            if (total <= 13) return { badge: "Smooth Operator 🎩", motto: "Precision over volume.", desc: "Sharp wit, killer timing, and immaculate presence. You own the room." };
            return { badge: "Unspoken Menace 🖤", motto: "Dangerous eye contact.", desc: "Mysterious, magnetic, and slightly toxic in the most unforgettable way." };
        }
    },

    'baddie-type': {
        title: 'What Kind of Baddie Are You? 💋',
        category: "BADDIES CORNER",
        defaultTheme: 'velvet',
        questions: [
            {
                q: "You walk into a party 30 minutes late. What's the energy?",
                options: [
                    { text: "All black, heels clicking, zero apologies", score: 4 },
                    { text: "Soft glam, expensive perfume, effortless glow", score: 3 },
                    { text: "Laughing with my girls, instantly stealing the spotlight", score: 2 },
                    { text: "Quietly stunning — people ask 'who is she?'", score: 1 }
                ]
            },
            {
                q: "A guy fumbles you and texts 'I miss you' 3 months later. You:",
                options: [
                    { text: "Leave it on delivered forever. Access revoked.", score: 4 },
                    { text: "Reply 'Who is this?' and block", score: 3 },
                    { text: "Screenshot for the group chat, then ignore", score: 2 },
                    { text: "Wish him well — I'm already 10 levels above that", score: 1 }
                ]
            },
            {
                q: "Pick your dream aesthetic:",
                options: [
                    { text: "Dark feminine — red lips, heels, main villain energy", score: 4 },
                    { text: "Soft luxury — silk, iced matcha, Pinterest life", score: 3 },
                    { text: "CEO Diva — blazer, ambition, booked & busy", score: 2 },
                    { text: "Chaotic It-Girl — flash photography & midnight drives", score: 1 }
                ]
            },
            {
                q: "What's your biggest superpower?",
                options: [
                    { text: "My intuition — I spot fake energy in 2 seconds", score: 4 },
                    { text: "My standards — I never settle for bare minimum", score: 3 },
                    { text: "My aura — I don't chase, I attract", score: 2 },
                    { text: "My humor — pretty AND funny is lethal", score: 1 }
                ]
            }
        ],
        getResult: (total) => {
            if (total <= 6) return { badge: "Soft Luxury Icon 🦢", motto: "Protected, peaceful, pricey.", desc: "Effortless grace, high standards, and zero tolerance for low-vibration drama." };
            if (total <= 10) return { badge: "Unapologetic CEO 💼", motto: "Booked, busy, and blessed.", desc: "Ambitious, sharp, and intimidating to anyone who can't match your pace." };
            if (total <= 13) return { badge: "Chaotic It-Girl 📸", motto: "The moment, not a trend.", desc: "Magnetic, bold, and always the main character in every room you enter." };
            return { badge: "Dark Feminine Siren 💋", motto: "Rare, lethal, unforgettable.", desc: "Mysterious aura, razor-sharp boundaries. Once they fumble you, it's over." };
        }
    },

    'delulu-meter': {
        title: 'Standards vs. Delulu Meter 💅',
        category: "BADDIES CORNER",
        defaultTheme: 'velvet',
        questions: [
            {
                q: "He takes 6 hours to reply, then texts 'Hey sorry was busy'. Verdict?",
                options: [
                    { text: "He's clearly planning a surprise for me", score: 4 },
                    { text: "I'll reply after 12 hours to keep the score even", score: 2 },
                    { text: "Bare minimum. Next.", score: 1 },
                    { text: "Maybe he's just shy and intimidated by my aura", score: 3 }
                ]
            },
            {
                q: "You lock eyes with a cute stranger for 1.5 seconds. Your brain:",
                options: [
                    { text: "Already picking our wedding playlist", score: 4 },
                    { text: "Yep, he's definitely obsessed with me", score: 3 },
                    { text: "Nice vibe, moving on", score: 1 },
                    { text: "I'll walk past him one more time just to be sure", score: 2 }
                ]
            },
            {
                q: "Your friend says 'I think he's a red flag.' You say:",
                options: [
                    { text: "Red is my favorite color anyway", score: 4 },
                    { text: "I can fix him (I definitely cannot)", score: 3 },
                    { text: "Say less, I'm blocking him right now", score: 1 },
                    { text: "Just let me ruin my peace one last time", score: 2 }
                ]
            },
            {
                q: "How realistic is your ideal type?",
                options: [
                    { text: "Written by a female author in a 19th-century novel", score: 4 },
                    { text: "Tall, obsessed with me, emotionally intelligent, rich", score: 3 },
                    { text: "Respectful, funny, and consistent", score: 1 },
                    { text: "A mix of toxic mystery and loyal golden retriever", score: 2 }
                ]
            }
        ],
        getResult: (total) => {
            const pct = Math.min(100, Math.round((total / 16) * 100));
            if (pct <= 30) return { badge: `${pct}% — High-Standards Queen 👑`, motto: "Zero delulu, pure clarity.", desc: "You see through games instantly. Bare minimum doesn't stand a chance." };
            if (pct <= 60) return { badge: `${pct}% — Romantic Realist 🌹`, motto: "Sweet heart, sharp eyes.", desc: "A little bit of daydreaming, but you still know when to walk away." };
            if (pct <= 82) return { badge: `${pct}% — Certified Delulu Diva 💅`, motto: "Delulu is the solulu.", desc: "Your imagination deserves an Oscar, and honestly? We love the confidence." };
            return { badge: `${pct}% — Peak Delulu Royalty ✨`, motto: "Living in a Netflix rom-com.", desc: "Reality is optional. You manifest everything and somehow it still works." };
        }
    },

    'red-flag': {
        title: 'Red Flag Analyzer 🚩',
        category: 'CLASSIC',
        defaultTheme: 'velvet',
        questions: [
            {
                q: "Someone texts you 'We need to talk.' Your instant reaction?",
                options: [
                    { text: "Panic and overthink every life decision", score: 1 },
                    { text: "Leave them on seen for 4 hours to assert dominance", score: 3 },
                    { text: "Reply 'Cool, call me when free'", score: 0 },
                    { text: "Reply 'Same.' and turn off Wi-Fi", score: 4 }
                ]
            },
            {
                q: "How do you handle an argument when you know you're wrong?",
                options: [
                    { text: "Admit it and apologize immediately", score: 0 },
                    { text: "Bring up something they did in 2023", score: 4 },
                    { text: "Go silent until they apologize first", score: 3 },
                    { text: "Make a joke to change the topic", score: 1 }
                ]
            },
            {
                q: "Your friend cancels plans last minute. What do you do?",
                options: [
                    { text: "Secretly relieved, back to bed", score: 1 },
                    { text: "Say 'It's totally fine!' while plotting revenge", score: 3 },
                    { text: "Understand and reschedule", score: 0 },
                    { text: "Post a cryptic Instagram story", score: 4 }
                ]
            },
            {
                q: "What's your texting reply speed?",
                options: [
                    { text: "0.2 seconds (chronically online)", score: 1 },
                    { text: "3-5 business days", score: 3 },
                    { text: "Depends on who it is", score: 2 },
                    { text: "I reply in my head and forget", score: 2 }
                ]
            }
        ],
        getResult: (total) => {
            const percent = Math.min(100, Math.round((total / 16) * 100));
            if (percent <= 25) return { badge: `${percent}% — Walking Green Forest 🌿`, motto: "Too pure for this era.", desc: "Honestly, protect your peace. You're the rare healthy one in the group." };
            if (percent <= 55) return { badge: `${percent}% — Beige Flag Energy 🐪`, motto: "Cute chaos.", desc: "A little chaotic, a little sweet. Keeps everyone guessing." };
            if (percent <= 80) return { badge: `${percent}% — Certified Red Flag 🚩`, motto: "Toxic, yet unforgettable.", desc: "Chaos follows you, and somehow people still come back for more." };
            return { badge: `${percent}% — Final Boss Menace 😈`, motto: "Owner of the red flag factory.", desc: "You don't just have red flags, you turn them into an aesthetic." };
        }
    },

    'aura-reader': {
        title: 'Aura Reader ✨',
        category: 'CLASSIC',
        defaultTheme: 'gold',
        questions: [
            {
                q: "It's 2 AM. What are you most likely doing?",
                options: [
                    { text: "Deep-diving into random Wikipedia rabbit holes", score: 1 },
                    { text: "Listening to cinematic music pretending I'm in a movie", score: 2 },
                    { text: "Planning a startup or life glow-up", score: 3 },
                    { text: "Actually sleeping like a normal human", score: 0 }
                ]
            },
            {
                q: "Pick a vibe for your ideal weekend:",
                options: [
                    { text: "Late-night drive with loud music", score: 3 },
                    { text: "Cozy cafe, coffee, and good conversation", score: 1 },
                    { text: "House party with the whole squad", score: 2 },
                    { text: "Do Not Disturb mode + solo recharge", score: 0 }
                ]
            },
            {
                q: "What's the first thing people notice about you?",
                options: [
                    { text: "My humor / chaotic energy", score: 2 },
                    { text: "Calm, mysterious presence", score: 0 },
                    { text: "Confidence and ambition", score: 3 },
                    { text: "Warmth and good listener vibes", score: 1 }
                ]
            },
            {
                q: "Choose a superpower:",
                options: [
                    { text: "Read minds", score: 0 },
                    { text: "Teleport anywhere", score: 3 },
                    { text: "Pause time", score: 1 },
                    { text: "Infinite charisma", score: 2 }
                ]
            }
        ],
        getResult: (total) => {
            if (total <= 3) return { badge: "Midnight Indigo 🌌", motto: "Quiet power.", desc: "Deep, mysterious, and observant. You speak less, but everyone listens." };
            if (total <= 6) return { badge: "Emerald Calm 🍃", motto: "Magnetic peace.", desc: "Grounded, loyal, and rare. People instantly feel safe around your energy." };
            if (total <= 9) return { badge: "Electric Violet ⚡", motto: "Unpredictable genius.", desc: "Creative, effortlessly cool, and main character energy without trying." };
            return { badge: "Solar Gold 🔥", motto: "Unstoppable force.", desc: "Bold and ambitious. You walk into a room and the whole vibe shifts." };
        }
    }
};

const VibeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const test = TESTS_DATA[testId];

    const [currentQ, setCurrentQ] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(test?.defaultTheme || 'noir');
    const [copiedMsg, setCopiedMsg] = useState(false);

    const myUsername = localStorage.getItem('username') || 'vibecheck';

    if (!test) {
        return (
            <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2>Test not found 😅</h2>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Back to Hub</button>
            </div>
        );
    }

    const handleAnswer = (score) => {
        const nextScore = totalScore + score;
        setTotalScore(nextScore);
        if (currentQ + 1 < test.questions.length) {
            setCurrentQ(currentQ + 1);
        } else {
            setFinished(true);
        }
    };

    const resetTest = () => {
        setCurrentQ(0);
        setTotalScore(0);
        setFinished(false);
    };

    const downloadStoryCard = async () => {
        if (!cardRef.current) return;

        // Auto-copy direct link
        const shareUrl = `${window.location.origin}/test/${testId}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopiedMsg(true);
            setTimeout(() => setCopiedMsg(false), 4000);
        } catch (err) {
            console.log('Clipboard copy failed:', err);
        }

        // Download 9:16 Card
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: '#050505',
            scale: 3
        });
        const link = document.createElement('a');
        link.download = `VibeCheck-${testId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const result = finished ? test.getResult(totalScore) : null;
    const activeTheme = CARD_THEMES[selectedTheme];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 50% -20%, #4a154b 0%, #050505 55%)',
            color: '#fff',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            padding: '30px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {!finished ? (
                <div style={{
                    width: '100%',
                    maxWidth: '550px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    padding: '32px 24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '13px', color: '#a8a8a8', fontWeight: 'bold' }}>{test.title}</span>
                        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>✕ Exit</button>
                    </div>

                    <div style={{ fontSize: '11px', color: '#ff66c4', fontWeight: '800', marginBottom: '10px', letterSpacing: '1.5px' }}>
                        QUESTION {currentQ + 1} OF {test.questions.length}
                    </div>

                    <h2 style={{ fontSize: '21px', margin: '0 0 24px 0', lineHeight: '1.4' }}>
                        {test.questions[currentQ].q}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {test.questions[currentQ].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt.score)}
                                style={{
                                    padding: '16px 20px',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '14px',
                                    color: '#fff',
                                    fontSize: '15px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#bc1888'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* 🎨 THEME SWITCHER */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {Object.keys(CARD_THEMES).map((key) => (
                            <button
                                key={key}
                                onClick={() => setSelectedTheme(key)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '999px',
                                    border: selectedTheme === key ? '1px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                                    background: selectedTheme === key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
                                    color: '#fff',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {CARD_THEMES[key].name}
                            </button>
                        ))}
                    </div>

                    {/* 📸 9:16 INSTAGRAM STORY CARD 2.0 */}
                    <div
                        ref={cardRef}
                        style={{
                            width: '100%',
                            aspectRatio: '9 / 16',
                            background: activeTheme.bg,
                            border: `1.5px solid ${activeTheme.border}`,
                            borderRadius: '28px',
                            padding: '32px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            textAlign: 'center',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.75)',
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Top Tag */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '-0.5px' }}>
                                vibecheck<span style={{ color: '#bc1888' }}>.</span>
                            </span>
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                letterSpacing: '1.2px',
                                padding: '5px 10px',
                                borderRadius: '999px',
                                background: activeTheme.tagBg,
                                color: activeTheme.tagColor
                            }}>
                                {test.category}
                            </span>
                        </div>

                        {/* Center Verdict */}
                        <div>
                            <div style={{ fontSize: '12px', color: '#a1a1aa', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>
                                {test.title}
                            </div>
                            <h1 style={{
                                fontSize: '30px',
                                fontWeight: '900',
                                lineHeight: '1.2',
                                background: activeTheme.accent,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                margin: '0 0 14px 0'
                            }}>
                                {result.badge}
                            </h1>
                            <div style={{
                                display: 'inline-block',
                                fontSize: '13px',
                                fontStyle: 'italic',
                                color: activeTheme.tagColor,
                                marginBottom: '18px'
                            }}>
                                "{result.motto}"
                            </div>
                            <p style={{ color: '#d4d4d8', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                                {result.desc}
                            </p>
                        </div>

                        {/* 🔗 HYBRID STICKER-READY PILL */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                            <div style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '14px',
                                background: 'rgba(255,255,255,0.06)',
                                border: `1px solid ${activeTheme.border}`,
                                fontSize: '12px',
                                fontWeight: '800',
                                letterSpacing: '0.8px',
                                color: '#fff'
                            }}>
                                🔗 vibecheck • take this test →
                            </div>
                            <span style={{ fontSize: '11px', color: '#a1a1aa' }}>@{myUsername}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '18px' }}>
                        <button
                            onClick={downloadStoryCard}
                            style={{
                                flex: 1,
                                padding: '14px',
                                background: 'linear-gradient(45deg, #f09433, #bc1888)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            {copiedMsg ? 'Saved + Link Copied! Paste on IG 🔗' : 'Save 9:16 Story Card 📸'}
                        </button>
                        <button onClick={resetTest} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', cursor: 'pointer' }}>🔄</button>
                        <button onClick={() => navigate('/dashboard')} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Hub</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VibeTest;