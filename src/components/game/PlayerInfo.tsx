import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    PlayerInfo as PlayerInfoType,
    Piece,
    Color
} from '@/lib/types/Definitions';

const pieceMap: Record<string, string> = {
    pawn: '♙',
    knight: '♘',
    bishop: '♗',
    rook: '♖',
    queen: '♕',
    king: '♔',
};

interface PlayerInfoProps {
    player: PlayerInfoType;
    isCurrentTurn: boolean;
    capturedPieces?: Piece[];
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
    player,
    isCurrentTurn,
    capturedPieces = [],
}) => {
    return (
        <motion.div
            className={cn(
                'w-full transition-all duration-300 p-2 rounded-lg',
                isCurrentTurn && 'bg-blue-500/10 ring-1 ring-blue-400'
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center space-x-3">
                {player.imageUrl ? (
                    <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-600"
                    />
                ) : (
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center ring-2 ring-slate-600">
                        <User className="h-5 w-5 text-slate-300" />
                    </div>
                )}

                <div className="flex-1">
                    <h3 className="text-white font-semibold">{player.name}</h3>
                    <p className="text-slate-400 text-sm">
                        {player.rating} ELO
                    </p>
                </div>
            </div>
            <div className="mt-2 ml-1 flex flex-wrap gap-x-1">
                {capturedPieces.map((piece, index) => (
                    <span
                        key={index}
                        className="captured-piece"
                        style={{
                            color: piece.color === Color.WHITE ? '#FFF' : '#AAA',
                        }}
                    >
                        {pieceMap[piece.type]}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

export default PlayerInfo;
