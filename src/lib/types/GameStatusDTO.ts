import { MoveStatus } from "./Definitions";

export interface GameStatusDTO{
    status: MoveStatus;
    message: string;
    winnerName: string;
    isGameOver: boolean;
}