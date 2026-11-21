import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

const MBTI_QUESTIONS = [
    // E vs I
    {
        axis: 'EI',
        pov: "POV: Friday night, 9 PM. Your phone blows up with a last-minute party invite.",
        a: { text: "Already picking my outfit. Sleep is for Sunday 🔥", trait: 'E', glow: '#f09433' },
        b: { text: "Phone on DND, headphones on, main-character solitude 🎧", trait: 'I', glow: '#4a154b' }
    },
    {
        axis: 'EI',
        pov: "POV: You walk into a room where you know literally zero people.",
        a: { text: "Find the most interesting group and jump into the convo", trait: 'E', glow: '#ff416c' },
        b: { text: "Observe the whole room like a detective from the corner", trait: 'I', glow: '#1e3c72' }
    },
    {
        axis: 'EI',
        pov: "POV: A crazy 2 AM startup or life idea hits your brain.",
        a: { text: "Voice-note my best friend immediately to brainstorm", trait: 'E', glow: '#f09433' },
        b: { text: "Build the entire empire silently in my head first", trait: 'I', glow: '#6a11cb' }
    },

    // N vs S
    {
        axis: 'NS',
        pov: "POV: Late-night drive with friends. What topic takes over the car?",
        a: { text: "Parallel universes, psychology, and 'where will we be in 5 years?'", trait: 'N', glow: '#8e2de2' },
        b: { text: "Real-life tea, funny memories, and where to eat next", trait: 'S', glow: '#00b09b' }
    },
    {
        axis: 'NS',
        pov: "POV: You're learning a brand-new skill from scratch.",
        a: { text: "Skip the manual, figure out the big picture and experiment", trait: 'N', glow: '#bc1888' },
        b: { text: "Give me a clean step-by-step guide with real examples", trait: 'S', glow: '#00b09b' }
    },
    {
        axis: 'NS',
        pov: "POV: Someone describes you in one line behind your back.",
        a: { text: "'Always living in their own cinematic world'", trait: 'N', glow: '#8e2de2' },
        b: { text: "'Sharp, grounded, notices details nobody else catches'", trait: 'S', glow: '#11998e' }
    },

    // T vs F
    {
        axis: 'TF',
        pov: "POV: Your best friend is about to text their toxic ex. Your move?",
        a: { text: "Hit them with brutal logic and a 3-point reality check", trait: 'T', glow: '#00c6ff' },
        b: { text: "Hear them out first, hype their worth, then snatch the phone", trait: 'F', glow: '#ff4b2b' }
    },
    {
        axis: 'TF',
        pov: "POV: Huge life decision. Head says A, heart says B.",
        a: { text: "Head wins. Emotions lie, numbers and logic don't", trait: 'T', glow: '#0072ff' },
        b: { text: "Heart wins. If the vibe feels wrong, it's a no", trait: 'F', glow: '#f857a6' }
    },
    {
        axis: 'TF',
        pov: "POV: Heated debate in the group chat.",
        a: { text: "I don't care who gets mad, I'm defending the actual facts", trait: 'T', glow: '#00c6ff' },
        b: { text: "Try to cool things down so nobody feels attacked", trait: 'F', glow: '#ff5858' }
    },

    // J vs P
    {
        axis: 'JP',
        pov: "POV: Big deadline is 5 days away.",
        a: { text: "Finish it early so I can chill without guilt", trait: 'J', glow: '#4a00e0' },
        b: { text: "Do nothing for 4 days, become a genius at 11:45 PM", trait: 'P', glow: '#f09433' }
    },
    {
        axis: 'JP',
        pov: "POV: Spontaneous Goa / hill-station trip with the squad.",
        a: { text: "Already making the Notion itinerary and budget sheet", trait: 'J', glow: '#2575fc' },
        b: { text: "Zero plan, pack in 10 mins, let destiny decide", trait: 'P', glow: '#ff416c' }
    },
    {
        axis: 'JP',
        pov: "POV: Someone looks at your room / phone gallery right now.",
        a: { text: "Clean, sorted, everything has a system", trait: 'J', glow: '#11998e' },
        b: { text: "Pure organized chaos—looks messy, but I know where everything is", trait: 'P', glow: '#bc1888' }
    }
];

