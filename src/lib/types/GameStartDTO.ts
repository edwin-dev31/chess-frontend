
import { Color } from "./Definitions";

export interface GameStartDTO {
    color: Color;
    code: string;
    opponentId: number;
    opponentUsername: string;
    opponentProfileImage: string;
}
