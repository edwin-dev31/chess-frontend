import { useEffect } from 'react';
import { socketHelper } from '@/lib/helpers/socketHelper';
import { CreateMoveDTO } from '@/lib/types/CreateMoveDTO';
import { subscribeFen, requestFen } from '@/lib/hooks/socket/useSocketFen';
import { subscribeMoves, sendMove as sendMoveHelper } from '@/lib/hooks/socket/useSocketMoves';
import { subscribeColor, requestColor as requestColorHelper } from '@/lib/hooks/socket/useSocketColor';

type UseChessSocketProps = {
    gameId: string;
    onFenUpdate?: (fen: string) => void;
    onMove?: (move: any) => void;
    onColor?: (color: any) => void;
};

export const useChessSocket = ({
    gameId,
    onFenUpdate,
    onMove,
    onColor,
}: UseChessSocketProps) => {
    useEffect(() => {
        socketHelper.connect(() => {
            subscribeFen(gameId, onFenUpdate);
            subscribeMoves(gameId, onMove);
            subscribeColor(gameId, onColor);

            requestFen(gameId);
            requestColorHelper(gameId);
        });

        return () => {
            //socketHelper.disconnect();
        };
    }, [gameId, onFenUpdate, onMove, onColor]);

    return {
        sendMove: (moveDto: CreateMoveDTO) => sendMoveHelper(gameId, moveDto),
        requestFen: () => requestFen(gameId),
        requestColor: () => requestColorHelper(gameId),
    };
};
