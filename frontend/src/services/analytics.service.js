import api from './api';

class AnalyticsService {
  // Get complete dashboard analytics data
  async getDashboardAnalytics() {
    try {
      const [aircraftStats, defectStats, maintenanceStats, inventoryStats] = await Promise.all([
        api.get('/aircraft/stats/summary'),
        api.get('/defects/stats/summary'),
        api.get('/maintenance/stats/summary'),
        api.get('/inventory/stats/summary')
      ]);

      return {
        success: true,
        data: {
          aircraft: aircraftStats.data.data,
          defects: defectStats.data.data,
          maintenance: maintenanceStats.data.data,
          inventory: inventoryStats.data.data
        }
      };
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error.response?.data || { message: 'Failed to fetch analytics data' };
    }
  }

  // Get defect trends over time
  async getDefectTrends(period = '30d') {
    try {
      const response = await api.get('/defects', { 
        params: { 
          limit: 1000,
          sort: '-reportedDate'
        } 
      });
      
      if (response.data.success) {
        // Process data for charts
        const defects = response.data.data;
        const trends = this.processDefectTrends(defects, period);
        return { success: true, data: trends };
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch defect trends' };
    }
  }

  // Get maintenance cost analysis
  async getMaintenanceCostAnalysis() {
    try {
      const response = await api.get('/maintenance', { 
        params: { 
          limit: 1000,
          sort: '-scheduledDate'
        } 
      });
      
      if (response.data.success) {
        const tasks = response.data.data;
        const costAnalysis = this.processMaintenanceCosts(tasks);
        return { success: true, data: costAnalysis };
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch maintenance costs' };
    }
  }

  // Get fleet utilization data
  async getFleetUtilization() {
    try {
      const [aircraftResponse, defectResponse, maintenanceResponse] = await Promise.all([
        api.get('/aircraft', { params: { limit: 100 } }),
        api.get('/defects', { params: { limit: 1000 } }),
        api.get('/maintenance', { params: { limit: 1000 } })
      ]);

      if (aircraftResponse.data.success && defectResponse.data.success && maintenanceResponse.data.success) {
        const utilization = this.processFleetUtilization(
          aircraftResponse.data.data,
          defectResponse.data.data,
          maintenanceResponse.data.data
        );
        return { success: true, data: utilization };
      }
      throw new Error('Failed to fetch fleet data');
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch fleet utilization' };
    }
  }

  // Process defect trends for charts
  processDefectTrends(defects, period) {
    const now = new Date();
    const periods = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    const days = periods[period] || 30;
    
    const cutoff = new Date(now.setDate(now.getDate() - days));
    const recentDefects = defects.filter(d => new Date(d.reportedDate) >= cutoff);
    
    // Group by date
    const byDate = {};
    recentDefects.forEach(defect => {
      const date = new Date(defect.reportedDate).toISOString().split('T')[0];
      if (!byDate[date]) {
        byDate[date] = { total: 0, bySeverity: { Low: 0, Medium: 0, High: 0, Critical: 0 } };
      }
      byDate[date].total++;
      byDate[date].bySeverity[defect.severity] = (byDate[date].bySeverity[defect.severity] || 0) + 1;
    });

    // Group by category
    const byCategory = {};
    defects.forEach(defect => {
      const cat = defect.category || 'Other';
      if (!byCategory[cat]) {
        byCategory[cat] = { total: 0, bySeverity: { Low: 0, Medium: 0, High: 0, Critical: 0 } };
      }
      byCategory[cat].total++;
      byCategory[cat].bySeverity[defect.severity] = (byCategory[cat].bySeverity[defect.severity] || 0) + 1;
    });

    return {
      byDate,
      byCategory,
      total: recentDefects.length,
      openCount: defects.filter(d => d.status !== 'Closed').length
    };
  }

  // Process maintenance costs
  processMaintenanceCosts(tasks) {
    const byType = {};
    const byMonth = {};
    let totalCost = 0;

    tasks.forEach(task => {
      const cost = task.cost || 0;
      totalCost += cost;

      // By type
      const type = task.type || 'Other';
      if (!byType[type]) {
        byType[type] = { count: 0, totalCost: 0 };
      }
      byType[type].count++;
      byType[type].totalCost += cost;

      // By month
      if (task.scheduledDate) {
        const month = new Date(task.scheduledDate).toISOString().slice(0, 7);
        if (!byMonth[month]) {
          byMonth[month] = { count: 0, totalCost: 0 };
        }
        byMonth[month].count++;
        byMonth[month].totalCost += cost;
      }
    });

    return {
      byType,
      byMonth,
      totalCost,
      averageCost: tasks.length ? totalCost / tasks.length : 0
    };
  }

  // Process fleet utilization
  processFleetUtilization(aircraft, defects, maintenance) {
    const totalAircraft = aircraft.length;
    const activeAircraft = aircraft.filter(a => a.status === 'Active').length;
    const inMaintenance = aircraft.filter(a => a.status === 'Maintenance').length;
    
    const openDefects = defects.filter(d => d.status !== 'Closed').length;
    const highSeverityDefects = defects.filter(d => d.severity === 'High' || d.severity === 'Critical').length;
    
    const scheduledMaintenance = maintenance.filter(m => m.status === 'Scheduled').length;
    const inProgressMaintenance = maintenance.filter(m => m.status === 'In Progress').length;

    // Calculate utilization rate (simplified)
    const utilizationRate = totalAircraft ? (activeAircraft / totalAircraft) * 100 : 0;

    return {
      totalAircraft,
      activeAircraft,
      inMaintenance,
      utilizationRate: Math.round(utilizationRate * 10) / 10,
      openDefects,
      highSeverityDefects,
      scheduledMaintenance,
      inProgressMaintenance,
      completedMaintenance: maintenance.filter(m => m.status === 'Completed').length
    };
  }
}

export default new AnalyticsService();
