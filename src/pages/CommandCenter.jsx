import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Users, AlertTriangle, CheckCircle, Radio, MapPin, Upload, Plus, BookOpen } from 'lucide-react';
import Map from '../components/Map';
import BarangayConnectLogo from '../components/BarangayConnectLogo';

export default function CommandCenter() {
  const { residents, vaultLogs, alerts, broadcastAlert, editAlert, deleteAlert, addVaultLog, auth, logout } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertLevel, setAlertLevel] = useState('Advisory');
  const [alertImage, setAlertImage] = useState(null);
  const [toast, setToast] = useState(null);

  const [newOfficialName, setNewOfficialName] = useState('');
  const [newOfficialRole, setNewOfficialRole] = useState('Responder');
  const [newOfficialMobile, setNewOfficialMobile] = useState('');

  // Edit alert states
  const [editingAlert, setEditingAlert] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [editLevel, setEditLevel] = useState('Advisory');
  const [editImage, setEditImage] = useState(null);

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
      author: 'Super Admin',
      image: alertImage
    });
    setAlertMessage('');
    setAlertImage(null);
    setToast({ title: 'Broadcast Sent', message: `Alert level ${alertLevel} sent to all users.` });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAlertImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setAlertImage(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setEditImage(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert.id);
    setEditMessage(alert.message);
    setEditLevel(alert.level);
    setEditImage(alert.image || null);
  };

  const handleSaveEdit = (alertId) => {
    editAlert(alertId, {
      message: editMessage,
      level: editLevel,
      image: editImage
    });
    setEditingAlert(null);
    setEditMessage('');
    setEditLevel('Advisory');
    setEditImage(null);
    setToast({ title: 'Alert Updated', message: 'Broadcast has been successfully updated.' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancelEdit = () => {
    setEditingAlert(null);
    setEditMessage('');
    setEditLevel('Advisory');
    setEditImage(null);
  };

  const handleDeleteAlert = (alertId) => {
    if (window.confirm('Are you sure you want to delete this broadcast? This action cannot be undone.')) {
      deleteAlert(alertId);
      setToast({ title: 'Alert Deleted', message: 'Broadcast has been successfully deleted.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddOfficial = (e) => {
    e.preventDefault();
    if (!newOfficialName.trim()) return;

    const newOfficial = {
      id: Date.now(),
      name: newOfficialName,
      role: newOfficialRole,
      mobile: newOfficialMobile,
      timestamp: new Date().toISOString(),
      status: 'Active'
    };

    // Add to context (State)
    addVaultLog(newOfficial);

    // Persist to local storage
    const existing = JSON.parse(localStorage.getItem('bc_officials') || '[]');
    localStorage.setItem('bc_officials', JSON.stringify([...existing, newOfficial]));

    setNewOfficialName('');
    setNewOfficialMobile('');
    setToast({ title: 'Success', message: `${newOfficialRole} account created successfully!` });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="desktop-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Toast Notification */}
      {toast && (
        <div className="glass-panel animate-slide-in" style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
          padding: '16px', borderLeft: '4px solid var(--primary)', background: 'white'
        }}>
          <strong style={{ display: 'block' }}>{toast.title}</strong>
          <span style={{ fontSize: '0.9rem' }}>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="glass-panel animate-slide-in" style={{
        padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
        backdropFilter: 'blur(20px)', border: '1px solid rgba(47, 103, 155, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BarangayConnectLogo size={45} animate={true} showText={true} />
          <div style={{ marginLeft: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <div style={{
                padding: '4px 12px', background: 'linear-gradient(135deg, var(--primary), #1e40af)',
                color: 'white', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700'
              }}>
                🏛️ LGU COMMAND CENTER
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--safe)', animation: 'pulse-live 2s infinite' }} />
                <span style={{ fontWeight: '600' }}>REAL-TIME</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {activeTab === 'DASHBOARD' && (
            <>
              <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '4px solid var(--safe)' }}>
                <CheckCircle size={20} color="var(--safe)" />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Safe</p>
                  <strong>{safeCount}</strong>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '4px solid var(--danger)' }}>
                <AlertTriangle size={20} color="var(--danger)" />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>SOS</p>
                  <strong>{helpCount}</strong>
                </div>
              </div>
            </>
          )}
          <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#e2e8f0' }}>Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px' }}>
        {[
          { id: 'DASHBOARD', icon: <MapPin size={18} />, label: 'Tactical Map' },
          { id: 'VAULT', icon: <ShieldCheck size={18} />, label: 'Verification Vault' },
          { id: 'DIRECTORIES', icon: <BookOpen size={18} />, label: 'Directories' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn"
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'white',
              color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
              border: '1px solid #cbd5e1', flex: '0 1 200px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'DASHBOARD' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1 }}>
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '650px' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
              <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <MapPin size={18} color="var(--primary)" /> Real-Time Tactical Map
              </h2>
            </div>
            <Map showResidents={true} focusOnRedPins={false} interactive={true} height="600px" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={20} color="var(--danger)" /> Emergency Broadcaster
              </h2>
              <form onSubmit={handleBroadcast}>
                <select value={alertLevel} onChange={(e) => setAlertLevel(e.target.value)} className="input-field" style={{ marginBottom: '12px' }}>
                  <option value="Advisory">Advisory - Informational</option>
                  <option value="Warning">Warning - Prepare</option>
                  <option value="Critical">Critical - Immediate Action</option>
                </select>
                <textarea
                  value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)}
                  className="input-field" rows="3" placeholder="Enter advisory..." style={{ marginBottom: '12px' }}
                />

                {/* Image Upload Section */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    marginBottom: '6px',
                    color: 'var(--text-main)'
                  }}>
                    📷 Attach Image (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAlertImageChange}
                      style={{ display: 'none' }}
                      id="alert-image-upload"
                    />
                    <label
                      htmlFor="alert-image-upload"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        border: '2px dashed #cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: '#f8fafc',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease',
                        ':hover': {
                          borderColor: 'var(--primary)',
                          backgroundColor: '#f1f5f9'
                        }
                      }}
                    >
                      <Upload size={16} />
                      {alertImage ? 'Image Selected ✓' : 'Click to upload image'}
                    </label>
                  </div>

                  {/* Image Preview */}
                  {alertImage && (
                    <div style={{ marginTop: '8px', position: 'relative' }}>
                      <img
                        src={alertImage}
                        alt="Alert preview"
                        style={{
                          width: '100%',
                          maxHeight: '120px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setAlertImage(null)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(220, 38, 38, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>
                  <Radio size={16} style={{ marginRight: '6px' }} />
                  Broadcast Alert
                </button>
              </form>
            </div>

            <div className="glass-panel" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Recent Broadcasts</h3>
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  background: '#f8fafc',
                  borderLeft: '4px solid var(--primary)',
                  position: 'relative'
                }}>
                  {editingAlert === alert.id ? (
                    // Edit Mode
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <select
                        value={editLevel}
                        onChange={(e) => setEditLevel(e.target.value)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        <option value="Advisory">Advisory</option>
                        <option value="Warning">Warning</option>
                        <option value="Critical">Critical</option>
                      </select>

                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        style={{
                          padding: '6px 8px',
                          fontSize: '0.8rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          resize: 'vertical',
                          minHeight: '60px'
                        }}
                      />

                      {/* Edit Image Upload */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                          style={{ display: 'none' }}
                          id={`edit-image-${alert.id}`}
                        />
                        <label
                          htmlFor={`edit-image-${alert.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)'
                          }}
                        >
                          <Upload size={12} />
                          {editImage ? 'Change Image' : 'Add Image'}
                        </label>
                      </div>

                      {/* Edit Image Preview */}
                      {editImage && (
                        <div style={{ position: 'relative', marginTop: '4px' }}>
                          <img
                            src={editImage}
                            alt="Edit preview"
                            style={{
                              width: '100%',
                              maxHeight: '80px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setEditImage(null)}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              background: 'rgba(220, 38, 38, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                        <button
                          onClick={() => handleSaveEdit(alert.id)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <small style={{ fontWeight: 'bold', display: 'block' }}>{alert.level}</small>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleEditAlert(alert)}
                            style={{
                              padding: '2px 6px',
                              fontSize: '0.65rem',
                              background: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            style={{
                              padding: '2px 6px',
                              fontSize: '0.65rem',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', margin: '4px 0 8px 0' }}>{alert.message}</p>

                      {/* Display Image if exists */}
                      {alert.image && (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={alert.image}
                            alt="Broadcast attachment"
                            style={{
                              width: '100%',
                              maxHeight: '100px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0'
                            }}
                          />
                        </div>
                      )}

                      <small style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        display: 'block',
                        marginTop: '6px'
                      }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </small>
                    </div>
                  )}
                </div>
              ))}

              {alerts.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  No broadcasts yet. Create your first emergency alert above.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VAULT TAB */}
      {activeTab === 'VAULT' && (
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', margin: '0 0 20px 0' }}>Add New Emergency Personnel</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Name</label>
                <input type="text" className="input-field" value={newOfficialName} onChange={e => setNewOfficialName(e.target.value)} placeholder="Full Name" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Mobile</label>
                <input type="tel" className="input-field" value={newOfficialMobile} onChange={e => setNewOfficialMobile(e.target.value)} placeholder="09XX..." />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Role</label>
                <select className="input-field" value={newOfficialRole} onChange={e => setNewOfficialRole(e.target.value)}>
                  <option value="Responder">🚑 Responder</option>
                  <option value="Medic">🏥 Medic</option>
                  <option value="Police">👮 Police</option>
                </select>
              </div>
              <button onClick={handleAddOfficial} className="btn" style={{ background: 'var(--primary)', color: 'white', height: '45px' }}>
                <Plus size={18} /> Add
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '20px' }}>Personnel Directory</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {vaultLogs.map(log => (
                <div key={log.id} style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{log.name}</strong>
                    <div style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{log.role} • {log.mobile}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>ID: {log.id}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID Verified ✅</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DIRECTORIES TAB */}
      {activeTab === 'DIRECTORIES' && (
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Resident Status Directory</h3>
              <div style={{ display: 'flex', gap: '20px' }}>
                <span>Total: <strong>{totalCount}</strong></span>
                <span style={{ color: 'var(--safe)' }}>Safe: <strong>{safeCount}</strong></span>
                <span style={{ color: 'var(--danger)' }}>SOS: <strong>{helpCount}</strong></span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {residents.length > 0 ? (
                residents.map((resident) => (
                  <div key={resident.id} style={{
                    background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    boxShadow: resident.status === 'NEEDS_HELP' ? '0 0 15px rgba(220, 38, 38, 0.1)' : 'none'
                  }}>
                    <div style={{
                      width: '45px', height: '45px', borderRadius: '50%', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: resident.status === 'SAFE' ? 'var(--safe)' : resident.status === 'NEEDS_HELP' ? 'var(--danger)' : '#94a3b8',
                      animation: resident.status === 'NEEDS_HELP' ? 'pulse-live 2s infinite' : 'none'
                    }}>
                      {resident.status === 'SAFE' ? '✓' : '!'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0 }}>{resident.name}</h4>
                      <small style={{ color: 'var(--text-muted)' }}>Location: Block {resident.block || '1'}, Lot {resident.lot || 'A'}</small>
                    </div>
                    <div style={{ fontWeight: 'bold', color: resident.status === 'SAFE' ? 'var(--safe)' : 'var(--danger)' }}>
                      {resident.status}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No resident records found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}