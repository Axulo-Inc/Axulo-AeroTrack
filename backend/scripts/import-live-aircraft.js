const mongoose = require('mongoose');
const axios = require('axios');
const Aircraft = require('../models/Aircraft');
require('dotenv').config({ path: './.env' });

// OpenSky API
const OPENSKY_API = 'https://opensky-network.org/api/states/all';

// Common aircraft types mapping (simplified)
const aircraftTypes = {
  'A320': 'Airbus A320',
  'B737': 'Boeing 737',
  'B777': 'Boeing 777',
  'B787': 'Boeing 787',
  'A330': 'Airbus A330',
  'A340': 'Airbus A340',
  'A380': 'Airbus A380',
  'CRJ9': 'Bombardier CRJ900',
  'E190': 'Embraer E190',
  'C172': 'Cessna 172',
  'PC12': 'Pilatus PC-12',
  'B190': 'Beechcraft 1900',
  'DH8D': 'De Havilland Dash 8',
};

// Generate realistic registration based on country
function generateRegistration(country, icao24) {
  const countryPrefix = {
    'South Africa': 'ZS-',
    'Botswana': 'A2-',
    'Namibia': 'V5-',
    'Zimbabwe': 'Z-',
    'Mozambique': 'C9-',
    'Kenya': '5Y-',
    'Nigeria': '5N-',
    'Egypt': 'SU-',
    'Morocco': 'CN-',
    'Tunisia': 'TS-',
    'Algeria': '7T-',
    'Libya': '5A-',
    'Sudan': 'ST-',
    'Ethiopia': 'ET-',
    'Tanzania': '5H-',
    'Uganda': '5X-',
    'Rwanda': '9XR-',
    'Ghana': '9G-',
    'Ivory Coast': 'TU-',
    'Senegal': '6V-',
    'Mauritius': '3B-',
    'Seychelles': 'S7-',
    'Madagascar': '5R-',
    'Angola': 'D2-',
    'Zambia': '9J-',
    'Malawi': '7Q-',
    'Botswana': 'A2-',
    'Eswatini': '3DC-',
    'Lesotho': '7P-',
  };
  
  const prefix = countryPrefix[country] || 'ZS-';
  const suffix = icao24.slice(-3).toUpperCase();
  return `${prefix}${suffix}`;
}

// Generate realistic hours
function generateHours() {
  return Math.floor(5000 + Math.random() * 15000);
}

// Generate realistic cycles
function generateCycles(hours) {
  return Math.floor(hours / 1.5);
}

// Determine status based on altitude
function getStatus(altitude) {
  if (altitude > 1000) return 'Active';
  return Math.random() > 0.8 ? 'Maintenance' : 'Active';
}

async function importLiveAircraft() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch live aircraft from OpenSky
    console.log('🔄 Fetching live aircraft data...');
    const response = await axios.get(OPENSKY_API, {
      params: {
        lamin: -35,
        lamax: 5,
        lomin: 10,
        lomax: 35,
      }
    });

    const states = response.data.states || [];
    console.log(`📊 Found ${states.length} live aircraft`);

    let imported = 0;
    let skipped = 0;

    for (const state of states.slice(0, 50)) { // Limit to 50 for now
      const [
        icao24, callsign, originCountry, , , longitude, latitude, altitude, , velocity, heading
      ] = state;

      // Skip if no position
      if (!latitude || !longitude) {
        skipped++;
        continue;
      }

      // Check if aircraft already exists
      const existing = await Aircraft.findOne({ 
        $or: [
          { registration: generateRegistration(originCountry, icao24) },
          { serialNumber: icao24 }
        ]
      });

      if (existing) {
        console.log(`⏭️  Aircraft ${existing.registration} already exists`);
        skipped++;
        continue;
      }

      // Generate aircraft data
      const hours = generateHours();
      const registration = generateRegistration(originCountry, icao24);
      const status = getStatus(altitude);
      
      // Determine type from callsign or default
      let type = 'B738'; // Default
      if (callsign) {
        if (callsign.includes('SAA') || callsign.includes('SAX')) type = 'A320';
        else if (callsign.includes('BAW')) type = 'B772';
        else if (callsign.includes('KQA')) type = 'B788';
        else if (callsign.includes('ETH')) type = 'B788';
        else if (callsign.includes('UAE')) type = 'A388';
        else if (callsign.includes('QTR')) type = 'B77L';
      }

      // Create aircraft record
      const aircraft = new Aircraft({
        registration,
        type,
        manufacturer: type.startsWith('A') ? 'Airbus' : 'Boeing',
        model: type,
        serialNumber: icao24,
        status,
        hours,
        cycles: generateCycles(hours),
        lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        notes: `Imported from live tracking. Origin: ${originCountry || 'Unknown'}`
      });

      await aircraft.save();
      imported++;
      console.log(`✅ Imported ${registration} (${type}) - ${status}`);
    }

    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Imported: ${imported} aircraft`);
    console.log(`   ⏭️  Skipped: ${skipped} aircraft`);
    console.log(`   📊 Total in DB: ${await Aircraft.countDocuments()}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

importLiveAircraft();

