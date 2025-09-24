import { CreateMoveDTO } from '@/lib/types/CreateMoveDTO';
import { usePlayerStatus } from '@/lib/contexts/PlayerStatusContext';

export const useChessSocket = () => {
    const { fen, moves, color, sendMove, setInGame } = usePlayerStatus();

    return {
        fen,
        moves,
        color,
        sendMove,
        setInGame,
    };
};
