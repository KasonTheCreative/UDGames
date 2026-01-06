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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <section className="mb-16 text-center relative">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-3xl opacity-30"></div>
              <h1 className="relative mb-6 text-6xl font-black md:text-7xl lg:text-8xl">
                <span className="gradient-text neon-text">Play. Win. Repeat.</span>
              </h1>
            </div>
          </div>
          <p className="text-xl text-foreground/60 md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate gaming hub with <span className="text-primary font-semibold">unlimited access</span> to premium unblocked games
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="glass-card px-6 py-3">
              <p className="text-sm text-muted-foreground">Total Games</p>
              <p className="text-3xl font-bold gradient-text">{games.length}+</p>
            </div>
            <div className="glass-card px-6 py-3">
              <p className="text-sm text-muted-foreground">100% Free</p>
              <p className="text-3xl font-bold text-green-400">✓</p>
            </div>
            <div className="glass-card px-6 py-3">
              <p className="text-sm text-muted-foreground">No Ads</p>
              <p className="text-3xl font-bold text-cyan-400">∞</p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <div className="mb-10">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="py-20 text-center">
            <div className="glass-card max-w-md mx-auto p-12">
              <p className="text-2xl font-semibold text-foreground/80 mb-2">
                No games found
              </p>
              <p className="text-muted-foreground">
                Try a different search or category!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-white/10 bg-card/20 backdrop-blur-xl py-12 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <p className="text-2xl font-black gradient-text mb-2">UD-Games</p>
            <p className="text-sm text-muted-foreground">Your Ultimate Gaming Destination</p>
          </div>
          <div className="flex items-center justify-center gap-8 mb-6">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Games</a>
            <a href="/music" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Music</a>
            <a href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tools</a>
            <a href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chat</a>
            <a href="/ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI</a>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2025 UD-Games. Play responsibly. Made with ⚡
          </p>
        </div>
      </footer>
    </div>
  );
}
