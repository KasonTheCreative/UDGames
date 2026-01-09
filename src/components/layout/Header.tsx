import { Search, Zap, Settings, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';
import { OnlineCounter } from '../features/OnlineCounter';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ searchQuery = '', onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group relative">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-2.5">
              <Zap className="h-6 w-6 text-white" fill="currentColor" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black gradient-text tracking-tight">
              UD-Games
            </span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Unblocked</span>
          </div>
        </a>

        {/* Search Bar */}
        {onSearchChange && (
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 h-12 bg-card/50 backdrop-blur-xl border-white/10 rounded-xl focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <OnlineCounter />
          <a href="/" className="nav-link group">
            <Sparkles className="h-4 w-4 inline-block mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            Games
          </a>
          <a href="/tools" className="nav-link">Tools</a>
          <a href="/music" className="nav-link">Music</a>
          <a href="/chat" className="nav-link">Chat</a>
          <a href="/community" className="nav-link">Community</a>
          <a href="/ai" className="nav-link">AI</a>
          <a href="/follow" className="nav-link">Follow</a>

          <div className="w-px h-6 bg-white/10 mx-2"></div>

          <a href="/settings" className="nav-link" title="Settings">
            <Settings className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
