const axios = require('axios');
const brain = require('brain.js');

class PredictiveMaintenance {
  constructor() {
    this.model = null;
    this.network = new brain.NeuralNetwork({
      activation: 'sigmoid',
      iterations: 5000,
      errorThresh: 0.005,
      learningRate: 0.3,
      hiddenLayers: [8, 5]
    });
    this.apiToken = null;
  }

  // Set authentication token
  setToken(token) {
    this.apiToken = token;
  }

  // Get auth headers for API calls
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  // Prepare training data from historical defects and maintenance
  async prepareTrainingData() {
    try {
      console.log('🔄 Fetching training data from API...');
      
      // Fetch data from your API with authentication
      const [defectsRes, maintenanceRes, aircraftRes] = await Promise.all([
        axios.get('http://localhost:5000/api/defects?limit=1000', { headers: this.getAuthHeaders() }),
        axios.get('http://localhost:5000/api/maintenance?limit=1000', { headers: this.getAuthHeaders() }),
        axios.get('http://localhost:5000/api/aircraft?limit=100', { headers: this.getAuthHeaders() })
      ]);

      const defects = defectsRes.data.data || [];
      const maintenance = maintenanceRes.data.data || [];
      const aircraft = aircraftRes.data.data || [];

      console.log(`📊 Fetched: ${aircraft.length} aircraft, ${defects.length} defects, ${maintenance.length} maintenance records`);

      const trainingData = [];
      
      // Process each aircraft
      for (const ac of aircraft) {
        const acDefects = defects.filter(d => d.aircraft === ac._id);
        const acMaintenance = maintenance.filter(m => m.aircraft === ac._id);
        
        // Features
        const hoursSinceLastMaintenance = ac.hours - (ac.lastMaintenanceHours || 0);
        const defectRate = acDefects.length / Math.max(ac.hours / 1000, 1);
        const highSeverityCount = acDefects.filter(d => d.severity === 'High' || d.severity === 'Critical').length;
        const maintenanceFrequency = acMaintenance.length / Math.max(ac.hours / 1000, 1);
        const recentDefects = acDefects.filter(d => {
          const date = new Date(d.reportedDate);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return date > sixMonthsAgo;
        }).length;
        
        // Calculate risk score (0-1) with nuanced logic
        let riskScore = 0;
        
        // Hours since last maintenance (0-0.25)
        if (hoursSinceLastMaintenance > 800) riskScore += 0.25;
        else if (hoursSinceLastMaintenance > 500) riskScore += 0.15;
        else if (hoursSinceLastMaintenance > 300) riskScore += 0.1;
        
        // Defect rate (0-0.25)
        if (defectRate > 2.0) riskScore += 0.25;
        else if (defectRate > 1.0) riskScore += 0.15;
        else if (defectRate > 0.3) riskScore += 0.1;
        
        // High severity defects (0-0.3)
        if (highSeverityCount > 3) riskScore += 0.3;
        else if (highSeverityCount > 1) riskScore += 0.2;
        else if (highSeverityCount > 0) riskScore += 0.1;
        
        // Recent defects (0-0.2)
        if (recentDefects > 2) riskScore += 0.2;
        else if (recentDefects > 0) riskScore += 0.1;
        
        // Maintenance frequency (0-0.2) - inverted logic
        if (maintenanceFrequency < 0.2) riskScore += 0.2;
        else if (maintenanceFrequency > 1.5) riskScore += 0.1;
        
        // Cap at 1.0
        riskScore = Math.min(riskScore, 1.0);
        
        // Determine risk level with thresholds for better distribution
        let critical = 0, medium = 0, low = 0;
        if (riskScore > 0.5) {
          critical = 1;
        } else if (riskScore > 0.2) {
          medium = 1;
        } else {
          low = 1;
        }
        
        trainingData.push({
          input: {
            hoursSinceLastMaintenance: Math.min(hoursSinceLastMaintenance / 1000, 1),
            defectRate: Math.min(defectRate / 3, 1),
            highSeverityCount: Math.min(highSeverityCount / 5, 1),
            maintenanceFrequency: Math.min(maintenanceFrequency / 2, 1),
            recentDefects: Math.min(recentDefects / 5, 1)
          },
          output: { critical, medium, low }
        });

        // Log first few samples for debugging
        if (aircraft.indexOf(ac) < 5) {
          console.log(`   Sample - ${ac.registration}: hours=${Math.round(hoursSinceLastMaintenance)}h, defects=${acDefects.length}, highSeverity=${highSeverityCount}, recent=${recentDefects}, riskScore=${riskScore.toFixed(2)} -> ${critical ? 'Critical' : medium ? 'Medium' : 'Low'}`);
        }
      }
      
      console.log(`✅ Prepared ${trainingData.length} training samples`);
      return trainingData;
    } catch (error) {
      console.error('❌ Failed to prepare training data:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return [];
    }
  }

  // Train the model
  async trainModel() {
    try {
      console.log('🔄 Preparing training data...');
      const trainingData = await this.prepareTrainingData();
      
      if (trainingData.length === 0) {
        console.error('❌ No training data available');
        return false;
      }

      console.log(`📊 Training with ${trainingData.length} samples`);
      
      // Train the neural network
      this.network.train(trainingData, {
        log: true,
        logPeriod: 10,
        callback: (stats) => {
          console.log(`   Iteration ${stats.iterations}: error = ${stats.error.toFixed(4)}`);
        }
      });

      console.log('✅ Model trained successfully');
      return true;
    } catch (error) {
      console.error('❌ Training error:', error);
      return false;
    }
  }

  // Predict maintenance needs for an aircraft
  async predictAircraftMaintenance(aircraft) {
    if (!this.network) {
      console.log('🔄 Model not trained, training now...');
      await this.trainModel();
    }

    const hoursSinceLastMaintenance = aircraft.hours - (aircraft.lastMaintenanceHours || 0);
    
    // Get defects for this aircraft
    const defectsResponse = await axios.get(`http://localhost:5000/api/defects/aircraft/${aircraft._id}`, {
      headers: this.getAuthHeaders()
    });
    const defects = defectsResponse.data.data || [];
    
    const defectRate = defects.length / Math.max(aircraft.hours / 1000, 1);
    const highSeverityCount = defects.filter(d => d.severity === 'High' || d.severity === 'Critical').length;
    const recentDefects = defects.filter(d => {
      const date = new Date(d.reportedDate);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return date > sixMonthsAgo;
    }).length;
    
    // Get maintenance history
    const maintenanceResponse = await axios.get(`http://localhost:5000/api/maintenance/aircraft/${aircraft._id}`, {
      headers: this.getAuthHeaders()
    });
    const maintenance = maintenanceResponse.data.data || [];
    const maintenanceFrequency = maintenance.length / Math.max(aircraft.hours / 1000, 1);

    const input = {
      hoursSinceLastMaintenance: Math.min(hoursSinceLastMaintenance / 1000, 1),
      defectRate: Math.min(defectRate / 3, 1),
      highSeverityCount: Math.min(highSeverityCount / 5, 1),
      maintenanceFrequency: Math.min(maintenanceFrequency / 2, 1),
      recentDefects: Math.min(recentDefects / 5, 1)
    };

    const output = this.network.run(input);

    // Log raw output for debugging
    console.log(`   Raw output for ${aircraft.registration}: critical=${(output.critical || 0).toFixed(3)}, medium=${(output.medium || 0).toFixed(3)}, low=${(output.low || 0).toFixed(3)}`);

    // Calculate real-world risk factors (independent of neural network)
    const hoursFactor = Math.min(hoursSinceLastMaintenance / 1000, 1);
    const defectFactor = Math.min(defectRate / 2, 1);
    const severityFactor = Math.min(highSeverityCount / 5, 1);
    const recentFactor = Math.min(recentDefects / 3, 1);

    // Weighted real-world risk score (0-1)
    const realRiskScore = (hoursFactor * 0.3) + (defectFactor * 0.2) + (severityFactor * 0.3) + (recentFactor * 0.2);

    // Blend neural network output with real-world calculations
    const criticalVal = output.critical || 0;
    const mediumVal = output.medium || 0;
    const lowVal = output.low || 0;

    const blendedCritical = (criticalVal * 0.6) + (realRiskScore * 0.4);
    const blendedMedium = (mediumVal * 0.6) + ((1 - realRiskScore) * 0.4);

    // Use blended scores for final decision with lower thresholds
    let riskLevel = 'Low';
    let confidence = 0;
    let riskScore = 0;

    if (blendedCritical > 0.2) {
      riskLevel = 'Critical';
      riskScore = blendedCritical;
      confidence = blendedCritical * 100;
    } else if (blendedMedium > 0.15) {
      riskLevel = 'Medium';
      riskScore = blendedMedium;
      confidence = blendedMedium * 100;
    } else {
      riskLevel = 'Low';
      riskScore = lowVal;
      confidence = lowVal * 100;
    }

    // Ensure confidence doesn't exceed 95%
    confidence = Math.min(confidence, 95);

    // Calculate days until maintenance based on real risk factors
    let predictedDays = 365;
    if (realRiskScore > 0.6) predictedDays = 30;
    else if (realRiskScore > 0.3) predictedDays = 180;
    else predictedDays = 365;

    // Predict likely failure type
    const failureTypes = this.predictFailureType(defects);

    return {
      aircraftId: aircraft._id,
      registration: aircraft.registration,
      riskScore: riskScore.toFixed(3),
      riskLevel,
      confidence: Math.round(confidence),
      predictedDaysUntilMaintenance: predictedDays,
      predictedFailureType: failureTypes[0] || 'Unknown',
      alternativeFailureTypes: failureTypes.slice(1, 3),
      recommendations: this.generateRecommendations(riskLevel, failureTypes[0] || 'system', predictedDays)
    };
  }

  // Predict likely failure type based on historical defects
  predictFailureType(defects) {
    const categories = {
      'Mechanical': 0,
      'Hydraulic': 0,
      'Electrical': 0,
      'Avionics': 0,
      'Structural': 0
    };
    
    defects.forEach(d => {
      if (categories.hasOwnProperty(d.category)) {
        categories[d.category]++;
      }
    });
    
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type);
  }