const MBTI_PROFILES = {
    INTJ: { title: "The Mastermind ♟️", twin: "Thomas Shelby / Batman", rarity: "2.1%", match: "ENFP", chaos: "ENTP", desc: "Always 5 moves ahead. Quiet exterior, nuclear-level ambition inside." },
    INTP: { title: "The Logician 🧠", twin: "Albert Einstein / L (Death Note)", rarity: "3.3%", match: "ENTJ", chaos: "ENFP", desc: "47 browser tabs open in your brain at 3 AM. Effortlessly sharp." },
    ENTJ: { title: "The Commander 👑", twin: "Harvey Specter / Steve Jobs", rarity: "1.8%", match: "INTP", chaos: "ESTP", desc: "Born to lead. If a door doesn't exist, you build the whole building." },
    ENTP: { title: "The Debater ⚡", twin: "Tony Stark / Jack Sparrow", rarity: "3.2%", match: "INFJ", chaos: "INTJ", desc: "Quick-witted, allergic to boredom, and plays devil's advocate for sport." },
    INFJ: { title: "The Mystic 🌌", twin: "Jon Snow / Albus Dumbledore", rarity: "1.5%", match: "ENTP", chaos: "ENFP", desc: "The rarest mind. You read people's real intentions in 10 seconds flat." },
    INFP: { title: "The Dreamer 🌙", twin: "Frodo / Wanda Maximoff", rarity: "4.4%", match: "ENFJ", chaos: "ENTP", desc: "Poetic soul, deep playlists, and fiercely loyal to the few who get you." },
    ENFJ: { title: "The Protagonist ✨", twin: "Mufasa / Tanjiro", rarity: "2.5%", match: "INFP", chaos: "ESFP", desc: "Magnetic aura. You walk in and somehow become everyone's favorite person." },
    ENFP: { title: "The Free Spirit 🔥", twin: "Spider-Man / Naruto", rarity: "8.1%", match: "INTJ", chaos: "ENTP", desc: "Unmatched main-character energy. Chaotic, warm, and endlessly inspiring." },
    ISTJ: { title: "The Strategist 🛡️", twin: "Hermione Granger / Geralt", rarity: "11.6%", match: "ESFP", chaos: "ENFP", desc: "Zero nonsense, 100% reliability. When chaos hits, everyone calls you." },
    ISFJ: { title: "The Guardian 🌿", twin: "Captain America / Samwise", rarity: "13.8%", match: "ESTP", chaos: "ENTP", desc: "Soft power. You remember the tiny details nobody else even notices." },
    ESTJ: { title: "The Boss 📊", twin: "Dwight Schrute / Boromir", rarity: "8.7%", match: "ISFP", chaos: "INFP", desc: "Direct, fearless, and gets things done while others are still talking." },
    ESFJ: { title: "The Connector 💫", twin: "Monica Geller / Taylor Swift", rarity: "12.3%", match: "ISFP", chaos: "INTP", desc: "The glue of every friend group. High EQ and unmatched hosting energy." },
    ISTP: { title: "The Maverick 🛠️", twin: "John Wick / Levi Ackerman", rarity: "5.4%", match: "ESFJ", chaos: "ENFJ", desc: "Ice-cold under pressure. Fewer words, maximum impact." },
    ISFP: { title: "The Aesthetic 🎨", twin: "Eleven / Billie Eilish", rarity: "8.8%", match: "ESTJ", chaos: "ENTJ", desc: "Quietly iconic. You live by your own taste and never follow the crowd." },
    ESTP: { title: "The Daredevil 🚀", twin: "Rocket Raccoon / Deadpool", rarity: "4.3%", match: "ISFJ", chaos: "INFJ", desc: "Adrenaline junkie with insane street smarts. Life is your playground." },
    ESFP: { title: "The Showstopper 🎬", twin: "Joey Tribbiani / Elvis", rarity: "8.5%", match: "ISTJ", chaos: "INTJ", desc: "Instant vibe shift. Wherever you go, the party follows." }
};

