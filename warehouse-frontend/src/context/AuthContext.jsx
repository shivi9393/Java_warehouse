import { createContext, useState, useEffect, useContext } from 'react';
import { login as loginApi, register as registerApi } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token and user on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginApi(email, password);
            // Assuming response has token and user object. Adjust based on actual API response structure
            // The backend returns: { token: "...", user: { ... } } based on AuthenticationResponse dto
            const { token: newToken, ...userData } = data; // Adjust if user is nested or flat

            // We might need to fetch user details if not fully returned in login response
            // But typically AuthResponse contains token. Let's assume we decode or fetch

            // Let's assume the response structure is { token: "...", role: "...", organizationId: ... }
            // We might need a way to get full user object. For now let's store what we have.

            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Store user data
            // Construct a user object from response or fetch it
            // Using a placeholder for now compatible with what backend likely returns
            const userObj = {
                email,
                role: data.role,
                organizationId: data.organizationId
            };

            localStorage.setItem('user', JSON.stringify(userObj));
            setUser(userObj);

            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const response = await registerApi(data);
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
