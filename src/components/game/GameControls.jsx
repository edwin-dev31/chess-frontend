 import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, Pause, Flag } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

const GameControls = ({ onReset, gameState, className }) => {
  const { toast } = useToast();

  const handlePause = () => {
    toast({
      title: "🚧 Esta función aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  const handleResign = () => {
    toast({
      title: "🚧 Esta función aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  return (
    <motion.div
      className={`flex space-x-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        onClick={onReset}
        variant="outline"
        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reiniciar
      </Button>
      
      <Button
        onClick={handlePause}
        variant="outline"
        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
      >
        <Pause className="h-4 w-4 mr-2" />
        Pausar
      </Button>
      
      <Button
        onClick={handleResign}
        variant="destructive"
        className="bg-red-600 hover:bg-red-700"
      >
        <Flag className="h-4 w-4 mr-2" />
        Rendirse
      </Button>
    </motion.div>
  );
};

export default GameControls;
