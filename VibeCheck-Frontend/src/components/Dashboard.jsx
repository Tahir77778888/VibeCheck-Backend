import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const myUsername = localStorage.getItem('vibe_username');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/${searchQuery.trim()}`);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 50% -20%, #4a154b 0%, #050505 50%)',
            color: '#fff',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>

            {/* 🎨 INLINE CSS FOR HOVER & ANIMATIONS */}
            <style>{`
        .search-box:focus-within {
          box-shadow: 0 0 20px rgba(188, 24, 136, 0.4);
          border-color: #bc1888 !important;
        }
        .test-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .test-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .active-card:hover {
          box-shadow: 0 10px 30px rgba(188, 24, 136, 0.2);
        }
        .glass-nav {
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

            {/* 🛸 STICKY GLASS HEADER */}
            <div className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '15px 5%' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>vibecheck<span style={{ color: '#bc1888' }}>.</span></h2>
                    <button
                        onClick={() => navigate(`/${myUsername}`)}
                        style={{
                            padding: '10px 20px',
                            background: 'linear-gradient(45deg, #bc1888, #f09433)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            boxShadow: '0 4px 15px rgba(188, 24, 136, 0.3)'
                        }}>
                        My Profile 👤
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>

                {/* 👋 HERO SECTION */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-1px' }}>
                        Welcome to the <span style={{ background: 'linear-gradient(45deg, #f09433, #bc1888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hub.</span>
                    </h1>
                    <p style={{ color: '#a8a8a8', fontSize: '16px' }}>Search friends, check vibes, and explore new personality tests.</p>
                </div>

                {/* 🔍 PREMIUM SEARCH BAR */}
                <div style={{ marginBottom: '50px' }}>
                    <form onSubmit={handleSearch} className="search-box" style={{
                        display: 'flex',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '100px',
                        padding: '8px',
                        transition: 'all 0.3s ease'
                    }}>
                        <input
                            type="text"
                            placeholder="Type a username to hype them up... 🕵️‍♂️"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '15px 20px',
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                        <button type="submit" style={{
                            padding: '0 30px',
                            backgroundColor: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '15px'
                        }}>
                            Search
                        </button>
                    </form>
                </div>

                {/* 🃏 CINEMATIC TEST CARDS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Trending Tests 🔥</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                    {/* CARD 1: MAIN VIBECHECK (ACTIVE) */}
                    <div
                        className="test-card active-card"
                        onClick={() => navigate(`/${myUsername}`)}
                        style={{
                            background: 'linear-gradient(145deg, rgba(188, 24, 136, 0.1), rgba(0,0,0,0.8))',
                            padding: '30px',
                            borderRadius: '24px',
                            border: '1px solid rgba(188, 24, 136, 0.4)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(188, 24, 136, 0.2)', color: '#ff66c4', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '900', letterSpacing: '1px' }}>
                            LIVE NOW
                        </div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold' }}>Ultimate VibeCheck 📈</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#a8a8a8', lineHeight: '1.5', maxWidth: '85%' }}>
                            Find out what people really think about you. Anonymous messages & 10 custom crowd polls.
                        </p>
                    </div>

                    {/* CARD 2: FUTURE TEST (LOCKED) */}
                    <div
                        className="test-card"
                        style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '30px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255, 255, 255, 0.1)', color: '#a8a8a8', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                            COMING SOON 🔒
                        </div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold', color: '#888' }}>Red Flag Analyzer 🚩</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5', maxWidth: '85%' }}>
                            A brutal honesty test to discover your most toxic traits according to your friends.
                        </p>
                    </div>

                    {/* CARD 3: FUTURE TEST (LOCKED) */}
                    <div
                        className="test-card"
                        style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '30px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255, 255, 255, 0.1)', color: '#a8a8a8', padding: '6px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                            COMING SOON 🔒
                        </div>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold', color: '#888' }}>Aura Reader ✨</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5', maxWidth: '85%' }}>
                            What color is your energy? Let your squad define your spiritual vibe.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;