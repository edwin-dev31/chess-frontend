import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import GameBoard from '../game/GameBoard';
import PlayerProfile from '../player/PlayerProfile';
import GameHistory from '../game/GameHistory';
import Settings from '../settings/Settings';
import { useNavigate } from 'react-router-dom';
import { useInitialColorSubscription } from '../../lib/hooks/socket/useGameStartSocket';
export type ActiveView = 'game' | 'profile' | 'history' | 'settings';


const ChessApp = () => {
    const [activeView, setActiveView] = useState<ActiveView>('game');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const { code } = useParams<{ code: string }>();
    useInitialColorSubscription();

    const renderContent = () => {
        switch (activeView) {
            case 'game':
                return <GameBoard gameCode={code} />;
            case 'profile':
                return <PlayerProfile />;
            case 'history':
                return <GameHistory />;
            case 'settings':
                return <Settings />;
            default:
                return <GameBoard gameCode={code} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-800">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                activeView={activeView}
                onViewChange={setActiveView}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                    activeView={activeView}
                />

                <motion.main
                    className="flex-1 p-4 lg:p-6 overflow-auto bg-[#1e293b]"
                    key={activeView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {renderContent()}
                </motion.main>
            </div>
        </div>
    );
};

export default ChessApp;
