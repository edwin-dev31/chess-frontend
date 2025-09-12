 import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw } from 'lucide-react';
import ChessBoard from './ChessBoard';
import PlayerInfo from './PlayerInfo';
import GameTabs from './GameTabs';
import { useChessGame } from '../../hooks/useChessGame';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import ChangePieceModal from './ChangePieceModal';

const GameBoard = () => {
  const { gameState, makeMove, resetGame, loadFen } = useChessGame();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      const fromRow = selectedSquare.row;
      const fromCol = selectedSquare.col;
      makeMove(fromRow, fromCol, row, col);
      setSelectedSquare(null);
    } else if (gameState.board[row][col]) {
      setSelectedSquare({ row, col });
    }
  };

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Esta función aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full">
        <div className="xl:col-span-2 flex flex-col justify-between items-center xl:items-start p-4 bg-slate-800 rounded-lg">
           <PlayerInfo 
              player={gameState.players.black}
              isCurrentTurn={gameState.currentPlayer === 'black'}
              capturedPieces={gameState.captured.white}
            />
            <div className="hidden xl:flex flex-col items-center my-4">
              <Button onClick={handleNotImplemented} variant="ghost" className="text-slate-400 hover:text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
            <PlayerInfo 
              player={gameState.players.white}
              isCurrentTurn={gameState.currentPlayer === 'white'}
              capturedPieces={gameState.captured.black}
            />
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
            />
          </motion.div>
          <div className="flex items-center justify-between w-full max-w-[70vh] mt-2">
            <Button onClick={() => setIsModalOpen(true)} variant="link" className="text-slate-300 hover:text-white">
                Change piece
              </Button>
            <div className="flex items-center space-x-2 bg-slate-800 px-4 py-1.5 rounded-md text-white">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{gameState.players[gameState.currentPlayer]?.timeLeft}</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 bg-slate-800 rounded-lg p-1">
          <GameTabs gameState={gameState} resetGame={resetGame} />
        </div>
      </div>
      <ChangePieceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default GameBoard;
