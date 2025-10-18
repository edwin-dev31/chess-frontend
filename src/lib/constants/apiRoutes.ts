export const apiRoutes = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout'
    },

    player: {
        profile: () => `api/players/profile`,
        online: 'api/players/online',
        summary:  `api/players/summary`,
    },
    game: {
        fen: (gameId: string) => `api/games/${gameId}/fen`,
        pgn: (gameId: string) => `api/games/${gameId}/pgn`,
        toFen: () =>  `api/games/pgn`,
        makeMove: (gameId: string) => `api/moves/${gameId}`,
        start: (gameId: string, time: string) => `api/games/${gameId}/start?time=${time}`,
        leave: (gameId: string) => `api/games/${gameId}/leave`,
    },
    
    invitation: {
        invite: (toUserId: number) => `api/games/${toUserId}/invite`,
        accept: (fromUserId: number) => `api/games/${fromUserId}/accept`,
        reject: (fromUserId: number) => `api/games/${fromUserId}/reject`,
    }
};
