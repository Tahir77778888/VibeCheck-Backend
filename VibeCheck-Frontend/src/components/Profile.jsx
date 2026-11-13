import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';

function Profile() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [ratings, setRatings] = useState({ trust: 50, vibe: 50, intellect: 50, humor: 50 });
    const [polls, setPolls] = useState({ redFlag: '', partyVibe: '' });
    const [userComment, setUserComment] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // 🚀 NAYE STATES FOR IDENTITY TOGGLE
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [senderName, setSenderName] = useState("");

    const fileInputRef = useRef(null);
    const storyCardRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, [username]);

    const fetchProfile = () => {
        axios.get(`https://vibecheck-backend-n4yi.onrender.com/api/users/${username}`)
            .then((response) => setUserData(response.data))
            .catch(() => setUserData(null));
    };

    const getVibeTitle = (scores) => {
        if (!scores) return "Mystery Aura 🌫️";
        if (scores.intellect >= 80 && scores.trust >= 80) return "The Mastermind 🧠";
        if (scores.vibe >= 80 && scores.humor >= 80) return "Chaotic Good 🌪️";
        if (scores.trust >= 85) return "The Loyal Sage 🛡️";
        if (scores.humor >= 85) return "The Class Clown 🤡";
        if (scores.vibe >= 85) return "Pure Main Character 🌟";
        if (scores.intellect < 50 && scores.humor > 70) return "Goofy Menace 🤪";
        return "The Enigma 🎭";
    };

    const submitVibeCheck = async () => {
        try {
            await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/ratings/submit', {
                username: username,
                scores: ratings,
                comment: userComment || "Sending good vibes! ✨",
                polls: polls,
                // 🚀 Naya Logic: Naam bhejna hai ya nahi
                senderName: isAnonymous ? "Anonymous" : (senderName || "A Friend")
            });
            alert("Message Sent! 💌");
            setUserComment("");
            setSenderName(""); // Reset
            setIsAnonymous(true); // Reset
            setPolls({ redFlag: '', partyVibe: '' });
            fetchProfile();
        } catch (error) {
            alert("Kuch gadbad ho gayi bhai.");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('profilePic', file);
        setIsUploading(true);
        try {
            await axios.post(`https://vibecheck-backend-n4yi.onrender.com/api/users/${username}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("DP Update ho gayi! 🔥");
            fetchProfile();
        } catch (error) {
            alert("Photo upload fail ho gayi.");
        } finally {
            setIsUploading(false);
        }
    };

    const generateAndDownloadStory = async () => {
        if (!storyCardRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(storyCardRef.current, { backgroundColor: null, scale: 2, useCORS: true });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `VibeCheck_${userData.user.username}.png`;
            link.click();
            alert("Story Card Downloaded! 📸");
        } catch (error) {
            alert("Oops! Card generate nahi ho paya.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#fafafa', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px 10px', overflowX: 'hidden' }}>
            {userData && userData.user ? (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', margin: '0 auto', position: 'relative' }}>

                    {/* TOP BANNER */}
                    <div style={{ textAlign: 'center', backgroundColor: '#121212', padding: '30px', borderRadius: '16px', border: '1px solid #262626', position: 'relative' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={userData.user.profilePic || 'https://via.placeholder.com/150'} alt="Profile" onClick={() => !isUploading && fileInputRef.current.click()} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #bc1888', padding: '3px', marginBottom: '15px', cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }} />
                            {isUploading && <span style={{ position: 'absolute', top: '40%', left: '15%', color: 'white', fontSize: '12px', fontWeight: 'bold', background: 'rgba(0,0,0,0.6)', padding: '2px 5px', borderRadius: '5px' }}>Uploading...</span>}
                        </div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                        <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>{userData.user.name}</h2>
                        <p style={{ color: '#a8a8a8', margin: '0 0 15px 0', fontSize: '14px' }}>@{userData.user.username}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ padding: '8px 16px', backgroundColor: '#262626', borderRadius: '8px', color: '#fafafa', fontSize: '13px', fontWeight: '600' }}>
                                {getVibeTitle(userData.averageScores)}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied! 📋"); }} style={{ padding: '10px 16px', background: '#262626', color: 'white', border: '1px solid #333', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Copy Link 🔗
                            </button>
                            <button onClick={generateAndDownloadStory} disabled={isGenerating} style={{ padding: '10px 16px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {isGenerating ? 'Creating... ⏳' : 'Get Story Card 📸'}
                            </button>
                        </div>
                    </div>

                    {/* HIDDEN STORY CARD TEMPLATE */}
                    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                        <div ref={storyCardRef} style={{ width: '400px', height: '711px', background: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '30px', color: 'white', textAlign: 'center', borderRadius: '24px', border: '1px solid #333' }}>
                            <h3 style={{ color: '#888', fontSize: '16px', marginBottom: '30px', letterSpacing: '2px', textTransform: 'uppercase' }}>VibeCheck</h3>
                            <img src={userData.user.profilePic || 'https://via.placeholder.com/150'} style={{ width: '160px', height: '160px', borderRadius: '50%', border: '4px solid #bc1888', padding: '4px', marginBottom: '20px', objectFit: 'cover' }} />
                            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', fontWeight: 'bold' }}>{userData.user.name}</h1>
                            <div style={{ padding: '8px 20px', backgroundColor: '#1a1a1a', borderRadius: '20px', fontSize: '16px', fontWeight: '600', marginBottom: '40px', color: '#bc1888' }}>{getVibeTitle(userData.averageScores)}</div>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 30px 0', lineHeight: '1.3' }}>Send me <br /> <span style={{ background: 'linear-gradient(45deg, #f09433, #bc1888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>anonymous</span> messages! 💌</h2>
                            <div style={{ padding: '16px 40px', backgroundColor: '#fafafa', color: '#000', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold' }}>Drop link here 🔗</div>
                        </div>
                    </div>

                    {/* HYPE FORM SECTION */}
                    <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #262626', paddingBottom: '15px' }}>Hype {userData.user.name} Up 👇</h3>

                        {/* ... Ratings Range inputs ... */}
                        <div>
                            {['trust', 'vibe', 'intellect', 'humor'].map((trait) => (
                                <div key={trait} style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ textTransform: 'capitalize', fontSize: '13px', color: '#a8a8a8', fontWeight: '500' }}>{trait}</span>
                                        <span style={{ fontWeight: 'bold', color: '#fafafa', fontSize: '13px' }}>{ratings[trait]}</span>
                                    </div>
                                    <input type="range" name={trait} min="1" max="100" value={ratings[trait]} onChange={(e) => setRatings({ ...ratings, [e.target.name]: Number(e.target.value) })} style={{ width: '100%', cursor: 'pointer', accentColor: '#bc1888' }} />
                                </div>
                            ))}
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', color: '#fafafa', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Sabse Bada Green Flag? 💚</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Good Listener', 'Hype Person', 'Golden Heart', 'Always There'].map(opt => (
                                    <button key={opt} onClick={() => setPolls({ ...polls, redFlag: opt })} style={{ padding: '8px 12px', borderRadius: '20px', border: polls.redFlag === opt ? '1px solid #1ed760' : '1px solid #333', backgroundColor: polls.redFlag === opt ? 'rgba(30, 215, 96, 0.1)' : '#000', color: polls.redFlag === opt ? '#1ed760' : '#a8a8a8', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', color: '#fafafa', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Best Quality? ✨</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Main Character', 'Chill Pill', 'Pure Soul', '3AM Friend'].map(opt => (
                                    <button key={opt} onClick={() => setPolls({ ...polls, partyVibe: opt })} style={{ padding: '8px 12px', borderRadius: '20px', border: polls.partyVibe === opt ? '1px solid #bc1888' : '1px solid #333', backgroundColor: polls.partyVibe === opt ? 'rgba(188, 24, 136, 0.1)' : '#000', color: polls.partyVibe === opt ? '#bc1888' : '#a8a8a8', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{opt}</button>
                                ))}
                            </div>
                        </div>

                        {/* 🚀 NAYA IDENTITY TOGGLE UI */}
                        <div style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <input type="checkbox" id="anonymousToggle" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#bc1888', cursor: 'pointer' }} />
                                <label htmlFor="anonymousToggle" style={{ fontSize: '14px', color: '#fafafa', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Keep my identity secret 🕵️
                                </label>
                            </div>

                            {!isAnonymous && (
                                <input type="text" placeholder="Tumhara naam kya hai? (Optional)" value={senderName} onChange={(e) => setSenderName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#000', color: '#fafafa', marginBottom: '15px', fontSize: '14px' }} />
                            )}

                            <textarea placeholder="Send a sweet message..." value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#000', color: '#fafafa', minHeight: '80px', resize: 'none', marginBottom: '15px', fontSize: '14px', fontFamily: 'inherit' }} />
                            <button onClick={submitVibeCheck} style={{ width: '100%', padding: '14px', background: '#fafafa', color: '#000', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Send {isAnonymous ? 'Anonymously' : 'Message'} 💌
                            </button>
                        </div>
                    </div>

                    {/* SECRET INBOX */}
                    <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fafafa', fontWeight: 'bold' }}>Messages 🤫</h3>
                        {userData.ratings && userData.ratings.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {userData.ratings.slice().reverse().map((rating, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#262626', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                                            <span style={{ fontSize: '18px' }}>👤</span>
                                        </div>
                                        <div style={{ backgroundColor: '#262626', padding: '12px 16px', borderRadius: '18px', borderTopLeftRadius: '4px', maxWidth: '85%' }}>
                                            {/* 🚀 NAAM YA ANONYMOUS PRINT HOGA */}
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '13px', color: (!rating.senderName || rating.senderName === 'Anonymous') ? '#bc1888' : '#1ed760' }}>
                                                {rating.senderName || 'Anonymous'} says:
                                            </h4>
                                            <p style={{ margin: '0', fontSize: '14px', color: '#fafafa', lineHeight: '1.4' }}>{rating.comment}</p>

                                            {rating.polls && (rating.polls.redFlag || rating.polls.partyVibe) && (
                                                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                                    {rating.polls.redFlag && <span style={{ fontSize: '11px', backgroundColor: '#121212', color: '#1ed760', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>💚 {rating.polls.redFlag}</span>}
                                                    {rating.polls.partyVibe && <span style={{ fontSize: '11px', backgroundColor: '#121212', color: '#bc1888', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>✨ {rating.polls.partyVibe}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#a8a8a8', fontSize: '14px', textAlign: 'center', margin: '30px 0' }}>Inbox is empty. Share your link to get hyped!</p>
                        )}
                    </div>

                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <div style={{ width: '30px', height: '30px', border: '3px solid #262626', borderTop: '3px solid #fafafa', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}
        </div>
    );
}

export default Profile;