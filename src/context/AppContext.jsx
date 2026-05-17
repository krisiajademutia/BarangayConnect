import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const EMERGENCY_CATEGORIES = [
  'Immediate Rescue (Trapped)',
  'Medical Emergency',
  'Evacuation Transport',
  'Relief Goods Needed'
];

export const AppProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [residents, setResidents] = useState([]);
  const [vaultLogs, setVaultLogs] = useState([]); // Global personnel roster
  const [auth, setAuth] = useState(null); 
  
  // Barangay Pagsabangan Base Coordinates
  const baseLat = 7.4804;
  const baseLng = 125.7516;

  const loadState = () => {
    const savedAlerts = localStorage.getItem('bc_alerts');
    const savedResidents = localStorage.getItem('bc_residents');
    const savedVault = localStorage.getItem('bc_vault');
    const savedAuth = sessionStorage.getItem('bc_auth'); 
    
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    if (savedVault) setVaultLogs(JSON.parse(savedVault));
    if (savedResidents) {
      setResidents(JSON.parse(savedResidents));
    } else {
      const initialResidents = [
        { id: 'sim_1', name: 'Juan Dela Cruz', address: 'Block 4, Purok 1', vulnerability: 'None', status: 'SAFE', lat: baseLat + 0.001, lng: baseLng - 0.001, type: 'RESIDENT' },
        { id: 'sim_2', name: 'Maria Clara', address: 'Riverside Street', vulnerability: 'Senior Citizen', status: 'NEEDS_HELP', category: 'Flooded Roof', message: 'Water is rising fast, please hurry!', lat: baseLat - 0.002, lng: baseLng + 0.002, responderAssigned: null, type: 'RESIDENT' },
        { id: 'sim_3', name: 'Pedro Penduko', address: 'Market Avenue', vulnerability: 'PWD', status: 'UNREPORTED', lat: baseLat + 0.003, lng: baseLng + 0.001, type: 'RESIDENT' }
      ];
      setResidents(initialResidents);
      localStorage.setItem('bc_residents', JSON.stringify(initialResidents));
    }
    
    if (savedAuth) setAuth(JSON.parse(savedAuth));
  };

  useEffect(() => {
    loadState();
    const handleStorageChange = (e) => {
      if (['bc_alerts', 'bc_residents', 'bc_vault'].includes(e.key)) {
        loadState();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enhanced real-time movement simulation with more realistic patterns
  useEffect(() => {
    const interval = setInterval(() => {
      setResidents(prev => {
        if (!prev || prev.length === 0) return prev;
        const updated = prev.map(r => {
          // More realistic movement patterns
          if (r.status === 'SAFE' || r.status === 'UNREPORTED') {
            // Simulate walking/driving with directional movement
            const movementSpeed = 0.00015; // Slightly faster movement
            const direction = Math.random() * 2 * Math.PI;
            const distance = Math.random() * movementSpeed;
            
            return {
              ...r,
              lat: r.lat + Math.cos(direction) * distance,
              lng: r.lng + Math.sin(direction) * distance,
              lastUpdate: new Date().toISOString()
            };
          }
          // SOS residents might have slight movement (not completely stationary)
          else if (r.status === 'NEEDS_HELP') {
            return {
              ...r,
              lat: r.lat + (Math.random() * 0.00005 - 0.000025), // Very slight movement
              lng: r.lng + (Math.random() * 0.00005 - 0.000025),
              lastUpdate: new Date().toISOString()
            };
          }
          return r;
        });
        localStorage.setItem('bc_residents', JSON.stringify(updated));
        return updated;
      });
    }, 2000); // Update every 2 seconds for more responsive feel

    return () => clearInterval(interval);
  }, []);

  // Real-time GPS Tracking for active user
  useEffect(() => {
    if (!auth) return;
    
    // Check if the browser supports geolocation
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setResidents(prev => {
            const updated = prev.map(r => {
              if (r.id === auth.id) {
                // Only use real GPS if within ~5km of the barangay to prevent pins from disappearing off the map
                const dist = Math.sqrt(Math.pow(position.coords.latitude - baseLat, 2) + Math.pow(position.coords.longitude - baseLng, 2));
                if (dist > 0.05) return r; // Ignore real GPS if far away
                
                return {
                  ...r,
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
              }
              return r;
            });
            localStorage.setItem('bc_residents', JSON.stringify(updated));
            return updated;
          });
        },
        (error) => console.warn('GPS tracking error:', error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [auth]);

  const loginResident = (name, address, vulnerability) => {
    const newId = 'res_' + Date.now();
    const newResident = {
      id: newId,
      name,
      address,
      vulnerability,
      status: 'UNREPORTED',
      lat: baseLat + (Math.random() * 0.006 - 0.003), 
      lng: baseLng + (Math.random() * 0.006 - 0.003),
      type: 'RESIDENT'
    };
    
    const updated = [...residents, newResident];
    setResidents(updated);
    localStorage.setItem('bc_residents', JSON.stringify(updated));
    
    const authData = { role: 'RESIDENT', ...newResident };
    setAuth(authData);
    sessionStorage.setItem('bc_auth', JSON.stringify(authData));
    return newId;
  };

  const loginResponder = (responderId) => {
    // Check if responder ID exists in vaultLogs (personnel directory)
    const vaultEntry = vaultLogs.find(log => log.id.toString() === responderId.toString());
    if (!vaultEntry) {
      throw new Error('Invalid responder ID. Please check your credentials.');
    }
    const authData = { role: 'RESPONDER', id: responderId, name: vaultEntry.name, personnelData: vaultEntry };
    setAuth(authData);
    sessionStorage.setItem('bc_auth', JSON.stringify(authData));
  };

  const loginAdmin = () => {
    const authData = { role: 'ADMIN', id: 'admin', name: 'Super Admin' };
    setAuth(authData);
    sessionStorage.setItem('bc_auth', JSON.stringify(authData));
  };

  const logout = () => {
    setAuth(null);
    sessionStorage.removeItem('bc_auth');
  };

  const broadcastAlert = (alert) => {
    const newAlerts = [{ id: Date.now().toString(), timestamp: new Date().toISOString(), ...alert }, ...alerts];
    setAlerts(newAlerts);
    localStorage.setItem('bc_alerts', JSON.stringify(newAlerts));
  };

  const editAlert = (alertId, updatedAlert) => {
    const updated = alerts.map(alert => 
      alert.id === alertId ? { ...alert, ...updatedAlert, timestamp: new Date().toISOString() } : alert
    );
    setAlerts(updated);
    localStorage.setItem('bc_alerts', JSON.stringify(updated));
  };

  const deleteAlert = (alertId) => {
    const updated = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updated);
    localStorage.setItem('bc_alerts', JSON.stringify(updated));
  };

  const addVaultLog = (log) => {
    const newLogs = [log, ...vaultLogs];
    setVaultLogs(newLogs);
    localStorage.setItem('bc_vault', JSON.stringify(newLogs));
  };

  const updateResidentStatus = (id, newStatus, details = {}) => {
    const updated = residents.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus, ...details, timestamp: new Date().toISOString() };
      }
      return r;
    });
    setResidents(updated);
    localStorage.setItem('bc_residents', JSON.stringify(updated));
    
    if (auth && auth.id === id) {
      const updatedAuth = { ...auth, status: newStatus, ...details };
      setAuth(updatedAuth);
      sessionStorage.setItem('bc_auth', JSON.stringify(updatedAuth));
    }
  };

  return (
    <AppContext.Provider value={{
      alerts,
      residents,
      vaultLogs,
      auth,
      loginResident,
      loginResponder,
      loginAdmin,
      logout,
      broadcastAlert,
      editAlert,
      deleteAlert,
      addVaultLog,
      updateResidentStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
