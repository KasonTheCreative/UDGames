import { Users } from 'lucide-react';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';

export function OnlineCounter() {
  const { onlineCount } = useOnlineUsers();

  return (
    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
      <div className="relative">
        <Users className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
      </div>
      <span className="font-bold">{onlineCount.toLocaleString()}</span>
      <span className="hidden sm:inline">Online</span>
    </div>
  );
}
