import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldAlert, Smartphone, ShieldCheck, UserPlus, Lock, MapPin } from 'lucide-react';
import BarangayConnectLogo from '../components/BarangayConnectLogo';

export default function Login() {
  const [activeTab, setActiveTab] = useState('RESIDENT'); // RESIDENT, OFFICIAL
  const [officialType, setOfficialType] = useState('RESPONDER'); // RESPONDER, ADMIN
  const navigate = useNavigate();
  const { loginResident, loginResponder, loginAdmin } = useAppContext();

  // Resident form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [vuln, setVuln] = useState('None');

  // Responder form state
  const [resId, setResId] = useState('');
  const [resPwd, setResPwd] = useState('');
  const [showCreatePwd, setShowCreatePwd] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin form state
  const [adminId, setAdminId] = useState('');
  const [adminPwd, setAdminPwd] = useState('');

  const handleResidentSubmit = (e) => {
    e.preventDefault();
    if (!name || !address) return;
    loginResident(name, address, vuln);
    navigate('/resident');
  };

  const handleResponderSubmit = (e) => {
    e.preventDefault();
    if (!resId) return;

    // Clear any previous errors
    setLoginError('');

    // Simulate first time login prompt
    if (resId && !showCreatePwd && resPwd === 'temp123') {
      setShowCreatePwd(true);
      return;
    }

    try {
      loginResponder(resId);
      navigate('/responder');
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminId && adminPwd) {
      loginAdmin();
      navigate('/command-center');
    }
  };

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="phone-screen" style={{
          padding: '0',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column'
        }}>

          <div style={{
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>

            {/* Mobile-Optimized Header */}
            <div style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1e40af 100%)',
              padding: '40px 20px 24px',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Animated background elements */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '60px',
                height: '60px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '-15px',
                width: '70px',
                height: '70px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse'
              }} />

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '50%',
                  padding: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}>
                  <BarangayConnectLogo size={32} animate={true} showText={false} />
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 style={{
                  fontSize: '1.5rem',
                  margin: '0 0 4px 0',
                  letterSpacing: '-0.5px',
                  fontWeight: '800',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  Barangay<span style={{ color: '#93c5fd' }}>Connect</span>
                </h1>
                <div style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  marginTop: '2px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  🏛️ OFFICIAL DISASTER RESPONSE NETWORK
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Content Area */}
            <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

              {activeTab === 'RESIDENT' ? (
                <div className="animate-slide-in">
                  <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      <Smartphone size={20} color="white" />
                    </div>
                    <h2 style={{ color: 'var(--text-main)', fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: '700' }}>
                      Resident Access Portal
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, lineHeight: '1.4' }}>
                      Register to receive emergency alerts and request immediate assistance
                    </p>
                  </div>

                  <form onSubmit={handleResidentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: 'var(--text-main)',
                        marginBottom: '5px',
                        fontWeight: '600'
                      }}>
                        👤 Full Name
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Juan Dela Cruz"
                        style={{
                          padding: '10px',
                          fontSize: '0.8rem',
                          borderRadius: '6px',
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: 'var(--text-main)',
                        marginBottom: '5px',
                        fontWeight: '600'
                      }}>
                        🏠 Complete Address
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="e.g. Block 4, Purok 1, Barangay San Jose"
                        style={{
                          padding: '10px',
                          fontSize: '0.8rem',
                          borderRadius: '6px',
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: 'var(--text-main)',
                        marginBottom: '5px',
                        fontWeight: '600'
                      }}>
                        🆘 Special Assistance Needed?
                      </label>
                      <select
                        className="input-field"
                        value={vuln}
                        onChange={e => setVuln(e.target.value)}
                        style={{
                          padding: '10px',
                          fontSize: '0.8rem',
                          borderRadius: '6px',
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="None">No special assistance needed</option>
                        <option value="Senior Citizen">Senior Citizen (60+ years old)</option>
                        <option value="PWD">Person with Disability (PWD)</option>
                        <option value="Pregnant">Pregnant Woman</option>
                        <option value="Child">Minor (Under 18)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      style={{
                        padding: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        marginTop: '4px',
                        transition: 'all 0.2s ease',
                        width: '100%'
                      }}
                    >
                      <UserPlus size={14} /> Access Emergency Network
                    </button>
                  </form>

                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '24px',
                    borderTop: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      Are you an authorized emergency responder or LGU administrator?
                    </p>
                    <button
                      onClick={() => setActiveTab('OFFICIAL')}
                      style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        border: '2px solid rgba(37, 99, 235, 0.2)',
                        color: 'var(--primary)',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        margin: '0 auto'
                      }}
                    >
                      <ShieldCheck size={10} />
                      Official Login Portal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-slide-in">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
                    <button
                      onClick={() => setActiveTab('RESIDENT')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        padding: '3px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        borderRadius: '3px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ← Back to Public Access
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}>
                      <ShieldCheck size={20} color="white" />
                    </div>
                    <h2 style={{ color: 'var(--text-main)', fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: '700' }}>
                      Official LGU Portal
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, lineHeight: '1.4' }}>
                      Secure access for authorized emergency personnel
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    background: 'rgba(241, 245, 249, 0.8)',
                    borderRadius: '6px',
                    padding: '2px',
                    marginBottom: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <button
                      onClick={() => setOfficialType('RESPONDER')}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: officialType === 'RESPONDER' ? 'white' : 'transparent',
                        color: officialType === 'RESPONDER' ? '#dc2626' : 'var(--text-muted)',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        boxShadow: officialType === 'RESPONDER' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      🚑 Responder
                    </button>
                    <button
                      onClick={() => setOfficialType('ADMIN')}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: officialType === 'ADMIN' ? 'white' : 'transparent',
                        color: officialType === 'ADMIN' ? '#059669' : 'var(--text-muted)',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        boxShadow: officialType === 'ADMIN' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}
                    >
                      🏛️ Command
                    </button>
                  </div>

                  {officialType === 'RESPONDER' && (
                    <form onSubmit={handleResponderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {!showCreatePwd ? (
                        <>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              color: 'var(--text-main)',
                              marginBottom: '5px',
                              fontWeight: '600'
                            }}>
                              🆔 Official Responder ID
                            </label>
                            <input
                              type="text"
                              required
                              className="input-field"
                              value={resId}
                              onChange={e => setResId(e.target.value)}
                              placeholder="e.g. BDRRMC-RES-001"
                              style={{
                                padding: '10px',
                                fontSize: '0.8rem',
                                borderRadius: '6px',
                                border: '2px solid #e2e8f0',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              color: 'var(--text-main)',
                              marginBottom: '5px',
                              fontWeight: '600'
                            }}>
                              🔐 Secure Password
                            </label>
                            <input
                              type="password"
                              required
                              className="input-field"
                              value={resPwd}
                              onChange={e => setResPwd(e.target.value)}
                              placeholder="Enter password (try 'temp123')"
                              style={{
                                padding: '10px',
                                fontSize: '0.8rem',
                                borderRadius: '6px',
                                border: '2px solid #e2e8f0',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          
                          {loginError && (
                            <div style={{
                              padding: '8px 12px',
                              background: 'rgba(220, 38, 38, 0.1)',
                              border: '1px solid rgba(220, 38, 38, 0.2)',
                              borderRadius: '6px',
                              color: '#dc2626',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              ⚠️ {loginError}
                            </div>
                          )}
                          
                          <button
                            type="submit"
                            style={{
                              marginTop: '4px',
                              padding: '12px',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                              transition: 'all 0.2s ease',
                              width: '100%'
                            }}
                          >
                            <Lock size={12} /> Access Tactical Dashboard
                          </button>
                        </>
                      ) : (
                        <div style={{
                          padding: '14px',
                          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(185, 28, 28, 0.02))',
                          borderRadius: '8px',
                          border: '2px solid rgba(220, 38, 38, 0.1)',
                          boxShadow: '0 3px 8px rgba(220, 38, 38, 0.1)'
                        }}>
                          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 6px auto'
                            }}>
                              <ShieldAlert size={16} color="white" />
                            </div>
                            <h4 style={{ color: '#dc2626', marginBottom: '3px', fontSize: '0.9rem', fontWeight: '700' }}>
                              First-Time Login Detected
                            </h4>
                            <p style={{ fontSize: '0.7rem', marginBottom: '0', color: '#991b1b', lineHeight: '1.4' }}>
                              Please create a secure password to continue.
                            </p>
                          </div>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              color: '#991b1b',
                              marginBottom: '5px',
                              fontWeight: '600'
                            }}>
                              🔐 Create New Password
                            </label>
                            <input
                              type="password"
                              required
                              className="input-field"
                              value={newPwd}
                              onChange={e => setNewPwd(e.target.value)}
                              placeholder="Enter a strong password"
                              style={{
                                marginBottom: '12px',
                                padding: '10px',
                                fontSize: '0.8rem',
                                borderRadius: '6px',
                                border: '2px solid rgba(220, 38, 38, 0.2)',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          <button
                            type="submit"
                            style={{
                              width: '100%',
                              padding: '10px',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              boxShadow: '0 3px 8px rgba(220, 38, 38, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '3px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <ShieldCheck size={12} /> Save & Continue
                          </button>
                        </div>
                      )}
                    </form>
                  )}

                  {officialType === 'ADMIN' && (
                    <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          color: 'var(--text-main)',
                          marginBottom: '5px',
                          fontWeight: '600'
                        }}>
                          🏛️ Administrator ID
                        </label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={adminId}
                          onChange={e => setAdminId(e.target.value)}
                          placeholder="Enter your admin ID"
                          style={{
                            padding: '10px',
                            fontSize: '0.8rem',
                            borderRadius: '6px',
                            border: '2px solid #e2e8f0',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          color: 'var(--text-main)',
                          marginBottom: '5px',
                          fontWeight: '600'
                        }}>
                          🔐 Vault Access Password
                        </label>
                        <input
                          type="password"
                          required
                          className="input-field"
                          value={adminPwd}
                          onChange={e => setAdminPwd(e.target.value)}
                          placeholder="Enter vault password"
                          style={{
                            padding: '10px',
                            fontSize: '0.8rem',
                            borderRadius: '6px',
                            border: '2px solid #e2e8f0',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          marginTop: '4px',
                          padding: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #059669, #047857)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          transition: 'all 0.2s ease',
                          width: '100%'
                        }}
                      >
                        <ShieldCheck size={12} /> Enter Command Center
                      </button>
                    </form>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}