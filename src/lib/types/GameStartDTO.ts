import { PlayerProfileDTO } from "./PlayerProfileDTO";
import { Color } from "./Definitions";

export interface GameStartDTO {
    color: Color;
    code: string;
    whitePlayer: PlayerProfileDTO;
    blackPlayer: PlayerProfileDTO;
}
