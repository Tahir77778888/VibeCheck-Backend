import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';

// ---------------- HOME COMPONENT (Naya User Banane Ke Liye) ----------------
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
      // Backend ke live create route par request bhej rahe hain
      await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/users/create', {
        name: name,
        username: username.toLowerCase().replace(/\s+/g, '_')
      });

      alert("Account ekdum mast ban gaya! 🚀");
      navigate(`/${username.toLowerCase().replace(/\s+/g, '_')}`);

    } catch (error) {
      console.error("Account banane mein error:", error);
      alert(error.response?.data?.message || "Kuch gadbad ho gayi bhai, shayad username pehle se kisi ne liya hua hai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: "'Inter', sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#151515', padding: '40px 30px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)', textAlign: 'center', border: '1px solid #2a2a2a' }}>

        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#4facfe' }}>VibeCheck ✨</h1>
        <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>Create your profile and let your friends rate your true vibe!</p>

        <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa', marginLeft: '5px' }}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: 'white', marginTop: '5px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#aaa', marginLeft: '5px' }}>Username</label>
            <input
              type="text"
              placeholder="e.g. rahul_07"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: 'white', marginTop: '5px' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '15px', marginTop: '10px', background: isLoading ? '#555' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: isLoading ? '#aaa' : 'black', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Creating Vibe... ⏳' : 'Generate My Vibe Link 🚀'}
          </button>
        </form>

      </div>
    </div>
  );
}


// ---------------- PROFILE COMPONENT (Wahi tumhara Insta-style UI) ----------------
function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [ratings, setRatings] = useState({ trust: 50, vibe: 50, intellect: 50, humor: 50 });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = () => {
    // Live backend link updated here
    axios.get(`https://vibecheck-backend-n4yi.onrender.com/api/users/${username}`)
      .then((response) => setUserData(response.data))
      .catch((error) => {
        console.error("User nahi mila:", error);
        setUserData(null);
      });
  };

  const handleSliderChange = (e) => {
    setRatings({ ...ratings, [e.target.name]: Number(e.target.value) });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    setIsUploading(true);
    try {
      // Live backend link updated here
      await axios.post(`https://vibecheck-backend-n4yi.onrender.com/api/users/${username}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProfile();
    } catch (error) {
      alert("Bhai photo upload mein error aayi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileClick = () => {
    if (!isUploading) fileInputRef.current.click();
  };

  const submitVibeCheck = async () => {
    try {
      const payload = {
        username: username,
        scores: { trust: ratings.trust, vibe: ratings.vibe, intellect: ratings.intellect, humor: ratings.humor },
        comment: "Frontend se Anonymous Vibe Check! 🔥"
      };
      // Live backend link updated here
      await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/ratings/submit', payload);
      alert("Vibe Check Submitted! 🔥");
      fetchProfile();
    } catch (error) {
      alert("Bhai kuch gadbad ho gayi rating submit karne mein.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: "'Inter', sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      {userData && userData.user ? (
        <div style={{ backgroundColor: '#151515', padding: '40px 30px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)', textAlign: 'center', border: '1px solid #2a2a2a' }}>

          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '15px' }}>
            <img src={userData.user.profilePic || 'https://via.placeholder.com/150'} alt="Profile" onClick={handleProfileClick} style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #4facfe', cursor: isUploading ? 'default' : 'pointer', opacity: isUploading ? 0.5 : 1, transition: '0.3s' }} />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            {!isUploading && (
              <div onClick={handleProfileClick} style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: '#4facfe', color: 'white', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: '3px solid #151515' }}>📸</div>
            )}
            {isUploading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px' }}>⏳</div>}
          </div>

          <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>{userData.user.name}</h2>
          <p style={{ color: '#888', margin: '0 0 25px 0', fontSize: '14px' }}>@{userData.user.username}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '16px', border: '1px solid #2a2a2a' }}>
            {['trust', 'vibe', 'intellect', 'humor'].map((trait) => (
              <div key={trait}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>{trait}</p>
                <h3 style={{ margin: 0, color: trait === 'trust' ? '#4facfe' : trait === 'vibe' ? '#ff0844' : trait === 'intellect' ? '#f6d365' : '#43e97b', fontSize: '22px' }}>{userData.averageScores?.[trait] || 0}</h3>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'left', marginBottom: '25px' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '20px', color: '#ccc', fontWeight: 'normal' }}>Rate my vibe 👇</h4>
            {['trust', 'vibe', 'intellect', 'humor'].map((trait) => (
              <div key={trait} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ textTransform: 'capitalize', fontSize: '14px', color: '#aaa' }}>{trait}</span>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{ratings[trait]}</span>
                </div>
                <input type="range" name={trait} min="1" max="100" value={ratings[trait]} onChange={handleSliderChange} style={{ width: '100%', cursor: 'pointer', accentColor: '#4facfe' }} />
              </div>
            ))}
          </div>

          <button onClick={submitVibeCheck} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'black', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Submit Vibe Check 🚀
          </button>

        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#4facfe' }}>User not found 🕵️‍♂️</h2>
          <p style={{ color: '#888' }}>Check the URL or go back to home page.</p>
        </div>
      )}
    </div>
  );
}

// ---------------- APP ROUTER MAIN ----------------
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