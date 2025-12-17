import { Header } from '../components/layout/Header';

interface Playlist {
  id: string;
  title: string;
  embedUrl: string;
}

const playlists: Playlist[] = [
  {
    id: '1',
    title: 'Tyler the Creator',
    embedUrl: 'https://open.spotify.com/embed/artist/4V8LLVI7PbaPR0K2TGSxFF?utm_source=generator'
  },
  {
    id: '2',
    title: 'Lil Wayne',
    embedUrl: 'https://open.spotify.com/embed/artist/55Aa2cqylxrFIXC767Z865?utm_source=generator'
  },
  {
    id: '3',
    title: 'Girl Playlist',
    embedUrl: 'https://open.spotify.com/embed/playlist/6rdv5yeiDrcleJJ5l5WqPV?utm_source=generator'
  },
  {
    id: '4',
    title: 'Boy Playlist',
    embedUrl: 'https://open.spotify.com/embed/playlist/37vVbInEzfnXJQjVuU7bAZ?utm_source=generator'
  },
  {
    id: '5',
    title: "Luka's Emo Playlist",
    embedUrl: 'https://open.spotify.com/embed/playlist/0SgyK6Rl58KJH3UGWDhSyc?utm_source=generator'
  },
  {
    id: '6',
    title: 'Rap 2025',
    embedUrl: 'https://open.spotify.com/embed/playlist/7EnIitpBIDp8hbqoaOWfQO?utm_source=generator'
  },
  {
    id: '7',
    title: "90's 2000's Hip Hop",
    embedUrl: 'https://open.spotify.com/embed/playlist/04C2Ck8ZTVTBn54mOyaXuW?utm_source=generator'
  },
  {
    id: '8',
    title: 'For the Boys',
    embedUrl: 'https://open.spotify.com/embed/playlist/1KTzNrwprS920tbqK7Jvl7?utm_source=generator'
  },
  {
    id: '9',
    title: 'Playlist Playlist',
    embedUrl: 'https://open.spotify.com/embed/playlist/28mfzRyVm6RDmkELgt3XAq?utm_source=generator'
  },
  {
    id: '10',
    title: 'Drake',
    embedUrl: 'https://open.spotify.com/embed/artist/3TVXtAsR1Inumwj472S9r4?utm_source=generator'
  },
  {
    id: '11',
    title: 'Taylor Swift EWW',
    embedUrl: 'https://open.spotify.com/embed/artist/06HL4z0CvFAxyc27GXpf02?utm_source=generator'
  }
];

export function Music() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Music</h1>
          <p className="text-lg text-muted-foreground">Listen to curated playlists and artists</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist, index) => (
            <div
              key={playlist.id}
              className="animate-fade-in rounded-xl bg-card p-4 shadow-lg transition-transform duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <h3 className="mb-3 text-lg font-bold text-foreground">{playlist.title}</h3>
              <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: '12px' }}
                src={playlist.embedUrl}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={playlist.title}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
