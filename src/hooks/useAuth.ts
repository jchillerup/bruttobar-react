import { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const TOKEN_KEY = 'bruttobar__jwt';

export function useAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(TOKEN_KEY);
        if (stored) {
            setToken(stored);
        }
        setAuthLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        const res = await fetch(getApiUrl('/auth/token'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            throw new Error('Authentication failed');
        }

        const token = await res.text();
        localStorage.setItem(TOKEN_KEY, token);
        setToken(token);
        return token;
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
    };

    return { token, authLoading, login, logout };
}
