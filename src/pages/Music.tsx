import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Music2, Radio, Headphones } from 'lucide-react';

interface MusicSite {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: typeof Music2;
}

const musicSites: MusicSite[] = [
  {
    id: '1',
    title: 'YouTube Music',
    description: 'Stream millions of songs and music videos',
    url: 'https://music.youtube.com/',
    icon: Music2
  },
  {
    id: '2',
    title: 'SoundCloud',
    description: 'Discover new music and listen to trending tracks',
    url: 'https://soundcloud.com/discover',
    icon: Headphones
  },
  {
    id: '3',
    title: 'Radio Garden',
    description: 'Listen to live radio stations from around the world',
    url: 'https://radio.garden/',
    icon: Radio
  }
];

export function Music() {
  const [selectedSite, setSelectedSite] = useState<MusicSite>(musicSites[0]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Music</h1>
          <p className="text-lg text-muted-foreground">Stream music from popular platforms</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {musicSites.map((site, index) => {
            const Icon = site.icon;
            const isSelected = selectedSite.id === site.id;
            return (
              <div
                key={site.id}
                className={`animate-fade-in group cursor-pointer rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-card'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedSite(site)}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`rounded-lg p-3 ${
                    isSelected ? 'bg-primary-foreground/20' : 'bg-primary/10'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      isSelected ? 'text-primary-foreground' : 'text-primary'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-bold ${
                    isSelected ? 'text-primary-foreground' : 'text-foreground'
                  }`}>{site.title}</h3>
                </div>
                <p className={isSelected ? 'text-primary-foreground/90' : 'text-muted-foreground'}>
                  {site.description}
                </p>
                <div className={`mt-4 flex items-center gap-2 text-sm font-semibold ${
                  isSelected 
                    ? 'text-primary-foreground opacity-100' 
                    : 'text-primary opacity-0 group-hover:opacity-100'
                } transition-opacity duration-300`}>
                  <span>{isSelected ? 'Now Playing' : 'Select Player'}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Music Player */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Now Playing: {selectedSite.title}
          </h2>
          <div className="overflow-hidden rounded-xl bg-card shadow-xl">
            <iframe
              key={selectedSite.id}
              src={selectedSite.url}
              className="h-[600px] w-full"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              title={`${selectedSite.title} Player`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
