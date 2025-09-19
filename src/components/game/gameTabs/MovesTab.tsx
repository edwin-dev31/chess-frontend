import React from 'react';
import { Button } from '../../ui/button';
import MoveHistory from '../MoveHistory';
import { GameState } from '../../../lib/types/Definitions';
import { Flag } from 'lucide-react';

interface MovesTabProps {
    gameState: GameState;
    handleNotImplemented: () => void;
}

const MovesTab: React.FC<MovesTabProps> = ({ gameState, handleNotImplemented }) => {
    return (
        <>
            <h3 className="text-lg font-semibold text-white mb-2">Movimientos</h3>
            <div className="flex-grow overflow-y-auto bg-slate-900/30 rounded-md p-2">
                <MoveHistory moves={gameState.moveHistory} />
            </div>
            <div className="flex items-center justify-between mt-2">
                <Button variant="outline" size="icon" onClick={handleNotImplemented}>
                    <Flag className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                    <Button variant="secondary" size="icon" onClick={handleNotImplemented}>|&lt;</Button>
                    <Button variant="secondary" size="icon" onClick={handleNotImplemented}>&lt;</Button>
                    <Button variant="secondary" size="icon" onClick={handleNotImplemented}>&gt;</Button>
                    <Button variant="secondary" size="icon" onClick={handleNotImplemented}>&gt;|</Button>
                </div>
                <Button variant="destructive" onClick={handleNotImplemented}>
                    Abandonar
                </Button>
            </div>
        </>
    );
};

export default MovesTab;
