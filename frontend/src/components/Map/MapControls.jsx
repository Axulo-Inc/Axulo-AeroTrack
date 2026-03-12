import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function MapControls({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);

  return null;
}

export default MapControls;
