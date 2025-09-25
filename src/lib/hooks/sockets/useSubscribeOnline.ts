import { usePlayerStatus } from '@/lib/contexts/PlayerStatusContext';

export function useSubscribeOnline() {
  const { onlinePlayers } = usePlayerStatus();
  return onlinePlayers;
}