import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [userData, setUserData] = useState(null);

    // Rating form ke liye state
    const [ratings, setRatings] = useState({
        trust: 50,
        vibe: 50,
        intellect: 50,
        humor: 50
    });

    // Page load hote hi data lana
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        axios.get('http://localhost:5000/api/users/tahir_boss')
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => console.error("Backend connect karne mein error:", error));
    };

    // Jab koi slider ghumaye toh value update karna
    const handleSliderChange = (e) => {
        setRatings({
            ...ratings,
            [e.target.name]: Number(e.target.value)
        });
    };

    // Rating submit karne ka function
    const submitVibeCheck = async () => {
        try {
            const payload = {
                username: 'tahir_boss',
                scores: {
                    trust: ratings.trust,
                    vibe: ratings.vibe,
                    intellect: ratings.intellect,
                    humor: ratings.humor
                },
                comment: "Frontend se Anonymous Vibe Check! 🔥"
            };

            await axios.post('http://localhost:5000/api/ratings/submit', payload);
            alert("Vibe Check Submitted! 🔥");
            fetchProfile(); // Submit hote hi naye scores fetch karke screen update karega

        } catch (error) {
            console.error("Rating submit nahi hui:", error);
            alert("Bhai kuch gadbad ho gayi rating submit karne mein.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#ffffff', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>

            {/* Dhyan rahe, ab hum userData.user check kar rahe hain taaki crash na ho */}
            {userData && userData.user ? (
                <div style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textAlign: 'center' }}>

                    {/* Profile Section */}
                    <img
                        src={userData.user.profilePic || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #646cff', marginBottom: '15px' }}
                    />
                    <h2 style={{ margin: '0 0 5px 0' }}>{userData.user.name}</h2>
                    <p style={{ color: '#888', margin: '0 0 20px 0' }}>@{userData.user.username}</p>

                    {/* Vibe Scores Display */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '10px' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>Trust</p>
                            <h3 style={{ margin: 0, color: '#4facfe' }}>{userData.averageScores?.trust || 0}</h3>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>Vibe</p>
                            <h3 style={{ margin: 0, color: '#ff0844' }}>{userData.averageScores?.vibe || 0}</h3>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>Intellect</p>
                            <h3 style={{ margin: 0, color: '#f6d365' }}>{userData.averageScores?.intellect || 0}</h3>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>Humor</p>
                            <h3 style={{ margin: 0, color: '#43e97b' }}>{userData.averageScores?.humor || 0}</h3>
                        </div>
                    </div>

                    {/* Rating Sliders */}
                    <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                        <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Rate this Vibe 👇</h4>

                        {['trust', 'vibe', 'intellect', 'humor'].map((trait) => (
                            <div key={trait} style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{trait}</span>
                                    <span style={{ fontWeight: 'bold' }}>{ratings[trait]}</span>
                                </div>
                                <input
                                    type="range"
                                    name={trait}
                                    min="1"
                                    max="100"
                                    value={ratings[trait]}
                                    onChange={handleSliderChange}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={submitVibeCheck}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Submit Vibe Check 🚀
                    </button>

                </div>
            ) : (
                <h2>Loading the vibes... ⏳</h2>
            )}
        </div>
    );
}

export default App;