import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const myUsername = localStorage.getItem('username') || 'vibecheck';

    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [enteringTest, setEnteringTest] = useState(null);

    const TESTS = [
        {
            id: 'main',
            short: 'VIBECHECK',
            emoji: '📈',
            title: 'Ultimate VibeCheck',
            tag: 'LIVE NOW',
            desc: 'Anonymous messages & 10 custom crowd polls.',
            color: '#bc1888',
            route: `/${myUsername}`
        },
        {
            id: 'mbti',
            short: 'MBTI 16',
            emoji: '🧠',
            title: '16 Personalities',
            tag: 'NEW 🔥',
            desc: 'Decode your mind & find your fictional twin.',
            color: '#f09433',
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
            route: '/test/rizz-check'
        },
        {
            id: 'baddie-type',
            short: 'BADDIE',
            emoji: '💋',
            title: 'Baddie Archetype',
            tag: 'BADDIES',
            desc: 'Dark Feminine Siren or Soft Luxury Icon?',
            color: '#ff416c',
            route: '/test/baddie-type'
        },
        {
            id: 'delulu-meter',
            short: 'DELULU',
            emoji: '💅',
            title: 'Delulu Meter',
            tag: 'BADDIES',
            desc: 'High-Standards Queen or Delulu Diva?',
            color: '#ff66c4',
            route: '/test/delulu-meter'
        },
        {
            id: 'red-flag',
            short: 'RED FLAG',
            emoji: '🚩',
            title: 'Red Flag Analyzer',
            tag: 'CLASSIC',
            desc: 'Discover your most toxic traits.',
            color: '#ff2e63',
            route: '/test/red-flag'
        },
        {
            id: 'aura-reader',
            short: 'AURA',
            emoji: '✨',
            title: 'Aura Reader',
            tag: 'CLASSIC',
            desc: 'What color is your real energy?',
            color: '#8e2de2',
            route: '/test/aura-reader'
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/${searchQuery.trim().toLowerCase()}`);
        }
    };

    // 🌀 Trigger 3D Tunnel Zoom before navigating
    const handleEnterPortal = (test) => {
        setEnteringTest(test);
        setTimeout(() => {
            navigate(test.route);
        }, 780);
    };

    // SVG Polar Math for 8 Slices
    const polarToCartesian = (cx, cy, r, angleDeg) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad)
        };
    };

    const createSlicePath = (cx, cy, innerR, outerR, startAngle, endAngle) => {
        const p1 = polarToCartesian(cx, cy, outerR, endAngle);
        const p2 = polarToCartesian(cx, cy, outerR, startAngle);
        const p3 = polarToCartesian(cx, cy, innerR, startAngle);
        const p4 = polarToCartesian(cx, cy, innerR, endAngle);
        return `M ${p1.x} ${p1.y} A ${outerR} ${outerR} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerR} ${innerR} 0 0 1 ${p4.x} ${p4.y} Z`;
    };

    const activeTest = enteringTest || (hoveredIdx !== null ? TESTS[hoveredIdx] : null);
    const activeColor = activeTest ? activeTest.color : '#bc1888';

    // Center indicator dot angle
    const dotAngle = hoveredIdx !== null ? hoveredIdx * 45 + 22.5 : 0;
    const dotPos = polarToCartesian(250, 250, 86, dotAngle);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#040407',
            backgroundImage: `radial-gradient(circle at 50% 48%, ${activeColor}33 0%, #040407 62%)`,
            transition: 'background-image 0.5s ease',
            color: '#fff',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <style>{`
        @keyframes pulseText {
          0%, 100% { opacity: 0.45; letter-spacing: 3px; }
          50% { opacity: 1; letter-spacing: 4.5px; }
        }
        @keyframes wheelEnter {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(4.2) rotate(32deg); opacity: 0; }
        }
        @keyframes tunnelRing {
          0% { transform: translate(-50%, -50%) scale(0.15); opacity: 0; }
          35% { opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(5.5); opacity: 0; }
        }
        @keyframes portalTitle {
          0% { transform: scale(0.7); opacity: 0; }
          40% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .pulse-hint {
          animation: pulseText 2.4s ease-in-out infinite;
        }
        .wheel-container {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wheel-zooming {
          animation: wheelEnter 0.8s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
        .slice-group {
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), filter 0.28s ease;
          transform-origin: 250px 250px;
        }
        .slice-group:hover {
          transform: scale(1.045);
        }
        .search-pill:focus-within {
          border-color: #bc1888 !important;
          box-shadow: 0 0 22px rgba(188, 24, 136, 0.35);
        }
      `}</style>

            {/* 🌀 3D PORTAL TUNNEL OVERLAY (Triggers on Click) */}
            {enteringTest && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999,
                    background: 'rgba(4, 4, 7, 0.85)',
                    backdropFilter: 'blur(8px)',
                    pointerEvents: 'none',
                    overflow: 'hidden'
                }}>
                    {[0, 0.12, 0.24, 0.36].map((delay, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '260px',
                                height: '260px',
                                borderRadius: '50%',
                                border: `2.5px solid ${enteringTest.color}`,
                                boxShadow: `0 0 40px ${enteringTest.color}, inset 0 0 30px ${enteringTest.color}55`,
                                animation: `tunnelRing 0.78s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s forwards`
                            }}
                        />
                    ))}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'portalTitle 0.78s ease forwards'
                    }}>
                        <div style={{ fontSize: '46px', marginBottom: '8px' }}>{enteringTest.emoji}</div>
                        <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', textShadow: `0 0 25px ${enteringTest.color}` }}>
                            {enteringTest.title}
                        </div>
                    </div>
                </div>
            )}

            {/* 🛸 MINIMAL GLASS HEADER */}
            <div style={{
                padding: '16px 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 20,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(5,5,10,0.55)',
                backdropFilter: 'blur(12px)'
            }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>
                    vibecheck<span style={{ color: activeColor, transition: 'color 0.3s' }}>.</span>
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <form
                        onSubmit={handleSearch}
                        className="search-pill"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '999px',
                            padding: '4px 6px 4px 14px',
                            transition: 'all 0.25s ease'
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
                                fontSize: '13px',
                                outline: 'none',
                                width: '120px'
                            }}
                        />
                        <button type="submit" style={{
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer'
                        }}>
                            Go
                        </button>
                    </form>

                    <button
                        onClick={() => navigate(`/${myUsername}`)}
                        style={{
                            padding: '9px 16px',
                            background: 'linear-gradient(45deg, #bc1888, #f09433)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            fontWeight: '800',
                            fontSize: '13px',
                            boxShadow: '0 4px 18px rgba(188, 24, 136, 0.35)'
                        }}
                    >
                        Profile 👤
                    </button>
                </div>
            </div>

            {/* 🎯 MAIN 360° RADIAL PORTAL STAGE */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 16px 34px 16px',
                position: 'relative'
            }}>
                {/* Top Pulsing Cue */}
                <div
                    className="pulse-hint"
                    style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: activeColor,
                        marginBottom: '14px',
                        textTransform: 'uppercase',
                        transition: 'color 0.3s'
                    }}
                >
                    {activeTest ? `TAP TO ENTER • ${activeTest.tag}` : 'HOVER OR TAP A SLICE TO TUNE IN'}
                </div>

                {/* 🎡 360° INTERACTIVE WHEEL */}
                <div
                    className={`wheel-container ${enteringTest ? 'wheel-zooming' : ''}`}
                    style={{
                        width: '100%',
                        maxWidth: '500px',
                        aspectRatio: '1 / 1',
                        position: 'relative',
                        filter: `drop-shadow(0 0 45px ${activeColor}40)`
                    }}
                >
                    <svg viewBox="0 0 500 500" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        {/* Outer Orbit Ring */}
                        <circle
                            cx="250"
                            cy="250"
                            r="242"
                            fill="none"
                            stroke={activeColor}
                            strokeOpacity="0.22"
                            strokeWidth="1.5"
                            strokeDasharray="6 8"
                        />

                        {/* 8 Radial Test Slices */}
                        {TESTS.map((test, idx) => {
                            const startAngle = idx * 45;
                            const endAngle = (idx + 1) * 45;
                            const midAngle = startAngle + 22.5;
                            const isHovered = hoveredIdx === idx;
                            const labelPos = polarToCartesian(250, 250, 166, midAngle);

                            return (
                                <g
                                    key={test.id}
                                    className="slice-group"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    onClick={() => handleEnterPortal(test)}
                                    style={{
                                        filter: isHovered ? `drop-shadow(0 0 16px ${test.color}aa)` : 'none'
                                    }}
                                >
                                    <path
                                        d={createSlicePath(250, 250, 96, 228, startAngle, endAngle)}
                                        fill={isHovered ? `${test.color}38` : 'rgba(255, 255, 255, 0.035)'}
                                        stroke={isHovered ? test.color : 'rgba(255, 255, 255, 0.12)'}
                                        strokeWidth={isHovered ? '2.2' : '1.2'}
                                        style={{ transition: 'all 0.25s ease' }}
                                    />

                                    {/* Slice Emoji */}
                                    <text
                                        x={labelPos.x}
                                        y={labelPos.y - 6}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        style={{ fontSize: isHovered ? '26px' : '22px', pointerEvents: 'none', transition: 'all 0.2s' }}
                                    >
                                        {test.emoji}
                                    </text>

                                    {/* Slice Short Label */}
                                    <text
                                        x={labelPos.x}
                                        y={labelPos.y + 18}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={isHovered ? '#ffffff' : '#a1a1aa'}
                                        style={{
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            letterSpacing: '1.2px',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        {test.short}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Center Dark Hub */}
                        <circle
                            cx="250"
                            cy="250"
                            r="90"
                            fill="#07070c"
                            stroke={activeColor}
                            strokeWidth="2"
                            strokeOpacity="0.65"
                            style={{ transition: 'stroke 0.3s ease' }}
                        />

                        {/* Orbiting Active Indicator Dot */}
                        {hoveredIdx !== null && (
                            <circle
                                cx={dotPos.x}
                                cy={dotPos.y}
                                r="5.5"
                                fill={activeColor}
                                style={{ filter: `drop-shadow(0 0 10px ${activeColor})` }}
                            />
                        )}

                        {/* Center Brand / Active Test Title */}
                        <text
                            x="250"
                            y="242"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#fff"
                            style={{ fontSize: activeTest ? '14px' : '20px', fontWeight: '900', letterSpacing: activeTest ? '0.5px' : '-0.5px' }}
                        >
                            {activeTest ? activeTest.title : 'vibecheck.'}
                        </text>
                        <text
                            x="250"
                            y="265"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={activeColor}
                            style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1.5px' }}
                        >
                            {activeTest ? 'ENTER PORTAL →' : '8 REALMS'}
                        </text>
                    </svg>
                </div>

                {/* 📡 BOTTOM LIVE HUD BAR */}
                <div style={{
                    marginTop: '18px',
                    minHeight: '56px',
                    maxWidth: '420px',
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeTest ? activeColor + '66' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '18px',
                    padding: '12px 18px',
                    textAlign: 'center',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.3s ease'
                }}>
                    {activeTest ? (
                        <>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                                {activeTest.emoji} {activeTest.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '3px' }}>
                                {activeTest.desc}
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: '13px', color: '#888', lineHeight: '32px' }}>
                            Select any portal on the wheel to launch your vibe test ✨
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;