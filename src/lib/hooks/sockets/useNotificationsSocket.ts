import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvitationDto } from '@/lib/types/InvitationDto';
import { usePlayerStatus } from '@/lib/contexts/PlayerStatusContext';
import { useToast } from '@/components/ui/use-toast';

export const useNotificationsSocket = () => {
    const { lastInvitation } = usePlayerStatus();
    const [pendingInvitations, setPendingInvitations] = useState<InvitationDto[]>([]);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (lastInvitation) {
            setPendingInvitations(prev => {
                const filtered = prev.filter(i => i.code !== lastInvitation.code);
                if (lastInvitation.status === 'PENDING') {
                    return [lastInvitation, ...filtered];
                }
                return filtered;
            });

            if (lastInvitation.status === 'ACCEPTED') {
                toast({
                    title: '✅ Invitation Accepted',
                    description: `${lastInvitation.fromUsername} accepted your invitation.`,
                });
                if (lastInvitation.code) {
                    localStorage.setItem('currentGameId', lastInvitation.code);
                    navigate(`/game/${lastInvitation.code}`);
                } else {
                    console.warn('useNotificationsSocket: Received ACCEPTED invitation with null code. Cannot navigate.', lastInvitation);
                }
            } else if (lastInvitation.status === 'REJECTED') {
                toast({
                    title: '❌ Invitation Rejected',
                    description: `${lastInvitation.fromUsername} rejected your invitation.`,
                });
            }
        }
    }, [lastInvitation, navigate, toast]);

    const removeInvitation = (code: string) => {
        setPendingInvitations(prev => prev.filter(i => i.code !== code));
    };

    return { pendingInvitations, removeInvitation };
};
