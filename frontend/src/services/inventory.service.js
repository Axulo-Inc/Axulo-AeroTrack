import api from './api';

class InventoryService {
  // Get all inventory items with optional filters
  async getAllInventory(params = {}) {
    try {
      const response = await api.get('/inventory', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory' };
    }
  }

  // Get single inventory item by ID
  async getInventoryById(id) {
    try {
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory item' };
    }
  }

  // Get inventory by part number
  async getInventoryByPartNumber(partNumber) {
    try {
      const response = await api.get(`/inventory/part/${partNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory item' };
    }
  }

  // Create new inventory item
  async createInventory(itemData) {
    try {
      const response = await api.post('/inventory', itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create inventory item' };
    }
  }

  // Update inventory item
  async updateInventory(id, itemData) {
    try {
      const response = await api.put(`/inventory/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update inventory item' };
    }
  }

  // Update stock level
  async updateStock(id, quantity, operation = 'set') {
    try {
      const response = await api.patch(`/inventory/${id}/stock`, { quantity, operation });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update stock' };
    }
  }

  // Delete inventory item
  async deleteInventory(id) {
    try {
      const response = await api.delete(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete inventory item' };
    }
  }

  // Get inventory statistics
  async getInventoryStats() {
    try {
      const response = await api.get('/inventory/stats/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory stats' };
    }
  }
}

export default new InventoryService();
