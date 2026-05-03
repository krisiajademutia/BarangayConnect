import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Users, AlertTriangle, CheckCircle, Radio, MapPin, Upload, Plus, BookOpen } from 'lucide-react';
import Map from '../components/Map';

export default function CommandCenter() {
  const { residents, vaultLogs, broadcastAlert, addVaultLog, auth, logout } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // DASHBOARD, VAULT, DIRECTORIES
  const [alertMessage, setAlertMessage] = useState('');
  const [alertLevel, setAlertLevel] = useState('Advisory');

  const [newOfficialName, setNewOfficialName] = useState('');
  const [newOfficialRole, setNewOfficialRole] = useState('Responder');
  const [newOfficialMobile, setNewOfficialMobile] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (!auth || auth.role !== 'ADMIN') {
      navigate('/');
    }
  }, [auth, navigate]);

  if (!auth || auth.role !== 'ADMIN') return null;

  const safeCount = residents.filter(r => r.status === 'SAFE').length;
  const helpCount = residents.filter(r => r.status === 'NEEDS_HELP').length;
  const totalCount = residents.length;

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;
    broadcastAlert({
      message: alertMessage,
      level: alertLevel,
      author: 'Super Admin'
    });
    setAlertMessage('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setUploadedFile(e.target.files[0].name);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newOfficialName || !uploadedFile) return;
    const newLog = {
      id: Date.now(),
      name: newOfficialName,
      role: newOfficialRole,
      mobile: newOfficialMobile,
      timestamp: new Date().toISOString(),
      idFile: uploadedFile
    };
    addVaultLog(newLog);
    setNewOfficialName('');
    setNewOfficialMobile('');
    setUploadedFile(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="desktop-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
            <span style={{ color: 'var(--primary)' }}>Barangay</span>
            <span style={{ color: 'var(--danger)' }}>Connect</span>
          </h1>
          <div style={{ paddingLeft: '12px', borderLeft: '1px solid #cbd5e1' }}>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' }}>LGU Command Center</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {activeTab === 'DASHBOARD' && (
            <>
              <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '4px solid var(--safe)', boxShadow: 'none' }}>
                <CheckCircle size={20} color="var(--safe)" />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe</p>
                  <strong>{safeCount}</strong>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '4px solid var(--danger)', boxShadow: 'none' }}>
                <AlertTriangle size={20} color="var(--danger)" />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SOS / Needs Help</p>
                  <strong>{helpCount}</strong>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '4px solid var(--primary)', boxShadow: 'none' }}>
                <Users size={20} color="var(--primary)" />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Citizens</p>
                  <strong>{totalCount}</strong>
                </div>
              </div>
            </>
          )}
          <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#e2e8f0', color: 'var(--text-muted)' }}>Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => setActiveTab('DASHBOARD')}
          className="btn"
          style={{ backgroundColor: activeTab === 'DASHBOARD' ? 'var(--primary)' : 'white', color: activeTab === 'DASHBOARD' ? 'white' : 'var(--text-muted)', border: '1px solid #cbd5e1', flex: '0 1 200px' }}
        >
          <MapPin size={18} /> Tactical Map
        </button>
        <button 
          onClick={() => setActiveTab('VAULT')}
          className="btn"
          style={{ backgroundColor: activeTab === 'VAULT' ? 'var(--primary)' : 'white', color: activeTab === 'VAULT' ? 'white' : 'var(--text-muted)', border: '1px solid #cbd5e1', flex: '0 1 200px' }}
        >
          <ShieldCheck size={18} /> Verification Vault
        </button>
        <button 
          onClick={() => setActiveTab('DIRECTORIES')}
          className="btn"
          style={{ backgroundColor: activeTab === 'DIRECTORIES' ? 'var(--primary)' : 'white', color: activeTab === 'DIRECTORIES' ? 'white' : 'var(--text-muted)', border: '1px solid #cbd5e1', flex: '0 1 200px' }}
        >
          <BookOpen size={18} /> Directories
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'DASHBOARD' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1 }}>
          
          {/* Tactical Map Simulation */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '650px' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', margin: 0 }}>
                <MapPin size={18} color="var(--primary)" /> Real-Time Tactical Map
              </h2>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--danger)'}}/> SOS/Need Help</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--safe)'}}/> Safe</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary)'}}/> Evac Center</span>
              </div>
            </div>
            
            <Map showResidents={true} focusOnRedPins={false} interactive={true} height="600px" />
          </div>

          {/* Broadcast System */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                <Radio size={20} color="var(--danger)" /> Emergency Broadcaster
              </h2>
              <form onSubmit={handleBroadcast}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Alert Level</label>
                <select 
                  value={alertLevel}
                  onChange={(e) => setAlertLevel(e.target.value)}
                  className="input-field" 
                  style={{ marginBottom: '16px' }}
                >
                  <option value="Advisory">Advisory - Informational</option>
                  <option value="Warning">Warning - Prepare</option>
                  <option value="Critical">Critical - Immediate Action</option>
                </select>

                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Message</label>
                <textarea 
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="input-field" 
                  rows="4" 
                  placeholder="Enter verified advisory..."
                  style={{ marginBottom: '24px', resize: 'vertical' }}
                ></textarea>
                
                <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>
                  <Radio size={18} /> Broadcast Alert
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'VAULT' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--primary)' }}>Create Official Account</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Only Super-Admins can create accounts for Responders and Officials to prevent unauthorized access.
            </p>

            <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Full Name of Personnel</label>
                <input type="text" required className="input-field" value={newOfficialName} onChange={e => setNewOfficialName(e.target.value)} placeholder="e.g. Cardo Dalisay" />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Role</label>
                <select className="input-field" value={newOfficialRole} onChange={e => setNewOfficialRole(e.target.value)}>
                  <option value="Responder">Tactical Responder</option>
                  <option value="BDRRMC Official">BDRRMC Official</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Mobile Number</label>
                <input type="tel" required className="input-field" value={newOfficialMobile} onChange={e => setNewOfficialMobile(e.target.value)} placeholder="e.g. 09123456789" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Government-Issued ID Verification</label>
                <div style={{ border: '1px dashed #cbd5e1', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <input type="file" id="id-upload" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                  <label htmlFor="id-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={24} color="var(--primary)" />
                    {uploadedFile ? (
                      <span style={{ color: 'var(--safe)', fontWeight: 'bold' }}>{uploadedFile}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click to attach ID scan</span>
                    )}
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                <Plus size={18} /> Generate Account
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Account Generation Logs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {vaultLogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '40px' }}>No accounts generated in this session.</p>
              ) : (
                vaultLogs.map(log => (
                  <div key={log.id} style={{ padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid var(--safe)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{log.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '4px', fontWeight: 'bold' }}>{log.role}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '8px' }}>Mobile: {log.mobile}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID Verified: {log.idFile}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DIRECTORIES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} /> Citizen Directory
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', color: 'var(--text-muted)', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Address</th>
                    <th style={{ padding: '12px' }}>Vulnerability</th>
                    <th style={{ padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {residents.map(res => (
                    <tr key={res.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500', color: 'var(--text-main)' }}>{res.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{res.address}</td>
                      <td style={{ padding: '12px' }}>
                        {res.vulnerability && res.vulnerability !== 'None' ? (
                          <span style={{ backgroundColor: '#fff1f2', color: 'var(--danger)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {res.vulnerability}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          backgroundColor: res.status === 'SAFE' ? 'var(--safe-bg)' : res.status === 'NEEDS_HELP' ? 'var(--danger-bg)' : '#f1f5f9',
                          color: res.status === 'SAFE' ? 'var(--safe)' : res.status === 'NEEDS_HELP' ? 'var(--danger)' : 'var(--text-muted)',
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
                        }}>
                          {res.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {residents.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No registered citizens yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} /> Verified Personnel Roster
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', color: 'var(--text-muted)', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px' }}>Official Name</th>
                    <th style={{ padding: '12px' }}>Designated Role</th>
                    <th style={{ padding: '12px' }}>Mobile Number</th>
                    <th style={{ padding: '12px' }}>Verification Proof</th>
                    <th style={{ padding: '12px' }}>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {vaultLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>{log.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-main)' }}>{log.role}</td>
                      <td style={{ padding: '12px', color: 'var(--text-main)' }}>{log.mobile}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} color="var(--safe)" /> {log.idFile}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {vaultLogs.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No personnel verified yet. Use the Verification Vault to add staff.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
