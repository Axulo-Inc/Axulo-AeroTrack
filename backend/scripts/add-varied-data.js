const mongoose = require('mongoose');
const Aircraft = require('../models/Aircraft');
const Defect = require('../models/Defect');
const Maintenance = require('../models/Maintenance');
require('dotenv').config({ path: './.env' });

// Helper function to get random date in range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to get random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Defect categories and severities
const defectCategories = ['Mechanical', 'Hydraulic', 'Electrical', 'Avionics', 'Structural'];
const severities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Open', 'Closed', 'In Progress'];

// Maintenance types
const maintenanceTypes = ['Scheduled', 'Unscheduled', 'Inspection', 'Repair', 'Overhaul'];
const maintenanceStatus = ['Completed', 'In Progress', 'Scheduled'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

async function addVariedData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all aircraft
    const aircraft = await Aircraft.find();
    console.log(`📊 Found ${aircraft.length} aircraft`);

    let defectsAdded = 0;
    let maintenanceAdded = 0;

    // For each aircraft, add varied defects and maintenance
    for (let i = 0; i < aircraft.length; i++) {
      const ac = aircraft[i];
      
      // Determine risk profile based on registration (use last char to distribute)
      const lastChar = ac.registration.slice(-1);
      const riskProfile = lastChar.charCodeAt(0) % 3; // 0=Low, 1=Medium, 2=High
      
      console.log(`\n🔄 Processing ${ac.registration} (Risk profile: ${riskProfile === 0 ? 'Low' : riskProfile === 1 ? 'Medium' : 'High'})`);

      // Number of defects based on risk profile
      const defectCount = riskProfile === 0 ? Math.floor(Math.random() * 2) : // 0-1 defects for low risk
                          riskProfile === 1 ? Math.floor(Math.random() * 3) + 1 : // 1-3 defects for medium risk
                          Math.floor(Math.random() * 4) + 3; // 3-6 defects for high risk

      // Number of maintenance tasks based on risk profile
      const maintenanceCount = riskProfile === 0 ? Math.floor(Math.random() * 2) + 1 : // 1-2 tasks for low risk
                              riskProfile === 1 ? Math.floor(Math.random() * 3) + 2 : // 2-4 tasks for medium risk
                              Math.floor(Math.random() * 4) + 3; // 3-6 tasks for high risk

      console.log(`   Adding ${defectCount} defects and ${maintenanceCount} maintenance tasks`);

      // Add defects
      for (let d = 0; d < defectCount; d++) {
        const severity = riskProfile === 0 ? randomItem(['Low', 'Medium']) :
                        riskProfile === 1 ? randomItem(['Low', 'Medium', 'High']) :
                        randomItem(['Medium', 'High', 'Critical']);
        
        const date = randomDate(new Date('2024-01-01'), new Date('2026-03-01'));
        const status = randomItem(statuses);
        
        const defect = new Defect({
          aircraft: ac._id,
          aircraftRegistration: ac.registration,
          description: `${randomItem(defectCategories)} system ${randomItem(['failure', 'anomaly', 'wear detected', 'leak', 'error'])}`,
          severity,
          status,
          category: randomItem(defectCategories),
          ataChapter: String(Math.floor(Math.random() * 90) + 10),
          reportedDate: date,
          resolvedDate: status === 'Closed' ? new Date(date.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
          downtime: Math.floor(Math.random() * 48) + 2, // 2-50 hours
          cost: Math.floor(Math.random() * 15000) + 1000,
        });
        
        await defect.save();
        defectsAdded++;
      }

      // Add maintenance tasks
      for (let m = 0; m < maintenanceCount; m++) {
        const scheduledDate = randomDate(new Date('2024-01-01'), new Date('2026-06-01'));
        const completed = Math.random() > 0.3; // 70% completed
        const completedDate = completed ? new Date(scheduledDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000) : null;
        
        const maintenance = new Maintenance({
          aircraft: ac._id,
          aircraftRegistration: ac.registration,
          task: `${randomItem(['100-hour', 'Annual', 'Engine', 'Landing gear', 'Avionics'])} ${randomItem(['inspection', 'overhaul', 'check', 'service', 'repair'])}`,
          type: randomItem(maintenanceTypes),
          status: completedDate ? 'Completed' : randomItem(['Scheduled', 'In Progress']),
          priority: randomItem(priorities),
          scheduledDate,
          completedDate,
          estimatedHours: Math.floor(Math.random() * 24) + 4,
          actualHours: completedDate ? Math.floor(Math.random() * 24) + 4 : null,
          progress: completedDate ? 100 : Math.floor(Math.random() * 80) + 20,
          cost: Math.floor(Math.random() * 50000) + 5000,
        });
        
        await maintenance.save();
        maintenanceAdded++;
      }

      // Update aircraft last maintenance date based on most recent completed maintenance
      const lastMaintenance = await Maintenance.findOne({ 
        aircraft: ac._id, 
        status: 'Completed' 
      }).sort({ completedDate: -1 });
      
      if (lastMaintenance) {
        ac.lastMaintenance = lastMaintenance.completedDate;
        await ac.save();
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Added ${defectsAdded} defects`);
    console.log(`   ✅ Added ${maintenanceAdded} maintenance tasks`);
    
    // Get updated stats
    const defectStats = await Defect.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    const maintenanceStats = await Maintenance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📈 Defect distribution:');
    defectStats.forEach(s => console.log(`   ${s._id}: ${s.count}`));
    
    console.log('\n📈 Maintenance status:');
    maintenanceStats.forEach(s => console.log(`   ${s._id}: ${s.count}`));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

addVariedData();
