import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Library, FileText, Bookmark, BookMarked, Glasses } from 'lucide-react';

interface BookSite {
  id: string;
  name: string;
  icon: typeof BookOpen;
  url: string;
  description: string;
}

const bookSites: BookSite[] = [
  {
    id: 'gutenberg',
    name: 'Project Gutenberg',
    icon: Library,
    url: 'https://www.gutenberg.org',
    description: 'Over 70,000 free ebooks - classics and public domain'
  },
  {
    id: 'openlibrary',
    name: 'Open Library',
    icon: BookOpen,
    url: 'https://openlibrary.org',
    description: 'Borrow and read millions of books online'
  },
  {
    id: 'sparknotes',
    name: 'SparkNotes',
    icon: Bookmark,
    url: 'https://www.sparknotes.com',
    description: 'Study guides and book summaries'
  },
  {
    id: 'cliffsnotes',
    name: 'CliffsNotes',
    icon: FileText,
    url: 'https://www.cliffsnotes.com',
    description: 'Literature study guides and summaries'
  },
  {
    id: 'litcharts',
    name: 'LitCharts',
    icon: BookMarked,
    url: 'https://www.litcharts.com',
    description: 'Literature guides, analysis, and summaries'
  },
  {
    id: 'bookbub',
    name: 'BookBub',
    icon: Glasses,
    url: 'https://www.bookbub.com/blog',
    description: 'Book recommendations and reading lists'
  },
  {
    id: 'archive',
    name: 'Internet Archive',
    icon: Library,
    url: 'https://archive.org/details/texts',
    description: 'Digital library of free books and texts'
  },
  {
    id: 'manybooks',
    name: 'ManyBooks',
    icon: BookOpen,
    url: 'https://manybooks.net',
    description: 'Free ebooks in various formats'
  },
  {
    id: 'bookfinder',
    name: 'BookFinder',
    icon: Bookmark,
    url: 'https://www.bookfinder.com',
    description: 'Find and compare book prices'
  },
  {
    id: 'goodreads',
    name: 'Goodreads',
    icon: BookMarked,
    url: 'https://www.goodreads.com',
    description: 'Book reviews, recommendations, and tracking'
  }
];

export function Books() {
  const [selectedSite, setSelectedSite] = useState<BookSite | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Books & Reading</h1>
          <p className="text-muted-foreground">
            Free ebooks, study guides, and reading resources
          </p>
        </div>

        {!selectedSite ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookSites.map((site, index) => {
              const Icon = site.icon;
              return (
                <Card
                  key={site.id}
                  className="group cursor-pointer transition-all hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedSite(site)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {site.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {site.description}
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
                <h2 className="text-2xl font-bold text-foreground">{selectedSite.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedSite.description}</p>
              </div>
              <Button onClick={() => setSelectedSite(null)} variant="outline">
                Back to Books
              </Button>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={selectedSite.url}
                  className="h-[calc(100vh-250px)] w-full border-0"
                  title={selectedSite.name}
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
