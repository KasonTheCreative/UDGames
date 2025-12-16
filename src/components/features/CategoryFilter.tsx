import { Button } from '../ui/button';

const categories = [
  { id: 'all', label: 'All Games' },
  { id: 'websites', label: 'Websites' },
  { id: 'action', label: 'Action' },
  { id: 'puzzle', label: 'Puzzle' },
  { id: 'racing', label: 'Racing' },
  { id: 'sports', label: 'Sports' },
  { id: 'multiplayer', label: 'Multiplayer' },
  { id: 'arcade', label: 'Arcade' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.id)}
          className="transition-all duration-300"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
