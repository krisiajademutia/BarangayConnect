import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Car, Navigation, CheckCircle, Clock, Map as MapIcon, List, Bell, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';
import Map from '../components/Map';
import BarangayConnectLogo from '../components/BarangayConnectLogo';

export default function Responder() {
  const { residents, alerts, updateResidentStatus, auth, logout } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('SOS'); 
  const [viewMode, setViewMode] = useState('LIST'); 
  const [showFullMap, setShowFullMap] = useState(false);
  const [toast, setToast] = useState(null);
  
  useEffect(() => {
    if (!auth || auth.role !== 'RESPONDER') {
      navigate('/');
    }
  }, [auth, navigate]);

  if (!auth || auth.role !== 'RESPONDER') return null;

  const sosRequests = residents.filter(r => r.status === 'NEEDS_HELP' && !r.responderAssigned);
  const assignedMissions = residents.filter(r => r.status === 'NEEDS_HELP' && r.responderAssigned === auth.id);

  const handleAcceptMission = (id) => {
    updateResidentStatus(id, 'NEEDS_HELP', { responderAssigned: auth.id });
    setActiveTab('ASSIGNED');
    setViewMode('LIST');
    setToast({
      title: 'Mission Accepted',
      message: 'GPS coordinates loaded. Proceed to victim location.'
    });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRescueComplete = (id) => {
    updateResidentStatus(id, 'SAFE', { responderAssigned: null });
    setActiveTab('SOS');
    setToast({
      title: 'Rescue Successful',
      message: 'Victim marked as Safe. Standing by for next mission.'
    });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const latestAlert = alerts[0];
  
  const getAlertColor = (level) => {
    if (level === 'Critical') return 'var(--danger)';
    if (level === 'Warning') return '#ea580c';
    return 'var(--primary)';
  };

  // Full Screen Map Modal for Responders
  if (showFullMap) {
    return (
      <div className="phone-wrapper">
        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-screen" style={{ padding: '0', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--danger)' }}>
                Tactical Response Map
              </h3>
              <button
                onClick={() => setShowFullMap(false)}
                style={{
                  background: 'rgba(100, 116, 139, 0.1)',
                  border: '1px solid rgba(100, 116, 139, 0.2)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Minimize2 size={16} />
              </button>
            </div>
            <div style={{ height: '100%', paddingTop: '60px' }}>
              <Map showResidents={true} focusOnRedPins={false} height="100%" interactive={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="phone-screen" style={{ paddingBottom: '0' }}>

          {/* Enhanced Header with BarangayConnect Logo */}
          <header className="animate-slide-in" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(211, 48, 51, 0.1), rgba(234, 88, 12, 0.05))',
            borderRadius: '16px',
            border: '1px solid rgba(211, 48, 51, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarangayConnectLogo size={32} animate={true} showText={false} />
              <div style={{ marginLeft: '8px' }}>
                <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: '700', color: 'var(--danger)' }}>
                  Emergency Responder
                </h2>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
                  Tactical Unit - {auth.name}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              style={{ 
                background: 'rgba(100, 116, 139, 0.1)', 
                border: '1px solid rgba(100, 116, 139, 0.2)', 
                color: 'var(--text-muted)', 
                fontSize: '0.75rem', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(100, 116, 139, 0.2)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(100, 116, 139, 0.1)'}
            >
              Logout
            </button>
          </header>

          {/* Alert Banner for Responders */}
          {latestAlert && (
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: getAlertColor(latestAlert.level), color: 'white', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} className={latestAlert.level === 'Critical' ? 'animate-pulse-danger' : ''}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Bell size={20} />
                <strong style={{ fontSize: '1rem' }}>{latestAlert.level.toUpperCase()} HQ ALERT</strong>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4', opacity: 0.9 }}>{latestAlert.message}</p>
              {latestAlert.image && (
                <img src={latestAlert.image} alt="HQ Alert" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '12px', border: '1px solid rgba(255,255,255,0.2)' }} />
              )}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '12px', padding: '6px', marginBottom: '20px' }}>
            <button 
              onClick={() => setActiveTab('SOS')}
              style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'SOS' ? 'white' : 'transparent', color: activeTab === 'SOS' ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '1rem', boxShadow: activeTab === 'SOS' ? '0 4px 6px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
            >
              SOS Feed ({sosRequests.length})
            </button>
            <button 
              onClick={() => setActiveTab('ASSIGNED')}
              style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'ASSIGNED' ? 'white' : 'transparent', color: activeTab === 'ASSIGNED' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '1rem', boxShadow: activeTab === 'ASSIGNED' ? '0 4px 6px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
            >
              Active ({assignedMissions.length})
            </button>
          </div>

          {/* View Toggle (List vs Map) - Only relevant for SOS Tab */}
          {activeTab === 'SOS' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '24px', padding: '6px' }}>
                <button onClick={() => setViewMode('LIST')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: viewMode === 'LIST' ? 'var(--primary)' : 'transparent', color: viewMode === 'LIST' ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  <List size={16} /> List
                </button>
                <button onClick={() => setViewMode('MAP')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: viewMode === 'MAP' ? 'var(--primary)' : 'transparent', color: viewMode === 'MAP' ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  <MapIcon size={16} /> Map
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '24px' }}>
            
            {activeTab === 'SOS' && viewMode === 'MAP' && (
              <div style={{ 
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                marginBottom: '16px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginBottom: '12px' 
                }}>
                  <h3 style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--primary)', 
                    margin: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontWeight: '700'
                  }}>
                    <MapIcon size={16} color="var(--primary)" />
                    Real-Time Safety Map
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.65rem',
                      color: 'white',
                      background: 'var(--safe)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'white',
                        animation: 'pulse-live 2s infinite'
                      }} />
                      LIVE GPS
                    </div>
                    <button
                      onClick={() => setShowFullMap(true)}
                      style={{
                        background: 'rgba(47, 103, 155, 0.1)',
                        border: '1px solid rgba(47, 103, 155, 0.2)',
                        borderRadius: '6px',
                        padding: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Maximize2 size={14} color="var(--primary)" />
                    </button>
                  </div>
                </div>
                
                {/* Map Legend */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '8px',
                  fontSize: '0.65rem',
                  fontWeight: '600'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>Evacuation Centers</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--safe)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>Safe Residents</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>SOS Alerts</span>
                  </div>
                </div>
                
                <div style={{ 
                  height: '200px', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <Map showResidents={true} focusOnRedPins={false} height="100%" interactive={true} />
                </div>
              </div>
            )}

            {activeTab === 'SOS' && viewMode === 'LIST' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sosRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <CheckCircle size={56} style={{ marginBottom: '16px', opacity: 0.5, margin: '0 auto' }} color="var(--safe)" />
                    <p style={{ fontSize: '1.1rem' }}>No active SOS requests.</p>
                  </div>
                ) : (
                  sosRequests.map(req => (
                    <div key={req.id} className="glass-panel animate-slide-in" style={{ padding: '24px', borderLeft: '6px solid var(--danger)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: 0 }}>{req.name}</h3>
                        <span style={{ fontSize: '0.85rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {req.timestamp ? new Date(req.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                         <AlertTriangle size={18} color="var(--danger)" />
                         <p style={{ color: 'var(--danger)', fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{req.category}</p>
                      </div>

                      {req.message && (
                        <div style={{ backgroundColor: '#fff1f2', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--danger)', marginBottom: '12px' }}>
                          <p style={{ fontSize: '0.95rem', color: '#9f1239', margin: 0, fontStyle: 'italic' }}>"{req.message}"</p>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-muted)' }}>
                         <MapIcon size={16} />
                         <p style={{ fontSize: '0.95rem', margin: 0 }}>{req.address || 'Location GPS Locked'}</p>
                      </div>
                      
                      <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 4px 6px -1px var(--primary-glow)' }}
                        onClick={() => handleAcceptMission(req.id)}
                      >
                        Accept Mission
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'ASSIGNED' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {assignedMissions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '1.1rem' }}>No active missions.</p>
                  </div>
                ) : (
                  assignedMissions.map(mission => (
                    <div key={mission.id} className="glass-panel animate-slide-in" style={{ padding: '24px', borderTop: '6px solid var(--primary)' }}>
                      <h3 style={{ marginBottom: '8px', fontSize: '1.4rem', color: 'var(--primary)' }}>{mission.name}</h3>
                      <p style={{ color: 'var(--danger)', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>{mission.category}</p>
                      
                      {mission.message && (
                        <div style={{ backgroundColor: '#fff1f2', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--danger)', marginBottom: '12px' }}>
                          <p style={{ fontSize: '0.95rem', color: '#9f1239', margin: 0, fontWeight: '500' }}>Message: "{mission.message}"</p>
                        </div>
                      )}

                      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '20px' }}>{mission.address}</p>
                      
                      {/* Mini Map to Navigate to Victim */}
                      <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #cbd5e1' }}>
                         <Map showResidents={true} focusOnRedPins={false} height="220px" />
                      </div>

                      <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                         <Navigation size={24} color="var(--primary)" />
                         <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                           GPS: {mission.lat?.toFixed(5)}, {mission.lng?.toFixed(5)}
                         </span>
                      </div>

                      <button 
                        className="btn btn-safe" 
                        style={{ width: '100%', padding: '18px', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 4px 6px -1px var(--safe-glow)' }}
                        onClick={() => handleRescueComplete(mission.id)}
                      >
                        <CheckCircle size={24} /> Mark as Safe
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Toast Notification Overlay - Inside phone screen */}
          {toast && (
            <div className="animate-slide-in" style={{ 
              position: 'absolute', 
              top: '20px', 
              left: '20px', 
              right: '20px', 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '16px', 
              borderRadius: '12px', 
              zIndex: 9999, 
              boxShadow: '0 10px 25px -5px rgba(47, 103, 155, 0.4)', 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px' 
            }}>
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
