import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';

// ---------------- HOME COMPONENT (Instagram Login Only) ----------------
function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#fafafa', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', borderBottom: '1px solid #262626' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', letterSpacing: '-1px' }}>vibecheck.</h2>
      </nav>

      <div style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', lineHeight: '1.2', letterSpacing: '-2px' }}>
          Let your friends <br /><span style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>hype you up</span> anonymously.
        </h1>
        <p style={{ color: '#a8a8a8', fontSize: '18px', marginBottom: '50px', maxWidth: '500px', margin: '0 auto 50px auto' }}>
          Receive heartwarming compliments, discover your best traits, and spread good vibes on your Instagram story. A 100% safe space. 💛
        </p>

        {/* NAYA INSTAGRAM LOGIN BUTTON */}
        <button
          onClick={() => window.location.href = "https://vibecheck-backend-n4yi.onrender.com/api/auth/instagram"}
          style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto', boxShadow: '0 10px 20px rgba(220, 39, 67, 0.3)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          Continue with Instagram
        </button>
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
  const [isGenerating, setIsGenerating] = useState(false);

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

  // DP UPLOAD FUNCTION
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
      console.error(error);
      alert("Photo upload fail ho gayi.");
    } finally {
      setIsUploading(false);
    }
  };

  // STORY CARD GENERATOR FUNCTION
  const generateAndDownloadStory = async () => {
    if (!storyCardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(storyCardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `VibeCheck_${userData.user.username}.png`;
      link.click();

      alert("Story Card Downloaded! 📸 Ab isko seedha Instagram par post karke apni Link laga do.");
    } catch (error) {
      console.error("Error generating story:", error);
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

            {/* CLICKABLE PROFILE PICTURE */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={userData.user.profilePic || 'https://via.placeholder.com/150'}
                alt="Profile"
                onClick={() => !isUploading && fileInputRef.current.click()}
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #bc1888', padding: '3px', marginBottom: '15px', cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}
              />
              {isUploading && <span style={{ position: 'absolute', top: '40%', left: '15%', color: 'white', fontSize: '12px', fontWeight: 'bold', background: 'rgba(0,0,0,0.6)', padding: '2px 5px', borderRadius: '5px' }}>Uploading...</span>}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>{userData.user.name}</h2>
            <p style={{ color: '#a8a8a8', margin: '0 0 15px 0', fontSize: '14px' }}>@{userData.user.username}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 16px', backgroundColor: '#262626', borderRadius: '8px', color: '#fafafa', fontSize: '13px', fontWeight: '600' }}>
                {getVibeTitle(userData.averageScores)}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied! 📋");
                }}
                style={{ padding: '10px 16px', background: '#262626', color: 'white', border: '1px solid #333', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                Copy Link 🔗
              </button>

              <button
                onClick={generateAndDownloadStory}
                disabled={isGenerating}
                style={{ padding: '10px 16px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
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

              <div style={{ padding: '8px 20px', backgroundColor: '#1a1a1a', borderRadius: '20px', fontSize: '16px', fontWeight: '600', marginBottom: '40px', color: '#bc1888' }}>
                {getVibeTitle(userData.averageScores)}
              </div>

              <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 30px 0', lineHeight: '1.3' }}>
                Send me <br /> <span style={{ background: 'linear-gradient(45deg, #f09433, #bc1888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>anonymous</span> messages! 💌
              </h2>

              <div style={{ padding: '16px 40px', backgroundColor: '#fafafa', color: '#000', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold' }}>
                Drop link here 🔗
              </div>
            </div>
          </div>

          {/* HYPE FORM SECTION */}
          <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #262626', paddingBottom: '15px' }}>Hype {userData.user.name} Up 👇</h3>
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

            <div style={{ marginTop: '10px' }}>
              <textarea placeholder="Send a sweet anonymous message..." value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#000', color: '#fafafa', minHeight: '80px', resize: 'none', marginBottom: '15px', fontSize: '14px', fontFamily: 'inherit' }} />
              <button onClick={submitVibeCheck} style={{ width: '100%', padding: '14px', background: '#fafafa', color: '#000', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                Send Anonymously 💌
              </button>
            </div>
          </div>

          {/* SECRET INBOX */}
          <div style={{ backgroundColor: '#121212', padding: '25px', borderRadius: '16px', border: '1px solid #262626' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fafafa', fontWeight: 'bold' }}>Anonymous Messages 🤫</h3>
            {userData.ratings && userData.ratings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {userData.ratings.map((rating, index) => (
                  <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#262626', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '18px' }}>👤</span>
                    </div>
                    <div style={{ backgroundColor: '#262626', padding: '12px 16px', borderRadius: '18px', borderTopLeftRadius: '4px', maxWidth: '85%' }}>
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