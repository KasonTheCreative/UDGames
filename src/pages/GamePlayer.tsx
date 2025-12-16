import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { games } from '../constants/games';

export function GamePlayer() {
  const [game, setGame] = useState<typeof games[0] | null>(null);

  useEffect(() => {
    const gameId = window.location.pathname.split('/').pop();
    const foundGame = games.find(g => g.id === gameId);
    if (foundGame) {
      setGame(foundGame);
    }
  }, []);

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Game Not Found</h1>
          <Button onClick={() => window.close()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Close Window
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.close()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{game.title}</h1>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(game.url, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const iframe = document.querySelector('iframe');
              if (iframe) {
                iframe.requestFullscreen();
              }
            }}
          >
            <Maximize2 className="mr-2 h-4 w-4" />
            Fullscreen
          </Button>
        </div>
      </header>

      {/* Game Container */}
      <div className="flex-1 overflow-hidden bg-background">
        <iframe
          src={game.url}
          className="h-full w-full border-0"
          title={game.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation"
        />
      </div>
    </div>
  );
}
