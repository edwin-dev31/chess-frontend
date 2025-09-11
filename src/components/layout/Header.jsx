 import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, User, RockingChair as ChessRook } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

const Header = ({ onMenuToggle, activeView }) => {
  const { toast } = useToast();

  const handleNotifications = () => {
    toast({
      title: "🚧 Esta función aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'game':
        return 'Tablero de Juego';
      case 'profile':
        return 'Perfil del Jugador';
      case 'history':
        return 'Historial de Partidas';
      case 'settings':
        return 'Configuración';
      default:
        return 'ChessHub';
    }
  };

  return (
    <motion.header 
      className="bg-slate-800 border-b border-slate-700/50 px-4 py-3"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="text-white hover:bg-slate-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <ChessRook className="h-7 w-7 text-blue-400"/>
            <h1 className="text-xl font-bold text-white hidden sm:block">ChessHub</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotifications}
            className="text-slate-300 hover:text-white hover:bg-slate-700 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border-2 border-slate-800">
              3
            </span>
          </Button>

          <div className="flex items-center space-x-2 bg-slate-700/50 rounded-full pl-1 pr-3 py-1 border border-slate-600/70">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center ring-2 ring-slate-500">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm hidden sm:block">
              <p className="text-white font-medium">edwin_dev</p>
              <p className="text-slate-400 text-xs">1200 ELO</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
