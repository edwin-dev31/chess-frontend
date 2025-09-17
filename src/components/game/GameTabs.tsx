import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Play, History, Info, Puzzle, Bug } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { GameState } from '../../lib/hooks/useChessGame';
import PlayTab from './gameTabs/PlayTab';
import MovesTab from './gameTabs/MovesTab';
import GameInfoTab from './gameTabs/GameInfoTab';
import DebugTab from './gameTabs/DebugTab';

interface GameTabsProps {
    gameState: GameState;
    resetGame: () => void;
}

const GameTabs: React.FC<GameTabsProps> = ({ gameState, resetGame }) => {
    const { toast } = useToast();

    const handleNotImplemented = () => {
        toast({
            title: '🚧 Esta función aún no está implementada',
            description: '¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀',
        });
    };

    return (
        <div className="h-full flex flex-col p-2">
            <Tabs defaultValue="play" className="w-full flex flex-col flex-grow">
                <TabsList className="grid w-full grid-cols-5 bg-slate-900/50">
                    <TabsTrigger value="play">
                        <Play className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="moves">
                        <History className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="game">
                        <Info className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="analysis" onClick={handleNotImplemented}>
                        <Puzzle className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="debug">
                        <Bug className="w-4 h-4" />
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="play" className="flex-grow overflow-y-auto p-2">
                    <PlayTab handleNotImplemented={handleNotImplemented} />
                </TabsContent>

                <TabsContent value="moves" className="flex-grow flex flex-col p-2">
                    <MovesTab gameState={gameState} handleNotImplemented={handleNotImplemented} />
                </TabsContent>

                <TabsContent value="game" className="flex-grow p-2">
                    <GameInfoTab gameState={gameState} />
                </TabsContent>

                <TabsContent value="debug" className="flex-grow p-2">
                    <DebugTab gameState={gameState} resetGame={resetGame} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default GameTabs;
