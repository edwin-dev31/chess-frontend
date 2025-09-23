import { socketHelper } from '../../helpers/socketHelper';
import { Subscription } from './Subscription';

export class InGameSubscription implements Subscription {
    constructor(
        private gameId: string,
        private onFenUpdate: (fen: string) => void,
        private onMove: (move: any) => void,
        private onColor: (color: any) => void
    ) {}

    subscribe(): () => void {
        const fenUnsubscribe = socketHelper.subscribe(`/topic/games/${this.gameId}/fen`, (msg) => {
            const body = JSON.parse(msg.body);
            if (body.gameId === this.gameId.toString()) {
                this.onFenUpdate(body.fen);
            }
        });

        const movesUnsubscribe = socketHelper.subscribe(`/topic/moves/${this.gameId}`, (msg) => {
            const body = JSON.parse(msg.body);
            this.onMove(body);
        });

        const colorUnsubscribe = socketHelper.subscribe(`/topic/games/${this.gameId}/color`, (msg) => {
            const body = JSON.parse(msg.body);
            this.onColor(body.color);
        });

        socketHelper.send(`/app/games/${this.gameId}/fen`, {});
        socketHelper.send(`/app/games/${this.gameId}/color`, {});

        return () => {
            fenUnsubscribe();
            movesUnsubscribe();
            colorUnsubscribe();
        };
    }
}
