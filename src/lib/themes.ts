// Theme system

export type ThemeColor = 'default' | 'ocean' | 'forest' | 'sunset' | 'purple' | 'sigma67';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

export const themes: Record<ThemeColor, Theme> = {
  default: {
    name: 'Cyber Neon',
    colors: {
      primary: '210 100% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '270 95% 60%',
      accent: '340 82% 52%',
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
    }
  },
  ocean: {
    name: 'Deep Ocean',
    colors: {
      primary: '200 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '187 85% 50%',
      accent: '172 66% 55%',
      background: '210 20% 8%',
      foreground: '180 10% 95%',
    }
  },
  forest: {
    name: 'Emerald Forest',
    colors: {
      primary: '142 76% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '159 70% 40%',
      accent: '88 60% 53%',
      background: '150 20% 7%',
      foreground: '120 10% 95%',
    }
  },
  sunset: {
    name: 'Solar Sunset',
    colors: {
      primary: '24 100% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '351 95% 71%',
      accent: '45 98% 58%',
      background: '20 18% 8%',
      foreground: '30 10% 95%',
    }
  },
  purple: {
    name: 'Nebula Purple',
    colors: {
      primary: '271 91% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '291 70% 50%',
      accent: '314 100% 62%',
      background: '280 18% 7%',
      foreground: '290 10% 95%',
    }
  },
  sigma67: {
    name: '67 Ohio Sigma',
    colors: {
      primary: '280 100% 50%',
      primaryForeground: '60 100% 50%',
      secondary: '180 100% 50%',
      accent: '0 100% 50%',
      background: '0 0% 5%',
      foreground: '60 100% 70%',
    }
  }
};



export function getActiveTheme(): Theme {
  const savedTheme = sessionStorage.getItem('colorTheme') as ThemeColor || 'default';
  return themes[savedTheme];
}

export function applyTheme(themeColor: ThemeColor | null = null) {
  const root = document.documentElement;
  const theme = themeColor ? themes[themeColor] : getActiveTheme();

  // Apply theme colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVar}`, value);
  });

  // Remove or add sigma67 class
  if (themeColor === 'sigma67') {
    root.classList.add('sigma67-theme');
  } else {
    root.classList.remove('sigma67-theme');
  }

  // Save theme preference to sessionStorage (resets on page close)
  if (themeColor) {
    sessionStorage.setItem('colorTheme', themeColor);
  }
}

export function initializeTheme() {
  // Check if dark mode is enabled (keep dark mode in localStorage)
  const isDark = localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  }

  // Apply color theme from sessionStorage
  applyTheme();
}

export function getCurrentThemeColor(): ThemeColor {
  return sessionStorage.getItem('colorTheme') as ThemeColor || 'default';
}
