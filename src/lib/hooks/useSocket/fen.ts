import { socketHelper } from './socketHelper';

export const subscribeFen = (
    gameId: number,
    onFenUpdate?: (fen: string) => void
) => {
    if (!onFenUpdate) return;

    socketHelper.subscribe(`/topic/games/${gameId}/fen`, (msg) => {
        if (msg.gameId === gameId.toString()) {
            onFenUpdate(msg.fen);
        }
    });

    socketHelper.send(`/app/games/${gameId}/fen`, {});
};

export const requestFen = (gameId: number) => {
    socketHelper.send(`/app/games/${gameId}/fen`, {});
};
