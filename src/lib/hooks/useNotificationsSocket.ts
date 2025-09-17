import { useState, useEffect, useRef } from 'react';
import { InvitationDto } from '../types/InvitationDto';
import { socketHelper } from './useSocket/socketHelper';
import { subscribeToNotifications } from './useSocket/notifications';

export const useNotificationsSocket = () => {
    const [pendingInvitations, setPendingInvitations] = useState<InvitationDto[]>([]);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const handleNewInvitation = (invitation: InvitationDto) => {
            alert("handleNewInvitation called with: " + JSON.stringify(invitation));
            setPendingInvitations((prev) => {
                if (invitation.status === 'PENDING') {
                    // Avoid adding duplicates
                    if (prev.find((i) => i.gameId === invitation.gameId)) {
                        return prev;
                    }
                    return [invitation, ...prev];
                } else {
                    return prev.filter((i) => i.gameId !== invitation.gameId);
                }
            });
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

        const connectionCheckInterval = setInterval(checkConnection, 2000); // Check every 2 seconds

        return () => {
            clearInterval(connectionCheckInterval);
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
            socketHelper.disconnect();
        };
    }, []);

    return { pendingInvitations };
};