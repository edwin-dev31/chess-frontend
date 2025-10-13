import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Play, History, Info, Puzzle, Bug } from 'lucide-react';
import { GameState } from '../../lib/types/Definitions';
import PlayTab from './gameTabs/PlayTab';
import MovesTab from './gameTabs/MovesTab';
import GameInfoTab from './gameTabs/GameInfoTab';
import ChatTab from './gameTabs/ChatTab';
import { useLeaveGame } from '@/lib/hooks/game/useLeaveGame';
import { toast } from 'sonner';

interface GameTabsProps {
    gameState: GameState;
    resetGame: () => void;
}

const GameTabs: React.FC<GameTabsProps> = ({ gameState, resetGame }) => {
    const {leaveGame} = useLeaveGame();

    const handleNotImplemented = () => {
        toast("Don't bother me")
    };

    const handleLeaveGame = () => {
        leaveGame()
    };
    return (
        <div className="h-full flex flex-col p-2">
            <Tabs defaultValue="play" className="w-full flex flex-col flex-grow">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
                    <TabsTrigger value="play">
                        <Play className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="moves">
                        <History className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="game">
                        <Info className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="chat">
                        <Puzzle className="w-4 h-4" />
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="play" className="flex-grow overflow-y-auto p-2">
                    <PlayTab handleNotImplemented={handleNotImplemented} />
                </TabsContent>

                <TabsContent value="moves" className="flex-grow flex flex-col p-2">
                    <MovesTab gameState={gameState} handleNotImplemented={handleLeaveGame} />
                </TabsContent>

                <TabsContent value="game" className="flex-grow p-2">
                    <GameInfoTab gameState={gameState} />
                </TabsContent>

                <TabsContent value="chat" className="flex-grow p-2">
                    <ChatTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default GameTabs;
