import { useState, useEffect } from 'react';

// Type Definitions
export type PieceType = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn';
export type PieceColor = 'black' | 'white';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type Board = (Piece | null)[][];

export interface PlayerInfo {
  name: string;
  rating: number;
  timeLeft: string;
}

export interface GameState {
  board: Board;
  currentPlayer: PieceColor;
  moveHistory: any[]; // TODO: Define a proper type for move history
  lastMove: any; // TODO: Define a proper type for last move
  players: {
    white: PlayerInfo;
    black: PlayerInfo;
  };
  captured: {
    white: Piece[];
    black: Piece[];
  };
}


const initialBoard: Board = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' }
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' }
  ]
];

const initialGameState: GameState = {
  board: initialBoard,
  currentPlayer: 'white',
  moveHistory: [],
  lastMove: null,
  players: {
    white: {
      name: 'edwin_dev',
      rating: 1200,
      timeLeft: '10:00'
    },
    black: {
      name: 'Oponente',
      rating: 1150,
      timeLeft: '10:00'
    }
  },
  captured: {
    white: [],
    black: []
  }
};

import { apiRoutes } from '../constants/apiRoutes';
import { apiHelper } from '../apiHelper';

const GAME_ID = 1;
const token = localStorage.getItem('token')


export const useChessGame = () => {
  const [gameState, setGameState] = useState<GameState>(JSON.parse(JSON.stringify(initialGameState)));

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data: { fen: string } = await apiHelper<{ fen: string }>(apiRoutes.game.fen(GAME_ID), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        loadFen(data.fen);
      } catch (error) {
        console.error('Failed to fetch game:', error);
      }
    };

    fetchGame();
  }, []);

  const makeMove = async (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = gameState.board[fromRow][fromCol];
    if (!piece || piece.color !== gameState.currentPlayer) {
      return;
    }

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const fromSquare = `${files[fromCol]}${ranks[fromRow]}`;
    const toSquare = `${files[toCol]}${ranks[toRow]}`;


    try {
      console.log("this are the datas", fromSquare, "  ", toSquare)
      await apiHelper<any>(apiRoutes.game.makeMove(GAME_ID), {
        method: 'POST',
        token: token,
        body: {  fromSquare: fromSquare, toSquare: toSquare }
      });

      const data: { fen: string } = await apiHelper<{ fen: string }>(apiRoutes.game.fen(GAME_ID));
      loadFen(data.fen);

    } catch (error) {
      console.error('Failed to make move:', error);
    }
  };

  const parseFenToBoard = (fen: string): Board => {
    const fenBoard = fen.split(' ')[0];
    const pieceMap: { [key: string]: Piece } = {
      'r': { type: 'rook', color: 'black' }, 'n': { type: 'knight', color: 'black' },
      'b': { type: 'bishop', color: 'black' }, 'q': { type: 'queen', color: 'black' },
      'k': { type: 'king', color: 'black' }, 'p': { type: 'pawn', color: 'black' },
      'R': { type: 'rook', color: 'white' }, 'N': { type: 'knight', color: 'white' },
      'B': { type: 'bishop', color: 'white' }, 'Q': { type: 'queen', color: 'white' },
      'K': { type: 'king', color: 'white' }, 'P': { type: 'pawn', color: 'white' }
    };

    const board: Board = [];
    const ranks = fenBoard.split('/');
    for (const rank of ranks) {
      const row: (Piece | null)[] = [];
      for (const char of rank) {
        if (isNaN(Number(char))) {
          row.push(pieceMap[char]);
        } else {
          for (let i = 0; i < parseInt(char, 10); i++) {
            row.push(null);
          }
        }
      }
      board.push(row);
    }
    return board;
  };

  const loadFen = (fen: string) => {
    const newBoard = parseFenToBoard(fen);
    const currentPlayer: PieceColor = fen.split(' ')[1] === 'w' ? 'white' : 'black';
    setGameState(prev => ({
      ...initialGameState,
      board: newBoard,
      currentPlayer: currentPlayer,
      moveHistory: [],
      lastMove: null,
      captured: { white: [], black: [] }
    }));
  };

  const resetGame = () => {
    setGameState(JSON.parse(JSON.stringify(initialGameState)));
  };

  return {
    gameState,
    makeMove,
    resetGame,
    loadFen
  };
};