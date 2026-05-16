import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Zap } from 'lucide-react';
import BarangayConnectLogo from '../components/BarangayConnectLogo';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="phone-wrapper" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="phone-frame" style={{ 
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        border: '8px solid #1e293b'
      }}>
        <div className="phone-notch" style={{ backgroundColor: '#1e293b' }}></div>
        <div className="phone-screen" style={{ 
          padding: '60px 24px 40px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          color: '#1e293b'
        }}>
          
          {/* Main Logo Section - Centered */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center'
          }}>
            {/* Animated Logo with Circular Background */}
            <div style={{ 
              position: 'relative', 
              width: '200px', 
              height: '200px', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '40px', 
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              animation: 'fadeInScale 0.8s ease-out'
            }}>
              <BarangayConnectLogo size={120} animate={true} showText={false} />
              
              {/* Animated signal rings */}
              <div style={{ 
                position: 'absolute', 
                width: '220px', 
                height: '220px', 
                border: '2px solid rgba(74, 144, 226, 0.3)', 
                borderRadius: '50%', 
                borderTopColor: 'transparent', 
                borderBottomColor: 'transparent', 
                animation: 'spin 8s linear infinite' 
              }} />
              <div style={{ 
                position: 'absolute', 
                width: '240px', 
                height: '240px', 
                border: '2px solid rgba(255, 107, 122, 0.3)', 
                borderRadius: '50%', 
                borderLeftColor: 'transparent', 
                borderRightColor: 'transparent', 
                animation: 'spin-reverse 12s linear infinite' 
              }} />
            </div>
            
            {/* BarangayConnect Text - Vertical Layout */}
            <div style={{ 
              textAlign: 'center',
              animation: 'slideIn 1s ease-out 0.3s both'
            }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                letterSpacing: '-0.02em',
                marginBottom: '8px'
              }}>
                <div style={{ color: '#2F679B', marginBottom: '4px' }}>Barangay</div>
                <div style={{ color: '#FF6B7A' }}>Connect</div>
              </div>
              
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: 'linear-gradient(135deg, #2F679B, #4A90E2)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(47, 103, 155, 0.3)',
                marginBottom: '20px'
              }}>
                🏛️ OFFICIAL LGU PLATFORM
              </div>
              
              <p style={{ 
                fontSize: '1rem', 
                color: '#64748b', 
                lineHeight: '1.5', 
                maxWidth: '280px',
                fontWeight: '500',
                margin: '0 auto'
              }}>
                Your Official Disaster Response & Verified Alert System for Real-Time Emergency Management.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div style={{ animation: 'slideIn 1.2s ease-out 0.6s both' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px', 
              marginBottom: '32px',
              padding: '20px',
              background: 'rgba(47, 103, 155, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(47, 103, 155, 0.1)'
            }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ 
                   background: 'linear-gradient(135deg, #16a34a, #15803d)', 
                   padding: '8px', 
                   borderRadius: '10px',
                   boxShadow: '0 4px 8px rgba(22, 163, 74, 0.3)'
                 }}>
                   <ShieldCheck size={20} color="white" />
                 </div>
                 <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Strictly Verified LGU Alerts</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ 
                   background: 'linear-gradient(135deg, #D33033, #b91c1c)', 
                   padding: '8px', 
                   borderRadius: '10px',
                   boxShadow: '0 4px 8px rgba(211, 48, 51, 0.3)'
                 }}>
                   <Zap size={20} color="white" />
                 </div>
                 <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Instant 1-Tap SOS Rescue</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ 
                   background: 'linear-gradient(135deg, #2F679B, #1e40af)', 
                   padding: '8px', 
                   borderRadius: '10px',
                   boxShadow: '0 4px 8px rgba(47, 103, 155, 0.3)'
                 }}>
                   <MapPin size={20} color="white" />
                 </div>
                 <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Live GPS Tactical Routing</span>
               </div>
            </div>

            <button 
              onClick={() => navigate('/login')}
              style={{ 
                width: '100%', 
                padding: '18px', 
                borderRadius: '16px', 
                border: 'none', 
                background: 'linear-gradient(135deg, #2F679B, #1e40af)', 
                color: 'white', 
                fontSize: '1.1rem', 
                fontWeight: '700', 
                cursor: 'pointer', 
                boxShadow: '0 8px 25px -5px rgba(47, 103, 155, 0.4)', 
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
