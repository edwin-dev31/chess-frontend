import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw } from 'lucide-react';
import ChessBoard from '@/components/game/ChessBoard';
import PlayerInfo from '@/components/game/PlayerInfo';
import GameTabs from '@/components/game/GameTabs';
import {  Color } from '@/lib/types/Definitions';
import { useChessGame } from '@/lib/hooks/game/useChessGame';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ChangePieceModal from '@/components/game/ChangePieceModal';

interface SelectedSquare {
    row: number;
    col: number;
}

interface GameBoardProps {}

const GameBoard: React.FC<GameBoardProps> = () => {

    const { gameState, makeMove, color, currentTurnColor } = useChessGame();
    console.log('GameBoard: gameState.board received:', gameState.board);
    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
    const handleSquareClick = (row: number, col: number) => {
        if (selectedSquare) {
            const fromRow = selectedSquare.row;
            const fromCol = selectedSquare.col;
            makeMove(fromRow, fromCol, row, col);
            setSelectedSquare(null);
        } else if (gameState.board[row][col]) {
            setSelectedSquare({ row, col });
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full">
                <div className="xl:col-span-2 flex flex-col justify-between items-center xl:items-start p-4 bg-slate-800 rounded-lg">
                    <PlayerInfo
                        player={gameState.players.black}
                        isCurrentTurn={gameState.currentPlayer === Color.BLACK}
                        capturedPieces={gameState.captured.white}
                    />

                    <PlayerInfo
                        player={gameState.players.white}
                        isCurrentTurn={gameState.currentPlayer === Color.WHITE}
                        capturedPieces={gameState.captured.black}
                    />
                    <span className="px-3 py-1 rounded-full text-white font-bold">
                        Current turn: {currentTurnColor?.toUpperCase()}
                    </span>
                </div>

                <div className="xl:col-span-6 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-[60vh] aspect-square chess-board-bg rounded-md"
                    >
                        <ChessBoard
                            board={gameState.board}
                            onSquareClick={handleSquareClick}
                            selectedSquare={selectedSquare}
                            lastMove={gameState.lastMove}
                            playerColor={color}
                        />
                    </motion.div>
                    <div className="flex items-center justify-between w-full max-w-[70vh] mt-2">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            variant="link"
                            className="text-slate-300 hover:text-white"
                        >
                            Change piece
                        </Button>
                        <div className="flex items-center space-x-2 bg-slate-800 px-4 py-1.5 rounded-md text-white">
                            <Clock className="w-5 h-5" />
                            <span className="font-mono text-lg">
                                {
                                    gameState.players[gameState.currentPlayer]
                                        ?.timeLeft
                                }
                            </span>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-4 bg-slate-800 rounded-lg p-1">
                    <GameTabs gameState={gameState} resetGame={ ()=> {} } />
                </div>
            </div>
            <ChangePieceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default GameBoard;