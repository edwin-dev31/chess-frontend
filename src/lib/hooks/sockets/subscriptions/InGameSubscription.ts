import { socketHelper } from '@/lib/helpers/socketHelper';
import { Subscription } from './Subscription';
import { Color } from '@/lib/types/Definitions';
import { ChatMessage } from '@/lib/types/ChatMessageDTO';
import { GameStatusDTO } from '@/lib/types/GameStatusDTO';

export class InGameSubscription implements Subscription {
    constructor(
        private gameId: string,
        private onFenUpdate: (fen: string) => void,
        private onMove: (move: any) => void,
        private onCurrentTurnColor: (color: Color) => void,
        private onChatMessage: (message: ChatMessage) => void,
        private onError: (error: any) => void,
        private onStatusGame: (status: GameStatusDTO) => void
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
            this.onCurrentTurnColor(body.color);
        });

        const statusGame = socketHelper.subscribe(`/topic/games/${this.gameId}/status`, (msg) => {
            const body = JSON.parse(msg.body);
            this.onStatusGame(body);
        });
        const chatUnsubscribe = socketHelper.subscribe(`/user/queue/messages`, (msg) => {
            const body = JSON.parse(msg.body);
            this.onChatMessage(body);
        });

        const errorUnsubscribe = socketHelper.subscribe(`/user/queue/errors`, (msg) => {
            const body = JSON.parse(msg.body);
            this.onError(body);
        });

        socketHelper.send(`/app/games/${this.gameId}/fen`, {});
        socketHelper.send(`/app/games/${this.gameId}/color`, {});

        return () => {
            fenUnsubscribe();
            movesUnsubscribe();
            colorUnsubscribe();
            chatUnsubscribe();
            errorUnsubscribe();
            statusGame()
        };
    }
}
