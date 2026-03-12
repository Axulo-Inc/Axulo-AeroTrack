import api from './api';

class DefectService {
  // Get all defects with optional filters
  async getAllDefects(params = {}) {
    try {
      const response = await api.get('/defects', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch defects' };
    }
  }

  // Get defects by aircraft ID
  async getDefectsByAircraft(aircraftId) {
    try {
      const response = await api.get(`/defects/aircraft/${aircraftId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch aircraft defects' };
    }
  }

  // Get single defect by ID
  async getDefectById(id) {
    try {
      const response = await api.get(`/defects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch defect' };
    }
  }

  // Create new defect
  async createDefect(defectData) {
    try {
      const response = await api.post('/defects', defectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create defect' };
    }
  }

  // Update defect
  async updateDefect(id, defectData) {
    try {
      const response = await api.put(`/defects/${id}`, defectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update defect' };
    }
  }

  // Delete defect
  async deleteDefect(id) {
    try {
      const response = await api.delete(`/defects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete defect' };
    }
  }

  // Get defect statistics
  async getDefectStats() {
    try {
      const response = await api.get('/defects/stats/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch defect stats' };
    }
  }
}

export default new DefectService();
