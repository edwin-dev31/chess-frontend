import { useState, useEffect } from 'react';
import { apiRoutes } from '@/lib/constants/apiRoutes';
import { toast } from 'sonner';
import { apiHelper } from '@/lib/helpers/apiHelper';
import { useAuthStorage } from '@/lib/hooks/auth/useAuthStorage';
import { useNavigate } from 'react-router-dom';
import { usePlayerStatus } from '@/lib/contexts/PlayerStatusContext';

export const useLeaveGame = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStorage();
  const navigate = useNavigate();
  const { clearGame } = usePlayerStatus();

  const leaveGame = () => {
    const performLeave = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const gameId = localStorage.getItem('currentGameId');
        if (!token) throw new Error('Authentication token not found.');
        if (!gameId) {
            alert("no hay game id")
            clearGame();
            navigate('/app');
            return;
        }

        const url = apiRoutes.game.leave(gameId);
        await apiHelper(url, { method: 'POST', token });

        clearGame();
        navigate('/app');
        toast.success('You have left the game!');
      } catch (err: any) {
        toast.error(err.message || 'Error leaving the game');
      } finally {
        setLoading(false);
      }
    };

    toast('Are you sure you want to leave the game?', {
      action: {
        label: 'Leave Game',
        onClick: performLeave,
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  return { leaveGame, loading };
};

