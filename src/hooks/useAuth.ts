'use client';

import { useContext, useDebugValue } from 'react';
import AuthContext from '@/context/AuthProvider';
import { Auth } from '@/types/Auth';

const useAuth = (): Auth => {
    const context = useContext(AuthContext);
    useDebugValue(context.auth, (auth) => (auth?.username ? 'Logged in' : 'Logged out'));
    return context;
};

export default useAuth;