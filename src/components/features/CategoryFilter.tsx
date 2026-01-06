import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Games', icon: '🎮' },
  { id: 'websites', label: 'Websites', icon: '🌐' },
  { id: 'action', label: 'Action', icon: '⚔️' },
  { id: 'puzzle', label: 'Puzzle', icon: '🧩' },
  { id: 'racing', label: 'Racing', icon: '🏎️' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'multiplayer', label: 'Multiplayer', icon: '👥' },
  { id: 'arcade', label: 'Arcade', icon: '🕹️' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.id)}
          className={`relative group transition-all duration-300 rounded-xl ${
            selectedCategory === category.id 
              ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white border-0' 
              : 'bg-card/40 backdrop-blur-xl border-white/10 hover:border-primary/50'
          }`}
        >
          {selectedCategory === category.id && (
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
          )}
          <span className="mr-2">{category.icon}</span>
          {category.label}
        </Button>
      ))}
    </div>
  );
}
