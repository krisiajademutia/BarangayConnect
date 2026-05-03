import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Zap } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="phone-wrapper" style={{ backgroundColor: 'var(--bg-darker)' }}>
      <div className="phone-frame" style={{ backgroundColor: 'var(--primary)', backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', border: '12px solid #0f172a' }}>
        <div className="phone-notch" style={{ backgroundColor: '#0f172a' }}></div>
        <div className="phone-screen" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', color: 'white', justifyContent: 'space-between' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', animation: 'slideIn 0.6s ease-out' }}>
             {/* Logo Simulation using Lucide Icons to match the theme */}
             <div style={{ position: 'relative', width: '120px', height: '120px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
               <MapPin size={56} color="var(--primary)" />
               <div style={{ position: 'absolute', width: '140px', height: '140px', border: '4px solid var(--danger)', borderRadius: '50%', borderTopColor: 'transparent', borderBottomColor: 'transparent', animation: 'spin 8s linear infinite' }} />
               <div style={{ position: 'absolute', width: '160px', height: '160px', border: '4px solid var(--primary)', borderRadius: '50%', borderLeftColor: 'transparent', borderRightColor: 'transparent', animation: 'spin-reverse 12s linear infinite' }} />
             </div>
             
             <h1 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '-0.5px' }}>
               Barangay<span style={{ color: '#fca5a5' }}>Connect</span>
             </h1>
             <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: '1.5', maxWidth: '280px' }}>
               Your Official Disaster Response & Verified Alert System.
             </p>
          </div>

          <div style={{ animation: 'slideIn 0.8s ease-out' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}><ShieldCheck size={20} /></div>
                 <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Strictly Verified LGU Alerts</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}><Zap size={20} /></div>
                 <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Instant 1-Tap SOS Rescue</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}><MapPin size={20} /></div>
                 <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Live GPS Tactical Routing</span>
               </div>
            </div>

            <button 
              onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: 'white', color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s' }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get Started
            </button>
          </div>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
      `}} />
    </div>
  );
}
