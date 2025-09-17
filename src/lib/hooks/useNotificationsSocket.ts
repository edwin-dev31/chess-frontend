import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvitationDto } from '../types/InvitationDto';
import { socketHelper } from './useSocket/socketHelper';
import { subscribeToNotifications } from './useSocket/notifications';

export const useNotificationsSocket = () => {
    const [pendingInvitations, setPendingInvitations] = useState<InvitationDto[]>([]);
    const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);
    const navigate = useNavigate();

    // Effect to handle navigation when the target is set
    useEffect(() => {
        if (navigationTarget) {
            navigate(navigationTarget);
        }
    }, [navigationTarget, navigate]);

    // Effect to manage socket connection and subscriptions
    useEffect(() => {
        const handleNewInvitation = (invitation: InvitationDto) => {
            // Update the list of pending invitations based on the new status
            setPendingInvitations(prev => {
                // Always remove the old version of the invitation, if it exists
                const filtered = prev.filter(i => i.code !== invitation.code);

                // If the new status is PENDING, add it to the list
                if (invitation.status === 'PENDING') {
                    return [invitation, ...filtered];
                }

                // For ACCEPTED or REJECTED, just return the filtered list (effectively removing it)
                return filtered;
            });

            // Handle the navigation side-effect for accepted invitations
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
    }, []); // This effect should run only once to set up the socket

    const removeInvitation = (code: string) => {
        setPendingInvitations(prev => prev.filter(i => i.code !== code));
    };

    return { pendingInvitations, removeInvitation };
};