import { useState } from 'react';
import { apiRoutes } from '../constants/apiRoutes';
import { useToast } from '../../components/ui/use-toast';
import { apiHelper } from '../apiHelper';
import { javaAPI } from '../axios';
export const useStartGame = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const startGame = async () => {
        const gameId = localStorage.getItem("currentGameId")

        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
            const msg = 'No se encontró el token de autenticación.';
            setError(msg);
            setLoading(false);
            toast({ title: '❌ Error', description: msg });
            return;
        }

        try {
            const url = apiRoutes.game.start(gameId);
            alert(url)
            await javaAPI.post(url, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
          

            toast({
                title: '✅ Partida iniciada',
                description: '¡Que comience el juego! Los colores han sido asignados.',
            });

        } catch (err: any) {
            const errorMessage = err.message || 'Error al iniciar la partida';
            setError(errorMessage);
            toast({
                title: '❌ Error',
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return { startGame, loading, error };
};
