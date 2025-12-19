import { Search, Gamepad2, Settings } from 'lucide-react';
import { Input } from '../ui/input';
import { OnlineCounter } from '../features/OnlineCounter';
import { getCurrentHoliday } from '../../lib/themes';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ searchQuery = '', onSearchChange }: HeaderProps) {
  const isChristmas = getCurrentHoliday() === 'christmas';
  
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 relative">
          {isChristmas && (
            <img 
              src="https://cdn-ai.onspace.ai/onspace/files/Cyvf8ac6pjD47L2jhEPje4/Untitled_Design_-_1_-_Edited.png"
              alt="Santa Hat"
              className="absolute -top-3 -left-8 w-12 h-12 object-contain animate-swing"
              style={{ transform: 'rotate(-15deg) scaleX(-1)' }}
            />
          )}
          <div className="rounded-lg bg-gaming-gradient p-2">
            <Gamepad2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold gradient-text">UD-Math</span>
        </a>

        {/* Search Bar */}
        {onSearchChange && (
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          <OnlineCounter />
          <a href="/" className="nav-link">Games</a>
          <a href="/art" className="nav-link">Art</a>
          <a href="/puzzles" className="nav-link">Puzzles</a>
          <a href="/tools" className="nav-link">Tools</a>
          <a href="/apps" className="nav-link">Apps</a>
          <a href="/music" className="nav-link">Music</a>
          <a href="/chat" className="nav-link">Chat</a>
          <a href="/ai" className="nav-link">AI</a>
          <a href="/settings" className="nav-link" title="Settings">
            <Settings className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
