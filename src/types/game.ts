export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  plays: string;
  url: string;
}

export type GameCategory = 'all' | 'action' | 'puzzle' | 'racing' | 'sports' | 'multiplayer' | 'arcade';
