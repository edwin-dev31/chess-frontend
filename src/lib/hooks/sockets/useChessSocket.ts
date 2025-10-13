import { usePlayerStatus } from '@/lib/contexts/PlayerStatusContext';

export const useChessSocket = () => {
    const { fen, moves, color, currentTurnColor, sendMove, setInGame, gameId, gameStart, } = usePlayerStatus();

    return {
        fen,
        moves,
        color,
        currentTurnColor,
        sendMove,
        setInGame,
        gameId,
        gameStart,
    };
};
