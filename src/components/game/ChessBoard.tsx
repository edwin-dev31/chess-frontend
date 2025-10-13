import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Board, Piece, Color } from '../../lib/types/Definitions';

interface SelectedSquare {
    row: number;
    col: number;
}

interface LastMove {
    from: { row: number; col: number };
    to: { row: number; col: number };
}

interface ChessBoardProps {
    board: Board;
    onSquareClick: (row: number, col: number) => void;
    selectedSquare: SelectedSquare | null;
    lastMove: LastMove | null;
    playerColor: Color | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
    board,
    onSquareClick,
    selectedSquare,
    lastMove,
    playerColor, 
}) => {
    const isBlack = playerColor === Color.BLACK;

    const orientedBoard = isBlack
        ? [...board].reverse().map((row) => [...row].reverse())
        : board;

    const pieceSymbols: Record<Color, Record<Piece['type'], string>> = {
        [Color.WHITE]: {
            king: '♔',
            queen: '♕',
            rook: '♖',
            bishop: '♗',
            knight: '♘',
            pawn: '♙',
        },
        [Color.BLACK]: {
            king: '♚',
            queen: '♛',
            rook: '♜',
            bishop: '♝',
            knight: '♞',
            pawn: '♟️',
        },
    };

    const getOriginalCoordinates = (rowIndex: number, colIndex: number) => {
        if (isBlack) {
            return { row: 7 - rowIndex, col: 7 - colIndex };
        }
        return { row: rowIndex, col: colIndex };
    };

    const isSquareSelected = (row: number, col: number): boolean => {
        const originalCoords = getOriginalCoordinates(row, col);
        return (
            selectedSquare &&
            selectedSquare.row === originalCoords.row &&
            selectedSquare.col === originalCoords.col
        );
    };

    const isLastMove = (row: number, col: number): boolean => {
        if (!lastMove) return false;
        const originalCoords = getOriginalCoordinates(row, col);
        return (
            (lastMove.from.row === originalCoords.row &&
                lastMove.from.col === originalCoords.col) ||
            (lastMove.to.row === originalCoords.row &&
                lastMove.to.col === originalCoords.col)
        );
    };

    const isLightSquare = (row: number, col: number): boolean =>
        (row + col) % 2 === 0;

    const handleSquareClick = (row: number, col: number) => {
        const { row: normRow, col: normCol } = getOriginalCoordinates(row, col);
        onSquareClick(normRow, normCol);
    };

    return (
        <div className="grid grid-cols-8 gap-0 w-full h-full aspect-square border-4 border-amber-800 rounded-lg overflow-hidden">
            {orientedBoard.map((row, rowIndex) =>
                row.map((piece, colIndex) => (
                    <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className={cn(
                            'chess-square flex items-center justify-center cursor-pointer relative aspect-square',
                            isLightSquare(rowIndex, colIndex)
                                ? 'bg-amber-100'
                                : 'bg-amber-800',
                            isSquareSelected(rowIndex, colIndex) &&
                                'ring-4 ring-blue-400 ring-inset',
                            isLastMove(rowIndex, colIndex) && 'bg-yellow-300'
                        )}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {piece && (
                            <motion.span
                                key={`${rowIndex}-${colIndex}-${piece.type}-${piece.color}`}
                                className="chess-piece select-none"
                                layout
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {pieceSymbols[piece.color][piece.type]}
                            </motion.span>
                        )}
                        
                        {colIndex === 0 && (
                            <span className="absolute left-1 top-1 text-xs font-bold opacity-60">
                                {playerColor === Color.WHITE
                                    ? 8 - rowIndex
                                    : rowIndex + 1}
                            </span>
                        )}
                        {rowIndex === 7 && (
                            <span className="absolute right-1 bottom-1 text-xs font-bold opacity-60">
                                {playerColor === Color.WHITE
                                    ? String.fromCharCode(97 + colIndex)
                                    : String.fromCharCode(97 + (7 - colIndex))}
                            </span>
                        )}
                    </motion.div>
                ))
            )}
        </div>
    );
};

export default ChessBoard;
