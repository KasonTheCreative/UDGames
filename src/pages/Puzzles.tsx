import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Puzzle, Brain, Grid3x3, Target, Zap, Trophy } from 'lucide-react';

interface PuzzleGame {
  id: string;
  name: string;
  icon: typeof Puzzle;
  url: string;
  description: string;
}

const puzzleGames: PuzzleGame[] = [
  {
    id: 'wordle',
    name: 'Wordle',
    icon: Grid3x3,
    url: 'https://www.nytimes.com/games/wordle/index.html',
    description: 'Daily word guessing game'
  },
  {
    id: 'connections',
    name: 'Connections',
    icon: Puzzle,
    url: 'https://www.nytimes.com/games/connections',
    description: 'Find groups of related words'
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    icon: Grid3x3,
    url: 'https://sudoku.com',
    description: 'Classic number puzzle game'
  },
  {
    id: 'chess',
    name: 'Chess.com',
    icon: Target,
    url: 'https://www.chess.com/play/online',
    description: 'Play chess online with players worldwide'
  },
  {
    id: 'lichess',
    name: 'Lichess',
    icon: Trophy,
    url: 'https://lichess.org',
    description: 'Free, open-source chess server'
  },
  {
    id: 'crossword',
    name: 'Crossword',
    icon: Puzzle,
    url: 'https://www.nytimes.com/crosswords',
    description: 'Daily crossword puzzles'
  },
  {
    id: 'jigsaw',
    name: 'Jigsaw Puzzles',
    icon: Puzzle,
    url: 'https://www.jigsawplanet.com',
    description: 'Create and solve jigsaw puzzles online'
  },
  {
    id: 'lumosity',
    name: 'Lumosity',
    icon: Brain,
    url: 'https://www.lumosity.com/en/brain-games/',
    description: 'Brain training and cognitive games'
  },
  {
    id: 'geoguessr',
    name: 'GeoGuessr',
    icon: Target,
    url: 'https://www.geoguessr.com',
    description: 'Geography guessing game using Google Maps'
  },
  {
    id: '2048',
    name: '2048',
    icon: Zap,
    url: 'https://play2048.co',
    description: 'Addictive number merging puzzle game'
  },
  {
    id: 'typeracer',
    name: 'TypeRacer',
    icon: Zap,
    url: 'https://play.typeracer.com',
    description: 'Competitive typing game'
  },
  {
    id: 'seterra',
    name: 'Seterra Geography',
    icon: Target,
    url: 'https://www.geoguessr.com/seterra',
    description: 'Geography quiz games'
  }
];

export function Puzzles() {
  const [selectedGame, setSelectedGame] = useState<PuzzleGame | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Puzzles & Brain Games</h1>
          <p className="text-muted-foreground">
            Challenge your mind with word games, chess, and logic puzzles
          </p>
        </div>

        {!selectedGame ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {puzzleGames.map((game, index) => {
              const Icon = game.icon;
              return (
                <Card
                  key={game.id}
                  className="group cursor-pointer transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedGame(game)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {game.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {game.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedGame.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedGame.description}</p>
              </div>
              <Button onClick={() => setSelectedGame(null)} variant="outline">
                Back to Puzzles
              </Button>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={selectedGame.url}
                  className="h-[calc(100vh-250px)] w-full border-0"
                  title={selectedGame.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
