import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Maximize2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { games } from '../constants/games';

const loadingPrompts = [
  "67 ohio sigma (god i have no friends)",
  "wow you found out kason made this site.",
  "someone send help i saw a man and got hard.",
  "Feeding the imaginary ducks.",
  "Checking if pigeons have opinions.",
  "Untying spaghetti from the fourth dimension.",
  "Asking a rock for life advice.",
  "Counting all the chairs that have ever existed.",
  "Putting tiny hats on large thoughts.",
  "Negotiating with a suspicious banana.",
  "Looking for the TV remote in the freezer.",
  "Rehearsing for a play that never happens.",
  "Explaining taxes to a goldfish.",
  "Making eye contact with the void.",
  "Teaching socks how to disappear properly.",
  "Waiting for the floor to blink first.",
  "Arguing with a cloud named Kevin.",
  "Checking if this text is actually real.",
  "once i jerked of with a duck",
  "luka is emo still"
];

export function GamePlayer() {
  const [game, setGame] = useState<typeof games[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPrompt, setLoadingPrompt] = useState('');

  useEffect(() => {
    const gameId = window.location.pathname.split('/').pop();
    const foundGame = games.find(g => g.id === gameId);
    if (foundGame) {
      setGame(foundGame);
      // Set random loading prompt
      const randomPrompt = loadingPrompts[Math.floor(Math.random() * loadingPrompts.length)];
      setLoadingPrompt(randomPrompt);
      
      // Show loading screen for 2-3 seconds
      const loadingTime = Math.random() * 1000 + 2000; // 2-3 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, loadingTime);
    }
  }, []);

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Game Not Found</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 max-w-lg px-6">
          {/* Loading Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-card/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <Loader2 className="h-20 w-20 animate-spin text-primary mx-auto" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Game Title */}
          <div className="glass-card p-6">
            <h2 className="text-3xl font-black gradient-text mb-3">Loading {game.title}</h2>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4"></div>
            <p className="text-base text-muted-foreground italic leading-relaxed px-4">
              "{loadingPrompt}"
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto space-y-2">
            <div className="h-3 bg-card/60 backdrop-blur-xl border border-white/20 rounded-full overflow-hidden shadow-lg">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground text-center font-medium">Preparing your game...</p>
          </div>
          
          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
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
            onClick={() => window.history.back()}
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
