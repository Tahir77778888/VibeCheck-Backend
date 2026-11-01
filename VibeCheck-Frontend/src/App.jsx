import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';

// ---------------- HOME COMPONENT ----------------
function Home() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!name || !username) {
      alert("Bhai dono fields bharna zaroori hai!");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/users/create', {
        name: name,
        username: username.toLowerCase().replace(/\s+/g, '_')
      });
      alert("Account ekdum mast ban gaya! 🚀");
      navigate(`/${username.toLowerCase().replace(/\s+/g, '_')}`);
    } catch (error) {
      alert(error.response?.data?.message || "Username already taken bhai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: "'Inter', sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#151515', padding: '40px 30px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)', textAlign: 'center', border: '1px solid #2a2a2a' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#4facfe' }}>VibeCheck ✨</h1>
        <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>Find out what people truly think about you.</p>

        <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa', marginLeft: '5px' }}>Full Name</label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: 'white', marginTop: '5px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa', marginLeft: '5px' }}>Username</label>
            <input type="text" placeholder="e.g. rahul_07" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: 'white', marginTop: '5px' }} />
          </div>
          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '15px', marginTop: '10px', background: isLoading ? '#555' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'black', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            {isLoading ? 'Creating Vibe... ⏳' : 'Generate My Link 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------- PROFILE COMPONENT ----------------
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
        comment: userComment || "Silent observer... 👀",
        polls: polls
      });
      alert("Vibe Check Submitted Anonymously! 🤫");
      setUserComment("");
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
      await axios.post(`https://vibecheck-backend-n4yi.onrender.com/api/users/${username}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchProfile();
    } catch (error) {
      alert("Photo upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: "'Inter', sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px' }}>
      {userData && userData.user ? (
        <div style={{ width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '30px', margin: '0 auto' }}>

          {/* TOP BANNER */}
          <div style={{ textAlign: 'center', backgroundColor: '#151515', padding: '30px', borderRadius: '24px', border: '1px solid #2a2a2a' }}>
            <img src={userData.user.profilePic || 'https://via.placeholder.com/150'} alt="Profile" onClick={() => !isUploading && fileInputRef.current.click()} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #4facfe', cursor: 'pointer', marginBottom: '15px' }} />
            <h2 style={{ margin: '0 0 5px 0', fontSize: '26px' }}>{userData.user.name}</h2>
            <p style={{ color: '#888', margin: '0 0 15px 0' }}>@{userData.user.username}</p>
            <div style={{ display: 'inline-block', padding: '6px 18px', backgroundColor: 'rgba(79, 172, 254, 0.1)', border: '1px solid #4facfe', borderRadius: '20px', color: '#4facfe', fontSize: '14px', fontWeight: 'bold' }}>
              {getVibeTitle(userData.averageScores)}
            </div>
          </div>

          {/* TWO COLUMN LAYOUT */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

            {/* LEFT COLUMN: Sliders */}
            <div style={{ flex: '1 1 350px', backgroundColor: '#151515', padding: '30px', borderRadius: '24px', border: '1px solid #2a2a2a' }}>
              <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '25px', marginTop: 0 }}>Rate My Vibe 👇</h3>
              {['trust', 'vibe', 'intellect', 'humor'].map((trait) => (
                <div key={trait} style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ textTransform: 'capitalize', fontSize: '14px', color: '#aaa' }}>{trait}</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{ratings[trait]}</span>
                  </div>
                  <input type="range" name={trait} min="1" max="100" value={ratings[trait]} onChange={(e) => setRatings({ ...ratings, [e.target.name]: Number(e.target.value) })} style={{ width: '100%', cursor: 'pointer', accentColor: '#4facfe' }} />
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: Spicy Polls & Secret Inbox */}
            <div style={{ flex: '1 1 350px', backgroundColor: '#151515', padding: '30px', borderRadius: '24px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '25px' }}>

              {/* Poll 1 */}
              <div>
                <label style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', display: 'block', fontWeight: 'bold' }}>Sabse Bada Red Flag? 🚩</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Ghosting', 'Overthinking', 'Gussa', 'Fake Promises'].map(opt => (
                    <button key={opt} onClick={() => setPolls({ ...polls, redFlag: opt })} style={{ padding: '10px 15px', borderRadius: '12px', border: polls.redFlag === opt ? '1px solid #ff0844' : '1px solid #333', backgroundColor: polls.redFlag === opt ? 'rgba(255,8,68,0.2)' : '#1e1e1e', color: 'white', cursor: 'pointer', fontSize: '13px', transition: '0.3s' }}>{opt}</button>
                  ))}
                </div>
              </div>

              {/* Poll 2 */}
              <div>
                <label style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', display: 'block', fontWeight: 'bold' }}>Party Vibe? 🪩</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['DJ Breaker', 'Kone mein phone', 'Peeke Ex ko call', 'Free ka khana'].map(opt => (
                    <button key={opt} onClick={() => setPolls({ ...polls, partyVibe: opt })} style={{ padding: '10px 15px', borderRadius: '12px', border: polls.partyVibe === opt ? '1px solid #4facfe' : '1px solid #333', backgroundColor: polls.partyVibe === opt ? 'rgba(79,172,254,0.2)' : '#1e1e1e', color: 'white', cursor: 'pointer', fontSize: '13px', transition: '0.3s' }}>{opt}</button>
                  ))}
                </div>
              </div>

              {/* Message Box & Submit */}
              <div style={{ marginTop: 'auto' }}>
                <textarea placeholder="Spill the tea... Any secrets?" value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: 'white', minHeight: '80px', resize: 'none', marginBottom: '15px' }} />
                <button onClick={submitVibeCheck} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'black', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(79,172,254,0.3)' }}>
                  Send Anonymously 🤫
                </button>
              </div>

            </div>
          </div>

          {/* SECRET INBOX */}
          <div style={{ backgroundColor: '#151515', padding: '30px', borderRadius: '24px', border: '1px solid #2a2a2a' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Secret Inbox 💌 (Only you can see this)</h3>
            {userData.ratings && userData.ratings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {userData.ratings.map((rating, index) => (
                  <div key={index} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                    <p style={{ margin: '0', fontSize: '15px', color: '#fff', fontStyle: 'italic' }}>"{rating.comment}"</p>

                    {/* Yahan aapke chune hue Polls Tags ki tarah dikhenge */}
                    {rating.polls && (rating.polls.redFlag || rating.polls.partyVibe) && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                        {rating.polls.redFlag && (
                          <span style={{ fontSize: '12px', backgroundColor: 'rgba(255,8,68,0.1)', color: '#ff0844', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,8,68,0.3)', fontWeight: 'bold' }}>
                            🚩 {rating.polls.redFlag}
                          </span>
                        )}
                        {rating.polls.partyVibe && (
                          <span style={{ fontSize: '12px', backgroundColor: 'rgba(79,172,254,0.1)', color: '#4facfe', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(79,172,254,0.3)', fontWeight: 'bold' }}>
                            🪩 {rating.polls.partyVibe}
                          </span>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>No secrets yet. Share your link on Insta!</p>
            )}
          </div>

        </div>
      ) : (
        <h2 style={{ color: '#4facfe' }}>Loading Vibe... 🕵️‍♂️</h2>
      )}
    </div>
  );
}

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