import { socketHelper } from './socketHelper';
import { CreateMoveDTO } from '../../types/CreateMoveDTO';

export const subscribeMoves = (
    gameId: number,
    onMove?: (move: any) => void
) => {
    if (!onMove) return;

    socketHelper.subscribe(`/topic/moves/${gameId}`, (msg) => {
        onMove(msg);
    });
};

export const sendMove = (gameId: number, moveDto: CreateMoveDTO) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    socketHelper.send(`/app/moves/${gameId}`, moveDto, headers);
};
