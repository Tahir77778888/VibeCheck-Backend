import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';

// ---------------- HOME COMPONENT (Wholesome & Positive Vibe) ----------------
function Home() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!name || !username) {
      alert("Fields bharna zaroori hai bhai!");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/users/create', {
        name: name,
        username: username.toLowerCase().replace(/\s+/g, '_')
      });
      navigate(`/${username.toLowerCase().replace(/\s+/g, '_')}`);
    } catch (error) {
      alert(error.response?.data?.message || "Username already taken.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#fafafa', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', borderBottom: '1px solid #262626' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', letterSpacing: '-1px' }}>vibecheck.</h2>
        <button onClick={() => setShowForm(true)} style={{ background: 'transparent', color: '#fafafa', border: '1px solid #fafafa', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Get Started</button>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', lineHeight: '1.2', letterSpacing: '-2px' }}>
          Let your friends <br /><span style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>hype you up</span> anonymously.
        </h1>
        <p style={{ color: '#a8a8a8', fontSize: '18px', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px auto' }}>
          Receive heartwarming compliments, discover your best traits, and spread good vibes on your Instagram story. A 100% safe space. 💛
        </p>

        {!showForm ? (
          <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', boxShadow: '0 10px 20px rgba(220, 39, 67, 0.3)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            Continue with Instagram
          </button>
        ) : (
          <form onSubmit={handleCreateProfile} style={{ backgroundColor: '#121212', padding: '30px', borderRadius: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #262626', textAlign: 'left' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Set up your Link</h3>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fafafa' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input type="text" placeholder="Insta Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#000', color: '#fafafa' }} />
            </div>
            <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: '#fafafa', color: '#000', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isLoading ? 'Loading...' : 'Generate My Link'}
            </button>
          </form>
        )}
      </div>

      {/* SEO Features Section (Wholesome Version) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 20px', flexWrap: 'wrap', borderTop: '1px solid #262626', backgroundColor: '#050505' }}>
        <div style={{ textAlign: 'center', maxWidth: '250px' }}>
          <h3 style={{ fontSize: '20px' }}>💌 Pure Positivity</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Receive heartwarming anonymous messages from people who truly care.</p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '250px' }}>
          <h3 style={{ fontSize: '20px' }}>📸 Share the Love</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Drop your link on your Instagram story and let the good vibes roll in.</p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '250px' }}>
          <h3 style={{ fontSize: '20px' }}>✨ Your Aura Stats</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>See your unique personality strengths based on how friends appreciate you.</p>
        </div>
      </div>
    </div>
  );
}

// ---------------- PROFILE COMPONENT (Insta Dark Mode & Wholesome Vibe) ----------------
function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [ratings, setRatings] = useState({ trust: 50, vibe: 50, intellect: 50, humor: 50 });
  const [polls, setPolls] = useState({ redFlag: '', partyVibe: '' });
  const [userComment, setUserComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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
        polls: polls
      });
      alert("Sent anonymously! 💌");
      setUserComment("");
      setPolls({ redFlag: '', partyVibe: '' });
      fetchProfile();
    } catch (error) {
      alert("Kuch gadbad ho gayi bhai.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#fafafa', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px 10px' }}>
      {userData && userData.user ? (
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', margin: '0 auto' }}>

          {/* TOP BANNER (Insta Profile Style) */}
          <div style={{ textAlign: 'center', backgroundColor: '#121212', padding: '30px', borderRadius: '16px', border: '1px solid #262626', position: 'relative' }}>
            <img src={userData.user.profilePic || 'https://via.placeholder.com/150'} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #bc1888', padding: '3px', marginBottom: '15px' }} />
            <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>{userData.user.name}</h2>
            <p style={{ color: '#a8a8a8', margin: '0 0 15px 0', fontSize: '14px' }}>@{userData.user.username}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ padding: '6px 16px', backgroundColor: '#262626', borderRadius: '8px', color: '#fafafa', fontSize: '13px', fontWeight: '600' }}>
                {getVibeTitle(userData.averageScores)}
              </div>

              <button
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator.share({
                      title: 'Hype me up! ✨',
                      text: 'Drop a secret compliment or rate my vibe anonymously 💌',
                      url: url,
                    }).catch((err) => console.log('Error sharing', err));
                  } else {
                    navigator.clipboard.writeText(url);
                    alert("Link copied! 📋 Paste it on your Instagram story!");
                  }
                }}
                style={{ padding: '6px 16px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                Share to Story
              </button>
            </div>
          </div>

          {/* HYPE FORM SECTION */}
          <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626', display: 'flex', flexDirection: 'column', gap: '25px' }}>

            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #262626', paddingBottom: '15px' }}>Hype {userData.user.name} Up 👇</h3>

            {/* Sliders */}
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

            {/* Wholesome Poll 1 */}
            <div>
              <label style={{ fontSize: '13px', color: '#fafafa', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Sabse Bada Green Flag? 💚</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Good Listener', 'Hype Person', 'Golden Heart', 'Always There'].map(opt => (
                  <button key={opt} onClick={() => setPolls({ ...polls, redFlag: opt })} style={{ padding: '8px 12px', borderRadius: '20px', border: polls.redFlag === opt ? '1px solid #1ed760' : '1px solid #333', backgroundColor: polls.redFlag === opt ? 'rgba(30, 215, 96, 0.1)' : '#000', color: polls.redFlag === opt ? '#1ed760' : '#a8a8a8', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{opt}</button>
                ))}
              </div>
            </div>

            {/* Wholesome Poll 2 */}
            <div>
              <label style={{ fontSize: '13px', color: '#fafafa', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Best Quality? ✨</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Main Character', 'Chill Pill', 'Pure Soul', '3AM Friend'].map(opt => (
                  <button key={opt} onClick={() => setPolls({ ...polls, partyVibe: opt })} style={{ padding: '8px 12px', borderRadius: '20px', border: polls.partyVibe === opt ? '1px solid #bc1888' : '1px solid #333', backgroundColor: polls.partyVibe === opt ? 'rgba(188, 24, 136, 0.1)' : '#000', color: polls.partyVibe === opt ? '#bc1888' : '#a8a8a8', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{opt}</button>
                ))}
              </div>
            </div>

            {/* Message Box & Submit */}
            <div style={{ marginTop: '10px' }}>
              <textarea placeholder="Send a sweet anonymous message..." value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#000', color: '#fafafa', minHeight: '80px', resize: 'none', marginBottom: '15px', fontSize: '14px', fontFamily: 'inherit' }} />
              <button onClick={submitVibeCheck} style={{ width: '100%', padding: '14px', background: '#fafafa', color: '#000', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                Send Anonymously 💌
              </button>
            </div>
          </div>

          {/* SECRET INBOX (Instagram DM Style) */}
          <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fafafa', fontWeight: 'bold' }}>Anonymous Messages 🤫</h3>
            {userData.ratings && userData.ratings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {userData.ratings.map((rating, index) => (
                  <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>

                    {/* Anonymous Avatar */}
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#262626', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '18px' }}>👤</span>
                    </div>

                    {/* Chat Bubble */}
                    <div style={{ backgroundColor: '#262626', padding: '12px 16px', borderRadius: '18px', borderTopLeftRadius: '4px', maxWidth: '85%' }}>
                      <p style={{ margin: '0', fontSize: '14px', color: '#fafafa', lineHeight: '1.4' }}>{rating.comment}</p>

                      {/* Wholesome Tags */}
                      {rating.polls && (rating.polls.redFlag || rating.polls.partyVibe) && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                          {rating.polls.redFlag && (
                            <span style={{ fontSize: '11px', backgroundColor: '#121212', color: '#1ed760', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                              💚 {rating.polls.redFlag}
                            </span>
                          )}
                          {rating.polls.partyVibe && (
                            <span style={{ fontSize: '11px', backgroundColor: '#121212', color: '#bc1888', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                              ✨ {rating.polls.partyVibe}
                            </span>
                          )}
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

// ---------------- APP ROUTER ----------------
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;