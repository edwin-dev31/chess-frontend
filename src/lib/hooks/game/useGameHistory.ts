import { useState, useEffect } from 'react';

// Type Definitions
type GameResult = 'win' | 'loss' | 'draw';

interface Accuracy {
    player: number;
    opponent: number;
}

export interface GameRecord {
    id: number;
    opponent: string;
    opponentRating: number;
    result: GameResult;
    date: string;
    timeControl: string;
    moves: number;
    opening: string;
    accuracy: Accuracy;
}

// Simulación de datos de historial de partidas
const mockGameHistory: GameRecord[] = [
    {
        id: 1,
        opponent: 'ChessMaster2024',
        opponentRating: 1250,
        result: 'win',
        date: '2024-01-15',
        timeControl: '10+0',
        moves: 42,
        opening: 'Apertura Italiana',
        accuracy: { player: 87, opponent: 82 },
    },
    {
        id: 2,
        opponent: 'KnightRider',
        opponentRating: 1180,
        result: 'loss',
        date: '2024-01-14',
        timeControl: '15+10',
        moves: 38,
        opening: 'Defensa Siciliana',
        accuracy: { player: 79, opponent: 91 },
    },
    {
        id: 3,
        opponent: 'PawnStorm',
        opponentRating: 1200,
        result: 'draw',
        date: '2024-01-13',
        timeControl: '5+3',
        moves: 67,
        opening: 'Gambito de Dama',
        accuracy: { player: 85, opponent: 84 },
    },
    {
        id: 4,
        opponent: 'RookiePlayer',
        opponentRating: 1100,
        result: 'win',
        date: '2024-01-12',
        timeControl: '10+0',
        moves: 29,
        opening: 'Apertura Española',
        accuracy: { player: 92, opponent: 76 },
    },
    {
        id: 5,
        opponent: 'QueenHunter',
        opponentRating: 1300,
        result: 'loss',
        date: '2024-01-11',
        timeControl: '15+10',
        moves: 51,
        opening: 'Defensa Francesa',
        accuracy: { player: 81, opponent: 88 },
    },
];

export const useGameHistory = () => {
    const [games, setGames] = useState<GameRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGameHistory = async () => {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            setGames(mockGameHistory);
            setLoading(false);
        };

        fetchGameHistory();
    }, []);

    return {
        games,
        loading,
    };
};
