import { useState } from 'react';
import { apiRoutes } from '@/lib/constants/apiRoutes';
import { toast } from 'sonner';
import { apiHelper } from '@/lib/helpers/apiHelper';
import { useAuthStorage } from '@/lib/hooks/auth/useAuthStorage';


export const useStartGame = () => {
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStorage();

    const startGame = async ( time:string) => {
        toast('Are you sure you want to start the game?', {
            action: {
                label: 'Start Game',
                onClick: async () => {
                    setLoading(true);
                    try {
                        const gameId = localStorage.getItem("currentGameId");
                        if (!token) {
                            throw new Error('Authentication token not found.');
                        }
                        const url = apiRoutes.game.start(gameId, time);
                        await apiHelper(url, {
                            method: 'POST',
                            token: token,
                        });
                        toast.success('The game has started!');
                    } catch (err: any) {
                        const errorMessage = err.message || 'Error starting the game';
                        toast.error(errorMessage);
                    } finally {
                        setLoading(false);
                    }
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => { /* Do nothing */ }
            }
        });
    };

    return { startGame, loading };
};