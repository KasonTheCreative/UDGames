import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { GameCard } from '../components/features/GameCard';
import { CategoryFilter } from '../components/features/CategoryFilter';
import { games } from '../constants/games';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl lg:text-7xl">
            <span className="gradient-text">UD-Games</span>
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl">
            Play the best unblocked games online - free and unlimited!
          </p>
        </section>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Games Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl text-muted-foreground">
              No games found. Try a different search or category!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 UD-Games. Play responsibly!</p>
        </div>
      </footer>
    </div>
  );
}
