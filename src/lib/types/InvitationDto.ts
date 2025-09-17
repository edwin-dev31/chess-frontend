export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface InvitationDto {
    gameId: number;
    fromUserId: number;
    toUserId: number;
    status: InvitationStatus;
}
