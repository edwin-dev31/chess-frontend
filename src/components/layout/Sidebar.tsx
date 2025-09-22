import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    User,
    History,
    Settings,
    Trophy,
    LogOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ActiveView } from '../chess/ChessApp';
import useAuth from '@/lib/hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    activeView: ActiveView;
    onViewChange: (view: ActiveView) => void;
}

interface MenuItem {
    id: ActiveView;
    label: string;
    icon: React.ElementType;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onToggle,
    activeView,
    onViewChange,
}) => {
    const menuItems: MenuItem[] = [
        { id: 'game', label: 'Jugar', icon: Play },
        { id: 'profile', label: 'Perfil', icon: User },
        { id: 'history', label: 'Historial', icon: History },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ];
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.aside
            className={cn(
                'bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300',
                isOpen ? 'w-64' : 'w-16'
            )}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Trophy className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-white font-bold text-lg">
                                ChessHub
                            </span>
                        </motion.div>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="text-white hover:bg-slate-700"
                    >
                        {isOpen ? (
                            <ChevronLeft className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;

                        return (
                            <Button
                                key={item.id}
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={cn(
                                    'w-full justify-start text-white hover:bg-slate-700',
                                    isActive && 'bg-blue-600 hover:bg-blue-700',
                                    !isOpen && 'justify-center px-2'
                                )}
                                onClick={() => onViewChange(item.id)}
                            >
                                <Icon className="h-4 w-4" />
                                {isOpen && (
                                    <span className="ml-2">{item.label}</span>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-600">
                <Button
                    key="logout"
                    className={cn(
                        'w-full justify-start text-white',
                        'bg-red-600 hover:bg-red-800 rounded-md',
                        !isOpen && 'justify-center px-2'
                    )}
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    {isOpen && (
                        <span className="ml-2">Logout</span>
                    )}
                </Button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
