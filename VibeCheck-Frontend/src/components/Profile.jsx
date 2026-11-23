import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

/* 🌌 3D PERSPECTIVE NEON HORIZON CANVAS */
const ProfileBackdrop3D = ({ color = '#ff2e93' }) => {
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

        const particles = Array.from({ length: 40 }, () => ({
            x: (Math.random() - 0.5) * 2.2,
            y: (Math.random() - 0.5) * 2.2,
            z: Math.random() * 14 + 1
        }));

        let offset = 0;

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const horizonY = h * 0.45;
            offset = (offset + 0.025) % 1;

            ctx.fillStyle = '#040408';
            ctx.fillRect(0, 0, w, h);

            const aura = ctx.createRadialGradient(cx, horizonY, 10, cx, horizonY, Math.max(w, h) * 0.65);
            aura.addColorStop(0, `${color}30`);
            aura.addColorStop(0.45, `${color}0e`);
            aura.addColorStop(1, 'rgba(4,4,8,0)');
            ctx.fillStyle = aura;
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = `${color}24`;
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

            particles.forEach((p) => {
                p.z -= 0.024;
                if (p.z <= 0.2) {
                    p.z = 14;
                    p.x = (Math.random() - 0.5) * 2.2;
                    p.y = (Math.random() - 0.5) * 2.2;
                }
                const scale = (Math.min(w, h) * 0.65) / p.z;
                const px = cx + p.x * scale;
                const py = horizonY + p.y * scale;
                const size = Math.max(1, (1 - p.z / 14) * 3);
                const alpha = Math.max(0, 1 - p.z / 14) * 0.65;

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
    velvet: {
        name: 'Velvet 🌹',
        bg: 'linear-gradient(165deg, #2e0717 0%, #090407 58%, #3d091f 100%)',
        border: 'rgba(255, 46, 147, 0.55)',
        accent: 'linear-gradient(45deg, #ff2e93, #ff85a2)',
        tagBg: 'rgba(255, 46, 147, 0.2)',
        tagColor: '#ff85a2'
    },
    noir: {
        name: 'Noir 🖤',
        bg: 'linear-gradient(165deg, #16161a 0%, #050507 58%, #1c1c24 100%)',
        border: 'rgba(255, 255, 255, 0.26)',
        accent: 'linear-gradient(45deg, #ffffff, #a1a1aa)',
        tagBg: 'rgba(255, 255, 255, 0.1)',
        tagColor: '#e4e4e7'
    },
    gold: {
        name: 'Gold ✨',
        bg: 'linear-gradient(165deg, #291d08 0%, #080705 58%, #332309 100%)',
        border: 'rgba(245, 176, 65, 0.55)',
        accent: 'linear-gradient(45deg, #f5b041, #fceabb)',
        tagBg: 'rgba(245, 176, 65, 0.18)',
        tagColor: '#f8c471'
    }
};

function Profile() {
    const { username: rawUsername } = useParams();
    const navigate = useNavigate();
    const username = rawUsername ? rawUsername.replace('@', '') : '';

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Interactive Form States
    const [ratings, setRatings] = useState({ trust: 75, vibe: 80, intellect: 75, humor: 80 });
    const [polls, setPolls] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);

    const [userComment, setUserComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [senderName, setSenderName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sentBanner, setSentBanner] = useState(false);

    // Custom Q&A States
    const [customAnswer, setCustomAnswer] = useState('');
    const [isEditingQ, setIsEditingQ] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');

    // Share & 9:16 Story Modal States
    const [linkCopied, setLinkCopied] = useState(false);
    const [storyModalData, setStoryModalData] = useState(null); // { type: 'message' | 'profile', item?: object }
    const [selectedTheme, setSelectedTheme] = useState('velvet');
    const [storySavedMsg, setStorySavedMsg] = useState(false);
    const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

    const storyCardRef = useRef(null);
    const accent = '#ff2e93';

    // Check if logged in user is the owner
    const loggedInUser = localStorage.getItem('vibe_username') || localStorage.getItem('username');
    const isOwner = loggedInUser && loggedInUser.toLowerCase() === username.toLowerCase();

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
        const cleanUsername = username.replace('@', '');
        if (!cleanUsername) {
            setLoading(false);
            setNotFound(true);
            return;
        }

        setLoading(true);
        setNotFound(false);

        axios
            .get(`https://vibecheck-backend-n4yi.onrender.com/api/users/${cleanUsername}`)
            .then((response) => {
                if (response.data && response.data.user) {
                    setUserData(response.data);
                    setNewQuestion(response.data.user.customQuestion || 'Farewell mein mujhe kya pehenna chahiye?');
                    setNotFound(false);
                } else {
                    setNotFound(true);
                }
                setLoading(false);
            })
            .catch(() => {
                setUserData(null);
                setNotFound(true);
                setLoading(false);
            });
    };

    const submitVibeCheck = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/ratings/submit', {
                username: username,
                scores: ratings,
                comment: userComment || 'Sending good vibes! ✨',
                polls: polls,
                customAnswer: customAnswer,
                senderName: isAnonymous ? 'Anonymous' : (senderName || 'A Friend')
            });

            setSentBanner(true);
            setTimeout(() => setSentBanner(false), 4500);

            setUserComment('');
            setSenderName('');
            setIsAnonymous(true);
            setPolls({});
            setCustomAnswer('');
            setCurrentSlide(0);
            fetchProfile();
        } catch (error) {
            alert('Kuch gadbad ho gayi bhai, dubara try karo.');
        } finally {
            setSubmitting(false);
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
            alert('Question update fail hua.');
        }
    };

    const copyProfileLink = async () => {
        const url = `${window.location.origin}/${username}`;
        try {
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 3000);
        } catch (e) {
            console.log(e);
        }
    };

    const getTopPoll = (pollKey) => {
        if (!userData || !userData.ratings || userData.ratings.length === 0) return 'No data yet';
        const counts = {};
        userData.ratings.forEach((r) => {
            if (r.polls && r.polls[pollKey]) {
                counts[r.polls[pollKey]] = (counts[r.polls[pollKey]] || 0) + 1;
            }
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : 'No data yet';
    };

    const getVibeTitle = (scores) => {
        if (!scores) return 'Mystery Aura 🌫️';
        if (scores.intellect >= 80 && scores.trust >= 80) return 'The Mastermind 🧠';
        if (scores.vibe >= 80 && scores.humor >= 80) return 'Chaotic Good 🌪️';
        if (scores.vibe >= 85) return 'Pure Main Character 🌟';
        return 'The Enigma 🎭';
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

    const downloadStoryPng = async () => {
        if (!storyCardRef.current) return;
        const shareUrl = `${window.location.origin}/${username}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setStorySavedMsg(true);
            setTimeout(() => setStorySavedMsg(false), 4000);
        } catch (e) {
            console.log(e);
        }

        const canvas = await html2canvas(storyCardRef.current, {
            backgroundColor: '#050507',
            scale: 3
        });
        const link = document.createElement('a');
        link.download = `VibeCheck-${username}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const activeTheme = CARD_THEMES[selectedTheme];

    const glassCardStyle = {
        background: 'rgba(10, 10, 18, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '26px',
        padding: '24px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.14)'
    };

    return (
        <div style={{
            minHeight: '100vh',
            color: '#fafafa',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            position: 'relative',
            padding: '76px 14px 48px 14px'
        }}>
            <style>{`
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .vibe-panel {
          animation: fadeSlide 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .poll-btn {
          padding: 14px 12px;
          border-radius: 14px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .poll-btn:hover {
          transform: translateY(-2px);
          border-color: #ff2e93 !important;
        }
      `}</style>

            {/* 🌌 3D HORIZON CANVAS */}
            <ProfileBackdrop3D color={accent} />

            {/* 🛸 FLOATING TOP HUD BAR */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 30,
                background: 'linear-gradient(180deg, rgba(4,4,8,0.88) 0%, transparent 100%)'
            }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding: '8px 15px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '800',
                        letterSpacing: '0.8px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    ← PORTAL HUB
                </button>

                <button
                    onClick={copyProfileLink}
                    style={{
                        padding: '8px 15px',
                        borderRadius: '999px',
                        background: linkCopied ? 'rgba(30, 215, 96, 0.2)' : 'rgba(255, 46, 147, 0.16)',
                        border: linkCopied ? '1px solid #1ed760' : '1px solid rgba(255, 46, 147, 0.5)',
                        color: linkCopied ? '#1ed760' : '#ff85a2',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {linkCopied ? 'Link Copied! 📋' : 'Share Link 🔗'}
                </button>
            </div>

            {/* 📸 9:16 IG STORY REPLY MODAL */}
            {storyModalData && (
                <div
                    onClick={() => setStoryModalData(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 999,
                        background: 'rgba(4, 4, 8, 0.88)',
                        backdropFilter: 'blur(14px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px 16px'
                    }}
                >
                    <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Theme Selector */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                            {Object.keys(CARD_THEMES).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedTheme(key)}
                                    style={{
                                        padding: '7px 13px',
                                        borderRadius: '999px',
                                        border: selectedTheme === key ? '1px solid #ff2e93' : '1px solid rgba(255,255,255,0.16)',
                                        background: selectedTheme === key ? 'rgba(255,255,255,0.14)' : 'rgba(10,10,18,0.7)',
                                        color: '#fff',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {CARD_THEMES[key].name}
                                </button>
                            ))}
                        </div>

                        {/* 3D Tilt Wrapper */}
                        <div onMouseMove={handleCardMove} onMouseLeave={handleCardLeave} style={{ width: '100%', perspective: '1000px' }}>
                            <div style={{
                                transform: `rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
                                transition: cardTilt.active ? 'transform 0.08s linear' : 'transform 0.4s ease',
                                position: 'relative',
                                borderRadius: '28px'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '28px',
                                    pointerEvents: 'none',
                                    zIndex: 5,
                                    background: `radial-gradient(circle at ${cardTilt.gx}% ${cardTilt.gy}%, rgba(255,255,255,${cardTilt.active ? 0.16 : 0}), transparent 55%)`
                                }} />

                                {/* 9:16 Capture Canvas */}
                                <div
                                    ref={storyCardRef}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '9 / 16',
                                        background: activeTheme.bg,
                                        border: `1.5px solid ${activeTheme.border}`,
                                        borderRadius: '28px',
                                        padding: '28px 22px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        textAlign: 'center',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '900', color: '#fff' }}>
                                            vibecheck<span style={{ color: '#ff2e93' }}>.</span>
                                        </span>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            padding: '4px 10px',
                                            borderRadius: '999px',
                                            background: activeTheme.tagBg,
                                            color: activeTheme.tagColor
                                        }}>
                                            {storyModalData.type === 'message' ? 'SECRET HYPE 💌' : 'VIBE REPORT 📈'}
                                        </span>
                                    </div>

                                    {storyModalData.type === 'message' && storyModalData.item ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                            <div style={{
                                                background: 'rgba(255,255,255,0.06)',
                                                border: `1px solid ${activeTheme.border}`,
                                                borderRadius: '20px',
                                                padding: '20px 16px'
                                            }}>
                                                <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', color: activeTheme.tagColor, marginBottom: '8px', textTransform: 'uppercase' }}>
                                                    {storyModalData.item.senderName || 'Anonymous'} sent:
                                                </div>
                                                <div style={{ fontSize: '19px', fontWeight: '800', lineHeight: '1.35', color: '#fff' }}>
                                                    "{storyModalData.item.comment}"
                                                </div>
                                            </div>

                                            {storyModalData.item.customAnswer && (
                                                <div style={{
                                                    background: 'rgba(0,0,0,0.45)',
                                                    borderRadius: '14px',
                                                    padding: '12px 14px',
                                                    fontSize: '12px',
                                                    color: '#d4d4d8'
                                                }}>
                                                    <div style={{ fontSize: '10px', color: '#a1a1aa', marginBottom: '4px' }}>
                                                        Q: {userData?.user?.customQuestion || 'AMA'}
                                                    </div>
                                                    "{storyModalData.item.customAnswer}"
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#a1a1aa', letterSpacing: '2px', marginBottom: '8px' }}>
                                                @{username.toUpperCase()}
                                            </div>
                                            <h1 style={{
                                                fontSize: '28px',
                                                fontWeight: '900',
                                                background: activeTheme.accent,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                margin: '0 0 16px 0'
                                            }}>
                                                {getVibeTitle(userData?.averageScores)}
                                            </h1>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', fontSize: '12px', fontWeight: '700' }}>
                                                    💚 Top Green Flag: {getTopPoll('q1')}
                                                </div>
                                                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', fontSize: '12px', fontWeight: '700' }}>
                                                    ✨ Best Quality: {getTopPoll('q2')}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '100%',
                                            padding: '11px 14px',
                                            borderRadius: '14px',
                                            background: 'rgba(255,255,255,0.07)',
                                            border: `1px solid ${activeTheme.border}`,
                                            fontSize: '12px',
                                            fontWeight: '800',
                                            color: '#fff'
                                        }}>
                                            🔗 send me an anonymous hype →
                                        </div>
                                        <span style={{ fontSize: '11px', color: '#a1a1aa' }}>@{username}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '14px' }}>
                            <button
                                onClick={downloadStoryPng}
                                style={{
                                    flex: 1,
                                    padding: '13px',
                                    background: 'linear-gradient(45deg, #f09433, #bc1888)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '14px',
                                    fontWeight: '800',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                {storySavedMsg ? 'Saved + Link Copied! 🔗' : 'Save 9:16 Story 📸'}
                            </button>
                            <button
                                onClick={() => setStoryModalData(null)}
                                style={{
                                    padding: '13px 16px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    borderRadius: '14px',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ⏳ LOADING STATE */}
            {loading && (
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginTop: '28vh' }}>
                    <div style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '3px', color: accent }}>
                        TUNING INTO @{username.toUpperCase()}...
                    </div>
                </div>
            )}

            {/* ❌ NOT FOUND STATE */}
            {!loading && notFound && (
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '420px', margin: '20vh auto 0 auto', textAlign: 'center', ...glassCardStyle }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛰️</div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>@{username} not found</h2>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '20px' }}>
                        This vibe portal doesn't exist yet or the username was mistyped.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '12px 22px',
                            borderRadius: '999px',
                            background: 'linear-gradient(45deg, #f09433, #bc1888)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '800',
                            cursor: 'pointer'
                        }}
                    >
                        Back to 3D Portal Hub
                    </button>
                </div>
            )}

            {/* 🚀 MAIN PROFILE CONTENT */}
            {!loading && userData && userData.user && (
                <div className="vibe-panel" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '18px', margin: '0 auto' }}>

                    {/* 1. HEADER CARD */}
                    <div style={{ ...glassCardStyle, textAlign: 'center', position: 'relative' }}>
                        <div style={{
                            width: '104px',
                            height: '104px',
                            borderRadius: '50%',
                            padding: '3px',
                            background: 'linear-gradient(45deg, #f09433, #bc1888)',
                            margin: '0 auto 14px auto',
                            boxShadow: '0 0 30px rgba(255, 46, 147, 0.35)'
                        }}>
                            <img
                                src={userData.user.profilePic || 'https://via.placeholder.com/150'}
                                alt={userData.user.name}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', backgroundColor: '#0a0a12' }}
                            />
                        </div>

                        <h2 style={{ margin: '0 0 4px 0', fontSize: '23px', fontWeight: '900', letterSpacing: '-0.5px' }}>
                            {userData.user.name}
                        </h2>
                        <p style={{ color: '#a1a1aa', margin: '0 0 14px 0', fontSize: '13px', fontWeight: '600' }}>
                            @{userData.user.username}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '7px 14px',
                                background: 'rgba(255, 46, 147, 0.14)',
                                border: '1px solid rgba(255, 46, 147, 0.4)',
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: '800',
                                color: '#ff85a2'
                            }}>
                                {getVibeTitle(userData.averageScores)}
                            </span>

                            <button
                                onClick={() => setStoryModalData({ type: 'profile' })}
                                style={{
                                    padding: '7px 14px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                    borderRadius: '999px',
                                    fontSize: '12px',
                                    fontWeight: '800',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                9:16 Vibe Card 📸
                            </button>
                        </div>
                    </div>

                    {/* 2. DYNAMIC VIBE ANALYTICS */}
                    <div style={glassCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '0.5px' }}>Vibe Analytics 📈</span>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: '800',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                background: 'rgba(255, 46, 147, 0.16)',
                                color: '#ff2e93'
                            }}>
                                {userData.ratings?.length || 0} Hypes
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            {['trust', 'vibe', 'intellect', 'humor'].map((trait) => {
                                const val = Math.round(userData.averageScores?.[trait] || 50);
                                return (
                                    <div key={trait} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ textTransform: 'capitalize', fontSize: '12px', color: '#a1a1aa', fontWeight: '600' }}>{trait}</span>
                                            <span style={{ fontWeight: '800', fontSize: '12px', color: '#fff' }}>{val}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${val}%`,
                                                height: '100%',
                                                background: 'linear-gradient(90deg, #ff2e93, #f09433)',
                                                boxShadow: '0 0 10px rgba(255, 46, 147, 0.6)'
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ background: 'rgba(30, 215, 96, 0.07)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(30, 215, 96, 0.25)', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Top Green Flag 💚</span>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1ed760' }}>{getTopPoll('q1')}</span>
                            </div>
                            <div style={{ background: 'rgba(240, 148, 51, 0.08)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(240, 148, 51, 0.25)', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>Best Quality ✨</span>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#f09433' }}>{getTopPoll('q2')}</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. ASK ME ANYTHING (AMA) */}
                    <div style={glassCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Ask Me Anything 🎙️</h3>
                            {isOwner && (
                                <button
                                    onClick={() => setIsEditingQ(!isEditingQ)}
                                    style={{ background: 'none', border: 'none', color: '#ff2e93', fontSize: '12px', cursor: 'pointer', fontWeight: '800' }}
                                >
                                    {isEditingQ ? 'Cancel' : 'Edit Question ✏️'}
                                </button>
                            )}
                        </div>

                        {isEditingQ && isOwner ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,46,147,0.45)',
                                        background: 'rgba(0,0,0,0.5)',
                                        color: '#fff',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={handleUpdateQuestion}
                                    style={{
                                        padding: '12px 18px',
                                        background: 'linear-gradient(45deg, #f09433, #bc1888)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#fff',
                                    marginBottom: !isOwner ? '14px' : 0,
                                    padding: '14px 16px',
                                    background: 'rgba(255,255,255,0.04)',
                                    borderRadius: '14px',
                                    borderLeft: '3px solid #ff2e93'
                                }}>
                                    "{userData.user.customQuestion || 'Farewell mein mujhe kya pehenna chahiye?'}"
                                </div>
                                {!isOwner && (
                                    <input
                                        type="text"
                                        placeholder="Drop your anonymous answer..."
                                        value={customAnswer}
                                        onChange={(e) => setCustomAnswer(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '13px 15px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.14)',
                                            background: 'rgba(0,0,0,0.45)',
                                            color: '#fff',
                                            fontSize: '14px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* 4. 10-QUESTION CROWD POLL DECK (Visitors) */}
                    {!isOwner && (
                        <div style={glassCardStyle}>
                            {/* 10 Segmented Progress Bars */}
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '16px' }}>
                                {pollQuestions.map((pq, i) => (
                                    <div
                                        key={pq.id}
                                        onClick={() => setCurrentSlide(i)}
                                        style={{
                                            flex: 1,
                                            height: '4px',
                                            borderRadius: '999px',
                                            cursor: 'pointer',
                                            background: polls[pq.id]
                                                ? '#1ed760'
                                                : i === currentSlide
                                                    ? '#ff2e93'
                                                    : 'rgba(255,255,255,0.12)',
                                            transition: 'all 0.25s ease'
                                        }}
                                    />
                                ))}
                            </div>

                            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.6px', color: '#ff2e93', textAlign: 'center', marginBottom: '6px' }}>
                                POLL {currentSlide + 1} / 10
                            </div>
                            <h2 style={{ fontSize: '19px', fontWeight: '800', textAlign: 'center', margin: '0 0 18px 0' }}>
                                {pollQuestions[currentSlide].title}
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                                {pollQuestions[currentSlide].options.map((opt) => {
                                    const isSelected = polls[pollQuestions[currentSlide].id] === opt;
                                    return (
                                        <button
                                            key={opt}
                                            className="poll-btn"
                                            onClick={() => {
                                                setPolls({ ...polls, [pollQuestions[currentSlide].id]: opt });
                                                if (currentSlide < 9) setTimeout(() => setCurrentSlide((c) => c + 1), 260);
                                            }}
                                            style={{
                                                border: isSelected ? '1px solid #ff2e93' : '1px solid rgba(255,255,255,0.12)',
                                                background: isSelected ? 'rgba(255, 46, 147, 0.18)' : 'rgba(255,255,255,0.03)',
                                                color: isSelected ? '#fff' : '#d4d4d8',
                                                boxShadow: isSelected ? '0 0 18px rgba(255, 46, 147, 0.3)' : 'none'
                                            }}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    disabled={currentSlide === 0}
                                    onClick={() => setCurrentSlide((c) => c - 1)}
                                    style={{ background: 'none', border: 'none', color: currentSlide === 0 ? '#444' : '#a1a1aa', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    ◀ Prev
                                </button>
                                <span style={{ fontSize: '11px', color: '#71717a' }}>
                                    {Object.keys(polls).length}/10 answered
                                </span>
                                <button
                                    disabled={currentSlide === 9}
                                    onClick={() => setCurrentSlide((c) => c + 1)}
                                    style={{ background: 'none', border: 'none', color: currentSlide === 9 ? '#444' : '#a1a1aa', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Next ▶
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 5. VIBE METER & ANONYMOUS HYPE BOX (Visitors) */}
                    {!isOwner && (
                        <div style={glassCardStyle}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>Rate Their Vibe ⚡</h3>

                            <div style={{ marginBottom: '20px' }}>
                                {['trust', 'vibe', 'intellect', 'humor'].map((trait) => (
                                    <div key={trait} style={{ marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ textTransform: 'capitalize', fontSize: '12px', color: '#a1a1aa', fontWeight: '600' }}>{trait}</span>
                                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#ff85a2' }}>{ratings[trait]}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            name={trait}
                                            min="1"
                                            max="100"
                                            value={ratings[trait]}
                                            onChange={(e) => setRatings({ ...ratings, [e.target.name]: Number(e.target.value) })}
                                            style={{ width: '100%', accentColor: '#ff2e93', cursor: 'pointer' }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <input
                                    type="checkbox"
                                    id="anonToggle"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: '#ff2e93', cursor: 'pointer' }}
                                />
                                <label htmlFor="anonToggle" style={{ fontSize: '13px', fontWeight: '600', color: '#e4e4e7', cursor: 'pointer' }}>
                                    Keep my identity 100% secret 🕵️
                                </label>
                            </div>

                            {!isAnonymous && (
                                <input
                                    type="text"
                                    placeholder="Your Name (Optional)"
                                    value={senderName}
                                    onChange={(e) => setSenderName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.14)',
                                        background: 'rgba(0,0,0,0.45)',
                                        color: '#fff',
                                        marginBottom: '12px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            )}

                            <textarea
                                placeholder="Send an anonymous confession, compliment, or roast..."
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '14px',
                                    border: '1px solid rgba(255,255,255,0.14)',
                                    background: 'rgba(0,0,0,0.45)',
                                    color: '#fff',
                                    minHeight: '86px',
                                    marginBottom: '14px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />

                            {sentBanner && (
                                <div style={{
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'rgba(30, 215, 96, 0.16)',
                                    border: '1px solid #1ed760',
                                    color: '#1ed760',
                                    fontSize: '13px',
                                    fontWeight: '800',
                                    textAlign: 'center',
                                    marginBottom: '12px'
                                }}>
                                    Vibe Hype Sent Anonymously! 💌✨
                                </div>
                            )}

                            <button
                                onClick={submitVibeCheck}
                                disabled={submitting}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: 'linear-gradient(45deg, #f09433, #bc1888)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '14px',
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 25px rgba(188, 24, 136, 0.4)'
                                }}
                            >
                                {submitting ? 'Sending...' : `Send ${isAnonymous ? 'Anonymously' : 'Message'} 🚀`}
                            </button>
                        </div>
                    )}

                    {/* 6. SECRET INBOX + 9:16 IG STORY REPLY CARDS */}
                    <div style={glassCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Secret Inbox 🤫</h3>
                            <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Tap 📸 to reply on IG</span>
                        </div>

                        {userData.ratings && userData.ratings.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {userData.ratings.slice().reverse().map((r, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.09)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: (!r.senderName || r.senderName === 'Anonymous') ? '#ff2e93' : '#1ed760' }}>
                                                {r.senderName || 'Anonymous'}
                                            </h4>

                                            <button
                                                onClick={() => setStoryModalData({ type: 'message', item: r })}
                                                style={{
                                                    padding: '5px 10px',
                                                    borderRadius: '999px',
                                                    background: 'rgba(255,255,255,0.07)',
                                                    border: '1px solid rgba(255,255,255,0.15)',
                                                    color: '#fff',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Reply 📸
                                            </button>
                                        </div>

                                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.45', color: '#f4f4f5' }}>
                                            "{r.comment}"
                                        </p>

                                        {r.customAnswer && (
                                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: '10px', borderLeft: '2px solid #f09433', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '10px', color: '#a1a1aa', display: 'block', marginBottom: '2px' }}>Replied to your AMA:</span>
                                                <span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{r.customAnswer}</span>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {r.polls?.q1 && (
                                                <span style={{ fontSize: '11px', background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.25)', color: '#1ed760', padding: '4px 9px', borderRadius: '999px', fontWeight: '600' }}>
                                                    💚 {r.polls.q1}
                                                </span>
                                            )}
                                            {r.polls?.q2 && (
                                                <span style={{ fontSize: '11px', background: 'rgba(240,148,51,0.1)', border: '1px solid rgba(240,148,51,0.25)', color: '#f09433', padding: '4px 9px', borderRadius: '999px', fontWeight: '600' }}>
                                                    ✨ {r.polls.q2}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                                <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '0 0 12px 0' }}>
                                    Inbox is empty right now — share your link on IG Story!
                                </p>
                                <button
                                    onClick={copyProfileLink}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '999px',
                                        background: 'rgba(255,46,147,0.16)',
                                        border: '1px solid #ff2e93',
                                        color: '#fff',
                                        fontSize: '12px',
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Copy My Vibe Link 🔗
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}

export default Profile;