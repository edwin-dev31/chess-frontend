import { useState } from 'react';

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

export const useChessGame = () => {
  const [gameState, setGameState] = useState(JSON.parse(JSON.stringify(initialGameState)));

  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    
    if (!piece || piece.color !== gameState.currentPlayer) {
      return;
    }

    const capturedPiece = newBoard[toRow][toCol];
    const newCaptured = { ...gameState.captured };

    if (capturedPiece) {
      if (capturedPiece.color === 'white') {
        newCaptured.white.push(capturedPiece.type.charAt(0).toUpperCase());
      } else {
        newCaptured.black.push(capturedPiece.type.charAt(0).toLowerCase());
      }
    }

    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const moveNotation = `${files[fromCol]}${ranks[fromRow]}-${files[toCol]}${ranks[toRow]}`;

    const newMove = {
      notation: moveNotation,
      time: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      piece: piece.type,
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol }
    };

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white',
      moveHistory: [...prev.moveHistory, newMove],
      lastMove: {
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol }
      },
      captured: newCaptured
    }));
  };

  const resetGame = () => {
    setGameState(JSON.parse(JSON.stringify(initialGameState)));
  };

  return {
    gameState,
    makeMove,
    resetGame
  };
};