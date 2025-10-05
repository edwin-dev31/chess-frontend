import { useState, useCallback } from 'react';
import { apiHelper } from '@/lib/helpers/apiHelper';
import { apiRoutes } from '@/lib/constants/apiRoutes';
import { PlayerOnlineDTO } from '@/lib/types/PlayerOnlineDTO';
import  useAuth  from '../auth/useAuth';

export const usePlayersOnline = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const fetchPlayers = useCallback(async () => {
        if (!token) {
            setError("No authentication token found.");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await apiHelper<PlayerOnlineDTO[]>(apiRoutes.player.online, {
                method: 'GET',
                token: token,
            });
            setLoading(false);
            return response;
        } catch (err: any) {
            setLoading(false);
            const errorMessage = err?.message || 'An unknown error occurred.';
            setError(errorMessage);
            return null;
        }
    }, [token]);

    return { loading, error, fetchPlayers };
};