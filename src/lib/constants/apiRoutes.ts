export const apiRoutes  = {
  login: "/auth/login",
  register: "/auth/register",
  game: {
    fen: (gameId: number) => `api/games/${gameId}/fen`,
    makeMove: (gameId: number) => `api/moves/${gameId}`,
  }
};
