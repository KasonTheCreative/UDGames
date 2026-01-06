import { Users } from 'lucide-react';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';

export function OnlineCounter() {
  const { onlineCount } = useOnlineUsers();

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative flex items-center gap-2 rounded-xl bg-card/40 backdrop-blur-xl border border-white/10 px-4 py-2.5 text-sm font-semibold">
        <div className="relative">
          <Users className="h-4 w-4 text-green-400" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse">
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping"></span>
          </span>
        </div>
        <span className="text-foreground font-bold">{onlineCount.toLocaleString()}</span>
        <span className="hidden sm:inline text-muted-foreground">Online</span>
      </div>
    </div>
  );
}
