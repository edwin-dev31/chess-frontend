import { socketHelper } from './socketHelper';

export const subscribeColor = (
    gameId: number,
    onColor?: (color: any) => void
) => {
    if (!onColor) return;

    socketHelper.subscribe(`/topic/games/${gameId}/color`, (msg) => {
        onColor(msg.color);
    });

    socketHelper.send(`/app/games/${gameId}/color`, {});
};

export const requestColor = (gameId: number) => {
    socketHelper.send(`/app/games/${gameId}/color`, {});
};
