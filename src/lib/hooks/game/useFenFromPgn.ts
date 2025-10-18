import { useState, useCallback } from 'react';
import { apiHelper } from '@/lib/helpers/apiHelper';
import { apiRoutes } from '@/lib/constants/apiRoutes';
import useAuth from '../auth/useAuth';

export const useFenFromPgn = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fen, setFen] = useState<string | null>(null);
    const { token } = useAuth();

    const getFenFromPgn = useCallback(async (pgn: string) => {
        if (!token) {
            setError("No authentication token found.");
            return null;
        }

        if (!pgn || pgn.trim().length === 0) {
            setError("PGN cannot be empty.");
            return null;
        }

        setLoading(true);
        setError(null);
        setFen(null);

        try {
            const response = await apiHelper(apiRoutes.game.toFen(), {
                method: 'POST',
                token: token,
                body: pgn,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });

            const fenResult = response?.fen || null;
            setFen(fenResult);
            setLoading(false);
            return fenResult;
        } catch (err: any) {
            setLoading(false);
            const errorMessage = err?.message || 'An unknown error occurred.';
            setError(errorMessage);
            return null;
        }
    }, [token]);

    return { loading, error, fen, getFenFromPgn };
};
