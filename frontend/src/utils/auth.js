// Auth utility functions
export const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('Getting token from localStorage:', token);
  return token;
};

export const setToken = (token) => {
  console.log('Setting token in localStorage:', token);
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  console.log('Getting user from localStorage:', user);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  console.log('Setting user in localStorage:', user);
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const token = getToken();
  const authenticated = !!token;
  console.log('Authentication check - Token exists:', authenticated);
  return authenticated;
};

// Clear all auth data
export const clearAuth = () => {
  removeToken();
  removeUser();
};