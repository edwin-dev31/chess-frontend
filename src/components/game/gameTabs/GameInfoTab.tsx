import React from 'react';
import { GameState } from '../../../lib/hooks/useChessGame';

interface GameInfoTabProps {
    gameState: GameState;
}

const GameInfoTab: React.FC<GameInfoTabProps> = ({ gameState }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Información de la Partida</h3>
            <div className="space-y-2 text-sm bg-slate-700/50 p-4 rounded-lg">
                <div className="flex justify-between">
                    <span className="text-slate-400">Turno:</span>
                    <span className="text-white capitalize">{gameState.currentPlayer}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Movimientos:</span>
                    <span className="text-white">{gameState.moveHistory.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Estado:</span>
                    <span className="text-green-400 font-semibold">En progreso</span>
                </div>
            </div>
            <div className="pt-4 border-t border-slate-700">
                <h4 className="text-base font-semibold text-white mb-2">Chat</h4>
                <div className="h-32 flex items-center justify-center bg-slate-900/30 rounded-lg">
                    <p className="text-slate-500">El chat está desactivado.</p>
                </div>
            </div>
        </div>
    );
};

export default GameInfoTab;
