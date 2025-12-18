import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calculator, Ruler, DollarSign, Clock, Hash, Percent } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: typeof Calculator;
  url: string;
  description: string;
}

const tools: Tool[] = [
  {
    id: 'calc',
    name: 'Scientific Calculator',
    icon: Calculator,
    url: 'https://www.desmos.com/scientific',
    description: 'Advanced scientific calculator with graphing capabilities'
  },
  {
    id: 'graphing',
    name: 'Graphing Calculator',
    icon: Hash,
    url: 'https://www.desmos.com/calculator',
    description: 'Graph functions and explore mathematical concepts'
  },
  {
    id: 'converter',
    name: 'Unit Converter',
    icon: Ruler,
    url: 'https://www.unitconverters.net/',
    description: 'Convert between different units of measurement'
  },
  {
    id: 'currency',
    name: 'Currency Converter',
    icon: DollarSign,
    url: 'https://www.xe.com/currencyconverter/',
    description: 'Real-time currency exchange rates'
  },
  {
    id: 'timer',
    name: 'Online Timer',
    icon: Clock,
    url: 'https://www.online-stopwatch.com/full-screen-stopwatch/',
    description: 'Stopwatch and timer for studying and breaks'
  },
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    icon: Percent,
    url: 'https://www.calculator.net/percent-calculator.html',
    description: 'Calculate percentages, discounts, and more'
  },
  {
    id: 'wolfram',
    name: 'Wolfram Alpha',
    icon: Calculator,
    url: 'https://www.wolframalpha.com/',
    description: 'Computational knowledge engine for math and science'
  },
  {
    id: 'geogebra',
    name: 'GeoGebra',
    icon: Hash,
    url: 'https://www.geogebra.org/calculator',
    description: 'Interactive geometry, algebra, and calculus tools'
  }
];

export function Tools() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Math Tools</h1>
          <p className="text-muted-foreground">
            Calculators, converters, and utilities to help with your work
          </p>
        </div>

        {!selectedTool ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool, index) => {
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
                Back to Tools
              </Button>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={selectedTool.url}
                  className="h-[calc(100vh-250px)] w-full border-0"
                  title={selectedTool.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
