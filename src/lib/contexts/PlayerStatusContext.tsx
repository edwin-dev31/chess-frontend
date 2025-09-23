import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PlayerStatus } from '../types/PlayerStatus';
import { PlayerOnlineDTO } from '../types/PlayerOnlineDTO';
import { SubscriptionFactory, FactoryParams } from '../sockets/SubscriptionFactory';
import { useProfile } from '../hooks/player/useProfile';
import { socketHelper } from '../helpers/socketHelper';
import { CreateMoveDTO } from '../types/CreateMoveDTO';
import { InvitationDto } from '../types/InvitationDto';

interface PlayerStatusContextType {
    status: PlayerStatus;
    gameId: string | null;
    onlinePlayers: PlayerOnlineDTO[];
    fen: string | null;
    moves: any[];
    color: string | null;
    lastInvitation: InvitationDto | null;
    setOnline: () => void;
    setInGame: (gameId: string) => void;
    setOffline: () => void;
    sendMove: (moveDto: CreateMoveDTO) => void;
}

const PlayerStatusContext = createContext<PlayerStatusContextType | undefined>(undefined);

export const PlayerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<PlayerStatus>(PlayerStatus.OFFLINE);
    const [gameId, setGameId] = useState<string | null>(null);
    const [onlinePlayers, setOnlinePlayers] = useState<PlayerOnlineDTO[]>([]);
    const [fen, setFen] = useState<string | null>(null);
    const [moves, setMoves] = useState<any[]>([]);
    const [color, setColor] = useState<string | null>(null);
    const [lastInvitation, setLastInvitation] = useState<InvitationDto | null>(null);

    const { profile } = useProfile();

    const filteredOnlinePlayers = useMemo(() => {
        if (!profile) {
            return onlinePlayers;
        }
        return onlinePlayers.filter(player => player.id !== profile.id);
    }, [onlinePlayers, profile]);

    useEffect(() => {
        const handleConnect = () => {
            const factoryParams: FactoryParams = {
                onOnlinePlayers: setOnlinePlayers,
                onFenUpdate: setFen,
                onMove: (move: any) => setMoves(prev => [...prev, move]),
                onColor: setColor,
                onNotification: setLastInvitation,
                gameId: gameId || undefined,
            };

            const subscription = SubscriptionFactory.create(status, factoryParams);
            const unsubscribe = subscription?.subscribe();

            return () => {
                unsubscribe?.();
            };
        };

        socketHelper.onConnect(handleConnect);

        if (!socketHelper.isConnected()) {
            socketHelper.connect();
        } else {
            handleConnect();
        }

        return () => {
            socketHelper.offConnect(handleConnect);
        }
    }, [status, gameId]);

    const sendMove = (moveDto: CreateMoveDTO) => {
        if (gameId) {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            socketHelper.send(`/app/moves/${gameId}`, moveDto, headers);
        }
    };

    const contextValue: PlayerStatusContextType = {
        status,
        gameId,
        onlinePlayers: filteredOnlinePlayers,
        fen,
        moves,
        color,
        lastInvitation,
        setOnline: () => setStatus(PlayerStatus.ONLINE),
        setInGame: (newGameId: string) => {
            setGameId(newGameId);
            setStatus(PlayerStatus.IN_GAME);
        },
        setOffline: () => setStatus(PlayerStatus.OFFLINE),
        sendMove,
    };

    return (
        <PlayerStatusContext.Provider value={contextValue}>
            {children}
        </PlayerStatusContext.Provider>
    );
};

export const usePlayerStatus = () => {
    const context = useContext(PlayerStatusContext);
    if (context === undefined) {
        throw new Error('usePlayerStatus must be used within a PlayerStatusProvider');
    }
    return context;
};
