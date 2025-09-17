export const apiRoutes = {
    login: '/auth/login',
    register: '/auth/register',
    game: {
        fen: (gameId: string) => `api/games/${gameId}/fen`,
        makeMove: (gameId: string) => `api/moves/${gameId}`,
        start: (gameId: string) => `api/games/${gameId}/start`,
    },
        invitation: {
        invite: (toUserId: number) => `api/games/${toUserId}/invite`,
        accept: (fromUserId: number) => `api/games/${fromUserId}/accept`,
        reject: (fromUserId: number) => `api/games/${fromUserId}/reject`,
    }
};
