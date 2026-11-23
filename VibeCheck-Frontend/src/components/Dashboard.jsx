import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* 🌌 REAL-TIME 3D ARCHITECTURAL CORRIDOR FLY-THROUGH */
const CorridorTunnel3D = ({ test }) => {
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

        const startTime = performance.now();
        const duration = 1150;
        const numFrames = 26;
        const spacing = 1.1;

        const render = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const travel = t * t * 18;

            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const fov = Math.min(w, h) * 0.9;

            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, w, h);

            const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.65);
            glow.addColorStop(0, `${test.color}88`);
            glow.addColorStop(0.35, `${test.color}22`);
            glow.addColorStop(1, 'rgba(5, 5, 8, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = `${test.color}44`;
            ctx.lineWidth = 1.2;
            [-2.2, -1.1, 1.1, 2.2].forEach((xOffset) => {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + xOffset * fov, h);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + xOffset * fov, 0);
                ctx.stroke();
            });

            for (let i = numFrames; i >= 1; i--) {
                let z = i * spacing - (travel % spacing);
                if (z <= 0.15) continue;

                const scale = fov / z;
                const halfW = 1.75 * scale;
                const halfH = 1.15 * scale;
                const pillarW = 0.22 * scale;
                const alpha = Math.max(0, Math.min(1, 1 - z / (numFrames * spacing)));

                const leftX = cx - halfW;
                const rightX = cx + halfW;
                const topY = cy - halfH;

                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.16})`;
                ctx.lineWidth = Math.max(1, scale * 0.015);
                ctx.strokeRect(leftX, topY, halfW * 2, halfH * 2);

                ctx.fillStyle = `rgba(14, 14, 22, ${alpha * 0.92})`;
                ctx.fillRect(leftX - pillarW, topY, pillarW, halfH * 2);
                ctx.fillRect(rightX, topY, pillarW, halfH * 2);

                ctx.fillStyle = test.color;
                ctx.globalAlpha = alpha * 0.85;
                ctx.fillRect(leftX - 2, topY + halfH * 0.2, Math.max(1.5, scale * 0.018), halfH * 1.6);
                ctx.fillRect(rightX, topY + halfH * 0.2, Math.max(1.5, scale * 0.018), halfH * 1.6);
                ctx.globalAlpha = 1;
            }

            const cardScale = 0.28 + Math.pow(t, 2.2) * 1.25;
            const cardW = Math.min(w * 0.82, 420) * cardScale;
            const cardH = cardW * 0.56;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.shadowColor = test.color;
            ctx.shadowBlur = 36;
            ctx.fillStyle = 'rgba(12, 12, 18, 0.9)';
            ctx.strokeStyle = test.color;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 18 * cardScale);
            ctx.fill();
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `900 ${Math.round(22 * cardScale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.fillText(`${test.emoji}  ${test.short}`, 0, -10 * cardScale);

            ctx.fillStyle = test.color;
            ctx.font = `700 ${Math.round(11 * cardScale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.fillText('ENTERING REALM...', 0, 20 * cardScale);
            ctx.restore();

            if (t < 1) {
                animId = requestAnimationFrame(render);
            }
        };

        animId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [test]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                display: 'block'
            }}
        />
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const myUsername = localStorage.getItem('vibe_username') || localStorage.getItem('username');

    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIdx, setActiveIdx] = useState(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const [dialAngle, setDialAngle] = useState(0);
    const [enteringTest, setEnteringTest] = useState(null);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const TESTS = [
        {
            id: 'main',
            short: 'VIBECHECK',
            emoji: '📈',
            title: 'Ultimate VibeCheck',
            tag: 'LIVE HUB',
            desc: 'Anonymous inbox & 10 custom crowd polls.',
            color: '#ff2e93',
            bg: 'radial-gradient(circle at 50% 20%, #8a0b4d 0%, #1d0616 55%, #07050a 100%)',
            pattern: 'repeating-linear-gradient(45deg, rgba(255,46,147,0.09) 0px, rgba(255,46,147,0.09) 1px, transparent 1px, transparent 22px)',
            route: myUsername ? `/${myUsername}` : '/'
        },
        {
            id: 'mbti',
            short: 'MBTI 16',
            emoji: '🧠',
            title: '16 Personalities',
            tag: 'NEW 🔥',
            desc: 'Decode your mind & fictional twin.',
            color: '#ff9a3c',
            bg: 'radial-gradient(circle at 80% 25%, #994300 0%, #261105 55%, #07050a 100%)',
            pattern: 'radial-gradient(rgba(255,154,60,0.18) 1px, transparent 1px)',
            route: '/test/mbti'
        },
        {
            id: 'villain-arc',
            short: 'VILLAIN',
            emoji: '🐺',
            title: 'Your Villain Arc',
            tag: "MEN'S",
            desc: 'Dark Stoic, Strategist, or Mastermind?',
            color: '#e4e4e7',
            bg: 'radial-gradient(circle at 85% 50%, #4b4b54 0%, #16161b 55%, #050507 100%)',
            pattern: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 28px)',
            route: '/test/villain-arc'
        },
        {
            id: 'rizz-check',
            short: 'RIZZ',
            emoji: '🥂',
            title: 'Rizz & Presence',
            tag: "MEN'S",
            desc: 'Old Money Calm or Unspoken Menace?',
            color: '#f5b041',
            bg: 'radial-gradient(circle at 75% 80%, #7d520b 0%, #211605 55%, #07050a 100%)',
            pattern: 'repeating-linear-gradient(-45deg, rgba(245,176,65,0.1) 0px, rgba(245,176,65,0.1) 1px, transparent 1px, transparent 20px)',
            route: '/test/rizz-check'
        },
        {
            id: 'baddie-type',
            short: 'BADDIE',
            emoji: '💋',
            title: 'Baddie Archetype',
            tag: 'BADDIES',
            desc: 'Dark Feminine Siren or Soft Luxury Icon?',
            color: '#ff3b6b',
            bg: 'radial-gradient(circle at 50% 85%, #910e31 0%, #260511 55%, #07050a 100%)',
            pattern: 'radial-gradient(rgba(255,59,107,0.2) 1.2px, transparent 1.2px)',
            route: '/test/baddie-type'
        },
        {
            id: 'delulu-meter',
            short: 'DELULU',
            emoji: '💅',
            title: 'Delulu Meter',
            tag: 'BADDIES',
            desc: 'High-Standards Queen or Delulu Diva?',
            color: '#d946ef',
            bg: 'radial-gradient(circle at 20% 80%, #78138a 0%, #210629 55%, #07050a 100%)',
            pattern: 'repeating-linear-gradient(45deg, rgba(217,70,239,0.1) 0px, rgba(217,70,239,0.1) 1px, transparent 1px, transparent 24px)',
            route: '/test/delulu-meter'
        },
        {
            id: 'red-flag',
            short: 'RED FLAG',
            emoji: '🚩',
            title: 'Red Flag Analyzer',
            tag: 'CLASSIC',
            desc: 'Brutal honesty check on your toxic traits.',
            color: '#ff2e4c',
            bg: 'radial-gradient(circle at 15% 50%, #8f0b21 0%, #24050a 55%, #07050a 100%)',
            pattern: 'repeating-linear-gradient(0deg, rgba(255,46,76,0.09) 0px, rgba(255,46,76,0.09) 1px, transparent 1px, transparent 26px)',
            route: '/test/red-flag'
        },
        {
            id: 'aura-reader',
            short: 'AURA',
            emoji: '✨',
            title: 'Aura Reader',
            tag: 'CLASSIC',
            desc: 'Discover the true color of your energy.',
            color: '#8b5cf6',
            bg: 'radial-gradient(circle at 20% 20%, #5821ad 0%, #170933 55%, #07050a 100%)',
            pattern: 'radial-gradient(rgba(139,92,246,0.22) 1.2px, transparent 1.2px)',
            route: '/test/aura-reader'
        }
    ];

    // ✨ Auto-spotlight cycle on mobile/idle so the wheel is always alive & glowing
    useEffect(() => {
        if (isInteracting || enteringTest) return;
        const timer = setInterval(() => {
            setActiveIdx((prev) => {
                const next = (prev + 1) % TESTS.length;
                setDialAngle(next * 45);
                return next;
            });
        }, 2400);
        return () => clearInterval(timer);
    }, [isInteracting, enteringTest, TESTS.length]);

    // Convert screen coordinates (mouse or touch) into slice index + smooth angle
    const updateFromCoords = (clientX, clientY) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight * (isMobile ? 0.46 : 0.5);
        let deg = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
        if (deg < 0) deg += 360;
        setDialAngle(deg);
        const idx = Math.floor(((deg + 22.5) % 360) / 45);
        setActiveIdx(idx);
    };

    const handleMouseMove = (e) => {
        setIsInteracting(true);
        updateFromCoords(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
        if (e.touches && e.touches[0]) {
            setIsInteracting(true);
            updateFromCoords(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/${searchQuery.trim().toLowerCase()}`);
        }
    };

    const handleEnterPortal = (test) => {
        setEnteringTest(test);
        setTimeout(() => {
            navigate(test.route);
        }, 1120);
    };

    const getSliceClipPath = (idx) => {
        const startDeg = idx * 45 - 22.5;
        const midDeg = idx * 45;
        const endDeg = idx * 45 + 22.5;
        const R = 175;
        const originY = isMobile ? 46 : 50;
        const pt = (deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = 50 + R * Math.sin(rad);
            const y = originY - R * Math.cos(rad);
            return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
        };
        return `polygon(50% ${originY}%, ${pt(startDeg)}, ${pt(midDeg)}, ${pt(endDeg)})`;
    };

    const currentTest = enteringTest || TESTS[activeIdx] || TESTS[0];
    const activeColor = currentTest.color;
    const centerYPercent = isMobile ? '46%' : '50%';

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchStart={handleTouchMove}
            onTouchMove={handleTouchMove}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#050508',
                color: '#fff',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                overflow: 'hidden',
                userSelect: 'none',
                touchAction: 'none'
            }}
        >
            <style>{`
        @keyframes pulseCue {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .cue-blink {
          animation: pulseCue 2s ease-in-out infinite;
        }
        .slice-layer {
          position: absolute;
          inset: 0;
          cursor: pointer;
          transition: filter 0.35s ease;
        }
        .slice-bg-content {
          position: absolute;
          inset: 0;
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

            {/* 🌀 REAL 3D CORRIDOR FLY-THROUGH OVERLAY */}
            {enteringTest && <CorridorTunnel3D test={enteringTest} />}

            {/* 🌈 8 FULL-SCREEN BLEED RADIAL SLICES */}
            {TESTS.map((test, idx) => {
                const isActive = activeIdx === idx;
                const midRad = ((idx * 45) * Math.PI) / 180;
                // Responsive ray radius so text sits inside wide part of wedge on mobile
                const radiusX = isMobile ? 37 : 34;
                const radiusY = isMobile ? 31 : 34;
                const originY = isMobile ? 46 : 50;
                const artX = 50 + radiusX * Math.sin(midRad);
                const artY = originY - radiusY * Math.cos(midRad);

                return (
                    <div
                        key={test.id}
                        className="slice-layer"
                        onClick={() => {
                            setActiveIdx(idx);
                            handleEnterPortal(test);
                        }}
                        style={{
                            clipPath: getSliceClipPath(idx),
                            WebkitClipPath: getSliceClipPath(idx),
                            filter: isActive
                                ? 'brightness(1.28) saturate(1.35)'
                                : 'brightness(0.42) saturate(0.5)',
                            zIndex: isActive ? 4 : 1
                        }}
                    >
                        <div
                            className="slice-bg-content"
                            style={{
                                background: test.bg,
                                transform: isActive ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: test.pattern,
                                backgroundSize: test.pattern.includes('radial') ? '22px 22px' : 'auto',
                                opacity: isActive ? 0.9 : 0.4
                            }} />

                            {/* Slice Emoji + Crisp Non-Clipping Title */}
                            <div style={{
                                position: 'absolute',
                                left: `${artX}%`,
                                top: `${artY}%`,
                                transform: `translate(-50%, -50%) scale(${isActive ? 1.12 : 0.92})`,
                                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                                textAlign: 'center',
                                pointerEvents: 'none',
                                width: isMobile ? '96px' : '180px'
                            }}>
                                <div style={{
                                    fontSize: isMobile ? '34px' : 'clamp(44px, 5.5vw, 72px)',
                                    filter: isActive ? `drop-shadow(0 0 24px ${test.color})` : 'none',
                                    opacity: isActive ? 1 : 0.72,
                                    lineHeight: 1
                                }}>
                                    {test.emoji}
                                </div>
                                <div style={{
                                    marginTop: '6px',
                                    fontSize: isMobile ? '10px' : '14px',
                                    fontWeight: '900',
                                    letterSpacing: isMobile ? '1.4px' : '2.8px',
                                    color: '#fff',
                                    textShadow: isActive ? `0 0 14px ${test.color}` : 'none',
                                    opacity: isActive ? 1 : 0.65,
                                    whiteSpace: 'nowrap'
                                }}>
                                    {isMobile ? test.short : test.title.toUpperCase()}
                                </div>
                                {!isMobile && (
                                    <div style={{
                                        marginTop: '4px',
                                        fontSize: '11px',
                                        color: 'rgba(255,255,255,0.78)',
                                        opacity: isActive ? 1 : 0,
                                        transition: 'opacity 0.25s ease'
                                    }}>
                                        {test.desc}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 📏 RAZOR-THIN RADIAL DIVIDER RAYS */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }}>
                {TESTS.map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            top: centerYPercent,
                            left: '50%',
                            width: '160vmax',
                            height: '1px',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)',
                            transformOrigin: '0 0',
                            transform: `rotate(${idx * 45 - 112.5}deg)`
                        }}
                    />
                ))}
            </div>

            {/* 🎯 PRECISION CENTER ROTARY DIAL */}
            <div
                onClick={() => handleEnterPortal(currentTest)}
                style={{
                    position: 'absolute',
                    top: centerYPercent,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? '186px' : 'clamp(240px, 28vw, 310px)',
                    height: isMobile ? '186px' : 'clamp(240px, 28vw, 310px)',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #101018 0%, #050508 78%)',
                    boxShadow: `0 0 60px rgba(0,0,0,0.95), 0 0 36px ${activeColor}44`,
                    zIndex: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    boxSizing: 'border-box'
                }}
            >
                {/* Outer Dashed Ring */}
                <div style={{
                    position: 'absolute',
                    inset: '-6px',
                    borderRadius: '50%',
                    border: `1.5px dashed ${activeColor}99`,
                    transition: 'border-color 0.3s ease',
                    pointerEvents: 'none'
                }} />

                {/* 8 Precision Radar Tick Marks (No overlapping or upside-down text!) */}
                {TESTS.map((t, idx) => (
                    <div
                        key={t.id}
                        style={{
                            position: 'absolute',
                            inset: '4px',
                            transform: `rotate(${idx * 45}deg)`,
                            display: 'flex',
                            justifyContent: 'center',
                            pointerEvents: 'none'
                        }}
                    >
                        <div style={{
                            width: activeIdx === idx ? '3px' : '1.5px',
                            height: activeIdx === idx ? '10px' : '6px',
                            borderRadius: '2px',
                            background: activeIdx === idx ? t.color : 'rgba(255,255,255,0.22)',
                            transition: 'all 0.25s ease'
                        }} />
                    </div>
                ))}

                {/* Orbiting Glowing Tuner Dot */}
                <div style={{
                    position: 'absolute',
                    inset: '14px',
                    transform: `rotate(${dialAngle}deg)`,
                    transition: isInteracting ? 'transform 0.08s linear' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: activeColor,
                        boxShadow: `0 0 14px ${activeColor}, 0 0 28px ${activeColor}`
                    }} />
                </div>

                {/* Center Typography */}
                <div
                    className="cue-blink"
                    style={{
                        fontSize: isMobile ? '8.5px' : '10px',
                        fontWeight: '800',
                        letterSpacing: '1.8px',
                        color: activeColor,
                        marginBottom: '6px',
                        textTransform: 'uppercase'
                    }}
                >
                    {isMobile ? 'SWIPE DIAL OR TAP' : 'TUNE & CLICK'}
                </div>

                <div style={{
                    fontSize: isMobile ? '17px' : '25px',
                    fontWeight: '900',
                    letterSpacing: '-0.5px',
                    color: '#fff',
                    textAlign: 'center',
                    lineHeight: '1.15'
                }}>
                    {currentTest.title}
                </div>

                <div style={{
                    marginTop: '8px',
                    fontSize: isMobile ? '9px' : '11px',
                    color: activeColor,
                    letterSpacing: '1.4px',
                    fontWeight: '800'
                }}>
                    {currentTest.tag} • ENTER →
                </div>
            </div>

            {/* 🛸 RESPONSIVE TOP BAR */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: isMobile ? '12px 14px' : '18px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
                zIndex: 25
            }}>
                <div style={{
                    fontSize: isMobile ? '16px' : '20px',
                    fontWeight: '900',
                    letterSpacing: '-0.5px',
                    color: '#fff',
                    flexShrink: 0
                }}>
                    vibecheck<span style={{ color: activeColor }}>.</span>
                </div>

                <form
                    onSubmit={handleSearch}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(10, 10, 16, 0.72)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '999px',
                        padding: '3px 4px 3px 12px',
                        flex: isMobile ? 1 : 'initial',
                        maxWidth: isMobile ? '185px' : '240px'
                    }}
                >
                    <input
                        type="text"
                        placeholder={isMobile ? '@username...' : 'Find @username...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12px',
                            outline: 'none',
                            width: '100%',
                            minWidth: 0
                        }}
                    />
                    <button type="submit" style={{
                        background: '#fff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}>
                        Go
                    </button>
                </form>

                <button
                    onClick={() => navigate(myUsername ? `/${myUsername}` : '/')}
                    style={{
                        padding: isMobile ? '7px 12px' : '8px 16px',
                        background: 'rgba(10, 10, 16, 0.78)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${activeColor}88`,
                        color: '#fff',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontWeight: '800',
                        fontSize: isMobile ? '11px' : '12px',
                        flexShrink: 0
                    }}
                >
                    {myUsername ? `@${myUsername}` : 'Login 👤'}
                </button>
            </div>

            {/* 📱 BOTTOM FLOATING GLASS LAUNCH BAR (Super clean on mobile) */}
            <div style={{
                position: 'fixed',
                bottom: isMobile ? '18px' : '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 28px)',
                maxWidth: '440px',
                background: 'rgba(10, 10, 18, 0.78)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: `1px solid ${activeColor}55`,
                borderRadius: '20px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: `0 16px 40px rgba(0,0,0,0.8), 0 0 25px ${activeColor}22`,
                zIndex: 25
            }}>
                <div style={{ minWidth: 0, textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentTest.emoji} {currentTest.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentTest.desc}
                    </div>
                </div>

                <button
                    onClick={() => handleEnterPortal(currentTest)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '14px',
                        background: activeColor,
                        color: '#050508',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: '900',
                        letterSpacing: '0.5px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: `0 0 18px ${activeColor}66`
                    }}
                >
                    ENTER →
                </button>
            </div>
        </div>
    );
};

export default Dashboard;