 import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { motion } from "framer-motion";
import { useToast } from "../ui/use-toast";

const pieceSets = [
    {
        name: "Clásico",
        pieces: { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' },
        board: "bg-yellow-200",
        square: "bg-green-700"
    },
    {
        name: "Madera",
        pieces: { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' },
        board: "bg-[#d2b48c]",
        square: "bg-[#8b5a2b]"
    },
    {
        name: "Neón",
        pieces: { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' },
        board: "bg-gray-800",
        square: "bg-pink-500"
    },
     {
        name: "Mármol",
        pieces: { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' },
        board: "bg-gray-200",
        square: "bg-gray-500"
    },
];

const PiecePreview = ({ set, onSelect }) => {
    return (
        <motion.div
            onClick={() => onSelect(set.name)}
            className="cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className={`grid grid-cols-2 w-32 h-32 ${set.board}`}>
                <div className="flex items-center justify-center text-4xl text-black">{set.pieces.bK}</div>
                <div className={`flex items-center justify-center text-4xl text-black ${set.square}`}>{set.pieces.bN}</div>
                <div className={`flex items-center justify-center text-4xl text-white ${set.square}`}>{set.pieces.wB}</div>
                <div className="flex items-center justify-center text-4xl text-white">{set.pieces.wP}</div>
            </div>
        </motion.div>
    );
};


const ChangePieceModal = ({ isOpen, onClose }) => {
    const { toast } = useToast();

    const handleSelect = (setName) => {
        toast({
            title: `Estilo "${setName}" seleccionado`,
            description: "Esta función es visual. ¡Puedes pedir la implementación completa!",
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Cambiar Estilo del Tablero</DialogTitle>
                    <DialogDescription>
                        Elige tu combinación de tablero y piezas preferida.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {pieceSets.map((set, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <PiecePreview set={set} onSelect={handleSelect} />
                             <p className="text-sm font-medium text-slate-300">{set.name}</p>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
  );
};

export default ChangePieceModal;
