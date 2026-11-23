import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

/* 🌌 3D PERSPECTIVE NEON HORIZON CANVAS (MBTI AMBER REALM) */
const MbtiBackdrop3D = ({ color = '#ff9a3c' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles = Array.from({ length: 45 }, () => ({
            x: (Math.random() - 0.5) * 2.3,
            y: (Math.random() - 0.5) * 2.3,
            z: Math.random() * 14 + 1
        }));

        let offset = 0;

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const horizonY = h * 0.52;
            offset = (offset + 0.032) % 1;

            ctx.fillStyle = '#040408';
            ctx.fillRect(0, 0, w, h);

            // Ambient realm aura
            const aura = ctx.createRadialGradient(cx, horizonY, 10, cx, horizonY, Math.max(w, h) * 0.65);
            aura.addColorStop(0, `${color}38`);
            aura.addColorStop(0.45, `${color}12`);
            aura.addColorStop(1, 'rgba(4,4,8,0)');
            ctx.fillStyle = aura;
            ctx.fillRect(0, 0, w, h);

            // 3D Floor Perspective Grid
            ctx.strokeStyle = `${color}2b`;
            ctx.lineWidth = 1;

            for (let i = -10; i <= 10; i++) {
                ctx.beginPath();
                ctx.moveTo(cx + i * 26, horizonY);
                ctx.lineTo(cx + i * (w * 0.22), h);
                ctx.stroke();
            }

            for (let i = 0; i < 14; i++) {
                const depth = (i + offset) / 14;
                const y = horizonY + Math.pow(depth, 2.3) * (h - horizonY);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Floating 3D depth particles
            particles.forEach((p) => {
                p.z -= 0.028;
                if (p.z <= 0.2) {
                    p.z = 14;
                    p.x = (Math.random() - 0.5) * 2.3;
                    p.y = (Math.random() - 0.5) * 2.3;
                }
                const scale = (Math.min(w, h) * 0.65) / p.z;
                const px = cx + p.x * scale;
                const py = horizonY + p.y * scale;
                const size = Math.max(1, (1 - p.z / 14) * 3.2);
                const alpha = Math.max(0, 1 - p.z / 14) * 0.72;

                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [color]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

const CARD_THEMES = {
    solar: {
        name: 'Amber 🔥',
        bg: 'linear-gradient(165deg, #2b1605 0%, #070508 58%, #381b06 100%)',
        border: 'rgba(255, 154, 60, 0.55)',
        accent: 'linear-gradient(45deg, #ff9a3c, #ffd194)',
        tagBg: 'rgba(255, 154, 60, 0.18)',
        tagColor: '#ffb770'
    },
    noir: {
        name: 'Noir 🖤',
        bg: 'linear-gradient(165deg, #16161a 0%, #050507 58%, #1c1c24 100%)',
        border: 'rgba(255, 255, 255, 0.28)',
        accent: 'linear-gradient(45deg, #ffffff, #a1a1aa)',
        tagBg: 'rgba(255, 255, 255, 0.1)',
        tagColor: '#e4e4e7'
    },
    velvet: {
        name: 'Velvet 🌹',
        bg: 'linear-gradient(165deg, #2e0717 0%, #090407 58%, #3d091f 100%)',
        border: 'rgba(255, 65, 108, 0.55)',
        accent: 'linear-gradient(45deg, #ff416c, #ff85a2)',
        tagBg: 'rgba(255, 65, 108, 0.2)',
        tagColor: '#ff85a2'
    }
};

/* 🧠 8 HIGH-SIGNAL MBTI QUESTIONS (2 per axis with tie-breaker weighting) */
const MBTI_QUESTIONS = [
    {
        axis: 'EI',
        q: 'After a loud, crowded weekend party, your social battery is:',
        options: [
            { text: 'Fully charged — ready for an afterparty', delta: 2 },
            { text: 'Dead for 3 business days — do not perceive me', delta: -2 }
        ]
    },
    {
        axis: 'SN',
        q: 'When you look at a brand-new idea or situation, your brain goes straight to:',
        options: [
            { text: 'Hidden patterns, future possibilities & "what ifs"', delta: 2 },
            { text: 'Concrete facts, real proof & practical execution', delta: -2 }
        ]
    },
    {
        axis: 'TF',
        q: 'A close friend asks for honest advice on a risky life decision. You prioritize:',
        options: [
            { text: 'Brutal logic & objective truth, even if it stings', delta: 2 },
            { text: 'Empathy, their feelings & protecting their peace', delta: -2 }
        ]
    },
    {
        axis: 'JP',
        q: 'Your ideal approach to big goals and travel plans:',
        options: [
            { text: 'Structured itinerary, clear deadlines, total control', delta: 2 },
            { text: 'Spontaneous chaos — figure it out on the way', delta: -2 }
        ]
    },
    {
        axis: 'EI',
        q: 'In a room full of strangers, you usually:',
        options: [
            { text: 'Start conversations and own the energy effortlessly', delta: 1 },
            { text: 'Observe quietly and stick to 1 or 2 real people', delta: -1 }
        ]
    },
    {
        axis: 'SN',
        q: 'Late at night at 2 AM, your mind mostly replays:',
        options: [
            { text: 'Deep theories, wild futures & imaginary scenarios', delta: 1 },
            { text: 'Real memories, details & tomorrow’s to-do list', delta: -1 }
        ]
    },
    {
        axis: 'TF',
        q: 'In a heated debate, what wins you over?',
        options: [
            { text: 'Sharp data, reason & zero emotional bias', delta: 1 },
            { text: 'Authenticity, human values & genuine intent', delta: -1 }
        ]
    },
    {
        axis: 'JP',
        q: 'How does your workspace / phone home screen look right now?',
        options: [
            { text: 'Clean folders, sorted, everything in its place', delta: 1 },
            { text: 'Organized chaos — only I know where things are', delta: -1 }
        ]
    }
];

/* 🎭 ALL 16 ARCHETYPES + FICTIONAL TWINS */
const MBTI_PROFILES = {
    INTJ: {
        role: 'The Architect ♟️',
        group: 'ANALYST',
        twin: 'Thomas Shelby • Batman',
        motto: 'Always 5 moves ahead in silence.',
        desc: 'Strategic, hyper-independent mastermind. You spot flaws in every system and build empires quietly.'
    },
    INTP: {
        role: 'The Logician 🧬',
        group: 'ANALYST',
        twin: 'L Lawliet • Sherlock Holmes',
        motto: 'Question everything, trust logic.',
        desc: 'Unconventional genius with a 2 AM Wikipedia addiction. You decode complex ideas effortlessly.'
    },
    ENTJ: {
        role: 'The Commander 👑',
        group: 'ANALYST',
        twin: 'Harvey Specter • Miranda Priestly',
        motto: 'Find a way or make one.',
        desc: 'Born leader with unstoppable executive presence. Mediocrity fears your standards.'
    },
    ENTP: {
        role: 'The Debater ⚡',
        group: 'ANALYST',
        twin: 'Tony Stark • Saul Goodman',
        motto: 'Rules are just suggestions.',
        desc: 'Quick-witted devil’s advocate. You can out-talk anyone and turn wild ideas into reality.'
    },
    INFJ: {
        role: 'The Advocate 🌌',
        group: 'DIPLOMAT',
        twin: 'Itachi Uchiha • Dumbledore',
        motto: 'Quiet intuition, lethal clarity.',
        desc: 'The rarest type. You read people’s souls in 5 seconds and protect your energy fiercely.'
    },
    INFP: {
        role: 'The Mediator 🌙',
        group: 'DIPLOMAT',
        twin: 'Spider-Man • Luna Lovegood',
        motto: 'Soft heart, unstoppable depth.',
        desc: 'Poetic, deeply authentic dreamer. You romanticize life and feel every emotion in HD.'
    },
    ENFJ: {
        role: 'The Protagonist 🔥',
        group: 'DIPLOMAT',
        twin: 'Mufasa • Rengoku',
        motto: 'Lift the whole room higher.',
        desc: 'Magnetic charisma and emotional intelligence. People naturally gravitate toward your leadership.'
    },
    ENFP: {
        role: 'The Campaigner ✨',
        group: 'DIPLOMAT',
        twin: 'Naruto • Lorelai Gilmore',
        motto: 'Main character energy, always.',
        desc: 'Infectious enthusiasm and creative spark. You turn ordinary days into core memories.'
    },
    ISTJ: {
        role: 'The Logistician 🛡️',
        group: 'SENTINEL',
        twin: 'Captain America • Hermione Granger',
        motto: 'Discipline over drama.',
        desc: 'Unshakeable reliability and razor-sharp focus. When everyone panics, you execute.'
    },
    ISFJ: {
        role: 'The Defender 🕊️',
        group: 'SENTINEL',
        twin: 'Samwise Gamgee • Hinata',
        motto: 'Loyalty is my love language.',
        desc: 'Fiercely protective and observant. You remember the smallest details about the people you love.'
    },
    ESTJ: {
        role: 'The Executive 💼',
        group: 'SENTINEL',
        twin: 'Monica Geller • Dwight Schrute',
        motto: 'Order creates power.',
        desc: 'No-nonsense organizer who gets things done while everyone else is still talking.'
    },
    ESFJ: {
        role: 'The Consul 🥂',
        group: 'SENTINEL',
        twin: 'Blair Waldorf • Taylor Swift',
        motto: 'Curate the vibe, own the room.',
        desc: 'Socially sharp, warm, and unstoppable when protecting your inner circle.'
    },
    ISTP: {
        role: 'The Virtuoso 🐺',
        group: 'EXPLORER',
        twin: 'John Wick • Levi Ackerman',
        motto: 'Calm under any pressure.',
        desc: 'Cool-headed realist with zero wasted words. You master skills fast and stay unbothered.'
    },
    ISFP: {
        role: 'The Adventurer 🎨',
        group: 'EXPLORER',
        twin: 'Eleven • Billie Eilish',
        motto: 'Aesthetic over approval.',
        desc: 'Mysterious, artistic, and effortlessly cool. You live in the moment on your own terms.'
    },
    ESTP: {
        role: 'The Entrepreneur 🏎️',
        group: 'EXPLORER',
        twin: 'Tyler Durden • Daemon Targaryen',
        motto: 'High risk, higher reward.',
        desc: 'Bold, fearless, and magnetic. You thrive in fast-paced chaos and always land on your feet.'
    },
    ESFP: {
        role: 'The Entertainer 📸',
        group: 'EXPLORER',
        twin: 'Maddy Perez • Jack Sparrow',
        motto: 'Life is a spotlight.',
        desc: 'Pure magnetism and spontaneous energy. Wherever you walk in, the party officially starts.'
    }
};

const MbtiTest = () => {
    const navigate = useNavigate();
    const cardRef = useRef(null);

    const [currentQ, setCurrentQ] = useState(0);
    const [scores, setScores] = useState({ EI: 0, SN: 0, TF: 0, JP: 0 });
    const [isDecoding, setIsDecoding] = useState(false);
    const [finished, setFinished] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState('solar');
    const [copiedMsg, setCopiedMsg] = useState(false);
    const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

    const myUsername = localStorage.getItem('vibe_username') || localStorage.getItem('username') || 'vibecheck';
    const accent = '#ff9a3c';

    const handleAnswer = (delta) => {
        const axis = MBTI_QUESTIONS[currentQ].axis;
        const updated = { ...scores, [axis]: scores[axis] + delta };
        setScores(updated);

        if (currentQ + 1 < MBTI_QUESTIONS.length) {
            setCurrentQ(currentQ + 1);
        } else {
            setIsDecoding(true);
            setTimeout(() => {
                setIsDecoding(false);
                setFinished(true);
            }, 1200);
        }
    };

    const resetTest = () => {
        setCurrentQ(0);
        setScores({ EI: 0, SN: 0, TF: 0, JP: 0 });
        setIsDecoding(false);
        setFinished(false);
    };

    const computeMbti = () => {
        const letter1 = scores.EI >= 0 ? 'E' : 'I';
        const letter2 = scores.SN >= 0 ? 'N' : 'S';
        const letter3 = scores.TF >= 0 ? 'T' : 'F';
        const letter4 = scores.JP >= 0 ? 'J' : 'P';
        const code = `${letter1}${letter2}${letter3}${letter4}`;

        const pct = (val) => (Math.abs(val) >= 3 ? 88 : 67);
        const stats = `${pct(scores.EI)}% ${letter1} • ${pct(scores.SN)}% ${letter2} • ${pct(scores.TF)}% ${letter3} • ${pct(scores.JP)}% ${letter4}`;

        return {
            code,
            stats,
            profile: MBTI_PROFILES[code] || MBTI_PROFILES.INTJ
        };
    };

    const handleCardMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = ((y - rect.height / 2) / (rect.height / 2)) * -9;
        const ry = ((x - rect.width / 2) / (rect.width / 2)) * 9;
        setCardTilt({
            rx,
            ry,
            gx: (x / rect.width) * 100,
            gy: (y / rect.height) * 100,
            active: true
        });
    };

    const handleCardLeave = () => {
        setCardTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
    };

    const downloadStoryCard = async () => {
        if (!cardRef.current) return;

        const shareUrl = `${window.location.origin}/test/mbti`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopiedMsg(true);
            setTimeout(() => setCopiedMsg(false), 4000);
        } catch (err) {
            console.log('Clipboard copy failed:', err);
        }

        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: '#050507',
            scale: 3
        });
        const link = document.createElement('a');
        link.download = `VibeCheck-MBTI.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const result = finished ? computeMbti() : null;
    const activeTheme = CARD_THEMES[selectedTheme];

    return (
        <div style={{
            minHeight: '100vh',
            color: '#fff',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '76px 16px 36px 16px',
            overflowX: 'hidden'
        }}>
            <style>{`
        @keyframes qReveal {
          0% { opacity: 0; transform: translateY(16px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spinPortal {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .q-stage {
          animation: qReveal 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mbti-option {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          color: #f4f4f5;
          font-size: 15px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
          backdrop-filter: blur(10px);
        }
        .mbti-option:hover {
          transform: translateX(6px) scale(1.015);
          background: rgba(255, 255, 255, 0.08);
          border-color: ${accent};
          box-shadow: 0 0 24px ${accent}33, inset 0 0 12px ${accent}18;
          color: #ffffff;
        }
        .mbti-option:active {
          transform: scale(0.98);
        }
      `}</style>

            {/* 🌌 LIVE 3D PERSPECTIVE HORIZON */}
            <MbtiBackdrop3D color={accent} />

            {/* 🛸 MINIMAL FLOATING TOP HUD */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 20,
                background: 'linear-gradient(180deg, rgba(4,4,8,0.85) 0%, transparent 100%)'
            }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '800',
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    ← PORTAL HUB
                </button>

                <span style={{
                    fontSize: '11px',
                    fontWeight: '900',
                    letterSpacing: '2px',
                    color: accent,
                    textShadow: `0 0 12px ${accent}`
                }}>
                    MBTI 16 • COGNITIVE REALM
                </span>
            </div>

            {/* ⚡ STAGE 1: 3D FLOATING QUESTION HUD */}
            {!isDecoding && !finished && (
                <div
                    key={currentQ}
                    className="q-stage"
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        width: '100%',
                        maxWidth: '580px',
                        background: 'rgba(10, 10, 18, 0.72)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: `1px solid ${accent}44`,
                        borderRadius: '28px',
                        padding: '32px 26px',
                        boxShadow: `0 30px 70px rgba(0,0,0,0.75), 0 0 40px ${accent}1f, inset 0 1px 1px rgba(255,255,255,0.18)`
                    }}
                >
                    {/* 8-Segment Neon Progress Bar */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '22px' }}>
                        {MBTI_QUESTIONS.map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    height: '4px',
                                    borderRadius: '999px',
                                    background: i <= currentQ ? accent : 'rgba(255,255,255,0.12)',
                                    boxShadow: i <= currentQ ? `0 0 12px ${accent}` : 'none',
                                    transition: 'all 0.35s ease'
                                }}
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.8px', color: accent }}>
                            NODE 0{currentQ + 1} / 0{MBTI_QUESTIONS.length}
                        </span>
                        <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '700' }}>
                            16 Personalities 🧠
                        </span>
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(20px, 3vw, 25px)',
                        fontWeight: '800',
                        lineHeight: '1.35',
                        margin: '0 0 26px 0',
                        color: '#fff'
                    }}>
                        {MBTI_QUESTIONS[currentQ].q}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {MBTI_QUESTIONS[currentQ].options.map((opt, idx) => (
                            <button
                                key={idx}
                                className="mbti-option"
                                onClick={() => handleAnswer(opt.delta)}
                            >
                                <span style={{
                                    minWidth: '30px',
                                    height: '30px',
                                    borderRadius: '9px',
                                    background: `${accent}22`,
                                    border: `1px solid ${accent}66`,
                                    color: accent,
                                    fontSize: '12px',
                                    fontWeight: '900',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span style={{ lineHeight: '1.45' }}>{opt.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 🔮 STAGE 2: COGNITIVE STACK DECODER */}
            {isDecoding && (
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '40px 20px'
                }}>
                    <div style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        border: `2px dashed ${accent}`,
                        boxShadow: `0 0 35px ${accent}66`,
                        animation: 'spinPortal 1.4s linear infinite',
                        marginBottom: '24px'
                    }} />
                    <div style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '3px', color: accent }}>
                        MAPPING COGNITIVE STACK...
                    </div>
                    <div style={{ fontSize: '13px', color: '#a1a1aa', marginTop: '8px' }}>
                        Matching your 16-Type Archetype & Fictional Twin
                    </div>
                </div>
            )}

            {/* 🏆 STAGE 3: HOLOGRAPHIC 3D PREVIEW + 9:16 STORY CARD */}
            {finished && result && (
                <div
                    className="q-stage"
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        width: '100%',
                        maxWidth: '360px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    {/* 🎨 THEME SWITCHER */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {Object.keys(CARD_THEMES).map((key) => (
                            <button
                                key={key}
                                onClick={() => setSelectedTheme(key)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '999px',
                                    border: selectedTheme === key ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.16)',
                                    background: selectedTheme === key ? 'rgba(255,255,255,0.14)' : 'rgba(10,10,18,0.65)',
                                    color: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                {CARD_THEMES[key].name}
                            </button>
                        ))}
                    </div>

                    {/* 🧊 3D TILT WRAPPER */}
                    <div
                        onMouseMove={handleCardMove}
                        onMouseLeave={handleCardLeave}
                        style={{ width: '100%', perspective: '1000px' }}
                    >
                        <div
                            style={{
                                transform: `rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
                                transition: cardTilt.active ? 'transform 0.08s linear' : 'transform 0.4s ease',
                                transformStyle: 'preserve-3d',
                                position: 'relative',
                                borderRadius: '28px'
                            }}
                        >
                            {/* Glossy Glare */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '28px',
                                pointerEvents: 'none',
                                zIndex: 5,
                                background: `radial-gradient(circle at ${cardTilt.gx}% ${cardTilt.gy}%, rgba(255,255,255,${cardTilt.active ? 0.16 : 0}), transparent 55%)`,
                                transition: 'background 0.15s ease'
                            }} />

                            {/* 📸 9:16 INSTAGRAM STORY CARD */}
                            <div
                                ref={cardRef}
                                style={{
                                    width: '100%',
                                    aspectRatio: '9 / 16',
                                    background: activeTheme.bg,
                                    border: `1.5px solid ${activeTheme.border}`,
                                    borderRadius: '28px',
                                    padding: '30px 24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    textAlign: 'center',
                                    boxShadow: `0 28px 65px rgba(0,0,0,0.8), 0 0 35px ${accent}25`,
                                    boxSizing: 'border-box'
                                }}
                            >
                                {/* Top Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '-0.5px', color: '#fff' }}>
                                        vibecheck<span style={{ color: '#ff9a3c' }}>.</span>
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
                                        {result.profile.group}
                                    </span>
                                </div>

                                {/* Center MBTI Reveal */}
                                <div>
                                    <div style={{
                                        fontSize: '46px',
                                        fontWeight: '900',
                                        letterSpacing: '3px',
                                        lineHeight: '1',
                                        background: activeTheme.accent,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        marginBottom: '6px'
                                    }}>
                                        {result.code}
                                    </div>

                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
                                        {result.profile.role}
                                    </div>

                                    {/* Fictional Twin Pill */}
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        borderRadius: '999px',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: `1px solid ${activeTheme.border}`,
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: activeTheme.tagColor,
                                        marginBottom: '14px'
                                    }}>
                                        🎭 Twin: {result.profile.twin}
                                    </div>

                                    <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.55', margin: '0 0 14px 0' }}>
                                        {result.profile.desc}
                                    </p>

                                    {/* Dominant Axis Breakdown */}
                                    <div style={{
                                        fontSize: '10px',
                                        fontWeight: '800',
                                        letterSpacing: '0.8px',
                                        color: '#a1a1aa'
                                    }}>
                                        {result.stats}
                                    </div>
                                </div>

                                {/* 🔗 HYBRID STICKER-READY PILL */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '14px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: `1px solid ${activeTheme.border}`,
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        letterSpacing: '0.8px',
                                        color: '#fff'
                                    }}>
                                        🔗 vibecheck • decode your 16-type →
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#a1a1aa' }}>@{myUsername}</span>
                                </div>
                            </div>
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
                                fontWeight: '800',
                                fontSize: '14px',
                                cursor: 'pointer',
                                boxShadow: '0 8px 25px rgba(240, 148, 51, 0.35)'
                            }}
                        >
                            {copiedMsg ? 'Saved + Link Copied! Paste on IG 🔗' : 'Save 9:16 Story Card 📸'}
                        </button>
                        <button
                            onClick={resetTest}
                            style={{
                                padding: '14px 16px',
                                background: 'rgba(255,255,255,0.08)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.16)',
                                borderRadius: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            🔄
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                padding: '14px 16px',
                                background: 'rgba(255,255,255,0.08)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.16)',
                                borderRadius: '16px',
                                fontWeight: '800',
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