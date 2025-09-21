import { socketHelper } from '../../helpers/socketHelper';

export const subscribeFen = (
    gameId: string,
    onFenUpdate?: (fen: string) => void
) => {
    if (!onFenUpdate) return;

    socketHelper.subscribe(`/topic/games/${gameId}/fen`, (msg) => {
        const body = JSON.parse(msg.body);
        if (body.gameId === gameId.toString()) {
            onFenUpdate(body.fen);
        }
    });
};

export const requestFen = (gameId: string) => {
    socketHelper.send(`/app/games/${gameId}/fen`, {});
};
