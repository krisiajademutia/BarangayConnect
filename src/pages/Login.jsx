import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldAlert, Smartphone, ShieldCheck, UserPlus, Lock, MapPin } from 'lucide-react';

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
    
    // Simulate first time login prompt
    if (resId && !showCreatePwd && resPwd === 'temp123') {
      setShowCreatePwd(true);
      return;
    }
    
    loginResponder(resId);
    navigate('/responder');
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminId && adminPwd) {
      loginAdmin();
      navigate('/command-center');
    }
  };

  return (
    <div className="phone-wrapper" style={{ backgroundColor: 'var(--bg-darker)' }}>
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header Area */}
        <div style={{ backgroundColor: 'var(--primary)', backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', padding: '40px 24px', textAlign: 'center', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
              <MapPin size={40} color="var(--primary)" />
            </div>
          </div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, letterSpacing: '-0.5px' }}>
             Barangay<span style={{ color: '#fca5a5' }}>Connect</span>
          </h1>
          <p style={{ opacity: 0.9, marginTop: '8px', fontSize: '0.9rem' }}>Official Disaster Network</p>
        </div>

        {/* Dynamic Content Area */}
        <div style={{ padding: '32px 24px' }}>
          
          {activeTab === 'RESIDENT' ? (
            <div className="animate-slide-in">
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: 'var(--text-main)', fontSize: '1.3rem' }}>Resident Access</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Register to receive alerts and request rescue.</p>
              </div>

              <form onSubmit={handleResidentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 'bold' }}>Full Name</label>
                  <input type="text" required className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Juan Dela Cruz" style={{ padding: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 'bold' }}>Complete Address</label>
                  <input type="text" required className="input-field" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Block 4, Purok 1" style={{ padding: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 'bold' }}>Do you need special assistance?</label>
                  <select className="input-field" value={vuln} onChange={e => setVuln(e.target.value)} style={{ padding: '14px' }}>
                    <option value="None">No (None)</option>
                    <option value="Senior Citizen">Yes - Senior Citizen</option>
                    <option value="PWD">Yes - PWD</option>
                    <option value="Pregnant">Yes - Pregnant</option>
                  </select>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '12px', boxShadow: '0 10px 15px -3px var(--primary-glow)' }}>
                  <UserPlus size={20} /> Access BarangayConnect
                </button>
              </form>
              
              <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Are you an official responder or LGU Admin?</p>
                <button 
                  onClick={() => setActiveTab('OFFICIAL')}
                  style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-main)', padding: '10px 20px', borderRadius: '24px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Official Login Portal
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button 
                  onClick={() => setActiveTab('RESIDENT')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}
                >
                  &larr; Back to Public
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                <h2 style={{ color: 'var(--text-main)', fontSize: '1.3rem' }}>Official LGU Portal</h2>
              </div>

              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
                 <button onClick={() => setOfficialType('RESPONDER')} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: officialType === 'RESPONDER' ? 'white' : 'transparent', color: officialType === 'RESPONDER' ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', boxShadow: officialType === 'RESPONDER' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                   Responder
                 </button>
                 <button onClick={() => setOfficialType('ADMIN')} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: officialType === 'ADMIN' ? 'white' : 'transparent', color: officialType === 'ADMIN' ? 'var(--safe)' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', boxShadow: officialType === 'ADMIN' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                   Command Center
                 </button>
              </div>

              {officialType === 'RESPONDER' && (
                <form onSubmit={handleResponderSubmit} className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {!showCreatePwd ? (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 'bold' }}>Official Responder ID</label>
                        <input type="text" required className="input-field" value={resId} onChange={e => setResId(e.target.value)} placeholder="e.g. BDRRMC-RES-01" style={{ padding: '14px' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 'bold' }}>Password (Try 'temp123')</label>
                        <input type="password" required className="input-field" value={resPwd} onChange={e => setResPwd(e.target.value)} style={{ padding: '14px' }} />
                      </div>
                      <button type="submit" className="btn btn-danger" style={{ marginTop: '12px', padding: '14px' }}>
                        <Lock size={18} /> Tactical Login
                      </button>
                    </>
                  ) : (
                    <div style={{ padding: '20px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                      <h4 style={{ color: 'var(--danger)', marginBottom: '8px', fontSize: '1.1rem' }}>First-Time Login</h4>
                      <p style={{ fontSize: '0.85rem', marginBottom: '16px', color: '#991b1b' }}>Please create a secure personal password to continue.</p>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#991b1b', marginBottom: '8px', fontWeight: 'bold' }}>New Password</label>
                        <input type="password" required className="input-field" value={newPwd} onChange={e => setNewPwd(e.target.value)} style={{ marginBottom: '16px', padding: '12px' }} />
                      </div>
                      <button type="submit" className="btn btn-danger" style={{ width: '100%', padding: '14px' }}>
                        Save & Continue
                      </button>
                    </div>
                  )}
                </form>
              )}

              {officialType === 'ADMIN' && (
                <form onSubmit={handleAdminSubmit} className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 'bold' }}>Admin ID</label>
                    <input type="text" required className="input-field" value={adminId} onChange={e => setAdminId(e.target.value)} placeholder="Admin ID" style={{ padding: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 'bold' }}>Vault Password</label>
                    <input type="password" required className="input-field" value={adminPwd} onChange={e => setAdminPwd(e.target.value)} style={{ padding: '14px' }} />
                  </div>
                  <button type="submit" className="btn btn-safe" style={{ marginTop: '12px', padding: '14px' }}>
                    <ShieldCheck size={18} /> Enter Dashboard
                  </button>
                </form>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
