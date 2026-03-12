import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom aircraft icon
const aircraftIcon = new L.Icon({
  iconUrl: '/aircraft-marker.png', // You'll need to add this image
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Directional aircraft icon (shows heading)
const getRotatedIcon = (heading) => {
  return L.divIcon({
    html: `<div style="transform: rotate(${heading}deg); font-size: 24px;">✈️</div>`,
    className: 'aircraft-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapMarker({ aircraft }) {
  const position = [aircraft.latitude, aircraft.longitude];
  const icon = getRotatedIcon(aircraft.heading || 0);

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-bold text-lg mb-1">{aircraft.callsign || 'Unknown'}</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-semibold">Type:</span> {aircraft.type || 'N/A'}</p>
            <p><span className="font-semibold">Altitude:</span> {aircraft.altitude?.toLocaleString()} ft</p>
            <p><span className="font-semibold">Speed:</span> {aircraft.velocity ? Math.round(aircraft.velocity * 1.94384) : 'N/A'} kts</p>
            <p><span className="font-semibold">Heading:</span> {aircraft.heading}°</p>
            <p><span className="font-semibold">Origin:</span> {aircraft.originCountry || 'Unknown'}</p>
          </div>
          <button 
            className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700 transition"
            onClick={() => console.log('Track aircraft:', aircraft)}
          >
            Track
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default MapMarker;
