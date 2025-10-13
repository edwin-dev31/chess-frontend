import { socketHelper } from '@/lib/helpers/socketHelper';
import { PlayerOnlineDTO } from '@/lib/types/PlayerOnlineDTO';
import { InvitationDto } from '@/lib/types/InvitationDto';
import { Subscription } from './Subscription';
import { GameStartDTO } from '@/lib/types/GameStartDTO';

export class OnlineStatusSubscription implements Subscription {
    constructor(
        private onOnlinePlayers: (players: PlayerOnlineDTO[]) => void,
        private onNotification: (invitation: InvitationDto) => void,
        private onGameStart: (gameStartData: GameStartDTO) => void
    ) {}

    subscribe(): () => void {
        const onlinePlayersUnsubscribe = socketHelper.subscribe('/topic/online-players', (message) => {
            try {
                const players: PlayerOnlineDTO[] = JSON.parse(message.body);
                this.onOnlinePlayers(players);
            } catch (err) {
                console.error('Error parsing online players message:', err);
            }
        });

        const initialOnlinePlayersUnsubscribe = socketHelper.subscribe('/user/queue/online-players', (message) => {
            try {
                const players: PlayerOnlineDTO[] = JSON.parse(message.body);
                this.onOnlinePlayers(players);
            } catch (err) {
                console.error('Error parsing initial online players message:', err);
            }
        });

        const notificationUnsubscribe = socketHelper.subscribe('/user/queue/invitations', (message) => {
            try {
                const invitation: InvitationDto = JSON.parse(message.body);
                this.onNotification(invitation);
            } catch (err) {
                console.error('Error parsing invitation:', err);
            }
        });

        const gameStartUnsubscribe = socketHelper.subscribe('/user/queue/start', (message) => {
            try {
                const gameStartData: GameStartDTO = JSON.parse(message.body);
                if (gameStartData.code) {
                    this.onGameStart(gameStartData);
                } else {    
                    console.warn('OnlineStatusSubscription: Received game start data with undefined gameCode.', gameStartData);
                }
            } catch (err) {
                console.error('Error parsing game start message:', err);
            }
        });
        
        return () => {
            onlinePlayersUnsubscribe();
            initialOnlinePlayersUnsubscribe();
            notificationUnsubscribe();
            gameStartUnsubscribe();
        };
    }
}