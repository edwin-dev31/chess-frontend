import { useState, useCallback } from 'react';
import { apiHelper } from '@/lib/helpers/apiHelper';
import { apiRoutes } from '@/lib/constants/apiRoutes';
import useAuth from '../auth/useAuth';
import { GameRecord } from '@/lib/types/Definitions';

export const useGameSummary = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<GameRecord[]>([]);
    const { token } = useAuth();

    const fetchSummary = useCallback(async (): Promise<GameRecord[]> => {
        if (!token) {
            setError("No authentication token found.");
            return [];
        }

        setLoading(true);
        setError(null);

        try {
            const response = await apiHelper(apiRoutes.player.summary, {
                method: 'GET',
                token: token,
            });

            const data = Array.isArray(response) ? response : [];

            setSummary(data);
            setLoading(false);
            return data;
        } catch (err: any) {
            setLoading(false);
            const errorMessage = err?.message || 'An unknown error occurred.';
            setError(errorMessage);
            return [];
        }
    }, [token]);

    return { loading, error, summary, fetchSummary };
};
