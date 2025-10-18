import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Play, History, Info, Puzzle } from 'lucide-react';
import { GameState } from '../../lib/types/Definitions';
import PlayTab from './gameTabs/PlayTab';
import MovesTab from './gameTabs/MovesTab';
import GameInfoTab from './gameTabs/GameInfoTab';
import ChatTab from './gameTabs/ChatTab';
import { useLeaveGame } from '@/lib/hooks/game/useLeaveGame';
import { useGetPgn } from '@/lib/hooks/game/useGetPgn';
import { toast } from 'sonner';

interface GameTabsProps {
    gameState: GameState;
    resetGame: () => void;
}

const GameTabs: React.FC<GameTabsProps> = ({ gameState, resetGame }) => {
    const { leaveGame } = useLeaveGame();
    const { fetchPgn } = useGetPgn();
    const [pgn, setPgn] = useState<string | null>(null);

    const handleLeaveGame = async () => {
        await leaveGame();
        const res = await fetchPgn();
        if (res?.pgn) {
            setPgn(res.pgn);
            toast.success('PGN obtenido correctamente');
        } else {
            toast.error('No se pudo obtener el PGN');
        }
    };

    return (
        <div className="h-full flex flex-col p-2">
            <Tabs defaultValue="play" className="w-full flex flex-col flex-grow">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
                    <TabsTrigger value="play"><Play className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="moves"><History className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="game"><Info className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="chat"><Puzzle className="w-4 h-4" /></TabsTrigger>
                </TabsList>

                <TabsContent value="play" className="flex-grow overflow-y-auto p-2">
                    <PlayTab handleNotImplemented={() => toast("Don't bother me")} />
                </TabsContent>

                <TabsContent value="moves" className="flex-grow flex flex-col p-2">
                    <MovesTab 
                        gameState={gameState} 
                        pgn={pgn}
                        handleLeaveGame={handleLeaveGame}
                    />
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
