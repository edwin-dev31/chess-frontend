import { useState } from 'react';
import { apiHelper } from '@/lib/helpers/apiHelper';
import { useAuthStorage } from '@/lib/hooks/auth/useAuthStorage';
import { useToast } from '@/components/ui/use-toast';
import { apiRoutes } from '@/lib/constants/apiRoutes';

interface AuthResponse {
    token: string;
}

interface AuthError {
    message: string;
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
            const response = await apiHelper<AuthResponse>(apiRoutes.auth.login, {
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
                apiRoutes.auth.register,
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

    const logout = async () => {
        if (!token) {
            clearAuth();
            return;
        }

        setLoading(true);
        try {
            await apiHelper(apiRoutes.auth.logout, {
                method: 'POST',
                token: token,
                
            });

            toast({
                title: '👋 Logout successful',
                description: 'You have been disconnected.',
            });
        } catch (err: any) {
            const errorMessage = err?.message || 'Logout failed. Please try again.';
            toast({
                title: '❌ Error',
                description: errorMessage,
            });
        } finally {
            clearAuth();
            setLoading(false);
        }
    };

    return { login, register, logout, loading, token, isAuthenticated };
};

export default useAuth;
