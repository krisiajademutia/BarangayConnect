import React, { useState, useEffect } from 'react';
import { useAppContext, EMERGENCY_CATEGORIES } from '../context/AppContext';
import { Bell, MapPin, CheckCircle, AlertTriangle, X, Maximize2, Minimize2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import BarangayConnectLogo from '../components/BarangayConnectLogo';

export default function Resident() {
  const { alerts, updateResidentStatus, auth, logout, residents } = useAppContext();
  const navigate = useNavigate();
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [category, setCategory] = useState(EMERGENCY_CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [showFullMap, setShowFullMap] = useState(false);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [toast, setToast] = useState(null);
  
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

  const getAlertColor = (level) => {
    // Level 1 (Advisory) - Blue, Level 2 (Warning) - Yellow, Level 3 (Critical) - Red
    if (level === 'Critical') return '#DC2626'; // Level 3 - Red
    if (level === 'Warning') return '#EAB308'; // Level 2 - Yellow  
    return '#2563EB'; // Level 1 (Advisory) - Blue
  };

  const getAlertIcon = (level) => {
    if (level === 'Critical') return '🚨';
    if (level === 'Warning') return '⚠️';
    return 'ℹ️';
  };

  // Get highlight colors for the most recent announcement
  const getHighlightColors = (level) => {
    if (level === 'Critical') {
      // Level 3 - Red
      return {
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.05)',
        glowColor: 'rgba(220, 38, 38, 0.2)'
      };
    }
    if (level === 'Warning') {
      // Level 2 - Yellow
      return {
        borderColor: '#EAB308',
        backgroundColor: 'rgba(234, 179, 8, 0.05)',
        glowColor: 'rgba(234, 179, 8, 0.2)'
      };
    }
    // Level 1 - Blue
    return {
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.05)',
      glowColor: 'rgba(37, 99, 235, 0.2)'
    };
  };

  // Full Screen Map Modal
  if (showFullMap) {
    // Debug: Log residents data for map
    console.log('Resident component - residents for map:', residents);
    console.log('Resident component - residents count:', residents?.length || 0);
    
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
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>
                Real-Time Safety Map
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
              <Map showResidents={true} height="100%" interactive={true} />
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
        <div className="phone-screen" style={{ paddingBottom: '0', background: '#f8fafc' }}>
          
          {/* Clean App-like Header */}
          <header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '16px',
            padding: '40px 16px 8px 16px', // Extra top padding for phone notch
            background: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            margin: '-35px -16px 16px -16px' // Negative margin to pull it to edges since phone-screen has padding
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BarangayConnectLogo size={24} animate={true} showText={true} />
            </div>
            <button 
              onClick={handleLogout} 
              style={{ 
                background: 'rgba(220, 38, 38, 0.1)', 
                border: 'none', 
                color: '#dc2626', 
                fontSize: '0.75rem', 
                cursor: 'pointer', 
                fontWeight: '600',
                padding: '6px 12px',
                borderRadius: '12px',
                transition: 'all 0.2s'
              }}
            >
              Logout
            </button>
          </header>

          {/* User Status Card with Action Buttons Below */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            marginBottom: '16px',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {/* User Info */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px'
            }}>
              <div style={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                backgroundColor: auth.status === 'SAFE' ? 'var(--safe)' : auth.status === 'NEEDS_HELP' ? 'var(--danger)' : '#94a3b8',
                animation: auth.status === 'NEEDS_HELP' ? 'pulse-live 2s infinite' : 'none'
              }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '600', display: 'block' }}>
                  {auth.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  Status: {auth.status === 'SAFE' ? 'Safe' : auth.status === 'NEEDS_HELP' ? 'Needs Help' : 'Unreported'}
                </span>
              </div>
              <div style={{ 
                fontSize: '0.65rem', 
                color: 'var(--safe)', 
                background: 'rgba(22, 163, 74, 0.1)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: '600'
              }}>
                GPS: ON
              </div>
            </div>
            
            {/* Action Buttons Below User Name */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              padding: '0 16px 16px 16px'
            }}>
              <button 
                onClick={() => {
                  console.log('I NEED HELP clicked');
                  setShowHelpForm(true);
                }}
                style={{ 
                  flex: 1, 
                  padding: '12px 14px', 
                  fontSize: '0.85rem', 
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #D33033, #b91c1c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 8px rgba(211, 48, 51, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  minHeight: '44px' // Ensure minimum touch target
                }}
              >
                <AlertTriangle size={16} /> I NEED HELP
              </button>
              <button 
                onClick={() => {
                  console.log('I\'M SAFE clicked');
                  handleSafe();
                }}
                style={{ 
                  flex: 1, 
                  padding: '12px 14px', 
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  background: auth.status === 'SAFE' 
                    ? 'linear-gradient(135deg, #16a34a, #15803d)' 
                    : '#e2e8f0', 
                  color: auth.status === 'SAFE' ? 'white' : '#64748b', 
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: auth.status === 'SAFE' 
                    ? '0 3px 8px rgba(22, 163, 74, 0.3)' 
                    : '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  minHeight: '44px' // Ensure minimum touch target
                }}
              >
                <CheckCircle size={16} /> I'M SAFE
              </button>
            </div>
          </div>

          {/* Facebook-Style Announcement Posts with Highlighting */}
          <div style={{ marginBottom: '16px', flexShrink: 0 }}>
            {alerts.length > 0 ? (
              <>
                {alerts.slice(0, 2).map((alert, index) => {
                  const isLatest = index === 0; // First alert is the most recent
                  const highlightColors = isLatest ? getHighlightColors(alert.level) : null;
                  
                  return (
                    <div key={alert.id} style={{
                      background: isLatest ? highlightColors.backgroundColor : 'white',
                      borderRadius: '12px',
                      marginBottom: '12px',
                      border: isLatest ? `2px solid ${highlightColors.borderColor}` : '1px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: isLatest 
                        ? `0 4px 20px ${highlightColors.glowColor}, 0 2px 8px rgba(0, 0, 0, 0.1)` 
                        : '0 2px 8px rgba(0, 0, 0, 0.05)',
                      overflow: 'hidden',
                      position: 'relative',
                      animation: isLatest && alert.level === 'Critical' ? 'pulse-danger 3s infinite' : 'none'
                    }}>
                      {/* Latest Alert Badge */}
                      {isLatest && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: highlightColors.borderColor,
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.6rem',
                          fontWeight: '700',
                          zIndex: 10,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                          LATEST
                        </div>
                      )}
                      
                      {/* Post Header */}
                      <div style={{
                        padding: '16px',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${getAlertColor(alert.level)}, ${getAlertColor(alert.level)}dd)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          boxShadow: isLatest ? `0 4px 12px ${highlightColors.glowColor}` : 'none'
                        }}>
                          {getAlertIcon(alert.level)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                            BarangayConnect Official
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <div style={{
                              background: getAlertColor(alert.level),
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.65rem',
                              fontWeight: '700',
                              letterSpacing: '0.5px'
                            }}>
                              {alert.level === 'Critical' ? 'LEVEL 3 - CRITICAL' : 
                               alert.level === 'Warning' ? 'LEVEL 2 - WARNING' : 
                               'LEVEL 1 - ADVISORY'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} color="var(--text-muted)" />
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div style={{ padding: '16px' }}>
                        <p style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: 'var(--text-main)',
                          margin: '0 0 12px 0',
                          fontWeight: isLatest ? '600' : '500'
                        }}>
                          {alert.message}
                        </p>
                        
                        {alert.image && (
                          <img 
                            src={alert.image} 
                            alt="Alert" 
                            style={{ 
                              width: '100%', 
                              maxHeight: '200px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              border: isLatest ? `2px solid ${highlightColors.borderColor}` : '1px solid rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* See All Announcements Button with functionality */}
                {alerts.length > 2 && (
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    marginBottom: '12px'
                  }}>
                    <button
                      onClick={() => setShowAllAnnouncements(true)}
                      style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        border: '2px solid rgba(37, 99, 235, 0.2)',
                        color: 'var(--primary)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        margin: '0 auto'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(37, 99, 235, 0.15)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'rgba(37, 99, 235, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <Bell size={14} />
                      See All Announcements ({alerts.length - 2} more)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <CheckCircle size={32} color="var(--safe)" style={{ marginBottom: '8px' }} />
                <h3 style={{ fontSize: '1rem', margin: '0 0 4px 0', color: 'var(--safe)' }}>All Clear</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  No active emergencies in your area.
                </p>
              </div>
            )}
          </div>



          {/* Real-Time Map Section - Matching Reference Design */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            marginBottom: '16px',
            flexShrink: 0
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
                <MapPin size={16} color="var(--primary)" />
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
              <Map showResidents={true} height="100%" interactive={true} />
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

          {/* All Announcements Modal */}
          {showAllAnnouncements && (
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(255, 255, 255, 0.98)', 
              zIndex: 9999, 
              overflowY: 'auto',
              padding: '20px' 
            }}>
              <div className="animate-slide-in">
                {/* Modal Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '20px',
                  padding: '16px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ 
                    color: 'var(--primary)', 
                    fontSize: '1.1rem', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Bell size={20} />
                    All Emergency Announcements
                  </h3>
                  <button 
                    onClick={() => setShowAllAnnouncements(false)} 
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
                    <X size={16} color="var(--text-muted)" />
                  </button>
                </div>

                {/* All Announcements List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {alerts.map((alert, index) => {
                    const isLatest = index === 0;
                    const highlightColors = isLatest ? getHighlightColors(alert.level) : null;
                    
                    return (
                      <div key={alert.id} style={{
                        background: isLatest ? highlightColors.backgroundColor : 'white',
                        borderRadius: '12px',
                        border: isLatest ? `2px solid ${highlightColors.borderColor}` : '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: isLatest 
                          ? `0 4px 20px ${highlightColors.glowColor}, 0 2px 8px rgba(0, 0, 0, 0.1)` 
                          : '0 2px 8px rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        {/* Latest Badge */}
                        {isLatest && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: highlightColors.borderColor,
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.6rem',
                            fontWeight: '700',
                            zIndex: 10
                          }}>
                            LATEST
                          </div>
                        )}
                        
                        {/* Post Header */}
                        <div style={{
                          padding: '16px',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${getAlertColor(alert.level)}, ${getAlertColor(alert.level)}dd)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}>
                            {getAlertIcon(alert.level)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                              BarangayConnect Official
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <div style={{
                                background: getAlertColor(alert.level),
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                letterSpacing: '0.5px'
                              }}>
                                {alert.level === 'Critical' ? 'LEVEL 3 - CRITICAL' : 
                                 alert.level === 'Warning' ? 'LEVEL 2 - WARNING' : 
                                 'LEVEL 1 - ADVISORY'}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div style={{ padding: '16px' }}>
                          <p style={{
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: 'var(--text-main)',
                            margin: '0 0 12px 0',
                            fontWeight: isLatest ? '600' : '500'
                          }}>
                            {alert.message}
                          </p>
                          
                          {alert.image && (
                            <img 
                              src={alert.image} 
                              alt="Alert" 
                              style={{ 
                                width: '100%', 
                                maxHeight: '200px', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: isLatest ? `2px solid ${highlightColors.borderColor}` : '1px solid rgba(0, 0, 0, 0.1)'
                              }} 
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Success Toast Overlay - Inside phone screen */}
          {toast && (
            <div className="animate-slide-in" style={{ 
              position: 'absolute', 
              top: '20px', 
              left: '20px', 
              right: '20px', 
              backgroundColor: 'var(--safe)', 
              color: 'white', 
              padding: '16px', 
              borderRadius: '12px', 
              zIndex: 9999, 
              boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4)', 
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
