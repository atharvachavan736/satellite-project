
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
// Import Clerk components
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"; 
import Earth from './components/Earth';
import SatelliteSwarm from './components/SatelliteSwarm';
import DetailedPanel from './components/DetailedPanel';
import axios from 'axios';
import './index.css';
import Dashboard from './components/Dashboard';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function App() {
  const [selectedSat, setSelectedSat] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Clerk provides the user state automatically
  const { isSignedIn, user } = useUser();

  // Fetch Data when satellite is selected
  useEffect(() => {
    if (selectedSat) {
      setFullData(null);
      axios.get(`${API_BASE}/satellites/health/${encodeURIComponent(selectedSat.name)}`)
        .then(res => {
            if (res.data && !res.data.error) setFullData(res.data);
        })
        .catch(console.error);
    }
  }, [selectedSat]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    try {
        const res = await axios.get(`${API_BASE}/satellites/search/${searchTerm}`);
        if (res.data.matches && res.data.matches.length > 0) {
          setSelectedSat(res.data.matches[0]);
        } else {
          alert("Satellite not found");
        }
    } catch (err) {
        console.error("Search Error:", err);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>

      {/* --- TOP BAR (Transparent) --- */}
      <div
        className="top-bar"
        style={{
          position: 'absolute', top: '20px', left: '20px', right: '20px',
          zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'none'
        }}
      >
        {/* --- CUSTOM BRANDING LOGO --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
            <div style={{
                width: '38px', height: '38px',
                background: 'linear-gradient(135deg, #1e3a8a, #312e81)',
                borderRadius: '10px', display: 'flex', justifyContent: 'center',
                alignItems: 'center', fontSize: '22px',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                🔭 
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 style={{
                    color: 'white', fontSize: '16px', fontWeight: '800',
                    letterSpacing: '1px', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    lineHeight: '1.1'
                }}>
                    ATHARVA'S
                </h1>
                <h2 style={{
                    color: '#a855f7', fontSize: '13px', fontWeight: '600',
                    letterSpacing: '2.5px', margin: 0, textTransform: 'uppercase',
                    textShadow: '0 1px 2px rgba(0,0,0,0.9)'
                }}>
                    OBSERVATORY
                </h2>
            </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="search-container" style={{ pointerEvents: 'auto' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              className="search-input" type="text" placeholder="Name or NORAD ID"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid #333', color: 'white', padding: '8px 12px', borderRadius: '4px' }}
            />
            <button type="submit" className="search-btn" style={{ background: '#333', color: 'white', border: '1px solid #444', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                SEARCH
            </button>
          </form>
        </div>

        {/* --- CLERK AUTHENTICATION BUTTONS --- */}
        <div className="right-tools" style={{display: 'flex', alignItems: 'center', pointerEvents: 'auto'}}>
            <SignedOut>
              <SignInButton mode="modal">
                <button style={{ 
                    background: '#3b82f6', color: 'white', border: 'none', 
                    padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', 
                    fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' 
                }}> Sign In </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: '40px', height: '40px' }}}} />
            </SignedIn>
        </div>
      </div>

      {/* --- PANEL 1: BOTTOM LEFT HUD --- */}
      {selectedSat && fullData && fullData.identity && (
        <Dashboard data={fullData} />
      )}

      {/* --- PANEL 2: TOP RIGHT --- */}
      {selectedSat && fullData && fullData.info_panel && (
        <DetailedPanel
          data={fullData}
          isLoggedIn={isSignedIn}
          onClose={() => setSelectedSat(null)}
        />
      )}

      {/* --- 3D SCENE --- */}
      <Canvas 
  // Dynamically adjust camera based on screen size
  camera={{ 
    position: [0, 0, window.innerWidth < 768 ? 20 : 16], 
    fov: window.innerWidth < 768 ? 60 : 45 
  }}
  // Prevents the page from scrolling while a user rotates the globe on touch screens
  style={{ touchAction: 'none' }}
>
  <color attach="background" args={['#000000']} />
  <ambientLight intensity={0.8} />
  <pointLight position={[20, 20, 20]} intensity={1.5} />

  <Suspense fallback={null}>
    <Earth />
    <SatelliteSwarm onSelectSatellite={setSelectedSat} />

    {/* Green Trajectory Line */}
    {fullData && fullData.trajectory && fullData.trajectory.length > 1 && (
      <Line
        points={fullData.trajectory.map(p => [
          p[0] * (5/6371)*6.25, 
          p[2] * (5/6371)*6.25, 
          p[1] * (5/6371)*6.25
        ])}
        color="#10b981"
        lineWidth={window.innerWidth < 768 ? 1 : 2} // Thinner line for mobile density
        opacity={0.5}
        transparent
      />
    )}

    {/* Red Target Marker */}
    {fullData && fullData.trajectory && fullData.trajectory.length > 0 && (
      <mesh position={[
        fullData.trajectory[0][0] * (5/6371)*6.25,
        fullData.trajectory[0][2] * (5/6371)*6.25,
        fullData.trajectory[0][1] * (5/6371)*6.25
      ]}>
        <sphereGeometry args={[window.innerWidth < 768 ? 0.08 : 0.05, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    )}

    <Stars radius={200} count={window.innerWidth < 768 ? 3000 : 6000} factor={4} fade />
  </Suspense>
  
  <OrbitControls 
    minDistance={6} 
    maxDistance={50} 
    enablePan={false}
    // Ensures smooth rotation on mobile browsers
    enableDamping={true}
    dampingFactor={0.05}
  />
</Canvas>
    </div>
  );
}

// Wrap the App in the ClerkProvider
export default function AppWrapper() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
}

