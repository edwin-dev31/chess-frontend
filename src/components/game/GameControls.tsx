import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Pause, Flag } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

import { useInvitePlayer } from '../../lib/hooks/invitation/useInvitation';

interface GameControlsProps {
    onReset: () => void;
    className?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
    onReset,
    className,
}) => {
    const { toast } = useToast();
    const { invitePlayer, loading, error } = useInvitePlayer();

    const handleSendInvitation = () => {
        invitePlayer(2);
        toast({
            title: 'Invitation Sent',
            description: 'An invitation has been sent to user 2 for game 1.',
        });
    };

    const handlePause = () => {
        toast({
            title: 'Esta función aún no está implementada',
            description: '¡ ! 🚀',
        });
    };

    const handleResign = () => {
        toast({
            title: '🚧 Esta función aún no está implementada',
            description: '¡ ! 🚀',
        });
    };

    return (
        <motion.div
            className={`flex space-x-3 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <Button
                onClick={onReset}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar
            </Button>

            <Button
                onClick={handlePause}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
                <Pause className="h-4 w-4 mr-2" />
                Pausar
            </Button>

            <Button
                onClick={handleResign}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
            >
                <Flag className="h-4 w-4 mr-2" />
                Rendirse
            </Button>

            <Button
                onClick={handleSendInvitation}
                variant="secondary"
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600"
            >
                Send Test Invitation
            </Button>
        </motion.div>
    );
};

export default GameControls;
