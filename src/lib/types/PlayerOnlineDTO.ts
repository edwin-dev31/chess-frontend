import { PlayerStatus } from './Definitions';

export interface PlayerOnlineDTO {
  id: number;
  username: string;
  imageUrl: string;
  status: PlayerStatus;
}
