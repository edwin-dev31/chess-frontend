 import React from 'react';
import { motion } from 'framer-motion';

interface Move {
  notation: string;
  time: string;
}

interface MoveHistoryProps {
  moves: Move[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  return (
    <div className="max-h-64 overflow-y-auto">
      {moves.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-4">
          No hay movimientos aún
        </p>
      ) : (
        <div className="space-y-1">
          {moves.map((move, index) => (
            <motion.div
              key={index}
              className="flex justify-between items-center py-1 px-2 rounded hover:bg-slate-700/50"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="text-slate-400 text-xs">
                {Math.floor(index / 2) + 1}.
              </span>
              <span className="text-white text-sm font-mono">
                {move.notation}
              </span>
              <span className="text-slate-500 text-xs">
                {move.time}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveHistory;
