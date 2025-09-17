export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface InvitationDto {
    code: string;
    fromUserId: number;
    fromUsername: string;
    toUserId: number;
    toUsername: string;
    status: InvitationStatus;
}
