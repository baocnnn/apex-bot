// Authentication service - handles login, logout, token storage

export const authService = {
  // Store token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Remove token (logout)
  removeToken() {
    localStorage.removeItem('token');
  },

  // Check if user is logged in
  isAuthenticated() {
    return !!this.getToken();
  }
};