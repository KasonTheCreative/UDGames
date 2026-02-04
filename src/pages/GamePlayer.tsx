import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Maximize2, Loader2, Lock, Download, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { games } from '../constants/games';

const loadingPrompts = [
  "Loading… because instant gratification is overrated.",
  "Please wait. Good things take time.",
  "Summoning pixels…",
  "Reticulating splines.",
  "Still faster than real life.",
  "Charging the hamsters.",
  "Warming up the servers.",
  "Just a moment… or three.",
  "Reality is buffering.",
  "Fetching awesomeness.",
  "Loading… don't blink.",
  "Almost there. Probably.",
  "Turning coffee into code.",
  "Assembling fun.",
  "Spinning dramatically.",
  "Please stand by. Or sit.",
  "Installing magic.",
  "Hold tight, hero.",
  "Preparing something cool.",
  "This won't take long. (Maybe.)",
  "Counting to infinity.",
  "Optimizing fun levels.",
  "Good vibes incoming.",
  "Making things less broken.",
  "Checking the checklist twice.",
  "Aligning the stars.",
  "Loading… try not to panic.",
  "Applying last-minute miracles.",
  "Time flies when you're loading.",
  "Almost ready to impress you.",
  "Just enough time to breathe.",
  "Downloading imagination.",
  "Building suspense.",
  "Reality.exe is starting.",
  "One sec. Promise.",
  "Still loading. Thanks for your patience.",
  "Preparing epic moments.",
  "This is the calm before the fun.",
  "Polishing the pixels.",
  "Making sure it doesn't explode.",
  "Please enjoy this brief pause.",
  "Spawning content.",
  "The wait is part of the journey.",
  "Loading… resist the urge to click.",
  "Setting things up nicely.",
  "Summoning dragons. (Metaphorically.)",
  "Checking for bugs. Literally and figuratively.",
  "Just enough time to stretch.",
  "Powering up.",
  "Loading screen quote #50. Meta, right?",
  "Almost done. For real this time.",
  "Buffering like a pro.",
  "Preparing something delightful.",
  "Turning zeros into ones.",
  "Don't worry, it's working.",
  "If this takes long, blame the internet.",
  "Waiting builds character.",
  "Loading… please hum elevator music.",
  "Making it worth the wait.",
  "One moment while we do our thing.",
  "The fun is loading.",
  "Taking a deep digital breath.",
  "Just a tiny pause in the universe.",
  "Making sure it looks good.",
  "Almost ready to go.",
  "Reality is loading.",
  "Stand by for greatness.",
  "Spinning circles intensify.",
  "Getting all the bits in place.",
  "The suspense is intentional.",
  "Loading… please remain awesome.",
  "Good things are loading.",
  "We're getting there. Together.",
  "Progress is happening. Somewhere.",
  "Waking up the code.",
  "Please wait while magic happens.",
  "Loading screen quotes are hard.",
  "This is not frozen. Probably.",
  "Almost finished. Don't leave now.",
  "Just one more second.",
  "Preheating the fun.",
  "Getting ready to start.",
  "Loading… thanks for sticking around.",
  "Making pixels behave.",
  "You're still here? Nice.",
  "This is the price of greatness.",
  "Loading in progress. Progress not guaranteed.",
  "Something cool is coming.",
  "A moment of anticipation.",
  "Almost unlocked.",
  "Please enjoy this brief nothingness.",
  "Loading… try smiling.",
  "Getting everything just right.",
  "Not broken. Just thinking.",
  "Stay tuned.",
  "Loading screen quotes are almost done.",
  "Thanks for waiting. Seriously.",
  "Ready when you are.",
  "Last checks in progress."
];

export function GamePlayer() {
  const [game, setGame] = useState<typeof games[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPrompt, setLoadingPrompt] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const gameId = window.location.pathname.split('/').pop();
    const foundGame = games.find(g => g.id === gameId);
    if (foundGame) {
      setGame(foundGame);
      
      // Check if password is required
      if (foundGame.requiresPassword) {
        setIsPasswordRequired(true);
        setIsLoading(false);
        return;
      }
      
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (game && passwordInput === game.password) {
      setIsUnlocked(true);
      setPasswordError(false);
      setIsPasswordRequired(false);
      
      // Show loading screen
      setIsLoading(true);
      const randomPrompt = loadingPrompts[Math.floor(Math.random() * loadingPrompts.length)];
      setLoadingPrompt(randomPrompt);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 1000);
    }
  };

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

  // Password screen
  if (isPasswordRequired && !isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="glass-card p-8 space-y-6">
            {/* Lock Icon */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Lock className={`h-16 w-16 text-primary ${passwordError ? 'animate-shake' : 'animate-pulse'}`} />
                </div>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">{game.title}</h1>
              <p className="text-muted-foreground">This game is password protected</p>
            </div>
            
            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className={`text-center text-lg ${passwordError ? 'border-destructive animate-shake' : ''}`}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-xs text-destructive mt-2 text-center animate-fade-in">
                    Incorrect password. Try again.
                  </p>
                )}
              </div>
              
              <Button type="submit" className="w-full gap-2" size="lg">
                <Lock className="h-5 w-5" />
                Unlock Game
              </Button>
            </form>
            
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="w-full gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
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
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(game.url, '_blank')}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(game.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
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
            <Maximize2 className="h-4 w-4" />
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
