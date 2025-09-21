import React from 'react';
import { Button } from '../../ui/button';
import { Clock, Play, Puzzle, Bot } from 'lucide-react';
import { useStartGame } from '../../../lib/hooks/game/useStartGame';

interface PlayTabProps {
    handleNotImplemented: () => void;
}

const PlayTab: React.FC<PlayTabProps> = ({ handleNotImplemented }) => {
    const { startGame } = useStartGame();

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Nueva Partida</h3>

            <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                    <p className="text-white font-medium">10 Min (Rápida)</p>
                    <Button size="sm" variant="ghost" onClick={handleNotImplemented}>
                        Cambiar
                    </Button>
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
                        <Button
                            key={time}
                            variant={time === '10 min' ? 'secondary' : 'outline'}
                            className={`w-full border-slate-600 ${time === '10 min' ? 'bg-blue-600/20 text-blue-300 border-blue-500' : 'bg-slate-700/50'}`}
                            onClick={handleNotImplemented}
                        >
                            <Clock className="w-3 h-3 mr-1.5" /> {time}
                        </Button>
                    ))}
                </div>
            </div>

            <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => startGame()}
            >
                
            </Button>
           

            <div className="space-y-2 pt-4 border-t border-slate-700">
                <Button className="w-full justify-start" variant="ghost" onClick={handleNotImplemented}>
                    <Puzzle className="w-4 h-4 mr-3 text-yellow-400" /> Desafío personalizado
                </Button>
                <Button className="w-full justify-start" variant="ghost" onClick={handleNotImplemented}>
                    <Bot className="w-4 h-4 mr-3 text-green-400" /> Juega contra un amigo
                </Button>
            </div>
        </div>
    );
};

export default PlayTab;
