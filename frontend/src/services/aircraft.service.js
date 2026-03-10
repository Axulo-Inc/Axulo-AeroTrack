import api from './api';

class AircraftService {
  // Get all aircraft with optional filters
  async getAllAircraft(params = {}) {
    try {
      const response = await api.get('/aircraft', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch aircraft' };
    }
  }

  // Get single aircraft by ID
  async getAircraftById(id) {
    try {
      const response = await api.get(`/aircraft/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch aircraft' };
    }
  }

  // Create new aircraft
  async createAircraft(aircraftData) {
    try {
      const response = await api.post('/aircraft', aircraftData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create aircraft' };
    }
  }

  // Update aircraft
  async updateAircraft(id, aircraftData) {
    try {
      const response = await api.put(`/aircraft/${id}`, aircraftData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update aircraft' };
    }
  }

  // Delete aircraft
  async deleteAircraft(id) {
    try {
      const response = await api.delete(`/aircraft/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete aircraft' };
    }
  }

  // Get aircraft statistics
  async getAircraftStats() {
    try {
      const response = await api.get('/aircraft/stats/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  }
}

export default new AircraftService();
