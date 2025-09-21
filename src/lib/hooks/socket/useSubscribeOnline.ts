import { useEffect, useState } from 'react';
import { socketHelper } from '@/lib/helpers/socketHelper';
import { PlayerOnlineDTO } from '@/lib/types/PlayerOnlineDTO';

export function useSubscribeOnline() {
  const [onlinePlayers, setOnlinePlayers] = useState<PlayerOnlineDTO[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const handleConnect = () => {
      unsubscribe = socketHelper.subscribe('/topic/online-players', (message) => {
        try {
          const players: PlayerOnlineDTO[] = JSON.parse(message.body);
          setOnlinePlayers(players);
        } catch (err) {
          console.error('Error parsing online players message:', err);
          setOnlinePlayers([]);
        }
      });
    };

    socketHelper.onConnect(handleConnect);

    if (!socketHelper.isConnected()) {
      socketHelper.connect();
    } else {
      handleConnect();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      socketHelper.offConnect(handleConnect);
    };
  }, []);

  return onlinePlayers;
}
