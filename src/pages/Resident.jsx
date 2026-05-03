import React, { useState, useEffect } from 'react';
import { useAppContext, EMERGENCY_CATEGORIES } from '../context/AppContext';
import { Shield, Bell, MapPin, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';

export default function Resident() {
  const { alerts, updateResidentStatus, auth, logout } = useAppContext();
  const navigate = useNavigate();
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [category, setCategory] = useState(EMERGENCY_CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(null); // success toast
  
  useEffect(() => {
    if (!auth || auth.role !== 'RESIDENT') {
      navigate('/');
    }
  }, [auth, navigate]);

  if (!auth || auth.role !== 'RESIDENT') return null;

  const handleNeedHelp = () => {
    updateResidentStatus(auth.id, 'NEEDS_HELP', { category, message });
    setShowHelpForm(false);
    setMessage('');
    
    // Show success toast
    setToast({
      title: 'SOS Sent!',
      message: 'Help is on the way. Responders have received your exact location.'
    });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSafe = () => {
    updateResidentStatus(auth.id, 'SAFE', { category: null, message: null });
    setToast({
      title: 'Status Updated',
      message: 'You have been marked as Safe.'
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const latestAlert = alerts[0];
  const isCritical = latestAlert && latestAlert.level === 'Critical';

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="phone-screen" style={{ paddingBottom: '0' }}>
          
          {/* Header */}
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield color="var(--primary)" />
              <h2 style={{ fontSize: '1rem', margin: 0 }}>
                <span style={{ color: 'var(--primary)' }}>Barangay</span>
                <span style={{ color: 'var(--danger)' }}>Connect</span>
              </h2>
            </div>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </header>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
             <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: auth.status === 'SAFE' ? 'var(--safe)' : auth.status === 'NEEDS_HELP' ? 'var(--danger)' : 'var(--text-muted)' }} />
             <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                {auth.name} (Status: {auth.status || 'UNREPORTED'})
             </span>
          </div>

          {/* Top Half: Alert Level Banner */}
          <div style={{ marginBottom: '24px' }}>
            {latestAlert ? (
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: isCritical ? 'var(--danger)' : 'var(--primary)', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} className={isCritical ? 'animate-pulse-danger' : ''}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Bell size={20} />
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>{latestAlert.level.toUpperCase()} ALERT</h3>
                </div>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{latestAlert.message}</p>
              </div>
            ) : (
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--safe)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} />
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>ALL CLEAR</h3>
                </div>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>No active emergencies in your area.</p>
              </div>
            )}
          </div>

          {/* Action Buttons for Accessibility */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button 
              onClick={() => setShowHelpForm(true)}
              className="btn btn-danger"
              style={{ 
                flex: 1, 
                padding: '14px', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                boxShadow: '0 4px 15px -3px var(--danger-glow)'
              }}
            >
              <AlertTriangle size={18} /> I NEED HELP
            </button>
            <button 
              onClick={handleSafe}
              className="btn btn-safe"
              style={{ 
                flex: 1, 
                padding: '14px', 
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: auth.status === 'SAFE' ? 'var(--safe)' : '#e2e8f0', 
                color: auth.status === 'SAFE' ? 'white' : 'var(--text-muted)', 
                boxShadow: auth.status === 'SAFE' ? '0 4px 15px -3px var(--safe-glow)' : 'none'
              }}
            >
              <CheckCircle size={18} /> I AM SAFE
            </button>
          </div>

          {/* Mini-Map for Evac Centers */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '24px', minHeight: '350px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> Evacuation & Safety Map
            </h3>
            <div style={{ flex: 1, minHeight: '250px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', zIndex: 10 }}>
              <Map showResidents={false} height="100%" />
            </div>
          </div>

          {/* Help Modal Overlay inside phone screen */}
          {showHelpForm && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="animate-slide-in" style={{ width: '100%', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--danger)', fontSize: '1.3rem', margin: 0 }}>Request Rescue</h3>
                  <button onClick={() => setShowHelpForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="var(--text-muted)"/></button>
                </div>
                
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '1rem', fontWeight: 'bold' }}>Type of Emergency</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                  style={{ marginBottom: '20px', padding: '16px', fontSize: '1rem' }}
                >
                  {EMERGENCY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '1rem', fontWeight: 'bold' }}>Current Situation (Optional)</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field"
                  placeholder="Explain what is happening right now..."
                  rows="4"
                  style={{ marginBottom: '24px', resize: 'none', padding: '16px', fontSize: '1rem' }}
                ></textarea>
                
                <button className="btn btn-danger" style={{ width: '100%', padding: '18px', fontSize: '1.2rem', fontWeight: '800' }} onClick={handleNeedHelp}>
                  <AlertTriangle size={20} /> SEND SOS NOW
                </button>
              </div>
            </div>
          )}

          {/* Success Toast Overlay */}
          {toast && (
            <div className="animate-slide-in" style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', backgroundColor: 'var(--safe)', color: 'white', padding: '16px', borderRadius: '12px', zIndex: 100, boxShadow: '0 10px 25px -5px var(--safe-glow)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{toast.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>{toast.message}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
