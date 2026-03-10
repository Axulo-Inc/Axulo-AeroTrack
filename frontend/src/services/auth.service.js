import api from './api';

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        // Update stored user data
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password change failed' };
    }
  }
}

export default new AuthService();
