import { useEffect } from "react";
import { socketHelper } from "../socketHelper";
import { CreateMoveDTO } from "../types";

type UseChessSocketProps = {
  gameId: number;
  onFenUpdate?: (fen: string) => void;
  onMove?: (move: any) => void;
  onColor?: (color: any) => void;
};

export const useChessSocket = ({ gameId, onFenUpdate, onMove, onColor }: UseChessSocketProps) => {

  
  useEffect(() => {
    socketHelper.connect(() => {
      if (onFenUpdate) {
        socketHelper.subscribe(`/topic/games/${gameId}/fen`, (msg) => {
          if (msg.gameId === gameId.toString()) {
            console.log("♟️ FEN recibido:", msg);
            onFenUpdate(msg.fen);
          }
        });

        socketHelper.send(`/app/games/${gameId}/fen`, { });
      }

      if (onMove) {
        socketHelper.subscribe(`/topic/moves/${gameId}`, (msg) => {
          console.log("♟️ Movimiento recibido:", msg);
          onMove(msg);
        });
      }
      socketHelper.subscribe(`/topic/games/${gameId}/color`, (message) => {
         onColor(message.color);
      });

      socketHelper.send(`/app/games/${gameId}/color`, { });
    });

    return () => {
      socketHelper.disconnect();
    };
  }, [gameId, onFenUpdate, onMove]);

    const sendMove = (moveDto: CreateMoveDTO) => {
    console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀")
    console.warn("🚀 CHESS MOVE SENT (useChessSocket):", moveDto);
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    socketHelper.send(`/app/moves/${gameId}`, moveDto, headers);
  };

  const requestFen = () => {
    socketHelper.send(`/app/games/${gameId}/fen`, { });
  };

  const requestColor = () => {
    socketHelper.send(`/app/games/${gameId}/color`, { });
  };

  return { sendMove, requestFen, requestColor };
};
