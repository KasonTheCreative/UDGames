import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Image, Code, Palette, Mail, Calendar, Cloud, Edit } from 'lucide-react';

interface WebApp {
  id: string;
  name: string;
  icon: typeof FileText;
  url: string;
  description: string;
}

const webApps: WebApp[] = [
  {
    id: 'docs',
    name: 'Google Docs',
    icon: FileText,
    url: 'https://docs.google.com',
    description: 'Create and edit documents online'
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    icon: Code,
    url: 'https://sheets.google.com',
    description: 'Create spreadsheets and analyze data'
  },
  {
    id: 'slides',
    name: 'Google Slides',
    icon: Palette,
    url: 'https://slides.google.com',
    description: 'Create presentations and slideshows'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    url: 'https://mail.google.com',
    description: 'Email communication platform'
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    icon: Calendar,
    url: 'https://calendar.google.com',
    description: 'Organize your schedule and events'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    icon: Cloud,
    url: 'https://drive.google.com',
    description: 'Cloud storage and file sharing'
  },
  {
    id: 'canva',
    name: 'Canva',
    icon: Palette,
    url: 'https://www.canva.com',
    description: 'Design graphics, presentations, and posters'
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: Image,
    url: 'https://www.figma.com',
    description: 'Collaborative design and prototyping tool'
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: FileText,
    url: 'https://www.notion.so',
    description: 'All-in-one workspace for notes and collaboration'
  },
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    icon: Edit,
    url: 'https://excalidraw.com',
    description: 'Virtual whiteboard for sketching diagrams'
  },
  {
    id: 'photopea',
    name: 'Photopea',
    icon: Image,
    url: 'https://www.photopea.com',
    description: 'Online photo editor (like Photoshop)'
  },
  {
    id: 'replit',
    name: 'Replit',
    icon: Code,
    url: 'https://replit.com',
    description: 'Code editor and IDE in your browser'
  }
];

export function Apps() {
  const [selectedApp, setSelectedApp] = useState<WebApp | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Web Apps</h1>
          <p className="text-muted-foreground">
            Useful online applications for productivity and creativity
          </p>
        </div>

        {!selectedApp ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {webApps.map((app, index) => {
              const Icon = app.icon;
              return (
                <Card
                  key={app.id}
                  className="group cursor-pointer transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedApp(app)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {app.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {app.description}
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
                <h2 className="text-2xl font-bold text-foreground">{selectedApp.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedApp.description}</p>
              </div>
              <Button onClick={() => setSelectedApp(null)} variant="outline">
                Back to Apps
              </Button>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={selectedApp.url}
                  className="h-[calc(100vh-250px)] w-full border-0"
                  title={selectedApp.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
