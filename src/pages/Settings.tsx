import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Settings as SettingsIcon, Trash2, Info, Shield, Palette, Moon, Sun } from 'lucide-react';
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
  getActiveTheme,
  getCurrentThemeColor,
  type ThemeColor 
} from '../lib/themes';

export function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [colorTheme, setColorTheme] = useState<ThemeColor>(
    getCurrentThemeColor()
  );
  const { toast } = useToast();

  // Check for active holiday theme
  const { isHoliday, holidayName } = getActiveTheme();

  useEffect(() => {
    // Initialize theme on component mount
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground">
            Customize your experience and manage preferences
          </p>
          {isHoliday && (
            <p className="mt-2 text-sm font-semibold text-primary">
              🎉 {holidayName} theme is currently active!
            </p>
          )}
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
                Customize how the site looks
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
                    {isHoliday && (
                      <span className="block text-xs text-primary mt-1">
                        Holiday theme active - will return to your choice after the holiday
                      </span>
                    )}
                  </p>
                </div>
                <Select value={colorTheme} onValueChange={handleColorThemeChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">🎮 Gaming Default</SelectItem>
                    <SelectItem value="ocean">🌊 Ocean Blue</SelectItem>
                    <SelectItem value="forest">🌲 Forest Green</SelectItem>
                    <SelectItem value="sunset">🌅 Sunset Orange</SelectItem>
                    <SelectItem value="purple">💜 Purple Dreams</SelectItem>
                    <SelectItem value="sigma67">😎 67 Ohio Sigma</SelectItem>
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

          {/* About */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
                <h3 className="mb-2 font-semibold">UD-Math</h3>
                <p className="text-sm text-muted-foreground">
                  A comprehensive platform featuring games, tools, chat, AI assistance, and more.
                </p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <p>• Games library with various categories</p>
                  <p>• AI-powered chatbot assistant</p>
                  <p>• Real-time chat room</p>
                  <p>• Music streaming services</p>
                  <p>• Productivity tools and apps</p>
                  <p>• Art and drawing tools</p>
                  <p>• Puzzles and brain games</p>
                  <p>• Automatic holiday themes (Christmas, Halloween, etc.)</p>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-semibold text-sm">Creator</h4>
                <p className="text-xs text-muted-foreground">
                  Built by Kason with OnSpace AI
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
