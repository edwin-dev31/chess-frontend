import { useState } from 'react';
import { apiRoutes } from '../../constants/apiRoutes';
import { apiHelper } from '../../helpers/apiHelper';
import { useAuthStorage } from '../auth/useAuthStorage';
import { useToast } from '../../../components/ui/use-toast';

type InvitationAction = 'invite' | 'accept' | 'reject';

const useInvitationAction = (action: InvitationAction) => {
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStorage();
    const { toast } = useToast();

    const performAction = async (fromUserId: number, toUserId?: number) => {
        setLoading(true);

        if (!token) {
            toast({ title: '❌ Error', description: 'Authentication token not found.' });
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

            await apiHelper(url, {
                method: 'POST',
                token: token,
            });

            // Optional: Add success toast here if needed
            // toast({ title: '✅ Success', description: `Invitation ${action}ed successfully.` });

        } catch (err: any) {
            const errorMessage = err.message || `Failed to ${action} invitation.`;
            toast({
                title: '❌ Error',
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return { performAction, loading };
};

export const useInvitePlayer = () => {
    const { performAction, loading } = useInvitationAction('invite');
    const invitePlayer = (gameId: number, toUserId: number) => performAction(gameId, toUserId);
    return { invitePlayer, loading };
};

export const useAcceptInvitation = () => {
    const { performAction, loading } = useInvitationAction('accept');
    const acceptInvitation = (fromUserId: number) => performAction(fromUserId);
    return { acceptInvitation, loading };
};

export const useRejectInvitation = () => {
    const { performAction, loading } = useInvitationAction('reject');
    const rejectInvitation = (fromUserId: number) => performAction(fromUserId);
    return { rejectInvitation, loading };
};