const LOADING_LINES = [
    "Scanning brainwaves... 🧠",
    "Measuring overthinking levels... 📈",
    "Decoding your fictional twin... 🎬"
];

const MbtiTest = () => {
    const navigate = useNavigate();
    const cardRef = useRef(null);

    const [step, setStep] = useState(0);
    const [scores, setScores] = useState({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
    const [auraColor, setAuraColor] = useState('#4a154b');
    const [loading, setLoading] = useState(false);
    const [loadTextIdx, setLoadTextIdx] = useState(0);
    const [finished, setFinished] = useState(false);

    const handleSelect = (opt) => {
        const updated = { ...scores, [opt.trait]: scores[opt.trait] + 1 };
        setScores(updated);
        setAuraColor(opt.glow);

        if (step + 1 < MBTI_QUESTIONS.length) {
            setStep(step + 1);
        } else {
            // Dramatic Decoding Sequence
            setLoading(true);
            setLoadTextIdx(0);
            setTimeout(() => setLoadTextIdx(1), 750);
            setTimeout(() => setLoadTextIdx(2), 1500);
            setTimeout(() => {
                setLoading(false);
                setFinished(true);
            }, 2300);
        }
    };

    const reset = () => {
        setStep(0);
        setScores({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
        setAuraColor('#4a154b');
        setFinished(false);
    };

    const getType = () =>
        (scores.E >= scores.I ? 'E' : 'I') +
        (scores.N >= scores.S ? 'N' : 'S') +
        (scores.T >= scores.F ? 'T' : 'F') +
        (scores.J >= scores.P ? 'J' : 'P');

    const mbtiType = finished ? getType() : '';
    const profile = MBTI_PROFILES[mbtiType];

    const downloadStoryCard = async () => {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: '#050505',
            scale: 2
        });
        const link = document.createElement('a');
        link.download = `VibeCheck-${mbtiType}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const traitBars = [
        { left: 'E', right: 'I', leftVal: scores.E },
        { left: 'N', right: 'S', leftVal: scores.N },
        { left: 'T', right: 'F', leftVal: scores.T },
        { left: 'J', right: 'P', leftVal: scores.J }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#050505',
            backgroundImage: `radial-gradient(circle at 50% -15%, ${auraColor} 0%, #050505 60%)`,
            transition: 'background-image 0.6s ease',
            color: '#fff',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            padding: '30px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .fade-slide { animation: fadeSlide 0.35s ease forwards; }
        .opt-btn:hover {
          transform: translateY(-2px);
          border-color: #bc1888 !important;
          background: rgba(188, 24, 136, 0.12) !important;
        }
      `}</style>

            {/* DECODING LOADER */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #f09433, #bc1888)',
                        margin: '0 auto 25px auto',
                        animation: 'pulseGlow 1.1s infinite ease-in-out',
                        boxShadow: '0 0 40px rgba(188, 24, 136, 0.6)'
                    }} />
                    <h2 key={loadTextIdx} className="fade-slide" style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
                        {LOADING_LINES[loadTextIdx]}
                    </h2>
                </div>
            )}

            {/* QUIZ CARD */}
            {!loading && !finished && (
                <div style={{
                    width: '100%',
                    maxWidth: '560px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '26px',
                    padding: '32px 24px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '13px', color: '#a8a8a8', fontWeight: '700', letterSpacing: '0.5px' }}>
                            VIBECHECK × MBTI 🧠
                        </span>
                        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>
                            ✕ Exit
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', marginBottom: '22px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${((step + 1) / MBTI_QUESTIONS.length) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #f09433, #bc1888)',
                            transition: 'width 0.35s ease'
                        }} />
                    </div>

                    <div key={step} className="fade-slide">
                        <div style={{ fontSize: '11px', color: '#ff66c4', fontWeight: '800', letterSpacing: '1.5px', marginBottom: '10px' }}>
                            SCENE {step + 1} / {MBTI_QUESTIONS.length}
                        </div>
                        <h2 style={{ fontSize: '21px', margin: '0 0 24px 0', lineHeight: '1.45', fontWeight: '700' }}>
                            {MBTI_QUESTIONS[step].pov}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[MBTI_QUESTIONS[step].a, MBTI_QUESTIONS[step].b].map((opt, idx) => (
                                <button
                                    key={idx}
                                    className="opt-btn"
                                    onClick={() => handleSelect(opt)}
                                    style={{
                                        padding: '18px 20px',
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        color: '#fff',
                                        fontSize: '15px',
                                        lineHeight: '1.4',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* RESULT SCREEN + DOWNLOADABLE STORY CARD */}
            {!loading && finished && (
                <div className="fade-slide" style={{ width: '100%', maxWidth: '460px' }}>
                    {/* Capturable Card */}
                    <div
                        ref={cardRef}
                        style={{
                            background: 'linear-gradient(160deg, #1a0b2e 0%, #09090b 65%, #1f0a1d 100%)',
                            border: '1px solid rgba(188, 24, 136, 0.45)',
                            borderRadius: '28px',
                            padding: '32px 24px',
                            textAlign: 'center',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '1px', color: '#fff' }}>
                                vibecheck<span style={{ color: '#bc1888' }}>.</span>
                            </span>
                            <span style={{ fontSize: '11px', background: 'rgba(240, 148, 51, 0.18)', color: '#ffb366', padding: '5px 10px', borderRadius: '999px', fontWeight: '800' }}>
                                TOP {profile.rarity} RARE
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: '54px',
                            fontWeight: '900',
                            letterSpacing: '5px',
                            background: 'linear-gradient(45deg, #f09433, #bc1888)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: '0'
                        }}>
                            {mbtiType}
                        </h1>
                        <h3 style={{ margin: '6px 0 12px 0', fontSize: '20px', color: '#fff' }}>{profile.title}</h3>
                        <p style={{ color: '#c4c4cc', fontSize: '14px', lineHeight: '1.55', margin: '0 0 22px 0' }}>
                            {profile.desc}
                        </p>

                        {/* Fictional Twin + Matches */}
                        <div style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '16px',
                            padding: '14px',
                            marginBottom: '20px',
                            textAlign: 'left',
                            fontSize: '13px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div>🎬 <span style={{ color: '#a1a1aa' }}>Fictional Twin:</span> <strong>{profile.twin}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>💚 <span style={{ color: '#a1a1aa' }}>Best Vibe:</span> <strong>{profile.match}</strong></span>
                                <span>⚡ <span style={{ color: '#a1a1aa' }}>Chaos Twin:</span> <strong>{profile.chaos}</strong></span>
                            </div>
                        </div>

                        {/* Compact 4-Axis Bars */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'left' }}>
                            {traitBars.map((b, i) => {
                                const pct = Math.round((b.leftVal / 3) * 100);
                                return (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#bbb', marginBottom: '5px', fontWeight: '700' }}>
                                            <span>{b.left} {pct}%</span>
                                            <span>{100 - pct}% {b.right}</span>
                                        </div>
                                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #f09433, #bc1888)' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons (Outside Screenshot Area) */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
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
                            Save Story Card 📸
                        </button>
                        <button
                            onClick={reset}
                            style={{
                                padding: '14px 18px',
                                background: 'rgba(255,255,255,0.08)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            🔄
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                padding: '14px 18px',
                                background: 'rgba(255,255,255,0.08)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Hub
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MbtiTest;