 import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Play, History, Info, Swords, Bot, Puzzle, Flag, Clock } from 'lucide-react';
import MoveHistory from './MoveHistory';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { GameState } from '../../lib/hooks/useChessGame';

interface GameTabsProps {
  gameState: GameState;
  resetGame: () => void;
}

const GameTabs: React.FC<GameTabsProps> = ({ gameState, resetGame }) => {
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "🚧 Esta función aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  return (
    <div className="h-full flex flex-col p-2">
      <Tabs defaultValue="play" className="w-full flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
          <TabsTrigger value="play"><Play className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="moves"><History className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="game"><Info className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="analysis" onClick={handleNotImplemented}><Puzzle className="w-4 h-4" /></TabsTrigger>
        </TabsList>

        <TabsContent value="play" className="flex-grow overflow-y-auto p-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Nueva Partida</h3>
            
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                    <p className="text-white font-medium">10 Min (Rápida)</p>
                    <Button size="sm" variant="ghost" onClick={handleNotImplemented}>Cambiar</Button>
                </div>
                <div className="mt-2 flex space-x-2">
                    <div className="flex-1 bg-slate-900 text-center py-2 rounded-md border border-slate-600">
                        <p className="text-sm text-slate-400">Evaluación</p>
                        <p className="text-white font-bold">± 0.3</p>
                    </div>
                     <div className="flex-1 bg-slate-900 text-center py-2 rounded-md border border-slate-600">
                        <p className="text-sm text-slate-400">Modo</p>
                        <p className="text-white font-bold">Estándar</p>
                    </div>
                </div>
            </div>

            <div>
              <p className="text-slate-300 font-medium mb-2">Elegir Tiempo</p>
              <div className="grid grid-cols-3 gap-2">
                {['1 min', '3 min', '5 min', '10 min', '15 | 10', '30 min'].map(time => (
                   <Button key={time} variant={time === '10 min' ? "secondary" : "outline"} className={`w-full border-slate-600 ${time === '10 min' ? 'bg-blue-600/20 text-blue-300 border-blue-500' : 'bg-slate-700/50'}`} onClick={handleNotImplemented}>
                       <Clock className="w-3 h-3 mr-1.5"/> {time}
                   </Button>
                ))}
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleNotImplemented}>
                <Play className="w-4 h-4 mr-2"/>Empezar Partida
            </Button>
            
            <div className="space-y-2 pt-4 border-t border-slate-700">
                 <Button className="w-full justify-start" variant="ghost" onClick={handleNotImplemented}>
                    <Puzzle className="w-4 h-4 mr-3 text-yellow-400"/> Desafío personalizado
                </Button>
                <Button className="w-full justify-start" variant="ghost" onClick={handleNotImplemented}>
                    <Bot className="w-4 h-4 mr-3 text-green-400"/> Juega contra un amigo
                </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="moves" className="flex-grow flex flex-col p-2">
            <h3 className="text-lg font-semibold text-white mb-2">Movimientos</h3>
            <div className="flex-grow overflow-y-auto bg-slate-900/30 rounded-md p-2">
                 <MoveHistory moves={gameState.moveHistory} />
            </div>
            <div className="flex items-center justify-between mt-2">
                <Button variant="outline" size="icon" onClick={handleNotImplemented}><Flag className="w-4 h-4"/></Button>
                <div className="flex items-center gap-1">
                    <Button variant="secondary" size="icon" onClick={handleNotImplemented}>|&lt;</Button>
                    <Button variant="secondary" size="icon" onClick={handleNotImplemented}>&lt;</Button>
                    <Button variant="secondary" size="icon" onClick={handleNotImplemented}>&gt;</Button>
                    <Button variant="secondary" size="icon" onClick={handleNotImplemented}>&gt;|</Button>
                </div>
                <Button variant="destructive" onClick={handleNotImplemented}>Abandonar</Button>
            </div>
        </TabsContent>
        
        <TabsContent value="game" className="flex-grow p-2">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameTabs;
