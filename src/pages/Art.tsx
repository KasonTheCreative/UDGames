import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Palette, Paintbrush, Pencil, Image, Layers, Sparkles } from 'lucide-react';

interface ArtTool {
  id: string;
  name: string;
  icon: typeof Palette;
  url: string;
  description: string;
}

const artTools: ArtTool[] = [
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    icon: Pencil,
    url: 'https://excalidraw.com',
    description: 'Virtual whiteboard for sketching hand-drawn diagrams'
  },
  {
    id: 'tldraw',
    name: 'tldraw',
    icon: Paintbrush,
    url: 'https://www.tldraw.com',
    description: 'Simple and fun drawing canvas'
  },
  {
    id: 'kleki',
    name: 'Kleki',
    icon: Palette,
    url: 'https://kleki.com',
    description: 'Online painting and drawing tool'
  },
  {
    id: 'pixilart',
    name: 'Pixilart',
    icon: Image,
    url: 'https://www.pixilart.com/draw',
    description: 'Pixel art maker and community'
  },
  {
    id: 'aggie',
    name: 'Aggie.io',
    icon: Layers,
    url: 'https://aggie.io',
    description: 'Collaborative drawing board'
  },
  {
    id: 'magma',
    name: 'Magma Studio',
    icon: Sparkles,
    url: 'https://magma.com',
    description: 'Real-time collaborative drawing canvas'
  },
  {
    id: 'photopea',
    name: 'Photopea',
    icon: Image,
    url: 'https://www.photopea.com',
    description: 'Advanced online photo editor like Photoshop'
  },
  {
    id: 'piskel',
    name: 'Piskel',
    icon: Image,
    url: 'https://www.piskelapp.com',
    description: 'Create pixel art and animated sprites'
  },
  {
    id: 'autodraw',
    name: 'AutoDraw',
    icon: Sparkles,
    url: 'https://www.autodraw.com',
    description: 'AI-powered drawing tool by Google'
  },
  {
    id: 'sketch',
    name: 'Sketch.io',
    icon: Paintbrush,
    url: 'https://sketch.io/sketchpad/',
    description: 'Online drawing and painting app'
  }
];

export function Art() {
  const [selectedTool, setSelectedTool] = useState<ArtTool | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Art & Drawing</h1>
          <p className="text-muted-foreground">
            Creative tools for drawing, painting, and pixel art
          </p>
        </div>

        {!selectedTool ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className="group cursor-pointer transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedTool(tool)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-500">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
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
                <h2 className="text-2xl font-bold text-foreground">{selectedTool.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedTool.description}</p>
              </div>
              <Button onClick={() => setSelectedTool(null)} variant="outline">
                Back to Art Tools
              </Button>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={selectedTool.url}
                  className="h-[calc(100vh-250px)] w-full border-0"
                  title={selectedTool.name}
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
