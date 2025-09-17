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
            if (invitation.status === 'ACCEPTED') {
                localStorage.setItem('currentGameId', invitation.code);
                setPendingInvitations((prev) => prev.filter((i) => i.code !== invitation.code));
                // Set the navigation target instead of navigating directly
                setNavigationTarget(`/game/${invitation.code}`);
            } else if (invitation.status === 'PENDING') {
                setPendingInvitations((prev) => {
                    if (prev.find((i) => i.code === invitation.code)) {
                        return prev;
                    }
                    return [invitation, ...prev];
                });
            } else { // REJECTED or other statuses
                setPendingInvitations((prev) => prev.filter((i) => i.code !== invitation.code));
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

    return { pendingInvitations };
};