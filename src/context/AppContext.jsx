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

  // Simulate real-time movement
  useEffect(() => {
    const interval = setInterval(() => {
      setResidents(prev => {
        if (!prev || prev.length === 0) return prev;
        const updated = prev.map(r => {
          // Move SAFE or UNREPORTED residents slightly to simulate walking/driving
          // Also slightly move NEEDS_HELP if they are not trapped, but for now we move SAFE/UNREPORTED
          if (r.status === 'SAFE' || r.status === 'UNREPORTED') {
            return {
              ...r,
              lat: r.lat + (Math.random() * 0.0002 - 0.0001),
              lng: r.lng + (Math.random() * 0.0002 - 0.0001)
            };
          }
          return r;
        });
        localStorage.setItem('bc_residents', JSON.stringify(updated));
        return updated;
      });
    }, 3000); // Update every 3 seconds for real-time feel

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
    // Check if responder is actually in vaultLogs, else use dummy data for prototype
    const vaultEntry = vaultLogs.find(log => log.idFile.includes(responderId) || log.name.includes(responderId));
    const authData = { role: 'RESPONDER', id: responderId, name: vaultEntry ? vaultEntry.name : `Responder ${responderId}` };
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
      addVaultLog,
      updateResidentStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
