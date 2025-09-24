import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GameBoard from '@/components/game/GameBoard';
import PlayerProfile from '@/components/player/PlayerProfile';
import GameHistory from '@/components/game/GameHistory';
import Settings from '@/components/settings/Settings';
import { useNavigate } from 'react-router-dom';

import { usePlayerStatus } from '@/lib/contexts/PlayerStatusContext';
import { PlayerStatus } from '@/lib/types/PlayerStatus'; // Import PlayerStatus enum

export type ActiveView = 'game' | 'profile' | 'history' | 'settings';


const ChessApp = () => {
    const [activeView, setActiveView] = useState<ActiveView>('game');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const { code } = useParams<{ code: string }>();

    const { setOnline, status } = usePlayerStatus();

    useEffect(() => {
        if (status !== PlayerStatus.IN_GAME) {
            setOnline();
        }
    }, [setOnline, status]);

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
