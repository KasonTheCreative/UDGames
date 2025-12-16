import { Play, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import type { Game } from '../../types/game';

interface GameCardProps {
  game: Game;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const handlePlayClick = () => {
    window.open(`/game/${game.id}`, '_blank');
  };

  return (
    <Card 
      className="game-card group animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={handlePlayClick}
    >
      <CardContent className="p-0">
        {/* Game Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {game.image ? (
            <img 
              src={game.image} 
              alt={game.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-muted to-card" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-full items-center justify-center">
              <Button size="lg" className="gap-2 animate-fade-in">
                <Play className="h-5 w-5" />
                Play Now
              </Button>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute right-2 top-2 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
            {game.category}
          </div>

          {/* External Link Badge */}
          <div className="absolute left-2 top-2 rounded-full bg-secondary/90 p-2 backdrop-blur-sm">
            <ExternalLink className="h-3 w-3 text-secondary-foreground" />
          </div>
        </div>

        {/* Game Info */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-bold text-foreground">
            {game.title}
          </h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {game.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>{game.rating}</span>
            </div>
            <span>{game.plays} plays</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