  // Generate recommendations based on prediction
  generateRecommendations(riskLevel, failureType, daysUntilMaintenance) {
    const recommendations = [];
    
    if (riskLevel === 'Critical') {
      recommendations.push(`⚠️ Immediate maintenance required - ${failureType} system at high risk`);
      recommendations.push(`🔧 Schedule inspection within 7 days`);
      recommendations.push(`📋 Order spare parts for ${failureType} components`);
    } else if (riskLevel === 'Medium') {
      recommendations.push(`📅 Plan maintenance within ${daysUntilMaintenance} days`);
      recommendations.push(`🔍 Monitor ${failureType} system closely`);
      recommendations.push(`📊 Review recent defect trends`);
    } else {
      recommendations.push(`✅ Aircraft in good condition`);
      recommendations.push(`📅 Next scheduled maintenance in ${daysUntilMaintenance} days`);
      recommendations.push(`📈 Continue regular monitoring`);
    }
    
    return recommendations;
  }

  // Batch predict for all aircraft
  async predictFleetMaintenance() {
    try {
      const aircraftResponse = await axios.get('http://localhost:5000/api/aircraft?limit=100', {
        headers: this.getAuthHeaders()
      });
      const aircraft = aircraftResponse.data.data;
      
      const predictions = [];
      for (const ac of aircraft) {
        const prediction = await this.predictAircraftMaintenance(ac);
        predictions.push(prediction);
        console.log(`✅ Predicted for ${ac.registration}: Risk = ${prediction.riskLevel}`);
      }
      
      return predictions;
    } catch (error) {
      console.error('Failed to predict fleet maintenance:', error);
      return [];
    }
  }
}

module.exports = PredictiveMaintenance;
