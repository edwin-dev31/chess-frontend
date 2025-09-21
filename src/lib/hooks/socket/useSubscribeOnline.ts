// src/lib/hooks/socket/useSubscribeOnline.ts
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

    // Attempt to connect if not already connected
    if (!socketHelper.isConnected()) {
      socketHelper.connect();
    } else {
      // If already connected, immediately subscribe
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
