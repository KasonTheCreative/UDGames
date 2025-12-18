import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Brain, StickyNote, FileText, GraduationCap, Lightbulb } from 'lucide-react';

interface StudyTool {
  id: string;
  name: string;
  icon: typeof BookOpen;
  url: string;
  description: string;
}

const studyTools: StudyTool[] = [
  {
    id: 'quizlet',
    name: 'Quizlet',
    icon: Brain,
    url: 'https://quizlet.com',
    description: 'Create and study with flashcards and practice tests'
  },
  {
    id: 'anki',
    name: 'AnkiWeb',
    icon: GraduationCap,
    url: 'https://ankiweb.net',
    description: 'Spaced repetition flashcard system for memorization'
  },
  {
    id: 'notion',
    name: 'Notion Notes',
    icon: StickyNote,
    url: 'https://www.notion.so',
    description: 'All-in-one workspace for notes and organization'
  },
  {
    id: 'onenote',
    name: 'OneNote',
    icon: FileText,
    url: 'https://www.onenote.com/notebooks',
    description: 'Microsoft\'s digital notebook for organizing notes'
  },
  {
    id: 'evernote',
    name: 'Evernote',
    icon: BookOpen,
    url: 'https://www.evernote.com/client/web',
    description: 'Note-taking and task management application'
  },
  {
    id: 'studyblue',
    name: 'Study Blue',
    icon: Lightbulb,
    url: 'https://www.chegg.com/flashcards',
    description: 'Study with flashcards and practice questions'
  },
  {
    id: 'cram',
    name: 'Cram.com',
    icon: Brain,
    url: 'https://www.cram.com',
    description: 'Create and share flashcards online'
  },
  {
    id: 'sparknotes',
    name: 'SparkNotes',
    icon: BookOpen,
    url: 'https://www.sparknotes.com',
    description: 'Study guides and literature summaries'
  },
  {
    id: 'coursera',
    name: 'Coursera',
    icon: GraduationCap,
    url: 'https://www.coursera.org',
    description: 'Online courses from top universities'
  },
  {
    id: 'khanacademy',
    name: 'Khan Academy',
    icon: Lightbulb,
    url: 'https://www.khanacademy.org',
    description: 'Free online courses and lessons'
  }
];

export function Study() {
  const [selectedTool, setSelectedTool] = useState<StudyTool | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Study Resources</h1>
          <p className="text-muted-foreground">
            Flashcards, notes, and learning tools to help you succeed
          </p>
        </div>

        {!selectedTool ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {studyTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className="group cursor-pointer transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedTool(tool)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
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
                Back to Study Tools
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
