export const apiRoutes = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout'
    },

    player: {
        profile: () => `api/players/profile`,
        online: 'api/players/online',
    },
    game: {
        fen: (gameId: string) => `api/games/${gameId}/fen`,
        makeMove: (gameId: string) => `api/moves/${gameId}`,
        start: (gameId: string, time: string) => `api/games/${gameId}/start?time=${time}`,
    },
    
    invitation: {
        invite: (toUserId: number) => `api/games/${toUserId}/invite`,
        accept: (fromUserId: number) => `api/games/${fromUserId}/accept`,
        reject: (fromUserId: number) => `api/games/${fromUserId}/reject`,
    }
};
