import { useState } from 'react';
import { apiRoutes } from '@/lib/constants/apiRoutes';
import { apiHelper } from '@/lib/helpers/apiHelper';
import { useAuthStorage } from '@/lib/hooks/auth/useAuthStorage';
import { useToast } from '@/components/ui/use-toast';

type InvitationAction = 'invite' | 'accept' | 'reject';

const useInvitationAction = (action: InvitationAction) => {
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStorage();
    const { toast } = useToast();

    const performAction = async (userId: number) => {
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
                    url = apiRoutes.invitation.invite(userId);
                    break;
                case 'accept':
                    url = apiRoutes.invitation.accept(userId);
                    break;
                case 'reject':
                    url = apiRoutes.invitation.reject(userId);
                    break;
                default:
                    throw new Error('Invalid invitation action.');
            }

            await apiHelper(url, {
                method: 'POST',
                token: token,
            });

            let successMessage = '';
            switch (action) {
                case 'invite':
                    successMessage = 'Invitation sent successfully.';
                    break;
                case 'accept':
                    successMessage = 'Invitation accepted successfully.';
                    break;
                case 'reject':
                    successMessage = 'Invitation rejected successfully.';
                    break;
            }

            toast({ title: '✅ Success', description: successMessage });

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
    const invitePlayer = (toUserId: number) => performAction(toUserId);
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
