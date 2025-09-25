import { useState, useEffect } from 'react';
import { useChessSocket } from '@/lib/hooks/socket/useChessSocket';
import { CreateMoveDTO } from '@/lib/types/CreateMoveDTO';
import { Board, Color, GameState, Piece } from '@/lib/types/Definitions';

const initialBoard: Board = [
    [
        { type: 'rook', color: Color.BLACK },
        { type: 'knight', color: Color.BLACK },
        { type: 'bishop', color: Color.BLACK },
        { type: 'queen', color: Color.BLACK },
        { type: 'king', color: Color.BLACK },
        { type: 'bishop', color: Color.BLACK },
        { type: 'knight', color: Color.BLACK },
        { type: 'rook', color: Color.BLACK },
    ],
    Array(8).fill({ type: 'pawn', color: Color.BLACK }),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill({ type: 'pawn', color: Color.WHITE }),
    [
        { type: 'rook', color: Color.WHITE },
        { type: 'knight', color: Color.WHITE },
        { type: 'bishop', color: Color.WHITE },
        { type: 'queen', color: Color.WHITE },
        { type: 'king', color: Color.WHITE },
        { type: 'bishop', color: Color.WHITE },
        { type: 'knight', color: Color.WHITE },
        { type: 'rook', color: Color.WHITE },
    ],
];

const initialGameState: GameState = {
    board: initialBoard,
    currentPlayer: Color.WHITE,
    moveHistory: [],
    lastMove: null,
    players: {
        white: {
            name: 'edwin_zdev',
            rating: 1200,
            timeLeft: '10:00',
        },
        black: {
            name: 'Oponente',
            rating: 1150,
            timeLeft: '10:00',
        },
    },
    captured: {
        white: [],
        black: [],
    },
};

export const useChessGame = () => {
    const { fen, moves, color, currentTurnColor, sendMove, setInGame, gameId } = useChessSocket();
    const [gameState, setGameState] = useState<GameState>(
        JSON.parse(JSON.stringify(initialGameState))
    );

    console.log('useChessGame: fen from useChessSocket:', fen);

    useEffect(() => {
        if (gameId) {
            console.log('useChessGame: Calling setInGame with gameId:', gameId);
            setInGame(gameId);
        }
    }, [gameId, setInGame]);

    useEffect(() => {
        if (fen) {
            console.log('useChessGame: useEffect triggered by fen change. Calling loadFen with fen:', fen);
            loadFen(fen);
        }
    }, [fen]);

    const makeMove = (
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ) => {
        const piece = gameState.board[fromRow][fromCol];
        if (!piece || piece.color !== color) {
            console.warn('Movimiento inválido: no hay pieza o no es tu turno');
            return;
        }

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        const fromSquare = `${files[fromCol]}${ranks[fromRow]}`;
        const toSquare = `${files[toCol]}${ranks[toRow]}`;

        const moveDto: CreateMoveDTO = { fromSquare, toSquare };

        try {
            console.log('📤 Enviando movimiento:', moveDto);
            sendMove(moveDto);
        } catch (error) {
            console.error('❌ Error enviando movimiento:', error);
        }
    };

    const parseFenToBoard = (fen: string): Board => {
        const fenBoard = fen.split(' ')[0];
        const pieceMap: { [key: string]: Piece } = {
            r: { type: 'rook', color: Color.BLACK },
            n: { type: 'knight', color: Color.BLACK },
            b: { type: 'bishop', color: Color.BLACK },
            q: { type: 'queen', color: Color.BLACK },
            k: { type: 'king', color: Color.BLACK },
            p: { type: 'pawn', color: Color.BLACK },
            R: { type: 'rook', color: Color.WHITE },
            N: { type: 'knight', color: Color.WHITE },
            B: { type: 'bishop', color: Color.WHITE },
            Q: { type: 'queen', color: Color.WHITE },
            K: { type: 'king', color: Color.WHITE },
            P: { type: 'pawn', color: Color.WHITE },
        };

        const board: Board = [];
        const ranks = fenBoard.split('/');
        for (const rank of ranks) {
            const row: (Piece | null)[] = [];
            for (const char of rank) {
                if (isNaN(Number(char))) {
                    row.push(pieceMap[char]);
                } else {
                    row.push(...Array(parseInt(char, 10)).fill(null));
                }
            }
            board.push(row);
        }
        return board;
    };

    const loadFen = (fen: string) => {
        console.log('useChessGame: loadFen called with fen:', fen);
        const newBoard = parseFenToBoard(fen);
        const currentPlayer: Color =
            fen.split(' ')[1] === 'w' ? Color.WHITE : Color.BLACK;
        setGameState((prev) => {
            console.log('useChessGame: setGameState called. New board:', newBoard, 'Current player:', currentPlayer);
            return {
                ...prev,
                board: newBoard,
                currentPlayer,
            };
        });
    };

    return { gameState, makeMove, loadFen, color, currentTurnColor };
};
