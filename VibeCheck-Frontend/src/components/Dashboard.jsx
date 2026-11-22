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
        const duration = 1200;
        const numFrames = 26;
        const spacing = 1.1;

        const render = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Smooth exponential acceleration into the portal
            const travel = t * t * 18;

            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const fov = Math.min(w, h) * 0.85;

            // Deep dark void
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, w, h);

            // Volumetric glow at vanishing point
            const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.6);
            glow.addColorStop(0, `${test.color}88`);
            glow.addColorStop(0.35, `${test.color}22`);
            glow.addColorStop(1, 'rgba(5, 5, 8, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, w, h);

            // Perspective Floor & Ceiling Rails
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

            // Draw 3D Corridor Pillars from far to near
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
                const botY = cy + halfH;

                // Architectural Frame Outline
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.16})`;
                ctx.lineWidth = Math.max(1, scale * 0.015);
                ctx.strokeRect(leftX, topY, halfW * 2, halfH * 2);

                // Left & Right Dark Pillars
                ctx.fillStyle = `rgba(14, 14, 22, ${alpha * 0.92})`;
                ctx.fillRect(leftX - pillarW, topY, pillarW, halfH * 2);
                ctx.fillRect(rightX, topY, pillarW, halfH * 2);

                // Glowing Neon Edge Strips on Pillars
                ctx.fillStyle = test.color;
                ctx.globalAlpha = alpha * 0.85;
                ctx.fillRect(leftX - 2, topY + halfH * 0.2, Math.max(1.5, scale * 0.018), halfH * 1.6);
                ctx.fillRect(rightX, topY + halfH * 0.2, Math.max(1.5, scale * 0.018), halfH * 1.6);
                ctx.globalAlpha = 1;
            }

            // Floating Glass Showcase Card rushing toward camera
            const cardScale = 0.25 + Math.pow(t, 2.2) * 1.35;
            const cardW = Math.min(w * 0.72, 460) * cardScale;
            const cardH = cardW * 0.56;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.shadowColor = test.color;
            ctx.shadowBlur = 40;
            ctx.fillStyle = 'rgba(12, 12, 18, 0.88)';
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
            ctx.font = `900 ${Math.round(28 * cardScale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.fillText(`${test.emoji}  ${test.title.toUpperCase()}`, 0, -10 * cardScale);

            ctx.fillStyle = test.color;
            ctx.font = `700 ${Math.round(12 * cardScale)}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.fillText('ENTERING REALM...', 0, 24 * cardScale);
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
    const myUsername = localStorage.getItem('username') || 'vibecheck';

    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [cursorAngle, setCursorAngle] = useState(0);
    const [enteringTest, setEnteringTest] = useState(null);

    const TESTS = [
        {
            id: 'main',
            short: 'VIBECHECK',
            emoji: '📈',
            title: 'Ultimate VibeCheck',
            tag: 'LIVE HUB',
            desc: 'Anonymous inbox & 10 custom crowd polls.',
            color: '#ff2e93',
            bg: 'radial-gradient(circle at 50% 20%, #7a0944 0%, #1a0614 55%, #07050a 100%)',
            pattern: 'repeating-linear-gradient(45deg, rgba(255,46,147,0.08) 0px, rgba(255,46,147,0.08) 1px, transparent 1px, transparent 22px)',
            route: `/${myUsername}`
        },
        {
            id: 'mbti',
            short: 'MBTI 16',
            emoji: '🧠',
            title: '16 Personalities',
            tag: 'NEW 🔥',
            desc: 'Decode your mind & fictional twin.',
            color: '#ff9a3c',
            bg: 'radial-gradient(circle at 80% 25%, #8a3c00 0%, #241005 55%, #07050a 100%)',
            pattern: 'radial-gradient(rgba(255,154,60,0.16) 1px, transparent 1px)',
            route: '/test/mbti'
        },
        {
            id: 'villain-arc',
            short: 'VILLAIN',
            emoji: '🐺',
            title: 'Your Villain Arc',
            tag: "MEN'S CORNER",
            desc: 'Dark Stoic, Strategist, or Mastermind?',
            color: '#e4e4e7',
            bg: 'radial-gradient(circle at 85% 50%, #3f3f46 0%, #141418 55%, #050507 100%)',
            pattern: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 28px)',
            route: '/test/villain-arc'
        },
        {
            id: 'rizz-check',
            short: 'RIZZ',
            emoji: '🥂',
            title: 'Rizz & Presence',
            tag: "MEN'S CORNER",
            desc: 'Old Money Calm or Unspoken Menace?',
            color: '#f5b041',
            bg: 'radial-gradient(circle at 75% 80%, #6e480a 0%, #1f1505 55%, #07050a 100%)',
            pattern: 'repeating-linear-gradient(-45deg, rgba(245,176,65,0.09) 0px, rgba(245,176,65,0.09) 1px, transparent 1px, transparent 20px)',
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
            bg: 'radial-gradient(circle at 50% 85%, #820c2c 0%, #240510 55%, #07050a 100%)',
            pattern: 'radial-gradient(rgba(255,59,107,0.18) 1.2px, transparent 1.2px)',
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
            bg: 'radial-gradient(circle at 20% 80%, #6b117a 0%, #1f0626 55%, #07050a 100%)',
            pattern: 'repeating-linear-gradient(45deg, rgba(217,70,239,0.09) 0px, rgba(217,70,239,0.09) 1px, transparent 1px, transparent 24px)',
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
            bg: 'radial-gradient(circle at 15% 50%, #7f0a1d 0%, #210509 55%, #07050a 100%)',
            pattern: 'repeating-linear-gradient(0deg, rgba(255,46,76,0.08) 0px, rgba(255,46,76,0.08) 1px, transparent 1px, transparent 26px)',
            route: '/test/red-flag'
        },
        {
            id: 'aura-reader',
            short: 'AURA',
            emoji: '✨',
            title: 'Aura Reader',
            tag: 'CLASSIC',
            desc: 'Discover the true color of your energy.',
            color: '#7c3aed',
            bg: 'radial-gradient(circle at 20% 20%, #4c1d95 0%, #15082e 55%, #07050a 100%)',
            pattern: 'radial-gradient(rgba(124,58,237,0.2) 1.2px, transparent 1.2px)',
            route: '/test/aura-reader'
        }
    ];

    // Track cursor angle around screen center for the orbiting dial dot
    const handleMouseMove = (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
        setCursorAngle(angle);
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
        }, 1180);
    };

    // Full-bleed edge-to-edge clip-path polygon for each 45° slice
    const getSliceClipPath = (idx) => {
        const startDeg = idx * 45 - 22.5;
        const midDeg = idx * 45;
        const endDeg = idx * 45 + 22.5;
        const R = 160;
        const pt = (deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = 50 + R * Math.sin(rad);
            const y = 50 - R * Math.cos(rad);
            return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
        };
        return `polygon(50% 50%, ${pt(startDeg)}, ${pt(midDeg)}, ${pt(endDeg)})`;
    };

    const activeTest = enteringTest || (hoveredIdx !== null ? TESTS[hoveredIdx] : null);
    const activeColor = activeTest ? activeTest.color : '#ff7b29';

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#050508',
                color: '#fff',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                overflow: 'hidden',
                userSelect: 'none'
            }}
        >
            <style>{`
        @keyframes pulseCue {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        .cue-blink {
          animation: pulseCue 2.2s ease-in-out infinite;
        }
        .slice-layer {
          position: absolute;
          inset: 0;
          cursor: pointer;
          transition: filter 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .slice-bg-content {
          position: absolute;
          inset: 0;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .slice-layer:hover .slice-bg-content {
          transform: scale(1.06);
        }
      `}</style>

            {/* 🌀 REAL 3D CORRIDOR FLY-THROUGH OVERLAY */}
            {enteringTest && <CorridorTunnel3D test={enteringTest} />}

            {/* 🌈 8 FULL-SCREEN BLEED RADIAL SLICES */}
            {TESTS.map((test, idx) => {
                const isHovered = hoveredIdx === idx;
                const anyHovered = hoveredIdx !== null;
                const midRad = ((idx * 45) * Math.PI) / 180;
                // Position floating slice artwork & giant watermark along each ray
                const artX = 50 + 34 * Math.sin(midRad);
                const artY = 50 - 34 * Math.cos(midRad);

                return (
                    <div
                        key={test.id}
                        className="slice-layer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        onClick={() => handleEnterPortal(test)}
                        style={{
                            clipPath: getSliceClipPath(idx),
                            WebkitClipPath: getSliceClipPath(idx),
                            filter: isHovered
                                ? 'brightness(1.25) saturate(1.3)'
                                : anyHovered
                                    ? 'brightness(0.32) saturate(0.35)'
                                    : 'brightness(0.62) saturate(0.75)',
                            zIndex: isHovered ? 4 : 1
                        }}
                    >
                        <div
                            className="slice-bg-content"
                            style={{
                                background: test.bg,
                                backgroundSize: 'cover'
                            }}
                        >
                            {/* Subtle Textured Grid / Dots */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: test.pattern,
                                backgroundSize: test.pattern.includes('radial') ? '22px 22px' : 'auto',
                                opacity: isHovered ? 0.9 : 0.45
                            }} />

                            {/* Floating Cinematic Visual Anchor inside the slice */}
                            <div style={{
                                position: 'absolute',
                                left: `${artX}%`,
                                top: `${artY}%`,
                                transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 0.95})`,
                                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                                textAlign: 'center',
                                pointerEvents: 'none'
                            }}>
                                <div style={{
                                    fontSize: 'clamp(42px, 6vw, 76px)',
                                    filter: `drop-shadow(0 0 30px ${test.color})`,
                                    opacity: isHovered ? 1 : 0.65
                                }}>
                                    {test.emoji}
                                </div>
                                <div style={{
                                    marginTop: '6px',
                                    fontSize: 'clamp(11px, 1.2vw, 15px)',
                                    fontWeight: '900',
                                    letterSpacing: '3px',
                                    color: '#fff',
                                    textShadow: `0 0 18px ${test.color}`,
                                    opacity: isHovered ? 1 : 0.5
                                }}>
                                    {test.title.toUpperCase()}
                                </div>
                                <div style={{
                                    marginTop: '4px',
                                    fontSize: '11px',
                                    color: 'rgba(255,255,255,0.75)',
                                    maxWidth: '180px',
                                    opacity: isHovered ? 1 : 0,
                                    transition: 'opacity 0.3s ease'
                                }}>
                                    {test.desc}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 📏 RAZOR-THIN RADIAL DIVIDER RAYS SHOOTING TO SCREEN EDGES */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }}>
                {TESTS.map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '150vmax',
                            height: '1px',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)',
                            transformOrigin: '0 0',
                            transform: `rotate(${idx * 45 - 112.5}deg)`
                        }}
                    />
                ))}
            </div>

            {/* 🎯 PRECISION CENTER DIAL (Matches Video's Center Hub) */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(230px, 31vw, 330px)',
                height: 'clamp(230px, 31vw, 330px)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #0e0e14 0%, #050508 75%)',
                boxShadow: `0 0 80px rgba(0,0,0,0.95), 0 0 40px ${activeColor}33`,
                zIndex: 10,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Dotted Inner Ring */}
                <div style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    border: `1.5px dashed ${activeColor}88`,
                    transition: 'border-color 0.3s ease'
                }} />

                {/* Real-Time Orbiting Indicator Dot */}
                <div style={{
                    position: 'absolute',
                    inset: '14px',
                    transform: `rotate(${cursorAngle}deg)`,
                    transition: 'transform 0.08s linear'
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

                {/* Perimeter Rim Labels */}
                {TESTS.map((test, idx) => {
                    const deg = idx * 45;
                    const isHovered = hoveredIdx === idx;
                    return (
                        <div
                            key={test.id}
                            style={{
                                position: 'absolute',
                                inset: '-30px',
                                transform: `rotate(${deg}deg)`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start'
                            }}
                        >
                            <span style={{
                                fontSize: 'clamp(8px, 0.85vw, 10px)',
                                fontWeight: '800',
                                letterSpacing: '2px',
                                color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.52)',
                                textShadow: isHovered ? `0 0 12px ${test.color}` : 'none',
                                transition: 'all 0.25s ease'
                            }}>
                                {test.short}
                            </span>
                        </div>
                    );
                })}

                {/* Center Typography */}
                <div
                    className="cue-blink"
                    style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        letterSpacing: '2.2px',
                        color: activeColor,
                        marginBottom: '10px',
                        textTransform: 'uppercase'
                    }}
                >
                    {activeTest ? 'CLICK TO TUNE IN' : 'HOVER TO TUNE IN'}
                </div>

                <div style={{
                    fontSize: 'clamp(22px, 2.6vw, 32px)',
                    fontWeight: '900',
                    letterSpacing: '-0.8px',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '0 20px',
                    lineHeight: '1.1'
                }}>
                    {activeTest ? activeTest.title : (
                        <>vibecheck<span style={{ color: activeColor }}>.</span></>
                    )}
                </div>

                <div style={{
                    marginTop: '10px',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.45)',
                    letterSpacing: '1.5px',
                    fontWeight: '700'
                }}>
                    {activeTest ? activeTest.tag : '8 INTERACTIVE REALMS'}
                </div>
            </div>

            {/* 🛸 MINIMAL FLOATING TOP BAR (Search + Profile) */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '18px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 25,
                pointerEvents: 'none'
            }}>
                <div style={{
                    pointerEvents: 'auto',
                    fontSize: '18px',
                    fontWeight: '900',
                    letterSpacing: '-0.5px',
                    color: 'rgba(255,255,255,0.9)'
                }}>
                    vibecheck<span style={{ color: activeColor }}>.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
                    <form
                        onSubmit={handleSearch}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(10, 10, 16, 0.65)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.14)',
                            borderRadius: '999px',
                            padding: '4px 6px 4px 14px'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Find @username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontSize: '12px',
                                outline: 'none',
                                width: '120px'
                            }}
                        />
                        <button type="submit" style={{
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '5px 11px',
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer'
                        }}>
                            Go
                        </button>
                    </form>

                    <button
                        onClick={() => navigate(`/${myUsername}`)}
                        style={{
                            padding: '8px 16px',
                            background: 'rgba(10, 10, 16, 0.72)',
                            backdropFilter: 'blur(12px)',
                            border: `1px solid ${activeColor}88`,
                            color: '#fff',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            fontWeight: '800',
                            fontSize: '12px'
                        }}
                    >
                        @{myUsername}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;