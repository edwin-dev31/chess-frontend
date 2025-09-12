 import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const ChessBoard = ({ board, onSquareClick, selectedSquare, lastMove }) => {
  console.log(lastMove, selectedSquare)
  const pieceSymbols = {
    'white': {
      'king': '♔',
      'queen': '♕',
      'rook': '♖',
      'bishop': '♗',
      'knight': '♘',
      'pawn': '♙'
    },
    'black': {
      'king': '♚',
      'queen': '♛',
      'rook': '♜',
      'bishop': '♝',
      'knight': '♞',
      'pawn': '♟'
    }
  };

  const isSquareSelected = (row, col) => {
    return selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
  };

  const isLastMove = (row, col) => {
    if (!lastMove) return false;
    return (lastMove.from.row === row && lastMove.from.col === col) ||
           (lastMove.to.row === row && lastMove.to.col === col);
  };

  const isLightSquare = (row, col) => (row + col) % 2 === 0;

  const handleSquareClick = (row, col) => {
    console.log(`Square clicked: (${8 - row}, ${col + 1})`);
    onSquareClick(row, col);
  };

  return (
    <div className="grid grid-cols-8 gap-0 w-full h-full aspect-square border-4 border-amber-800 rounded-lg overflow-hidden">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <motion.div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "chess-square flex items-center justify-center cursor-pointer relative aspect-square",
              isLightSquare(rowIndex, colIndex)
                ? "bg-amber-100"
                : "bg-amber-800",
              isSquareSelected(rowIndex, colIndex) && "ring-4 ring-blue-400 ring-inset",
              isLastMove(rowIndex, colIndex) && "bg-yellow-300"
            )}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {piece && (
              <motion.span
                className="chess-piece select-none"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {pieceSymbols[piece.color][piece.type]}
              </motion.span>
            )}
            
            {/* Coordenadas del tablero */}
            {colIndex === 0 && (
              <span className="absolute left-1 top-1 text-xs font-bold opacity-60">
                {8 - rowIndex}
              </span>
            )}
            {rowIndex === 7 && (
              <span className="absolute right-1 bottom-1 text-xs font-bold opacity-60">
                {String.fromCharCode(97 + colIndex)}
              </span>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ChessBoard;
