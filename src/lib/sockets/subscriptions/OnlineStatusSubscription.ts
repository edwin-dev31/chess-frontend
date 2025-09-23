import { socketHelper } from '../../helpers/socketHelper';
import { PlayerOnlineDTO } from '../../types/PlayerOnlineDTO';
import { InvitationDto } from '../../types/InvitationDto';
import { Subscription } from './Subscription';

export class OnlineStatusSubscription implements Subscription {
    constructor(
        private onOnlinePlayers: (players: PlayerOnlineDTO[]) => void,
        private onNotification: (invitation: InvitationDto) => void
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

        const notificationUnsubscribe = socketHelper.subscribe('/user/queue/invitations', (message) => {
            try {
                const invitation: InvitationDto = JSON.parse(message.body);
                this.onNotification(invitation);
            } catch (err) {
                console.error('Error parsing invitation:', err);
            }
        });

        return () => {
            onlinePlayersUnsubscribe();
            notificationUnsubscribe();
        };
    }
}