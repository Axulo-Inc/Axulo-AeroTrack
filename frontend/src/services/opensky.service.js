import axios from 'axios';

// Free OpenSky API - no authentication required for basic calls
const OPENSKY_API = 'https://opensky-network.org/api';

class OpenSkyService {
  // Get all aircraft states (positions) for a bounding box (Southern Africa focus)
  async getAircraftStates() {
    try {
      // Bounding box for Southern Africa
      // [minLat, maxLat, minLon, maxLon]
      const bbox = '-35,5,10,35'; // Approximate bounds for Southern Africa
      
      const response = await axios.get(`${OPENSKY_API}/states/all`, {
        params: {
          lamin: -35,  // min latitude
          lamax: 5,    // max latitude
          lomin: 10,   // min longitude
          lomax: 35,   // max longitude
        }
      });
      
      if (response.data && response.data.states) {
        // Process the data into a more usable format
        return this.processAircraftData(response.data.states);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch aircraft states:', error);
      // Return mock data if API fails (for development)
      return this.getMockAircraftData();
    }
  }

  // Process raw OpenSky data
  processAircraftData(states) {
    return states
      .filter(state => state[5] && state[6]) // Filter out aircraft without position
      .map(state => ({
        icao24: state[0],
        callsign: state[1]?.trim() || 'Unknown',
        originCountry: state[2],
        latitude: state[6],
        longitude: state[5],
        altitude: state[7],
        velocity: state[9],
        heading: state[10],
        onGround: state[8],
        lastContact: state[4]
      }))
      .slice(0, 50); // Limit to 50 aircraft for performance
  }

  // Mock data for development (when API fails)
  getMockAircraftData() {
    const aircraft = [
      { callsign: 'SAA234', type: 'A320', lat: -26.1, lng: 28.2, alt: 35000, heading: 180 }, // JNB
      { callsign: 'BAW54', type: 'B777', lat: -33.9, lng: 18.4, alt: 37000, heading: 270 }, // CPT
      { callsign: 'KQ456', type: 'B787', lat: -4.0, lng: 39.7, alt: 38000, heading: 90 }, // NBO
      { callsign: 'ETD123', type: 'A380', lat: -22.5, lng: 17.1, alt: 40000, heading: 45 }, // WDH
      { callsign: 'SAA789', type: 'A333', lat: -29.8, lng: 31.0, alt: 36000, heading: 120 }, // DUR
      { callsign: 'LNK345', type: 'C172', lat: -25.7, lng: 28.2, alt: 8500, heading: 200 }, // Pretoria
    ];
    
    return aircraft.map((a, i) => ({
      id: i,
      callsign: a.callsign,
      type: a.type,
      latitude: a.lat + (Math.random() - 0.5) * 0.1,
      longitude: a.lng + (Math.random() - 0.5) * 0.1,
      altitude: a.alt,
      heading: a.heading,
      velocity: Math.floor(400 + Math.random() * 100)
    }));
  }

  // Get specific aircraft details
  async getAircraftByCallsign(callsign) {
    try {
      const allAircraft = await this.getAircraftStates();
      return allAircraft.find(a => 
        a.callsign && a.callsign.includes(callsign.toUpperCase())
      );
    } catch (error) {
      console.error('Failed to fetch aircraft:', error);
      return null;
    }
  }
}

export default new OpenSkyService();
