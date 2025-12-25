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
    name: 'Gaming Default',
    colors: {
      primary: '262 83% 58%',
      primaryForeground: '0 0% 100%',
      secondary: '280 100% 70%',
      accent: '340 100% 70%',
      background: '0 0% 7%',
      foreground: '0 0% 95%',
    }
  },
  ocean: {
    name: 'Ocean Blue',
    colors: {
      primary: '199 89% 48%',
      primaryForeground: '0 0% 100%',
      secondary: '187 85% 43%',
      accent: '172 66% 50%',
      background: '200 18% 12%',
      foreground: '180 10% 95%',
    }
  },
  forest: {
    name: 'Forest Green',
    colors: {
      primary: '142 71% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '159 58% 40%',
      accent: '88 50% 53%',
      background: '150 15% 10%',
      foreground: '120 10% 95%',
    }
  },
  sunset: {
    name: 'Sunset Orange',
    colors: {
      primary: '24 95% 53%',
      primaryForeground: '0 0% 100%',
      secondary: '351 95% 71%',
      accent: '45 93% 58%',
      background: '20 15% 10%',
      foreground: '30 10% 95%',
    }
  },
  purple: {
    name: 'Purple Dreams',
    colors: {
      primary: '271 81% 56%',
      primaryForeground: '0 0% 100%',
      secondary: '291 64% 42%',
      accent: '314 100% 62%',
      background: '280 15% 10%',
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
