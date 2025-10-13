import { useState, useEffect } from 'react';
import { apiRoutes } from '@/lib/constants/apiRoutes';
import { toast } from 'sonner';
import { apiHelper } from '@/lib/helpers/apiHelper';
import { useAuthStorage } from '@/lib/hooks/auth/useAuthStorage';
import { useNavigate } from 'react-router-dom';
import { usePlayerStatus } from '@/lib/contexts/PlayerStatusContext';

export const useLeaveGame = () => {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { token, setClearGame } = useAuthStorage();
  const navigate = useNavigate();
  const { setOffline } = usePlayerStatus();

  const leaveGame = () => {
    toast('Are you sure you want to leave the game?', {
      action: {
        label: 'Leave Game',
        onClick: () => setConfirmed(true),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  useEffect(() => {
    if (!confirmed) return;

    (async () => {
      setLoading(true);
      try {
        const gameId = localStorage.getItem('currentGameId');
        if (!token) throw new Error('Authentication token not found.');

        const url = apiRoutes.game.leave(gameId);
        await apiHelper(url, { method: 'POST', token });

        navigate('/app');
        setClearGame();
        setOffline();
        toast.success('You have left the game!');
      } catch (err: any) {
        toast.error(err.message || 'Error leaving the game');
      } finally {
        setLoading(false);
        setConfirmed(false);
      }
    })();
  }, [confirmed, token, setClearGame, setOffline, navigate]);

  return { leaveGame, loading };
};
