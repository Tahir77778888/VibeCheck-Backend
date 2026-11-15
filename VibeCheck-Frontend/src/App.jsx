import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components import kar rahe hain
import Home from './components/Home';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard'; // 👈 YEH MISSING THA

function App() {
  const GOOGLE_CLIENT_ID = "647623068223-fk9ujoo3sdgvgihhje6vq8cinq4asmei.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* 👈 NAYA ROUTE YAHAN HAI */}
          <Route path="/:username" element={<Profile />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;