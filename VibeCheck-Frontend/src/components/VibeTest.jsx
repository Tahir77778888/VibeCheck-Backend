import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TESTS_DATA = {
    'red-flag': {
        title: 'Red Flag Analyzer 🚩',
        accent: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
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
            if (percent <= 25) return { badge: `${percent}% — Walking Green Forest 🌿`, desc: "Honestly, too pure for this generation. Protect your peace." };
            if (percent <= 55) return { badge: `${percent}% — Beige Flag Energy 🐪`, desc: "A little chaotic, a little sweet. Keeps people guessing." };
            if (percent <= 80) return { badge: `${percent}% — Certified Red Flag 🚩`, desc: "Toxic? Maybe. Unforgettable? Definitely." };
            return { badge: `${percent}% — Final Boss Menace 😈`, desc: "You don't just have red flags, you own the whole factory." };
        }
    },

    'aura-reader': {
        title: 'Aura Reader ✨',
        accent: 'linear-gradient(45deg, #8e2de2, #bc1888)',
        questions: [
            {
                q: "It's 2 AM. What are you most likely doing?",
                options: [
                    { text: "Deep-diving into random Wikipedia rabbit holes", score: 1 },
                    { text: "Listening to sad/cinematic music pretending I'm in a movie", score: 2 },
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
            if (total <= 3) return { badge: "Midnight Indigo 🌌", desc: "Deep, mysterious, and observant. You speak less, but when you do, everyone listens." };
            if (total <= 6) return { badge: "Emerald Calm 🍃", desc: "Grounded, loyal, and magnetic. People instantly feel safe around your energy." };
            if (total <= 9) return { badge: "Electric Violet ⚡", desc: "Creative, unpredictable, and effortlessly cool. Main character energy without even trying." };
            return { badge: "Solar Gold 🔥", desc: "Bold, ambitious, and unstoppable. You walk into a room and the whole vibe shifts." };
        }
    }
};

const VibeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const test = TESTS_DATA[testId];

    const [currentQ, setCurrentQ] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [finished, setFinished] = useState(false);

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

    const result = finished ? test.getResult(totalScore) : null;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 50% -20%, #4a154b 0%, #050505 55%)',
            color: '#fff',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '550px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '35px 25px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                {/* Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <span style={{ fontSize: '14px', color: '#a8a8a8', fontWeight: 'bold' }}>{test.title}</span>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}
                    >
                        ✕ Exit
                    </button>
                </div>

                {!finished ? (
                    <>
                        {/* Progress */}
                        <div style={{ fontSize: '12px', color: '#bc1888', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' }}>
                            QUESTION {currentQ + 1} OF {test.questions.length}
                        </div>

                        <h2 style={{ fontSize: '22px', margin: '0 0 25px 0', lineHeight: '1.4' }}>
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
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ fontSize: '12px', color: '#a8a8a8', letterSpacing: '2px', marginBottom: '10px' }}>YOUR RESULT</div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '900',
                            background: test.accent,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: '0 0 15px 0'
                        }}>
                            {result.badge}
                        </h1>
                        <p style={{ color: '#ccc', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px' }}>
                            {result.desc}
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={resetTest}
                                style={{
                                    padding: '12px 22px',
                                    background: 'rgba(255,255,255,0.08)',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Retake 🔄
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    padding: '12px 22px',
                                    background: test.accent,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Back to Hub 🚀
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VibeTest;