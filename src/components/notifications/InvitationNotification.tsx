import React from 'react';
import { User, Check, X } from 'lucide-react';
import { useAcceptInvitation, useRejectInvitation } from '../../lib/hooks/invitation/useInvitation';
import { Button } from '../ui/button';
import { InvitationDto } from '../../lib/types/InvitationDto';

interface InvitationNotificationProps {
    pendingInvitations: InvitationDto[];
    removeInvitation: (code: string) => void;
}

export const InvitationNotification: React.FC<InvitationNotificationProps> = ({ pendingInvitations, removeInvitation }) => {
    const { acceptInvitation, loading: accepting } = useAcceptInvitation();
    const { rejectInvitation, loading: rejecting } = useRejectInvitation();

    if (pendingInvitations.length === 0) {
        return <div className="p-4 text-center text-sm text-slate-400">No pending invitations.</div>;
    }

    return (
        <div className="flex flex-col ">
            {pendingInvitations.map((invitation: InvitationDto) => (
                <div key={invitation.code} className="p-3 hover:bg-slate-700/50 rounded-lg transition-colors duration-150">
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center ring-2 ring-slate-600/50">
                            <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-200">
                                <span className="font-bold text-white"> {invitation.fromUsername.toLocaleUpperCase()}</span> has invited you to a match.
                            </p>
                            <div className="flex space-x-2 mt-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        removeInvitation(invitation.code);
                                        acceptInvitation(invitation.fromUserId);
                                    }}
                                    disabled={accepting || rejecting}
                                    className="bg-green-500/10 text-green-400 hover:bg-green-500/20 h-8 px-2"
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        removeInvitation(invitation.code);
                                        rejectInvitation(invitation.fromUserId);
                                    }}
                                    disabled={accepting || rejecting}
                                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 h-8 px-2"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};