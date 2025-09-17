import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, User, RockingChair as ChessRook } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { ActiveView } from '../chess/ChessApp';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { useNotificationsSocket } from '../../lib/hooks/useNotificationsSocket';
import { InvitationNotification } from '../notifications/InvitationNotification';

interface HeaderProps {
    onMenuToggle: () => void;
    activeView: ActiveView;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, activeView }) => {
    const { pendingInvitations, removeInvitation } = useNotificationsSocket();

    const getViewTitle = (): string => {
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
                        <ChessRook className="h-7 w-7 text-blue-400" />
                        <h1 className="text-xl font-bold text-white hidden sm:block">
                            ChessHub
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-300 hover:text-white hover:bg-slate-700 relative"
                            >
                                <Bell className="h-5 w-5" />
                                {pendingInvitations.length > 0 && (
                                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                        {pendingInvitations.length}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="w-80 bg-slate-800 border border-slate-700 rounded-md shadow-md p-1 text-white"
                                sideOffset={5}
                            >
                                <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold flex justify-between items-center">
                                    <span>Game Invitations</span>
                                    
                                </DropdownMenu.Label>
                                <DropdownMenu.Separator className="h-px bg-slate-700 my-1" />
                                <InvitationNotification pendingInvitations={pendingInvitations} removeInvitation={removeInvitation} />
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

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
