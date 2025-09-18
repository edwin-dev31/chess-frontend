import { socketHelper } from './socketHelper';

export const subscribeColor = (
    gameId: string,
    onColor?: (color: any) => void
) => {
    if (!onColor) return;

    socketHelper.subscribe(`/topic/games/${gameId}/color`, (msg) => {
        const body = JSON.parse(msg.body);
        onColor(body.color);
    });
};

export const requestColor = (gameId: string) => {
    socketHelper.send(`/app/games/${gameId}/color`, {});
};
