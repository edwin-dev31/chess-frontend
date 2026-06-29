import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PlayerStatus } from '../types/PlayerStatus';
import { PlayerOnlineDTO } from '../types/PlayerOnlineDTO';
import { SubscriptionFactory, FactoryParams } from '@/lib/hooks/sockets/SubscriptionFactory';
import { useProfile } from '../hooks/player/useProfile';
import { socketHelper } from '../helpers/socketHelper';
import { CreateMoveDTO } from '../types/CreateMoveDTO';
import { InvitationDto } from '../types/InvitationDto';
import { useRef } from 'react';
import { useColorStorage } from '../hooks/common/useColorStorage';
import { Color } from '../types/Definitions';
import { ChatMessage } from '../types/ChatMessageDTO';
import { toast } from '@/components/ui/use-toast';  
import { MoveStatus } from '../types/Definitions';
import md5 from 'md5';
import { useLocation, useNavigate } from 'react-router-dom';

interface PlayerStatusContextType {
    status: PlayerStatus;
    gameId: string | null;
    onlinePlayers: PlayerOnlineDTO[];
    fen: string | null;
    moves: any[];
    color: Color | null; 
    currentTurnColor: Color | null;
    lastInvitation: InvitationDto | null;
    chatMessages: ChatMessage[];
    setOnline: () => void;
    setInGame: (gameId: string, color?: Color, persist?: boolean) => void;
    setOffline: () => void;
    clearGame: () => void;
    sendMove: (moveDto: CreateMoveDTO) => void;
    sendChatMessage: (message: string) => void;
    gameStart: any | null;
}

const PlayerStatusContext = createContext<PlayerStatusContextType | undefined>(undefined);

export const PlayerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const getInitialGameId = () => localStorage.getItem('currentGameId');
    const getInitialStatus = () => (getInitialGameId() ? PlayerStatus.IN_GAME : PlayerStatus.OFFLINE);
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<PlayerStatus>(getInitialStatus);
    const [gameId, setGameId] = useState<string | null>(getInitialGameId);
    const [gameStart, setGameStart] = useState<any | null>(null);
    const [onlinePlayers, setOnlinePlayers] = useState<PlayerOnlineDTO[]>([]);
    const [fen, setFen] = useState<string | null>(null);
    const [moves, setMoves] = useState<any[]>([]);
    const {color, saveColor, removeColor } = useColorStorage(); 
    const [currentTurnColor, setCurrentTurnColor] = useState<Color | null>(null);
    const [lastInvitation, setLastInvitation] = useState<InvitationDto | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const { profile } = useProfile();

    const gameIdRef = useRef<string | null>(null);
    const justLeftGameRef = useRef<boolean>(false);

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const gameIdFromUrl = pathParts.length === 3 && pathParts[1] === 'game' ? pathParts[2] : null;
        const gameIdFromLocalStorage = getInitialGameId();

        if (gameIdFromUrl) {
            if (!gameIdFromLocalStorage || gameIdFromUrl !== gameIdFromLocalStorage) {
                navigate('/app');
            }
        }
    }, [location, navigate]);

    useEffect(() => {
        gameIdRef.current = gameId;
    }, [gameId]);

    const filteredOnlinePlayers = useMemo(() => {
        if (!profile) {
            return onlinePlayers;
        }
        return onlinePlayers.filter(player => player.id !== profile.id);
    }, [onlinePlayers, profile]);

    const setInGame = (newGameId: string, newColor?: Color, persist = false) => {
        gameIdRef.current = newGameId;
        setGameId(newGameId);
        setStatus(PlayerStatus.IN_GAME);
        if (persist) {
            localStorage.setItem('currentGameId', newGameId);
        }
        if (newColor) {
            saveColor(newColor);
        }
    };

    const clearGame = () => {
        setGameId(null);
        setFen(null);
        setMoves([]);
        setCurrentTurnColor(null);
        removeColor(); 
        localStorage.removeItem('currentGameId');
        setStatus(PlayerStatus.ONLINE);

        justLeftGameRef.current = true;
        setTimeout(() => {
            justLeftGameRef.current = false;
        }, 2000); 
    };

        useEffect(() => {
            let unsubscribeFromSocket: (() => void) | undefined;
    
            const createAndSubscribe = () => {
                if (status === PlayerStatus.OFFLINE) {
                    return;
                }
    
                const factoryParams: FactoryParams = {
                    onOnlinePlayers: setOnlinePlayers,
                    onFenUpdate: (fen) => {
                        setFen(fen);
                    },
                    onMove: (move: any) => setMoves(prev => [...prev, move]),
                    onCurrentTurnColor: setCurrentTurnColor,
                    onNotification: setLastInvitation,
                    
                    onGameStart: (gameData) => {
                        if (justLeftGameRef.current) {
                            justLeftGameRef.current = false;
                            return;
                        }

                        setGameStart(gameData);

                        setInGame(gameData.code, gameData.color, true);
                    },
                    onChatMessage: (message) => setChatMessages(prev => [...prev, message]),
                    gameId: gameIdRef.current || undefined,
                    onError: (error) => { 
                        toast({        
                            title: "Error",        
                            description: error.message || "An unknown error occurred.",                         
                    }) },

                    onStatusGame: (statusGame) => {
                        let winnerMsg = ""
                        if(statusGame.status == MoveStatus.CHECKMATE){
                            winnerMsg = " The winner is: " + statusGame.winnerName
                        }
                        
                        toast({
                            title: statusGame.status.toString(),
                            description: statusGame.message + winnerMsg
                        })
                    }
                
                 };
                const subscription = SubscriptionFactory.create(status, factoryParams);
    
                if (subscription) { 
                    return subscription.subscribe();
                } else {
                    return undefined;
                }
            };
    
            if (socketHelper.isConnected()) {
                unsubscribeFromSocket = createAndSubscribe();
            } else {
                socketHelper.connect(() => {
                    unsubscribeFromSocket = createAndSubscribe();
                });
            }
    
            return () => {
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

    const sendChatMessage = (message: string) => {
        if (gameId && profile) {
            const opponent = onlinePlayers.find(p => p.id !== profile?.id);
            const payload = {
                content: message,
                md5: md5(message),
            };
            socketHelper.send(`/app/${gameId}/chat`, payload);

            const newMessage: ChatMessage = {
                from: profile.id,
                to: opponent?.id || 0,
                content: message,
            };

            setChatMessages(prev => [...prev, newMessage]);
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
        chatMessages,
        setOnline: () => setStatus(PlayerStatus.ONLINE),
        setInGame,
        setOffline: () => setStatus(PlayerStatus.OFFLINE),
        clearGame,
        sendMove,
        sendChatMessage,
        gameStart
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
