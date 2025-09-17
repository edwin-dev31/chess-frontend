export const apiRoutes = {
    login: '/auth/login',
    register: '/auth/register',
    game: {
        fen: (gameId: number) => `api/games/${gameId}/fen`,
        makeMove: (gameId: number) => `api/moves/${gameId}`,
    },
        invitation: {
        invite: (gameId: number, toUserId: number) => `api/games/${gameId}/invite?toUserId=${toUserId}`,
        accept: (gameId: number) => `api/games/${gameId}/accept`,
        reject: (gameId: number) => `api/games/${gameId}/reject`,
    }
};
