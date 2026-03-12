import api from './api';

class MaintenanceService {
  // Get all maintenance tasks with optional filters
  async getAllMaintenance(params = {}) {
    try {
      const response = await api.get('/maintenance', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch maintenance tasks' };
    }
  }

  // Get maintenance by aircraft ID
  async getMaintenanceByAircraft(aircraftId) {
    try {
      const response = await api.get(`/maintenance/aircraft/${aircraftId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch aircraft maintenance' };
    }
  }

  // Get single maintenance task by ID
  async getMaintenanceById(id) {
    try {
      const response = await api.get(`/maintenance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch maintenance task' };
    }
  }

  // Create new maintenance task
  async createMaintenance(taskData) {
    try {
      const response = await api.post('/maintenance', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create maintenance task' };
    }
  }

  // Update maintenance task
  async updateMaintenance(id, taskData) {
    try {
      const response = await api.put(`/maintenance/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update maintenance task' };
    }
  }

  // Update maintenance progress
  async updateProgress(id, progress) {
    try {
      const response = await api.patch(`/maintenance/${id}/progress`, { progress });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update progress' };
    }
  }

  // Delete maintenance task
  async deleteMaintenance(id) {
    try {
      const response = await api.delete(`/maintenance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete maintenance task' };
    }
  }

  // Get maintenance statistics
  async getMaintenanceStats() {
    try {
      const response = await api.get('/maintenance/stats/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch maintenance stats' };
    }
  }
}

export default new MaintenanceService();
