import { Color } from '@/lib/types/Definitions';
import { InvitationDto } from '@/lib/types/InvitationDto';
import { PlayerStatus } from '@/lib/types/PlayerStatus';
import { PlayerOnlineDTO } from '@/lib/types/PlayerOnlineDTO';
import { CompositeSubscription } from './subscriptions/CompositeSubscription';
import { InGameSubscription } from './subscriptions/InGameSubscription';
import { OnlineStatusSubscription } from './subscriptions/OnlineStatusSubscription';
import { Subscription } from './subscriptions/Subscription';
import { ChatMessage } from '@/lib/types/ChatMessageDTO';

export interface FactoryParams {
    onOnlinePlayers: (players: PlayerOnlineDTO[]) => void;
    onFenUpdate: (fen: string) => void;
    onMove: (move: any) => void;
    onCurrentTurnColor: (color: Color) => void;
    onNotification: (invitation: InvitationDto) => void;
    onGameStart: (gameId: string, color: Color) => void;
    onChatMessage: (message: ChatMessage) => void;
    gameId?: string;
}

export class SubscriptionFactory {
    public static create(
        status: PlayerStatus,
        params: FactoryParams
    ): Subscription | null {
        switch (status) {
            case PlayerStatus.ONLINE:
                return new OnlineStatusSubscription(
                    params.onOnlinePlayers,
                    params.onNotification,
                    params.onGameStart
                );
            case PlayerStatus.IN_GAME:
                if (params.gameId) {
                    return new CompositeSubscription([
                        new InGameSubscription(
                            params.gameId, 
                            params.onFenUpdate, 
                            params.onMove, 
                            params.onCurrentTurnColor,
                            params.onChatMessage
                        ),
                        new OnlineStatusSubscription(
                            params.onOnlinePlayers,
                            params.onNotification,
                            params.onGameStart
                        ),
                    ]);
                }
                return null;
            case PlayerStatus.OFFLINE:
            default:
                return null;
        }
    }
}