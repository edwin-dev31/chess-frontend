import { PlayerStatus } from "./Definitions";

export interface PlayerProfileDTO {
    id: number;
    username: string;
    rating: number;
    imageUrl: string;
    status: PlayerStatus;
}
