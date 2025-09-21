import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvitationDto } from '../../types/InvitationDto';
import { socketHelper } from '../../helpers/socketHelper';
import { subscribeToNotifications } from '../socket/notifications';

export const useNotificationsSocket = () => {
    const [pendingInvitations, setPendingInvitations] = useState<InvitationDto[]>([]);
    const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (navigationTarget) {
            navigate(navigationTarget);
        }
    }, [navigationTarget, navigate]);

    useEffect(() => {
        const handleNewInvitation = (invitation: InvitationDto) => {
            
            setPendingInvitations(prev => {
                const filtered = prev.filter(i => i.code !== invitation.code);

                if (invitation.status === 'PENDING') {
                    return [invitation, ...filtered];
                }

                return filtered;
            });

            if (invitation.status === 'ACCEPTED') {
                localStorage.setItem('currentGameId', invitation.code);
                setNavigationTarget(`/game/${invitation.code}`);
            }
        };

        const checkConnection = () => {
            if (socketHelper.isConnected()) {
                if (!unsubscribeRef.current) {
                    unsubscribeRef.current = subscribeToNotifications(handleNewInvitation);
                }
            } else {
                socketHelper.connect();
            }
        };

        checkConnection();

        const connectionCheckInterval = setInterval(checkConnection, 2000);

        return () => {
            clearInterval(connectionCheckInterval);
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
            socketHelper.disconnect();
        };
    }, []);

    const removeInvitation = (code: string) => {
        setPendingInvitations(prev => prev.filter(i => i.code !== code));
    };

    return { pendingInvitations, removeInvitation };
};