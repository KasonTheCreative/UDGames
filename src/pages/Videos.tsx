import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Play, Tv, Video, Film } from 'lucide-react';

interface VideoSite {
  id: string;
  name: string;
  icon: typeof Play;
  url: string;
  description: string;
}

const videoSites: VideoSite[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Play,
    url: 'https://www.youtube.com',
    description: 'Watch videos, music, and live streams'
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    icon: Video,
    url: 'https://vimeo.com',
    description: 'High-quality video platform'
  },
  {
    id: 'dailymotion',
    name: 'Dailymotion',
    icon: Tv,
    url: 'https://www.dailymotion.com',
    description: 'Discover and watch videos from around the world'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: Film,
    url: 'https://www.twitch.tv',
    description: 'Live streaming and gaming content'
  },
  {
    id: 'ted',
    name: 'TED Talks',
    icon: Play,
    url: 'https://www.ted.com/talks',
    description: 'Inspiring talks from experts and innovators'
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    icon: Video,
    url: 'https://www.khanacademy.org/video',
    description: 'Free educational videos on various subjects'
  }
];

export function Videos() {
  const [selectedSite, setSelectedSite] = useState<VideoSite | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Videos</h1>
          <p className="text-muted-foreground">
            Watch videos, educational content, and live streams
          </p>
        </div>

        {!selectedSite ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videoSites.map((site, index) => {
              const Icon = site.icon;
              return (
                <Card
                  key={site.id}
                  className="group cursor-pointer transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedSite(site)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gaming-gradient">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {site.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {site.description}
                    </p>
                    <Button className="mt-4 w-full">
                      <Play className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedSite.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedSite.description}</p>
              </div>
              <Button onClick={() => setSelectedSite(null)} variant="outline">
                Back to Videos
              </Button>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={selectedSite.url}
                  className="h-[calc(100vh-250px)] w-full border-0"
                  title={selectedSite.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
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
