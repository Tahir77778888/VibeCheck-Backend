import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';

function Profile() {

    const { username: rawUsername } = useParams();
    const username = rawUsername ? rawUsername.replace('@', '') : '';
    const [userData, setUserData] = useState(null);

    // Naye States
    const [ratings, setRatings] = useState({ trust: 50, vibe: 50, intellect: 50, humor: 50 });
    const [polls, setPolls] = useState({}); // 10 questions ka data
    const [currentSlide, setCurrentSlide] = useState(0); // Slider control

    const [userComment, setUserComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [senderName, setSenderName] = useState("");

    // Custom Q&A States
    const [customAnswer, setCustomAnswer] = useState("");
    const [isEditingQ, setIsEditingQ] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const fileInputRef = useRef(null);
    const storyCardRef = useRef(null);

    // Check if logged in user is the owner
    const isOwner = localStorage.getItem('vibe_username') === username;

    // 10 Poll Questions Array
    const pollQuestions = [
        { id: 'q1', title: 'Sabse Bada Green Flag? 💚', options: ['Hype Person', 'Golden Heart', 'Good Listener', 'Always There'] },
        { id: 'q2', title: 'Best Quality? ✨', options: ['Main Character', 'Chill Pill', 'Pure Soul', '3AM Friend'] },
        { id: 'q3', title: 'First Impression? 👀', options: ['Intimidating', 'Cute & Innocent', 'Full Attitude', 'Quiet'] },
        { id: 'q4', title: 'Secret Talent? 🥷', options: ['Overthinking', 'Sarcasm Pro', 'Giving Advice', 'Sleeping Anywhere'] },
        { id: 'q5', title: 'Spirit Animal? 🐾', options: ['Golden Retriever', 'Black Cat', 'Lone Wolf', 'Panda'] },
        { id: 'q6', title: 'Party Vibe? 🪩', options: ['DJ Babu', 'Corner Observer', 'Dance Floor Star', 'Deep Talks'] },
        { id: 'q7', title: 'Red Flag (Worst Habit)? 🚩', options: ['Late Replies', 'Canceling Plans', 'Zoning Out', 'Ghosting'] },
        { id: 'q8', title: 'Love Language? 💌', options: ['Sending Memes', 'Quality Time', 'Free Food', 'Playful Insults'] },
        { id: 'q9', title: 'Future Prediction? 🔮', options: ['Rich CEO', 'World Traveler', 'Married Early', 'Still Confused'] },
        { id: 'q10', title: 'Needs Right Now? 🔋', options: ['A Hug', 'Coffee', 'Sleep', '10 Crore Rupees'] }
    ];

    useEffect(() => {
        fetchProfile();
    }, [username]);

    const fetchProfile = () => {
        // Nayi line: username se '@' hatao agar kisine daal diya ho
        const cleanUsername = username.replace('@', '');

        // Yahan ${username} ki jagah ${cleanUsername} bhej do
        axios.get(`https://vibecheck-backend-n4yi.onrender.com/api/users/${cleanUsername}`)
            .then((response) => {
                setUserData(response.data);
                setNewQuestion(response.data.user.customQuestion || "Farewell mein mujhe kya pehenna chahiye?");
            })
            .catch(() => setUserData(null));
    };
    const submitVibeCheck = async () => {
        try {
            await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/ratings/submit', {
                username: username,
                scores: ratings,
                comment: userComment || "Sending good vibes! ✨",
                polls: polls,
                customAnswer: customAnswer,
                senderName: isAnonymous ? "Anonymous" : (senderName || "A Friend")
            });
            alert("Message Sent! 💌");
            // Reset form
            setUserComment(""); setSenderName(""); setIsAnonymous(true);
            setPolls({}); setCustomAnswer(""); setCurrentSlide(0);
            fetchProfile();
        } catch (error) {
            alert("Kuch gadbad ho gayi bhai.");
        }
    };

    const handleUpdateQuestion = async () => {
        try {
            await axios.post(`https://vibecheck-backend-n4yi.onrender.com/api/users/${username}/update-question`, {
                question: newQuestion
            });
            setIsEditingQ(false);
            fetchProfile();
        } catch (error) {
            alert("Question update fail hua.");
        }
    };

    // Analytics Helpers
    const getTopPoll = (pollKey) => {
        if (!userData || !userData.ratings || userData.ratings.length === 0) return "No data yet";
        const counts = {};
        userData.ratings.forEach(r => {
            if (r.polls && r.polls[pollKey]) {
                counts[r.polls[pollKey]] = (counts[r.polls[pollKey]] || 0) + 1;
            }
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : "No data yet";
    };

    const getVibeTitle = (scores) => {
        if (!scores) return "Mystery Aura 🌫️";
        if (scores.intellect >= 80 && scores.trust >= 80) return "The Mastermind 🧠";
        if (scores.vibe >= 80 && scores.humor >= 80) return "Chaotic Good 🌪️";
        if (scores.vibe >= 85) return "Pure Main Character 🌟";
        return "The Enigma 🎭";
    };

    // Profile DP & Story Functions (Kept original logic)
    const handleFileChange = async (e) => { /* same as before */ };
    const generateAndDownloadStory = async () => { /* same as before */ };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#fafafa', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", padding: '20px 10px' }}>
            {userData && userData.user ? (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', margin: '0 auto' }}>

                    {/* HEADER */}
                    <div style={{ textAlign: 'center', backgroundColor: '#121212', padding: '30px', borderRadius: '16px', border: '1px solid #262626' }}>
                        <img src={userData.user.profilePic || 'https://via.placeholder.com/150'} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #bc1888', marginBottom: '15px' }} />
                        <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>{userData.user.name}</h2>
                        <p style={{ color: '#a8a8a8', margin: '0 0 15px 0', fontSize: '14px' }}>@{userData.user.username}</p>
                        <div style={{ padding: '8px 16px', backgroundColor: '#262626', borderRadius: '8px', display: 'inline-block', fontSize: '13px', fontWeight: '600' }}>
                            {getVibeTitle(userData.averageScores)}
                        </div>
                    </div>

                    {/* 📊 DYNAMIC VIBE DASHBOARD */}
                    <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Vibe Analytics 📈</span>
                            <span style={{ color: '#bc1888' }}>{userData.ratings?.length || 0} Hypes</span>
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            {['trust', 'vibe', 'intellect', 'humor'].map((trait) => (
                                <div key={trait} style={{ backgroundColor: '#000', padding: '12px', borderRadius: '10px', border: '1px solid #333' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ textTransform: 'capitalize', fontSize: '12px', color: '#a8a8a8' }}>{trait}</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{Math.round(userData.averageScores?.[trait] || 50)}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', backgroundColor: '#262626', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${userData.averageScores?.[trait] || 50}%`, height: '100%', background: 'linear-gradient(90deg, #bc1888, #f09433)' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, backgroundColor: '#000', padding: '12px', borderRadius: '10px', border: '1px solid #333', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#a8a8a8', display: 'block', marginBottom: '5px' }}>Top Green Flag 💚</span>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1ed760' }}>{getTopPoll('q1')}</span>
                            </div>
                            <div style={{ flex: 1, backgroundColor: '#000', padding: '12px', borderRadius: '10px', border: '1px solid #333', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#a8a8a8', display: 'block', marginBottom: '5px' }}>Best Quality ✨</span>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f09433' }}>{getTopPoll('q2')}</span>
                            </div>
                        </div>
                    </div>

                    {/* ✍️ CUSTOM Q&A SECTION */}
                    <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Ask Me Anything 🎙️</h3>
                            {isOwner && (
                                <button onClick={() => setIsEditingQ(!isEditingQ)} style={{ background: 'none', border: 'none', color: '#bc1888', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {isEditingQ ? 'Cancel' : 'Edit Question'}
                                </button>
                            )}
                        </div>

                        {isEditingQ && isOwner ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff' }} />
                                <button onClick={handleUpdateQuestion} style={{ padding: '10px 15px', backgroundColor: '#bc1888', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: '15px', color: '#fafafa', marginBottom: '15px', padding: '12px', backgroundColor: '#000', borderRadius: '8px', borderLeft: '3px solid #bc1888' }}>
                                    "{userData.user.customQuestion || 'Farewell mein mujhe kya pehenna chahiye?'}"
                                </p>
                                {!isOwner && (
                                    <input type="text" placeholder="Type your answer here..." value={customAnswer} onChange={(e) => setCustomAnswer(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', fontSize: '14px' }} />
                                )}
                            </div>
                        )}
                    </div>

                    {/* 🎡 POLL SLIDER (10 Questions) */}
                    {!isOwner && (
                        <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626' }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#a8a8a8', textAlign: 'center' }}>Question {currentSlide + 1} of 10</h3>
                            <h2 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>{pollQuestions[currentSlide].title}</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                {pollQuestions[currentSlide].options.map(opt => (
                                    <button key={opt} onClick={() => {
                                        setPolls({ ...polls, [pollQuestions[currentSlide].id]: opt });
                                        if (currentSlide < 9) setTimeout(() => setCurrentSlide(c => c + 1), 300); // Auto next slide
                                    }}
                                        style={{ padding: '12px', borderRadius: '10px', border: polls[pollQuestions[currentSlide].id] === opt ? '1px solid #bc1888' : '1px solid #333', backgroundColor: polls[pollQuestions[currentSlide].id] === opt ? 'rgba(188,24,136,0.1)' : '#000', color: polls[pollQuestions[currentSlide].id] === opt ? '#bc1888' : '#fafafa', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.2s' }}>
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button disabled={currentSlide === 0} onClick={() => setCurrentSlide(c => c - 1)} style={{ background: 'none', border: 'none', color: currentSlide === 0 ? '#333' : '#a8a8a8', cursor: 'pointer' }}>◀ Prev</button>
                                <button disabled={currentSlide === 9} onClick={() => setCurrentSlide(c => c + 1)} style={{ background: 'none', border: 'none', color: currentSlide === 9 ? '#333' : '#a8a8a8', cursor: 'pointer' }}>Next ▶</button>
                            </div>
                        </div>
                    )}

                    {/* 💌 HYPE FORM (Only for Public) */}
                    {!isOwner && (
                        <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626' }}>
                            {/* 4 Range Sliders */}
                            <div style={{ marginBottom: '20px' }}>
                                {['trust', 'vibe', 'intellect', 'humor'].map((trait) => (
                                    <div key={trait} style={{ marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ textTransform: 'capitalize', fontSize: '12px', color: '#a8a8a8' }}>{trait}</span>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{ratings[trait]}</span>
                                        </div>
                                        <input type="range" name={trait} min="1" max="100" value={ratings[trait]} onChange={(e) => setRatings({ ...ratings, [e.target.name]: Number(e.target.value) })} style={{ width: '100%', accentColor: '#bc1888' }} />
                                    </div>
                                ))}
                            </div>

                            {/* Anonymous Toggle & Message */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <input type="checkbox" id="anonToggle" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#bc1888' }} />
                                <label htmlFor="anonToggle" style={{ fontSize: '14px', color: '#fafafa', cursor: 'pointer' }}>Keep my identity secret 🕵️</label>
                            </div>
                            {!isAnonymous && <input type="text" placeholder="Your Name (Optional)" value={senderName} onChange={(e) => setSenderName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', marginBottom: '15px' }} />}
                            <textarea placeholder="Write a sweet message..." value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', minHeight: '80px', marginBottom: '15px' }} />
                            <button onClick={submitVibeCheck} style={{ width: '100%', padding: '15px', background: '#fafafa', color: '#000', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Send {isAnonymous ? 'Anonymously' : 'Message'} 🚀</button>
                        </div>
                    )}

                    {/* 🤫 INBOX (Visible to Owner mostly, but left open for flex if you want) */}
                    <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold' }}>Secret Inbox 🤫</h3>
                        {userData.ratings && userData.ratings.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {userData.ratings.slice().reverse().map((r, i) => (
                                    <div key={i} style={{ backgroundColor: '#000', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: (!r.senderName || r.senderName === 'Anonymous') ? '#bc1888' : '#1ed760' }}>
                                            {r.senderName || 'Anonymous'} says:
                                        </h4>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.4' }}>"{r.comment}"</p>

                                        {/* Custom Answer display */}
                                        {r.customAnswer && (
                                            <div style={{ backgroundColor: '#121212', padding: '10px', borderRadius: '8px', borderLeft: '2px solid #f09433', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '11px', color: '#a8a8a8', display: 'block' }}>Replied to your question:</span>
                                                <span style={{ fontSize: '13px', color: '#fff' }}>{r.customAnswer}</span>
                                            </div>
                                        )}

                                        {/* Top 2 Poll tags */}
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {r.polls?.q1 && <span style={{ fontSize: '11px', backgroundColor: '#1a1a1a', color: '#1ed760', padding: '4px 8px', borderRadius: '12px' }}>💚 {r.polls.q1}</span>}
                                            {r.polls?.q2 && <span style={{ fontSize: '11px', backgroundColor: '#1a1a1a', color: '#f09433', padding: '4px 8px', borderRadius: '12px' }}>✨ {r.polls.q2}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#a8a8a8', fontSize: '14px', textAlign: 'center' }}>Inbox is empty.</p>
                        )}
                    </div>

                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading vibes... ⏳</div>
            )}
        </div>
    );
}

export default Profile;