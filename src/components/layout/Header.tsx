import { Search, Gamepad2 } from 'lucide-react';
import { Input } from '../ui/input';
import { OnlineCounter } from '../features/OnlineCounter';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ searchQuery = '', onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
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
          <a href="/study" className="nav-link">Study</a>
          <a href="/art" className="nav-link">Art</a>
          <a href="/puzzles" className="nav-link">Puzzles</a>
          <a href="/books" className="nav-link">Books</a>
          <a href="/tools" className="nav-link">Tools</a>
          <a href="/videos" className="nav-link">Videos</a>
          <a href="/apps" className="nav-link">Apps</a>
          <a href="/music" className="nav-link">Music</a>
          <a href="/chat" className="nav-link">Chat</a>
          <a href="/ai" className="nav-link">AI</a>
        </nav>
      </div>
    </header>
  );
}
