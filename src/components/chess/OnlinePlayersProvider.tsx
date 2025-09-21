import React, { createContext, useContext } from 'react';
import { useSubscribeOnline } from '@/lib/hooks/socket/useSubscribeOnline';
import { PlayerOnlineDTO } from '@/lib/types/PlayerOnlineDTO';

const OnlinePlayersContext = createContext<PlayerOnlineDTO[]>([]);

export const OnlinePlayersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const onlinePlayers = useSubscribeOnline();
  return (
    <OnlinePlayersContext.Provider value={onlinePlayers}>
      {children}
    </OnlinePlayersContext.Provider>
  );
};

export const useOnlinePlayers = () => useContext(OnlinePlayersContext);
