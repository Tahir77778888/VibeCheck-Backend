import React from 'react';
import axios from 'axios';
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';

const OneTapLogin = () => {
    useGoogleOneTapLogin({
        onSuccess: async (credentialResponse) => {
            console.log("✅ Google Token mil gaya (One-Tap):", credentialResponse);
            try {
                const res = await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/auth/google', {
                    token: credentialResponse.credential
                });
                if (res.data.success) {
                    window.location.href = `/${res.data.user.username}`;
                }
            } catch (error) {
                console.error("Backend Error:", error);
            }
        },
        onError: () => {
            console.log('One-Tap Login Failed');
        },
    });
    return null;
};
// Google login success hone par:
if (res.data.success) {
    localStorage.setItem('vibe_username', res.data.user.username); // 👈 YEH LINE ADD KARNI HAI
    window.location.href = `/${res.data.user.username}`;
}

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
                    Receive heartwarming compliments, discover your best traits, and spread good vibes on your story. A 100% safe space. 💛
                </p>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <OneTapLogin />
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            console.log("✅ Google Token mil gaya (Button):", credentialResponse);
                            try {
                                const res = await axios.post('https://vibecheck-backend-n4yi.onrender.com/api/auth/google', {
                                    token: credentialResponse.credential
                                });
                                if (res.data.success) {
                                    window.location.href = `/${res.data.user.username}`;
                                }
                            } catch (error) {
                                console.error("Backend Error:", error);
                                alert("Login failed!");
                            }
                        }}
                        onError={() => {
                            console.log('Button Login Failed');
                        }}
                        useOneTap
                        shape="pill"
                        theme="filled_black"
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;