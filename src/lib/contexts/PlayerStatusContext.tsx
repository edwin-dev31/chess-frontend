import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PlayerStatus } from '../types/PlayerStatus';
import { PlayerOnlineDTO } from '../types/PlayerOnlineDTO';
import { SubscriptionFactory, FactoryParams } from '../sockets/SubscriptionFactory';
import { useProfile } from '../hooks/player/useProfile';
import { socketHelper } from '../helpers/socketHelper';
import { CreateMoveDTO } from '../types/CreateMoveDTO';
import { InvitationDto } from '../types/InvitationDto';
import { useRef } from 'react';
import { useColorStorage } from '../hooks/common/useColorStorage';
import { Color } from '../types/Definitions';

interface PlayerStatusContextType {
    status: PlayerStatus;
    gameId: string | null;
    onlinePlayers: PlayerOnlineDTO[];
    fen: string | null;
    moves: any[];
    color: string | null; 
    currentTurnColor: Color | null;
    lastInvitation: InvitationDto | null;
    setOnline: () => void;
    setInGame: (gameId: string, color?: Color) => void;
    setOffline: () => void;
    sendMove: (moveDto: CreateMoveDTO) => void;
}

const PlayerStatusContext = createContext<PlayerStatusContextType | undefined>(undefined);

export const PlayerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const getInitialGameId = () => localStorage.getItem('currentGameId');
    const getInitialStatus = () => (getInitialGameId() ? PlayerStatus.IN_GAME : PlayerStatus.OFFLINE);

    const [status, setStatus] = useState<PlayerStatus>(getInitialStatus);
    const [gameId, setGameId] = useState<string | null>(getInitialGameId);
    const [onlinePlayers, setOnlinePlayers] = useState<PlayerOnlineDTO[]>([]);
    const [fen, setFen] = useState<string | null>(null);
    const [moves, setMoves] = useState<any[]>([]);
    const {color, saveColor } = useColorStorage(); 
    const [currentTurnColor, setCurrentTurnColor] = useState<Color | null>(null);
    const [lastInvitation, setLastInvitation] = useState<InvitationDto | null>(null);

    const { profile } = useProfile();

    const gameIdRef = useRef<string | null>(null);

    useEffect(() => {
        gameIdRef.current = gameId;
    }, [gameId]);

    const filteredOnlinePlayers = useMemo(() => {
        if (!profile) {
            return onlinePlayers;
        }
        return onlinePlayers.filter(player => player.id !== profile.id);
    }, [onlinePlayers, profile]);

    const setInGame = (newGameId: string, newColor?: Color) => {
        console.log('PlayerStatusContext: setInGame called with gameId:', newGameId, 'and color:', newColor);
        gameIdRef.current = newGameId;
        setGameId(newGameId);
        setStatus(PlayerStatus.IN_GAME);
        localStorage.setItem('currentGameId', newGameId);
        if (newColor) {
            saveColor(newColor);
        }
        console.log('PlayerStatusContext: Status set to IN_GAME for gameId:', newGameId);
    };

    useEffect(() => {
        console.log('PlayerStatusContext: Main useEffect re-running. Status:', status, 'GameId:', gameId);
        let unsubscribeFromSocket: (() => void) | undefined;

        const createAndSubscribe = () => {
            if (status === PlayerStatus.OFFLINE) {
                console.log('PlayerStatusContext: Not creating subscriptions for OFFLINE status.');
                return;
            }

            const factoryParams: FactoryParams = {
                onOnlinePlayers: setOnlinePlayers,
                onFenUpdate: (fen) => {
                    console.log('PlayerStatusContext: onFenUpdate received fen:', fen);
                    setFen(fen);
                },
                onMove: (move: any) => setMoves(prev => [...prev, move]),
                onCurrentTurnColor: setCurrentTurnColor, 
                onNotification: setLastInvitation,
                onGameStart: (gameId, color) => setInGame(gameId, color),
                gameId: gameIdRef.current || undefined,
            };

            console.log('PlayerStatusContext: Calling SubscriptionFactory.create with status:', status, 'and gameId:', gameIdRef.current, 'Current fen state:', fen);
            const subscription = SubscriptionFactory.create(status, factoryParams);
            return subscription?.subscribe();
        };

        if (socketHelper.isConnected()) {
            unsubscribeFromSocket = createAndSubscribe();
        } else {
            socketHelper.connect(() => {
                unsubscribeFromSocket = createAndSubscribe();
            });
        }

        return () => {
            console.log('PlayerStatusContext: Cleaning up subscriptions.');
            unsubscribeFromSocket?.();
        };
    }, [status, gameId, saveColor, fen]);

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
        currentTurnColor,
        lastInvitation,
        setOnline: () => setStatus(PlayerStatus.ONLINE),
        setInGame,
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
