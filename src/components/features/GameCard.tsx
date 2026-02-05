import { Play, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import type { Game } from '../../types/game';

interface GameCardProps {
  game: Game;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const handlePlayClick = () => {
    window.location.href = `/game/${game.id}`;
  };

  return (
    <Card 
      className="game-card group animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={handlePlayClick}
    >
      <CardContent className="p-0">
        {/* Game Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-card">
          {game.image ? (
            <img 
              src={game.image} 
              alt={game.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/80 via-purple-500/80 to-pink-500/80 opacity-0 transition-all duration-500 group-hover:opacity-100 flex items-center justify-center">
            <Button size="lg" className="gap-2 animate-fade-in bg-white text-black hover:bg-white/90 font-bold">
              <Play className="h-5 w-5 fill-current" />
              Play Now
            </Button>
          </div>
          
          {/* Category Badge */}
          <div className="absolute right-3 top-3 rounded-xl bg-black/50 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white border border-white/20">
            {game.category}
          </div>


        </div>

        {/* Game Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
              {game.title}
            </h3>
            <Zap className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {game.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-end text-xs">
            <div className="px-2 py-1 rounded-lg bg-primary/10 text-primary font-semibold">
              Free
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}
