export const apiRoutes = {
    login: '/auth/login',
    register: '/auth/register',
    game: {
        fen: (gameId: number) => `api/games/${gameId}/fen`,
        makeMove: (gameId: number) => `api/moves/${gameId}`,
    },
        invitation: {
        invite: (toUserId: number) => `api/games/${toUserId}/invite`,
        accept: (fromUserId: number) => `api/games/${fromUserId}/accept`,
        reject: (fromUserId: number) => `api/games/${fromUserId}/reject`,
    }
};
