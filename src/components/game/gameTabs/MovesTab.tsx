import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import MoveHistory from '../MoveHistory';
import { GameState } from '../../../lib/types/Definitions';
import { Flag } from 'lucide-react';

interface MovesTabProps {
    gameState: GameState;
    handleLeaveGame: () => void;
    pgn?: string | null;
}

const MovesTab: React.FC<MovesTabProps> = ({ gameState, handleLeaveGame, pgn }) => {
    const [moves, setMoves] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (pgn) {
            const moveList = pgn
                .split(/\d+\.\s/) // separa por "1. e4 e5 2. Nf3 Nc6..."
                .slice(1) // elimina encabezado vacío
                .flatMap(m => m.trim().split(/\s+/))
                .filter(m => m !== '*' && m !== ''); // elimina marcador final
            setMoves(moveList);
            setCurrentIndex(moveList.length - 1);
        }
    }, [pgn]);

    const goFirst = () => setCurrentIndex(0);
    const goPrev = () => setCurrentIndex(i => Math.max(i - 1, 0));
    const goNext = () => setCurrentIndex(i => Math.min(i + 1, moves.length - 1));
    const goLast = () => setCurrentIndex(moves.length - 1);

    return (
        <>
            <h3 className="text-lg font-semibold text-white mb-2">Movimientos</h3>
            <div className="flex-grow overflow-y-auto bg-slate-900/30 rounded-md p-2">
                {pgn ? (
                    <div className="text-white space-y-1">
                        <p><strong>Movimiento actual:</strong> {moves[currentIndex]}</p>
                        <MoveHistory moves={moves.slice(0, currentIndex + 1)} />
                    </div>
                ) : (
                    <p className="text-slate-400">No hay PGN cargado.</p>
                )}
            </div>
            <div className="flex items-center justify-between mt-2">
                <Button variant="outline" size="icon" onClick={handleLeaveGame}>
                    <Flag className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                    <Button variant="secondary" size="icon" onClick={goFirst}>|&lt;</Button>
                    <Button variant="secondary" size="icon" onClick={goPrev}>&lt;</Button>
                    <Button variant="secondary" size="icon" onClick={goNext}>&gt;</Button>
                    <Button variant="secondary" size="icon" onClick={goLast}>&gt;|</Button>
                </div>
                <Button variant="destructive" onClick={handleLeaveGame}>
                    Abandonar
                </Button>
            </div>
        </>
    );
};

export default MovesTab;
