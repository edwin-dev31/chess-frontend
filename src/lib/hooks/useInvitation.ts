import { useState } from 'react';
import { javaAPI } from '../axios';
import { apiRoutes } from '../constants/apiRoutes';

type InvitationAction = 'invite' | 'accept' | 'reject';

const useInvitationAction = (action: InvitationAction) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const performAction = async (fromUserId: number, toUserId?: number) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No authentication token found.');
            setLoading(false);
            return;
        }

        try {
            let url: string;
            switch (action) {
                case 'invite':
                    if (toUserId === undefined) {
                        throw new Error('toUserId is required for inviting a player.');
                    }
                    url = apiRoutes.invitation.invite(toUserId);
                    break;
                case 'accept':
                    url = apiRoutes.invitation.accept(fromUserId);
                    break;
                case 'reject':
                    url = apiRoutes.invitation.reject(fromUserId);
                    break;
                default:
                    throw new Error('Invalid invitation action.');
            }

            await javaAPI.post(url, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (action === 'accept' || action === 'reject') {
               // removeInvitation(gameId);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to ${action} invitation.`);
        } finally {
            setLoading(false);
        }
    };

    return { performAction, loading, error };
};

export const useInvitePlayer = () => {
    const { performAction, loading, error } = useInvitationAction('invite');
    const invitePlayer = (gameId: number, toUserId: number) => performAction(gameId, toUserId);
    return { invitePlayer, loading, error };
};

export const useAcceptInvitation = () => {
    const { performAction, loading, error } = useInvitationAction('accept');
    const acceptInvitation = (fromUserId: number) => performAction(fromUserId);
    return { acceptInvitation, loading, error };
};

export const useRejectInvitation = () => {
    const { performAction, loading, error } = useInvitationAction('reject');
    const rejectInvitation = (fromUserId: number) => performAction(fromUserId);
    return { rejectInvitation, loading, error };
};