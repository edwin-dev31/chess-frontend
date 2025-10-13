export type PieceType =
    | 'rook'
    | 'knight'
    | 'bishop'
    | 'queen'
    | 'king'
    | 'pawn';

export interface Piece {
    type: PieceType;
    color: Color;
}

export type Board = (Piece | null)[][];

export interface PlayerInfo {
    name: string;
    rating: number;
    timeLeft: string;
}

export interface GameState {
    board: Board;
    currentPlayer: Color;
    moveHistory: any[]; 
    lastMove: any;
    players: {
        white: PlayerInfo;
        black: PlayerInfo;
    };
    captured: {
        white: Piece[];
        black: Piece[];
    };
}

export enum Color {
    WHITE = 'WHITE',
    BLACK = 'BLACK',
}

export enum PlayerStatus {
    ONLINE,
    OFFLINE,
    IN_GAME
}

export enum MoveStatus {
    CONTINUES = "CONTINUES",
    CHECK = "CHECK",
    CHECKMATE = "CHECKMATE",
    STALEMATE = "STALEMATE",
    LEFT = "LEFT"
}