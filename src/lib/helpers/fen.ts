// src/lib/utils/fen.ts
import { Chess } from "chess.js";
import { Board, Color } from "@/lib/types/Definitions";

// Asumo que tu Board es Board = (Piece | null)[][]
// Piece: { type: 'pawn'|'rook'|..., color: Color }
export function fenToBoard(fen: string): Board {
  const chess = new Chess(fen);
  const boardFromChess = chess.board(); // devuelve matriz 8x8, filas 0..7 (8->1)
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = boardFromChess[r][c];
      if (sq) {
        // sq.type es 'p','r','n','b','q','k'
        let type: any = "";
        switch (sq.type) {
          case "p": type = "pawn"; break;
          case "r": type = "rook"; break;
          case "n": type = "knight"; break;
          case "b": type = "bishop"; break;
          case "q": type = "queen"; break;
          case "k": type = "king"; break;
          default: type = "pawn";
        }
        board[r][c] = {
          type,
          color: sq.color === "w" ? Color.WHITE : Color.BLACK,
        } as any;
      }
    }
  }

  return board;
}
