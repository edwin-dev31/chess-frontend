import { useState, useEffect } from 'react';

const initialBoard = [
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

const initialGameState = {
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

const API_BASE_URL = 'http://localhost:1788/chess/api';
const GAME_ID = 8;

const playerTokens = {
  white: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZHdpbkBnbWFpbC5jb20iLCJpZCI6MSwidXNlcm5hbWUiOiJlZHdpbiIsImlhdCI6MTc1NzcwMjU4OCwiZXhwIjoxNzU3NzA2MTg4fQ.ulxQW-BVdoRAmWQHtTrlfzeZEQaRzRjFtkVUA_QaGko',
  black: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYXJheUBnbWFpbC5jb20iLCJpZCI6MiwidXNlcm5hbWUiOiJzYXJheSIsImlhdCI6MTc1NzcwMjU4OCwiZXhwIjoxNzU3NzA2MTg4fQ.VSCmWkc4NRYtDW90YEAvx1NR0z-_c6z8kVaGFne0U4I'
};

const playerIds = {
  white: 1,
  black: 2
};

export const useChessGame = () => {
  const [gameState, setGameState] = useState(JSON.parse(JSON.stringify(initialGameState)));

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/games/${GAME_ID}/fen`, {
          headers: {
            'Authorization': `Bearer ${playerTokens.white}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        loadFen(data.fen);
      } catch (error) {
        console.error('Failed to fetch game:', error);
      }
    };

    fetchGame();
  }, []);

  const makeMove = async (fromRow, fromCol, toRow, toCol) => {
    const piece = gameState.board[fromRow][fromCol];
    if (!piece || piece.color !== gameState.currentPlayer) {
      return;
    }

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const fromSquare = `${files[fromCol]}${ranks[fromRow]}`;
    const toSquare = `${files[toCol]}${ranks[toRow]}`;

    const playerId = playerIds[gameState.currentPlayer];
    const token = playerTokens[gameState.currentPlayer];

    try {
      const moveResponse = await fetch(`${API_BASE_URL}/moves/${playerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId: GAME_ID, fromSquare: fromSquare, toSquare: toSquare })
      });

      if (!moveResponse.ok) {
        throw new Error('Move was not accepted by the server');
      }

      const fenResponse = await fetch(`${API_BASE_URL}/games/${GAME_ID}/fen`);
      if (!fenResponse.ok) {
        throw new Error('Network response was not ok after making a move');
      }
      const data = await fenResponse.json();
      loadFen(data.fen);

    } catch (error) {
      console.error('Failed to make move:', error);
    }
  };

  const parseFenToBoard = (fen) => {
    const fenBoard = fen.split(' ')[0];
    const pieceMap = {
      'r': { type: 'rook', color: 'black' }, 'n': { type: 'knight', color: 'black' },
      'b': { type: 'bishop', color: 'black' }, 'q': { type: 'queen', color: 'black' },
      'k': { type: 'king', color: 'black' }, 'p': { type: 'pawn', color: 'black' },
      'R': { type: 'rook', color: 'white' }, 'N': { type: 'knight', color: 'white' },
      'B': { type: 'bishop', color: 'white' }, 'Q': { type: 'queen', color: 'white' },
      'K': { type: 'king', color: 'white' }, 'P': { type: 'pawn', color: 'white' }
    };

    const board = [];
    const ranks = fenBoard.split('/');
    for (const rank of ranks) {
      const row = [];
      for (const char of rank) {
        if (isNaN(char)) {
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

  const loadFen = (fen) => {
    const newBoard = parseFenToBoard(fen);
    const currentPlayer = fen.split(' ')[1] === 'w' ? 'white' : 'black';
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