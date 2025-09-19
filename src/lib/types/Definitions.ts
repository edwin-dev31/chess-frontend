export type PieceType =
    | 'rook'
    | 'knight'
    | 'bishop'
    | 'queen'
    | 'king'
    | 'pawn';
export type PieceColor = 'black' | 'white';

export interface Piece {
    type: PieceType;
    color: PieceColor;
}

export type Board = (Piece | null)[][];

export interface PlayerInfo {
    name: string;
    rating: number;
    timeLeft: string;
}

export interface GameState {
    board: Board;
    currentPlayer: PieceColor;
    moveHistory: any[]; // TODO: Define a proper type for move history
    lastMove: any; // TODO: Define a proper type for last move
    players: {
        white: PlayerInfo;
        black: PlayerInfo;
    };
    captured: {
        white: Piece[];
        black: Piece[];
    };
}

export type Color = 'WHITE' | 'BLACK';