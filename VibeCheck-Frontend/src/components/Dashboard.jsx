import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const myUsername = localStorage.getItem('vibe_username');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/${searchQuery.trim()}`); // Dost ki profile par bhej dega
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#fafafa', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: '20px' }}>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '600px', margin: '0 auto 30px auto' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>vibecheck.</h2>
                <button onClick={() => navigate(`/${myUsername}`)} style={{ padding: '8px 16px', backgroundColor: '#262626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    My Profile 👤
                </button>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* 🔍 SEARCH BAR */}
                <div style={{ backgroundColor: '#121212', padding: '20px', borderRadius: '16px', border: '1px solid #262626', marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Find a Friend 🕵️‍♂️</h3>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Enter username (e.g., tahir_khan)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', fontSize: '14px' }}
                        />
                        <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#bc1888', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Search
                        </button>
                    </form>
                </div>

                {/* 🃏 TEST CARDS SECTION */}
                <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Explore Tests 🚀</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>

                    {/* CARD 1: Apna Main VibeCheck (Active) */}
                    <div
                        onClick={() => navigate(`/${myUsername}`)}
                        style={{ background: 'linear-gradient(135deg, #121212, #1a1a1a)', padding: '25px', borderRadius: '16px', border: '1px solid #bc1888', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s' }}
                    >
                        <div>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#fff' }}>Ultimate VibeCheck 📈</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#a8a8a8' }}>Anonymous messages & crowd polls</p>
                        </div>
                        <div style={{ backgroundColor: '#bc1888', padding: '8px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                            Active 🔥
                        </div>
                    </div>

                    {/* CARD 2: Future Test (Locked) */}
                    <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626', opacity: 0.7 }}>
                        <div>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#fff' }}>Red Flag Analyzer 🚩</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#a8a8a8' }}>Find out your most toxic traits</p>
                        </div>
                        <div style={{ marginTop: '15px', display: 'inline-block', backgroundColor: '#262626', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', color: '#a8a8a8' }}>
                            Coming Soon 🔒
                        </div>
                    </div>

                    {/* CARD 3: Future Test (Locked) */}
                    <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626', opacity: 0.7 }}>
                        <div>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#fff' }}>Past Life Reader 🔮</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#a8a8a8' }}>What were you in your past life?</p>
                        </div>
                        <div style={{ marginTop: '15px', display: 'inline-block', backgroundColor: '#262626', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', color: '#a8a8a8' }}>
                            Coming Soon 🔒
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;