import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';

// Real-time marker updater component
function LiveMarkerUpdater({ residents, showResidents, focusOnRedPins }) {
  const map = useMap();
  const markersRef = useRef({});
  
  useEffect(() => {
    if (!showResidents) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = {};
    
    // Add updated markers with smooth transitions
    residents.forEach(res => {
      if (!res.lat || !res.lng) return; // Skip residents without coordinates
      
      const isSOS = res.status === 'NEEDS_HELP';
      const isSafe = res.status === 'SAFE';
      const isUnreported = res.status === 'UNREPORTED';
      
      if (focusOnRedPins && !isSOS) return;
      
      // Determine color based on status
      let color = '#94a3b8'; // Default gray for unreported
      if (isSOS) color = '#D33033'; // Red for SOS
      else if (isSafe) color = '#16a34a'; // Green for safe
      
      const icon = createAnimatedIcon(color, isSOS, res.name);
      const marker = L.marker([res.lat, res.lng], { icon }).addTo(map);
      
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif;">
          <strong style="color: ${color};">${res.name}</strong><br/>
          <span style="color: #64748b;">Status: ${res.status}</span><br/>
          <span style="color: #64748b;">Address: ${res.address}</span><br/>
          ${res.vulnerability !== 'None' ? `<span style="color: #EAB308;">⚠️ ${res.vulnerability}</span><br/>` : ''}
          ${isSOS ? `<span style="color: #D33033; font-weight: bold;">Emergency: ${res.category}</span><br/>` : ''}
          ${res.message ? `<em style="color: #64748b;">"${res.message}"</em><br/>` : ''}
          <small style="color: #94a3b8;">Last updated: ${new Date().toLocaleTimeString()}</small>
        </div>
      `);
      
      markersRef.current[res.id] = marker;
    });
    
    return () => {
      Object.values(markersRef.current).forEach(marker => {
        map.removeLayer(marker);
      });
    };
  }, [residents, map, showResidents, focusOnRedPins]);
  
  return null;
}

// Enhanced animated icon creator
const createAnimatedIcon = (color, isSOS, name) => {
  const pulseAnimation = isSOS ? `
    @keyframes pulse-danger {
      0% { transform: scale(1); box-shadow: 0 0 0 0 ${color}80; }
      70% { transform: scale(1.1); box-shadow: 0 0 0 15px ${color}00; }
      100% { transform: scale(1); box-shadow: 0 0 0 0 ${color}00; }
    }
  ` : '';
  
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <style>${pulseAnimation}</style>
      <div style="
        position: relative;
        width: ${isSOS ? '24px' : '18px'}; 
        height: ${isSOS ? '24px' : '18px'};
        border-radius: 50%;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        border: 3px solid white;
        box-shadow: 0 4px 12px ${color}60, 0 0 0 ${isSOS ? '4px' : '2px'} ${color}30;
        animation: ${isSOS ? 'pulse-danger 2s infinite' : 'none'};
        transition: all 0.3s ease;
      ">
        ${isSOS ? `
          <div style="
            position: absolute; 
            top: -32px; 
            left: 50%; 
            transform: translateX(-50%); 
            background: linear-gradient(135deg, ${color}, #b91c1c); 
            color: white; 
            padding: 4px 8px; 
            border-radius: 6px; 
            font-size: 0.65rem; 
            white-space: nowrap; 
            font-family: Inter, sans-serif; 
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
          ">
            🚨 ${name.split(' ')[0]} - SOS
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [isSOS ? 24 : 18, isSOS ? 24 : 18],
    iconAnchor: [isSOS ? 12 : 9, isSOS ? 12 : 9]
  });
};

// Static evacuation center icon
const createEvacIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        position: relative;
        width: 28px; 
        height: 28px;
        border-radius: 6px;
        background: linear-gradient(135deg, #2F679B, #1e40af);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(47, 103, 155, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      ">
        🏢
        <div style="
          position: absolute; 
          top: -28px; 
          left: 50%; 
          transform: translateX(-50%); 
          background: linear-gradient(135deg, #2F679B, #1e40af); 
          color: white; 
          padding: 3px 6px; 
          border-radius: 4px; 
          font-size: 0.6rem; 
          white-space: nowrap; 
          font-family: Inter, sans-serif; 
          font-weight: bold;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        ">
          Evacuation Center
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export default function Map({ showResidents = true, focusOnRedPins = false, height = '400px', interactive = false }) {
  const { residents } = useAppContext();
  const [mapKey, setMapKey] = useState(0);

  // Debug: Log residents data
  console.log('Map component - residents:', residents);
  console.log('Map component - showResidents:', showResidents);
  console.log('Map component - focusOnRedPins:', focusOnRedPins);

  // Barangay Pagsabangan Base Coordinates
  const baseLat = 7.4804;
  const baseLng = 125.7516;

  // Evacuation Centers in Pagsabangan
  const evacCenters = [
    { id: 'evac1', name: 'Pagsabangan Barangay Hall', lat: baseLat + 0.001, lng: baseLng - 0.0015, capacity: '200 people' },
    { id: 'evac2', name: 'Covered Court Emergency Center', lat: baseLat - 0.0015, lng: baseLng + 0.002, capacity: '150 people' }
  ];

  // Force re-render when residents change significantly
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [residents.length]);

  return (
    <div style={{ 
      height, 
      width: '100%', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      border: '2px solid #e2e8f0',
      boxShadow: '0 8px 25px -5px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {/* Real-time indicator */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        background: 'rgba(22, 163, 74, 0.9)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#fff',
          animation: 'pulse 2s infinite'
        }} />
        LIVE
      </div>

      <MapContainer 
        key={mapKey}
        center={[baseLat, baseLng]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        dragging={interactive}
        scrollWheelZoom={interactive}
        zoomControl={interactive}
        doubleClickZoom={interactive}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Coverage area circles */}
        <Circle
          center={[baseLat, baseLng]}
          radius={500}
          pathOptions={{
            color: '#2F679B',
            fillColor: '#2F679B',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5, 5'
          }}
        />

        {/* Plot Evacuation Centers */}
        {evacCenters.map(evac => (
          <Marker key={evac.id} position={[evac.lat, evac.lng]} icon={createEvacIcon()}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                <strong style={{ color: '#2F679B', fontSize: '1rem' }}>{evac.name}</strong><br/>
                <span style={{ color: '#64748b' }}>Capacity: {evac.capacity}</span><br/>
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ Operational</span><br/>
                <small style={{ color: '#94a3b8' }}>Emergency shelter facility</small>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Live marker updater */}
        <LiveMarkerUpdater 
          residents={residents} 
          showResidents={showResidents} 
          focusOnRedPins={focusOnRedPins} 
        />
      </MapContainer>
    </div>
  );
}
