import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Settings as SettingsIcon, Trash2, Info, Shield, Palette, Moon, Sun, Download, Lock } from 'lucide-react';

import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  themes, 
  applyTheme,
  getCurrentThemeColor,
  type ThemeColor 
} from '../lib/themes';

interface SettingsProps {
  onOpenAdminPanel: () => void;
}

export function Settings({ onOpenAdminPanel }: SettingsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  const [colorTheme, setColorTheme] = useState<ThemeColor>(
    getCurrentThemeColor()
  );

  const { toast } = useToast();

  useEffect(() => {
    // Initialize theme on component mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    applyTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast({
      title: 'Theme Updated',
      description: `Switched to ${newTheme} mode`,
    });
  };

  const handleColorThemeChange = (value: ThemeColor) => {
    setColorTheme(value);
    applyTheme(value);
    
    toast({
      title: 'Color Theme Changed',
      description: `Applied ${themes[value].name} theme`,
    });
  };

  const clearChatHistory = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      toast({
        title: 'No Session',
        description: 'No active session found',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('online_users')
        .delete()
        .eq('session_id', sessionId);

      if (error) throw error;

      localStorage.removeItem('sessionId');
      localStorage.removeItem('chatUsername');
      
      toast({
        title: 'Chat Cleared',
        description: 'Your chat session has been cleared',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetSettings = () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    setTheme('light');
    setColorTheme('default');
    applyTheme('default');
    
    toast({
      title: 'Settings Reset',
      description: 'All settings have been reset to default',
    });
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const downloadSite = () => {
    // Create HTML content with inline styles
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UD-Games - Saved Copy</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0a0a0a;
      color: #f5f5f5;
      padding: 2rem;
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      background: linear-gradient(to right, #a855f7, #ec4899, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .open-btn {
      display: inline-block;
      background: linear-gradient(to right, #a855f7, #3b82f6);
      color: white;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: bold;
      margin-top: 1rem;
      transition: opacity 0.2s;
    }
    .open-btn:hover {
      opacity: 0.8;
    }
    .info {
      background: #1a1a1a;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
      border-left: 4px solid #a855f7;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>UD-Games Backup</h1>
    <a href="https://udgs.netlify.app" class="open-btn" target="_blank">🚀 Open Latest Version</a>
    <div class="info">
      <h2>🎮 Site Information</h2>
      <p><strong>Current URL:</strong> ${window.location.origin}</p>
      <p><strong>Latest Version:</strong> <a href="https://udgs.netlify.app" target="_blank">https://udgs.netlify.app</a></p>
      <p><strong>Saved Date:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Status:</strong> This is an offline backup of UD-Games</p>
    </div>
    
    <div class="info">
      <h2>📌 Important Links</h2>
      <ul>
        <li><a href="${window.location.origin}">Home</a></li>
        <li><a href="${window.location.origin}/music">Music</a></li>
        <li><a href="${window.location.origin}/chat">Chat Room</a></li>
        <li><a href="${window.location.origin}/ai">AI Assistant</a></li>
        <li><a href="${window.location.origin}/tools">Tools</a></li>
        <li><a href="${window.location.origin}/apps">Apps</a></li>
        <li><a href="${window.location.origin}/art">Art</a></li>
        <li><a href="${window.location.origin}/puzzles">Puzzles</a></li>
      </ul>
    </div>
    
    <div class="info">
      <h2>💡 How to Access</h2>
      <p>To access the full site, visit: <a href="${window.location.origin}">${window.location.origin}</a></p>
      <p>If the site is down, you can use this backup file as a reference for the URL and features.</p>
    </div>
    
    <div class="info">
      <h2>✨ Features</h2>
      <ul>
        <li>🎮 Games Library - Multiple categories and embedded games</li>
        <li>🤖 AI Chat Assistant - Powered by OnSpace AI</li>
        <li>💬 Real-time Chat Room - Resets daily at midnight</li>
        <li>🎵 Music Streaming - Multiple music platforms</li>
        <li>🛠️ Productivity Tools - Calculators, converters, and more</li>
        <li>📱 Web Apps - Google Docs, Canva, and other apps</li>
        <li>🎨 Art Tools - Drawing and creative tools</li>
        <li>🧩 Puzzles - Brain games and challenges</li>
        <li>🎨 Customizable Themes - 6 color themes to choose from</li>
      </ul>
    </div>
  </div>
</body>
</html>`;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UD-Games-Backup-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Started',
      description: 'Backup file is being downloaded',
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground">
            Customize your experience and manage preferences
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {/* Appearance Settings */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize your visual experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Light/Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
                </div>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      Light Mode
                    </>
                  )}
                </Button>
              </div>

              {/* Color Theme */}
              <div className="flex items-center justify-between border-t pt-6">
                <div>
                  <h3 className="font-semibold">Color Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your favorite color scheme
                  </p>
                </div>
                <Select value={colorTheme} onValueChange={handleColorThemeChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">🌀 Cyber Neon</SelectItem>
                    <SelectItem value="ocean">🌊 Deep Ocean</SelectItem>
                    <SelectItem value="forest">🌲 Emerald Forest</SelectItem>
                    <SelectItem value="sunset">🌅 Solar Sunset</SelectItem>
                    <SelectItem value="purple">💜 Nebula Purple</SelectItem>
                    <SelectItem value="sigma67">😎 67 Ohio Sigma</SelectItem>
                    <SelectItem value="googlesnake">🐍 Google Snake</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Preview */}
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="text-sm font-semibold mb-3">Theme Preview</h4>
                <div className="flex gap-2">
                  <div className="flex-1 h-12 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    Primary
                  </div>
                  <div className="flex-1 h-12 rounded bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold">
                    Secondary
                  </div>
                  <div className="flex-1 h-12 rounded bg-accent flex items-center justify-center text-accent-foreground text-xs font-semibold">
                    Accent
                  </div>
                </div>
                <div className="gradient-text text-xl font-bold text-center py-2">
                  Gradient Text Effect
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Clear Chat History</h3>
                  <p className="text-sm text-muted-foreground">
                    Remove all chat messages and session data
                  </p>
                </div>
                <Button
                  onClick={clearChatHistory}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <h3 className="font-semibold">Reset All Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Reset everything to default (clears all data)
                  </p>
                </div>
                <Button
                  onClick={resetSettings}
                  variant="destructive"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup & Download */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Backup & Download
              </CardTitle>
              <CardDescription>
                Save a copy of this site in case it gets taken down
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-semibold">Download Backup File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download an HTML file with site information and links. Keep this file safe so you can access the site info if it ever goes down.
                </p>
                <Button
                  onClick={downloadSite}
                  className="w-full gap-2"
                  variant="default"
                >
                  <Download className="h-4 w-4" />
                  Download Backup
                </Button>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-semibold text-sm">💡 What's Included</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ Site URL and access information</li>
                  <li>✓ List of all features and pages</li>
                  <li>✓ Important links and navigation</li>
                  <li>✓ Timestamp of when backup was created</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Admin Access */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Admin Panel
              </CardTitle>
              <CardDescription>
                Access advanced system controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-semibold">Restricted Access</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This panel requires administrator privileges. Only authorized users should access this area.
                </p>
                <Button
                  onClick={onOpenAdminPanel}
                  className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  size="lg"
                >
                  <Lock className="h-4 w-4" />
                  Open Admin Panel
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  💡 Tip: Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl+Shift+A</kbd> anywhere to toggle
                </p>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                About
              </CardTitle>
              <CardDescription>
                Information about this site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-semibold">UD-Games</h3>
                <p className="text-sm text-muted-foreground">
                  A comprehensive platform featuring games, tools, chat, AI assistance, and more.
                </p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <p>• Games library with various categories</p>
                  <p>• AI-powered chatbot assistant</p>
                  <p>• Real-time chat room</p>
                  <p>• Music streaming services</p>
                  <p>• Productivity tools</p>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-semibold text-sm">Special Thanks</h4>
                <p className="text-xs text-muted-foreground">
                  Built with OnSpace AI
                </p>
              </div>
              
              <div className="rounded-lg bg-muted/50 border border-primary/20 p-3 text-center">
                <p className="text-sm text-muted-foreground italic">
                  luka is emo
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
