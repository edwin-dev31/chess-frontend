import { useState } from 'react';
import { apiRoutes } from '../constants/apiRoutes';
import { useToast } from '../../components/ui/use-toast';
import { apiHelper } from '../helpers/apiHelper';
import { useAuthStorage } from './useAuthStorage';

export const useStartGame = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { token } = useAuthStorage();

    const startGame = async () => {
        const gameId = localStorage.getItem("currentGameId")

        setLoading(true);

        if (!token) {
            const msg = 'Authentication token not found.';
            toast({ title: '❌ Error', description: msg });
            setLoading(false);
            return;
        }

        try {
            const url = apiRoutes.game.start(gameId);
            alert(url)
            await apiHelper(url, {
                method: 'POST',
                token: token,
            });
          

            toast({
                title: '✅ Game Started',
                description: 'The game has started! Colors have been assigned.',
            });

        } catch (err: any) {
            const errorMessage = err.message || 'Error starting the game';
            toast({
                title: '❌ Error',
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return { startGame, loading };
};
