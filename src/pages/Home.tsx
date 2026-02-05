import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { GameCard } from '../components/features/GameCard';
import { games } from '../constants/games';
import { Gamepad2, Zap, Trophy, Users } from 'lucide-react';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] floating"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] floating" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] floating" style={{ animationDelay: '6s' }}></div>
      </div>

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <section className="mb-20 pt-12">
          <div className="max-w-6xl mx-auto">
            {/* Main Title */}
            <div className="text-center mb-12 relative">
              <div className="inline-block relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-75 blur-2xl"></div>
                <h1 className="relative text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                    UD-GAMES
                  </span>
                </h1>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-500"></div>
                <p className="text-lg text-slate-400 font-medium uppercase tracking-widest">The Ultimate Gaming Hub</p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500"></div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6 hover:border-blue-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Gamepad2 className="h-10 w-10 text-blue-400 mb-3" />
                <p className="text-3xl font-black text-white mb-1">{games.length}+</p>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Games</p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-6 hover:border-purple-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Zap className="h-10 w-10 text-purple-400 mb-3" />
                <p className="text-3xl font-black text-white mb-1">100%</p>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Free</p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 p-6 hover:border-pink-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Trophy className="h-10 w-10 text-pink-400 mb-3" />
                <p className="text-3xl font-black text-white mb-1">No Ads</p>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Pure Gaming</p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 p-6 hover:border-cyan-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Users className="h-10 w-10 text-cyan-400 mb-3" />
                <p className="text-3xl font-black text-white mb-1">∞</p>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Players</p>
              </div>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-4xl font-black text-white">All Games</h2>
            </div>
            <p className="text-slate-400 ml-7">Choose your adventure. No limits, no restrictions.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="py-32 text-center">
              <div className="max-w-md mx-auto">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl"></div>
                  <div className="relative bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-12">
                    <Gamepad2 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-2">
                      No games found
                    </p>
                    <p className="text-slate-400">
                      Try a different search term
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-slate-800 bg-slate-950/50 backdrop-blur-xl py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                ud-games
              </p>
              <p className="text-slate-500 text-sm uppercase tracking-widest">Your Ultimate Gaming Destination</p>
            </div>
            
            <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
              <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Games</a>
              <a href="/music" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Music</a>
              <a href="/chat" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Chat</a>
              <a href="/ai" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">AI</a>
              <a href="/settings" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Settings</a>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>
            
            <div className="space-y-2">
              <p className="text-sm text-slate-500">
                &copy; 2025 ud-games. All rights reserved. Made with ⚡ and 💜
              </p>
              <p className="text-sm text-slate-600 font-medium">
                im autistic ✌️😩
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
