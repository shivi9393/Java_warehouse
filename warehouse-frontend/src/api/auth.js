import api from './client';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const getCurrentUser = async () => {
    // Assuming there's an endpoint to get current user details, 
    // or we can decode from token if needed. For now, we'll rely on stored user data
    // but this is where you'd add a /users/me endpoint call if available
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
