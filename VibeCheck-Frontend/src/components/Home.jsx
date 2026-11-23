import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';

/* 🌌 INTERACTIVE 3D PORTAL VORTEX CANVAS */
const PortalVortex3D = () => {
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

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e) => {
            targetX = ((e.clientX / window.innerWidth) - 0.5) * 90;
            targetY = ((e.clientY / window.innerHeight) - 0.5) * 90;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const particles = Array.from({ length: 65 }, () => ({
            angle: Math.random() * Math.PI * 2,
            radius: 0.35 + Math.random() * 1.4,
            z: Math.random() * 16 + 1,
            hue: Math.random() > 0.5 ? '#ff2e93' : '#f09433'
        }));

        let ringOffset = 0;

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;
            currentX += (targetX - currentX) * 0.06;
            currentY += (targetY - currentY) * 0.06;

            const cx = w / 2 + currentX;
            const cy = h / 2 + currentY;
            const fov = Math.min(w, h) * 0.72;
            ringOffset = (ringOffset + 0.025) % 1;

            // Deep space background
            ctx.fillStyle = '#040408';
            ctx.fillRect(0, 0, w, h);

            // Core volumetric glow
            const coreGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.58);
            coreGlow.addColorStop(0, 'rgba(188, 24, 136, 0.34)');
            coreGlow.addColorStop(0.4, 'rgba(240, 148, 51, 0.10)');
            coreGlow.addColorStop(1, 'rgba(4, 4, 8, 0)');
            ctx.fillStyle = coreGlow;
            ctx.fillRect(0, 0, w, h);

            // 3D Tunnel Rings rushing forward
            const totalRings = 14;
            for (let i = totalRings; i >= 1; i--) {
                const z = i - ringOffset;
                if (z <= 0.15) continue;
                const radius = (fov * 0.85) / z;
                const alpha = Math.max(0, Math.min(0.42, (1 - z / totalRings) * 0.55));

                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.strokeStyle = i % 2 === 0
                    ? `rgba(255, 46, 147, ${alpha})`
                    : `rgba(240, 148, 51, ${alpha * 0.8})`;
                ctx.lineWidth = Math.max(1, 2.2 / z);
                ctx.stroke();
            }

            // 3D Warp Particles
            particles.forEach((p) => {
                p.z -= 0.045;
                p.angle += 0.004;
                if (p.z <= 0.2) {
                    p.z = 16;
                    p.angle = Math.random() * Math.PI * 2;
                }
                const scale = fov / p.z;
                const px = cx + Math.cos(p.angle) * p.radius * scale;
                const py = cy + Math.sin(p.angle) * p.radius * scale;
                const size = Math.max(1, (1 - p.z / 16) * 3.4);
                const alpha = Math.max(0, (1 - p.z / 16) * 0.85);

                ctx.fillStyle = p.hue;
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
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

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

const OneTapLogin = ({ onAuthSuccess }) => {
    useGoogleOneTapLogin({
        onSuccess: async (credentialResponse) => {
            try {
                const res = await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/auth/google', {
                    token: credentialResponse.credential
                });
                if (res.data.success) {
                    localStorage.setItem('vibe_username', res.data.user.username);
                    onAuthSuccess(res.data.user.username);
                }
            } catch (error) {
                console.error('Backend Error:', error);
            }
        },
        onError: () => {
            console.log('One-Tap Login Failed');
        }
    });
    return null;
};

