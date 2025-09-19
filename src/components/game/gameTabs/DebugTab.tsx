import React from 'react';
import GameControls from '../GameControls';
import { GameState } from '../../../lib/types/Definitions';

interface DebugTabProps {
    gameState: GameState;
    resetGame: () => void;
}

const DebugTab: React.FC<DebugTabProps> = ({ gameState, resetGame }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Debug Controls</h3>
            <GameControls onReset={resetGame} gameState={gameState} />
        </div>
    );
};

export default DebugTab;
