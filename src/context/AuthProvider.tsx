'use client';

import { createContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { Auth, AuthUser } from '@/types/Auth';

const AuthContext = createContext<Auth>({} as Auth);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const localUser = localStorage.getItem('user');
            const sessionUser = sessionStorage.getItem('user');
            const storedUser =
                (localUser ? JSON.parse(localUser) : null) ??
                (sessionUser ? JSON.parse(sessionUser) : null);

            if (storedUser) setAuth(storedUser);
        } catch {
            // 파싱 에러 등은 무시
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(
        (
            userData: AuthUser,
            accessToken: string,
            refreshToken: string,
            rememberMe = false
        ) => {
            setAuth(userData);
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(userData));
            storage.setItem('ACCESS_TOKEN', accessToken);
            storage.setItem('REFRESH_TOKEN', refreshToken);
        },
        []
    );

    const logout = useCallback(() => {
        setAuth(null);
        localStorage.removeItem('user');
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('ACCESS_TOKEN');
        sessionStorage.removeItem('REFRESH_TOKEN');
    }, []);

    // Provider value를 메모이즈
    const value = useMemo<Auth>(() => {
        return {
            auth,
            user: auth,
            login,
            logout,
            isAuthenticated: !!auth,
            isAdmin: auth?.role === 'ADMIN',
        };
    }, [auth, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;