function Home() {
    const navigate = useNavigate();
    const existingUser = localStorage.getItem('vibe_username');
    const [unlockingUser, setUnlockingUser] = useState(null);

    const handleAuthSuccess = (username) => {
        setUnlockingUser(username);
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 900);
    };

    const REALM_CHIPS = [
        { emoji: '🧠', label: 'MBTI 16' },
        { emoji: '🐺', label: 'Villain Arc' },
        { emoji: '💋', label: 'Baddie Type' },
        { emoji: '🥂', label: 'Rizz Check' },
        { emoji: '💌', label: 'Anon Inbox' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#040408',
            color: '#fafafa',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 28px rgba(188, 24, 136, 0.35), 0 0 60px rgba(240, 148, 51, 0.15); }
          50% { box-shadow: 0 0 42px rgba(255, 46, 147, 0.6), 0 0 80px rgba(240, 148, 51, 0.28); }
        }
        @keyframes unlockZoom {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.25); opacity: 0; }
        }
        .portal-card {
          animation: heroFloat 5s ease-in-out infinite;
        }
        .portal-unlocking {
          animation: unlockZoom 0.9s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
        .login-aura {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .explore-btn {
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .explore-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: rgba(255, 46, 147, 0.7) !important;
        }
      `}</style>

            {/* 🌌 3D VORTEX BACKGROUND */}
            <PortalVortex3D />

            {/* 🔓 PORTAL UNLOCK OVERLAY ON LOGIN */}
            {unlockingUser && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999,
                    background: 'rgba(4, 4, 8, 0.88)',
                    backdropFilter: 'blur(14px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '42px', marginBottom: '10px' }}>⚡</div>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '900',
                        letterSpacing: '3px',
                        color: '#ff2e93',
                        marginBottom: '6px'
                    }}>
                        PORTAL UNLOCKED
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>
                        Welcome back, @{unlockingUser}
                    </div>
                </div>
            )}

            {/* 🛸 MINIMAL GLASS NAVBAR */}
            <nav style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 6%',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(4, 4, 8, 0.45)',
                backdropFilter: 'blur(12px)'
            }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '-0.8px' }}>
                    vibecheck<span style={{ color: '#ff2e93' }}>.</span>
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="explore-btn"
                        style={{
                            padding: '8px 16px',
                            borderRadius: '999px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer'
                        }}
                    >
                        {existingUser ? `Enter Hub (@${existingUser}) →` : '3D Portal Hub →'}
                    </button>
                </div>
            </nav>

            {/* 🎯 CENTER 3D PORTAL HERO STAGE */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 16px'
            }}>
                <div
                    className={unlockingUser ? 'portal-unlocking' : 'portal-card'}
                    style={{
                        width: '100%',
                        maxWidth: '580px',
                        background: 'rgba(10, 10, 18, 0.68)',
                        backdropFilter: 'blur(22px)',
                        WebkitBackdropFilter: 'blur(22px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '32px',
                        padding: '42px 28px',
                        textAlign: 'center',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.18)'
                    }}
                >
                    {/* Live Status Pill */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: 'rgba(255, 46, 147, 0.12)',
                        border: '1px solid rgba(255, 46, 147, 0.35)',
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '1.6px',
                        color: '#ff7eb3',
                        marginBottom: '22px'
                    }}>
                        <span>●</span> 8 INTERACTIVE REALMS • ANONYMOUS HUB
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(34px, 6vw, 52px)',
                        fontWeight: '900',
                        margin: '0 0 16px 0',
                        lineHeight: '1.12',
                        letterSpacing: '-1.8px'
                    }}>
                        Let your friends <br />
                        <span style={{
                            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            hype you up
                        </span>{' '}
                        anonymously.
                    </h1>

                    <p style={{
                        color: '#a1a1aa',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        maxWidth: '430px',
                        margin: '0 auto 28px auto'
                    }}>
                        Create your anonymous vibe link, run custom crowd polls, and decode your personality across 8 neon realms.
                    </p>

                    {/* Floating Realm Preview Chips */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '32px'
                    }}>
                        {REALM_CHIPS.map((chip) => (
                            <span
                                key={chip.label}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '999px',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.09)',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#e4e4e7'
                                }}
                            >
                                {chip.emoji} {chip.label}
                            </span>
                        ))}
                    </div>

                    {/* 🔐 GLOWING GOOGLE LOGIN PORTAL BUTTON */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                        <OneTapLogin onAuthSuccess={handleAuthSuccess} />
                        <div
                            className="login-aura"
                            style={{
                                padding: '4px',
                                borderRadius: '999px',
                                background: 'linear-gradient(45deg, #f09433, #bc1888)'
                            }}
                        >
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const res = await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/auth/google', {
                                            token: credentialResponse.credential
                                        });
                                        if (res.data.success) {
                                            localStorage.setItem('vibe_username', res.data.user.username);
                                            handleAuthSuccess(res.data.user.username);
                                        }
                                    } catch (error) {
                                        console.error('Backend Error:', error);
                                        alert('Login failed!');
                                    }
                                }}
                                onError={() => {
                                    console.log('Button Login Failed');
                                }}
                                useOneTap
                                shape="pill"
                                theme="filled_black"
                            />
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="explore-btn"
                            style={{
                                marginTop: '4px',
                                padding: '10px 20px',
                                borderRadius: '999px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.14)',
                                color: '#d4d4d8',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Skip Login & Explore 8 Vibe Tests ✨
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;