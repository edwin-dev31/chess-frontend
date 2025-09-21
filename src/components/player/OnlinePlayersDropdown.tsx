import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '../ui/button';
import { Circle } from 'lucide-react';
import { useOnlinePlayers } from '@/components/chess/OnlinePlayersProvider';

export const OnlinePlayersDropdown: React.FC = () => {
  const onlinePlayers = useOnlinePlayers();
  
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-green-500 hover:text-green-400 hover:bg-slate-700 relative"
        >
          <Circle className="h-5 w-5 fill-current" />
         
          {onlinePlayers.length > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              {onlinePlayers.length}
            </span>
            
          )}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-60 bg-slate-800 border border-slate-700 rounded-md shadow-md p-1 text-white"
          sideOffset={5}
        >
          <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
            Online Players
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="h-px bg-slate-700 my-1" />
          {onlinePlayers.length === 0 ? (
            <DropdownMenu.Item className="px-2 py-1.5 text-sm text-slate-400 cursor-default">
              No players online
            </DropdownMenu.Item>
          ) : (
            onlinePlayers.map((player) => (
              <DropdownMenu.Item
                key={player.id}
                className="px-2 py-1.5 text-sm hover:bg-slate-700 rounded-sm cursor-pointer flex items-center justify-between"
                onSelect={() => alert(`Player ID: ${player.id}`)}
              >
                <span>{player.username}</span>

              </DropdownMenu.Item>
            ))
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
