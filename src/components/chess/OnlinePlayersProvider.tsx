import React, { createContext, useContext, useMemo } from 'react';
import { useSubscribeOnline } from '@/lib/hooks/socket/useSubscribeOnline';
import { PlayerOnlineDTO } from '@/lib/types/PlayerOnlineDTO';
import { useProfile } from '@/lib/hooks/player/useProfile';

const OnlinePlayersContext = createContext<PlayerOnlineDTO[]>([]);

export const OnlinePlayersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const onlinePlayers = useSubscribeOnline();
  const { profile } = useProfile();

  const filteredPlayers = useMemo(() => {
    if (!profile) {
      return onlinePlayers;
    }
    return onlinePlayers.filter(player => player.id !== profile.id);
  }, [onlinePlayers, profile]);

  return (
    <OnlinePlayersContext.Provider value={filteredPlayers}>
      {children}
    </OnlinePlayersContext.Provider>
  );
};

export const useOnlinePlayers = () => useContext(OnlinePlayersContext);
