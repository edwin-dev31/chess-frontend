import { socketHelper } from './socketHelper';
import { CreateMoveDTO } from '../../types/CreateMoveDTO';

export const subscribeMoves = (
    gameId: string,
    onMove?: (move: any) => void
) => {
    if (!onMove) return;

    socketHelper.subscribe(`/topic/moves/${gameId}`, (msg) => {
        const body = JSON.parse(msg.body);
        onMove(body);
    });
};

export const sendMove = (gameId: string, moveDto: CreateMoveDTO) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    socketHelper.send(`/app/moves/${gameId}`, moveDto, headers);
};
