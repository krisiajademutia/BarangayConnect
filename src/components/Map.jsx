import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function Map({ showResidents = true, focusOnRedPins = false, height = '400px', interactive = false }) {
  const { residents } = useAppContext();

  // Barangay Pagsabangan Base Coordinates
  const baseLat = 7.4804;
  const baseLng = 125.7516;

  // Evacuation Centers in Pagsabangan
  const evacCenters = [
    { id: 'evac1', name: 'Pagsabangan Brgy Hall', lat: baseLat + 0.001, lng: baseLng - 0.0015 },
    { id: 'evac2', name: 'Covered Court Evac', lat: baseLat - 0.0015, lng: baseLng + 0.002 }
  ];

  // Custom Icons
  const createCustomIcon = (color, label) => {
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `
        <div style="
          position: relative;
          width: 20px; 
          height: 20px;
          border-radius: 50%;
          background-color: ${color};
          border: 2px solid white;
          box-shadow: 0 0 10px ${color}80;
        ">
          ${label ? `<span style="position: absolute; top: -24px; left: 50%; transform: translateX(-50%); background: ${color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; white-space: nowrap; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${label}</span>` : ''}
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const evacIcon = createCustomIcon('var(--primary)', 'Evac Center');
  const safeIcon = createCustomIcon('var(--safe)', '');
  const sosIcon = (name) => createCustomIcon('var(--danger)', `${name.split(' ')[0]} - SOS`);

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
      <MapContainer 
        center={[baseLat, baseLng]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        dragging={interactive}
        scrollWheelZoom={interactive}
        zoomControl={interactive}
        doubleClickZoom={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Plot Evacuation Centers */}
        {evacCenters.map(evac => (
          <Marker key={evac.id} position={[evac.lat, evac.lng]} icon={evacIcon}>
            <Popup>{evac.name}</Popup>
          </Marker>
        ))}

        {/* Plot Residents */}
        {showResidents && residents.filter(r => r.status === 'SAFE' || r.status === 'NEEDS_HELP').map(res => {
          const isSOS = res.status === 'NEEDS_HELP';
          if (focusOnRedPins && !isSOS) return null; 

          return (
            <Marker 
              key={res.id} 
              position={[res.lat, res.lng]} 
              icon={isSOS ? sosIcon(res.name) : safeIcon}
            >
              <Popup>
                <strong>{res.name}</strong><br/>
                Status: {res.status}<br/>
                {isSOS && `Needs: ${res.category}`}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
