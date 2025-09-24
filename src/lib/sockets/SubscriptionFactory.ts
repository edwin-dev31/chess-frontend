import { Color } from '../types/Definitions';
import { InvitationDto } from '../types/InvitationDto';
import { PlayerStatus } from '../types/PlayerStatus';
import { PlayerOnlineDTO } from '../types/PlayerOnlineDTO';
import { CompositeSubscription } from './subscriptions/CompositeSubscription';
import { InGameSubscription } from './subscriptions/InGameSubscription';
import { OnlineStatusSubscription } from './subscriptions/OnlineStatusSubscription';
import { Subscription } from './subscriptions/Subscription';

export interface FactoryParams {
    onOnlinePlayers: (players: PlayerOnlineDTO[]) => void;
    onFenUpdate: (fen: string) => void;
    onMove: (move: any) => void;
    onCurrentTurnColor: (color: Color) => void;
    onPlayerColor: (color: Color) => void; 
    onNotification: (invitation: InvitationDto) => void;
    onGameStart: (gameId: string) => void;
    gameId?: string;
}

export class SubscriptionFactory {
    public static create(
        status: PlayerStatus,
        params: FactoryParams
    ): Subscription | null {
        console.log('SubscriptionFactory: Creating subscription for status:', status, 'gameId:', params.gameId);
        switch (status) {
            case PlayerStatus.ONLINE:
                console.log('SubscriptionFactory: Returning OnlineStatusSubscription');
                return new OnlineStatusSubscription(
                    params.onOnlinePlayers,
                    params.onNotification,
                    params.onGameStart,
                    params.onCurrentTurnColor
                );
            case PlayerStatus.IN_GAME:
                if (params.gameId) {
                    console.log('SubscriptionFactory: Returning CompositeSubscription for IN_GAME' + params.gameId);
                    return new CompositeSubscription([
                        new InGameSubscription(params.gameId, params.onFenUpdate, params.onMove, params.onCurrentTurnColor),
                        new OnlineStatusSubscription(
                            params.onOnlinePlayers,
                            params.onNotification,
                            params.onGameStart,
                            params.onCurrentTurnColor
                        ),
                    ]);
                }
                console.log('SubscriptionFactory: gameId is missing for IN_GAME status, returning null');
                return null;
            case PlayerStatus.OFFLINE:
            default:
                console.log('SubscriptionFactory: Returning null for OFFLINE or default status');
                return null;
        }
    }
}