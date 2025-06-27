// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('access') || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh') || null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedAccess = localStorage.getItem('access');
        const storedRefresh = localStorage.getItem('refresh');
        if (storedAccess) setToken(storedAccess);
        if (storedRefresh) setRefreshToken(storedRefresh);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post(
                `${config.API_BASE_URL}token/`,
                credentials,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const access = response.data.access;
            const refresh = response.data.refresh;

            setToken(access);
            setRefreshToken(refresh);
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                message: error.response?.data?.detail || "Erreur inconnue"
            };
        }
    };

    const logout = () => {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    };

    const checkAuth = async () => {
        if (!token) return false;

        try {
            await axios.post(
                `${config.API_BASE_URL}token/verify/`,
                { token: token },
                { headers: { 'Content-Type': 'application/json' } }
            );
            return true;
        } catch (error) {
            return await refreshAccessToken();
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(
                `${config.API_BASE_URL}token/refresh/`,
                { refresh: refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const newAccess = response.data.access;
            setToken(newAccess);
            localStorage.setItem('access', newAccess);
            return true;
        } catch (error) {
            logout();
            return false;
        }
    };

    const getToken = () => token;

    return (
        <AuthContext.Provider value={{ token, user, login, logout, checkAuth, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);