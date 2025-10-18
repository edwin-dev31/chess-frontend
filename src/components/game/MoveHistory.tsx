import React from 'react';
import { motion } from 'framer-motion';

interface Move {
    notation: string;
    time?: string;
}

interface MoveHistoryProps {
    moves: (Move | string)[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
    if (!moves || moves.length === 0) {
        return (
            <p className="text-slate-400 text-sm text-center py-4">
                No hay movimientos aún
            </p>
        );
    }

    const groupedMoves = [];
    for (let i = 0; i < moves.length; i += 2) {
        groupedMoves.push({
            white:
                typeof moves[i] === 'string'
                    ? (moves[i] as string)
                    : (moves[i] as Move).notation,
            black:
                moves[i + 1]
                    ? typeof moves[i + 1] === 'string'
                        ? (moves[i + 1] as string)
                        : (moves[i + 1] as Move).notation
                    : '',
        });
    }

    return (
        <div className="max-h-64 overflow-y-auto">
            <div className="space-y-1">
                {groupedMoves.map((pair, index) => (
                    <motion.div
                        key={index}
                        className="flex justify-between items-center py-1 px-2 rounded hover:bg-slate-700/30"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <span className="text-slate-400 text-xs w-4">
                            {index + 1}.
                        </span>
                        <span className="text-white text-sm font-mono w-12 text-center">
                            {pair.white}
                        </span>
                        <span className="text-white text-sm font-mono w-12 text-center">
                            {pair.black}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MoveHistory;
