import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapMarker from './MapMarker';
import MapControls from './MapControls';
import openskyService from '../../services/opensky.service';
import { Card, Button, LoadingSpinner } from '../ui';
import { RefreshCw, Plane, MapPin, Navigation } from 'lucide-react';

// Component to recenter map
function RecenterButton({ position }) {
  const map = useMap();
  
  const recenter = () => {
    map.setView(position, map.getZoom());
  };

  return (
    <button
      onClick={recenter}
      className="absolute bottom-20 right-4 z-[1000] bg-slate-800 p-2 rounded-lg shadow-lg hover:bg-slate-700 transition"
      title="Recenter map"
    >
      <Navigation size={20} className="text-blue-400" />
    </button>
  );
}

function AircraftMap({ center = [-26.1, 28.2], zoom = 5 }) {
  const [aircraft, setAircraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    inAir: 0,
    onGround: 0,
    avgAltitude: 0
  });

  const fetchAircraft = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await openskyService.getAircraftStates();
      setAircraft(data);
      
      // Calculate stats
      const inAir = data.filter(a => a.altitude > 1000).length;
      const onGround = data.filter(a => a.altitude <= 1000).length;
      const avgAlt = data.reduce((acc, a) => acc + (a.altitude || 0), 0) / (data.length || 1);
      
      setStats({
        total: data.length,
        inAir,
        onGround,
        avgAltitude: Math.round(avgAlt)
      });
      
    } catch (error) {
      console.error('Failed to fetch aircraft:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAircraft();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAircraft, 30000);
    return () => clearInterval(interval);
  }, [fetchAircraft]);

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">Loading live aircraft data...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Plane className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Aircraft Tracked</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Navigation className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">In Air</p>
              <p className="text-2xl font-bold text-green-400">{stats.inAir}</p>
            </div>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <MapPin className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">On Ground</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.onGround}</p>
            </div>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Navigation className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Altitude</p>
              <p className="text-2xl font-bold text-white">{stats.avgAltitude.toLocaleString()} ft</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Map */}
      <Card className="relative overflow-hidden" style={{ height: '600px' }}>
        <div className="absolute top-4 right-4 z-[1000] flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchAircraft}
            isLoading={refreshing}
            icon={RefreshCw}
          >
            Refresh
          </Button>
        </div>

        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          {aircraft.map((a, idx) => (
            <MapMarker 
              key={idx} 
              aircraft={a}
            />
          ))}
          
          <RecenterButton position={center} />
        </MapContainer>
      </Card>

      {/* Legend */}
      <Card>
        <Card.Body className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="text-gray-400">Aircraft position (rotates with heading)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-400">In Air (&gt;1000ft)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-gray-400">On Ground</span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AircraftMap;
