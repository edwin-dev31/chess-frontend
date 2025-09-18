import { useState } from 'react';
import { apiHelper } from '../helpers/apiHelper';
import { useAuthStorage } from './useAuthStorage';
import { useToast } from '../../components/ui/use-toast';

interface AuthResponse {
    token: string;
}

interface AuthError {
    message: string;
    // Add other error properties if available from your API
}

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const { token, setAuth, clearAuth } = useAuthStorage();
    const { toast } = useToast();

    const isAuthenticated = !!token;

    const login = async (
        email: string,
        password: string
    ): Promise<string | null> => {
        setLoading(true);
        try {
            const response = await apiHelper<AuthResponse>('/auth/login', {
                method: 'POST',
                body: { email, password },
            });
            setAuth(response.token);
            return response.token;
        } catch (err: any) {
            const authError: AuthError = err;
            const errorMessage = authError.message || 'Login failed. Please check your credentials.';
            toast({
                title: '❌ Error',
                description: errorMessage,
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        username: string,
        email: string,
        password: string
    ): Promise<string | null> => {
        setLoading(true);
        try {
            const response = await apiHelper<AuthResponse>(
                '/auth/register',
                { method: 'POST', body: { username, email, password } }
            );
            setAuth(response.token);
            return response.token;
        } catch (err: any) {
            const authError: AuthError = err;
            const errorMessage = authError.message || 'Registration failed. Please try again.';
            toast({
                title: '❌ Error',
                description: errorMessage,
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        clearAuth();
    };

    return { login, register, logout, loading, token, isAuthenticated };
};

export default useAuth;
