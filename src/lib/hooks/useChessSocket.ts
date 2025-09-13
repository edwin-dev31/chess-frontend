import { useEffect } from "react";
import { socketHelper } from "../socketHelper";

export const useChessSocket = (
  gameId: number,
  onFenUpdate: (fen: string) => void
) => {
  useEffect(() => {
    socketHelper.connect(() => {
      socketHelper.subscribe(`/topic/games/${gameId}/fen`, (msg) => {
        console.log("♟️ FEN recibido:", msg);
        onFenUpdate(msg.fen);
      });

      socketHelper.send("/app/games/fen", { gameId });
    });

    return () => {
      socketHelper.disconnect();
    };
  }, [gameId, onFenUpdate]);
};
