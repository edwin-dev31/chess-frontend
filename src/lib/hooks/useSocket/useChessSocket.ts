import { useEffect, useRef, useState } from 'react';
import { socketHelper } from './socketHelper';
import { CreateMoveDTO } from '../../types/CreateMoveDTO';
import { subscribeFen, requestFen } from './fen';
import { subscribeMoves, sendMove as sendMoveHelper } from './moves';
import { subscribeColor, requestColor as requestColorHelper } from './color';

type UseChessSocketProps = {
    gameId: number;
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
    const [connected, setConnected] = useState(false);
    const unsubscribeRefs = useRef<(() => void)[]>([]);

    useEffect(() => {
        const checkConnection = () => {
            if (socketHelper.isConnected()) {
                setConnected(true);
            } else {
                setConnected(false);
                socketHelper.connect();
            }
        };

        checkConnection();

        const connectionCheckInterval = setInterval(checkConnection, 2000); // Check every 2 seconds

        const handleVisibilityChange = () => {
            if (
                document.visibilityState === 'visible' &&
                !socketHelper.isConnected()
            ) {
                console.log(
                    'Page became visible, attempting to reconnect WebSocket.'
                );
                socketHelper.connect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(connectionCheckInterval);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
            socketHelper.disconnect();
        };
    }, []);

    useEffect(() => {
        if (connected) {
            unsubscribeRefs.current.forEach((unsub) => unsub());
            unsubscribeRefs.current = [];

            const unsubFen = subscribeFen(gameId, onFenUpdate);
            if (unsubFen) unsubscribeRefs.current.push(unsubFen);

            const unsubMoves = subscribeMoves(gameId, onMove);
            if (unsubMoves) unsubscribeRefs.current.push(unsubMoves);

            const unsubColor = subscribeColor(gameId, onColor);
            if (unsubColor) unsubscribeRefs.current.push(unsubColor);
        } else {
            unsubscribeRefs.current.forEach((unsub) => unsub());
            unsubscribeRefs.current = [];
        }

        return () => {
            unsubscribeRefs.current.forEach((unsub) => unsub());
            unsubscribeRefs.current = [];
        };
    }, [connected, gameId, onFenUpdate, onMove, onColor]); // Dependencies for subscriptions

    return {
        sendMove: (moveDto: CreateMoveDTO) => sendMoveHelper(gameId, moveDto),
        requestFen: () => requestFen(gameId),
        requestColor: () => requestColorHelper(gameId),
    };
};
