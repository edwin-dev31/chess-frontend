import { PlayerStatus } from '../types/PlayerStatus';
import { PlayerOnlineDTO } from '../types/PlayerOnlineDTO';
import { Subscription } from './subscriptions/Subscription';
import { OnlineStatusSubscription } from './subscriptions/OnlineStatusSubscription';
import { InGameSubscription } from './subscriptions/InGameSubscription';
import { CompositeSubscription } from './subscriptions/CompositeSubscription';
import { InvitationDto } from '../types/InvitationDto';

export interface FactoryParams {
    onOnlinePlayers: (players: PlayerOnlineDTO[]) => void;
    onFenUpdate: (fen: string) => void;
    onMove: (move: any) => void;
    onColor: (color: any) => void;
    onNotification: (invitation: InvitationDto) => void;
    gameId?: string;
}

export class SubscriptionFactory {
    public static create(
        status: PlayerStatus,
        params: FactoryParams
    ): Subscription | null {
        switch (status) {
            case PlayerStatus.ONLINE:
                return new OnlineStatusSubscription(params.onOnlinePlayers, params.onNotification);
            case PlayerStatus.IN_GAME:
                if (params.gameId) {
                    return new CompositeSubscription([
                        new InGameSubscription(params.gameId, params.onFenUpdate, params.onMove, params.onColor),
                        new OnlineStatusSubscription(params.onOnlinePlayers, params.onNotification),
                    ]);
                }
                return null;
            case PlayerStatus.OFFLINE:
            default:
                return null;
        }
    }
}