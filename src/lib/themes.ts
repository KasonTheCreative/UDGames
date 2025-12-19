// Theme system with holiday detection

export type ThemeColor = 'default' | 'ocean' | 'forest' | 'sunset' | 'purple' | 'sigma67';
export type HolidayTheme = 'christmas' | 'newyears' | 'thanksgiving' | 'july4th' | 'halloween' | null;

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

export const holidayThemes: Record<Exclude<HolidayTheme, null>, Theme> = {
  christmas: {
    name: 'Christmas',
    colors: {
      primary: '0 84% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '142 76% 36%',
      accent: '0 72% 51%',
      background: '140 20% 8%',
      foreground: '0 0% 98%',
    }
  },
  newyears: {
    name: 'New Years',
    colors: {
      primary: '43 96% 56%',
      primaryForeground: '0 0% 10%',
      secondary: '0 0% 75%',
      accent: '280 100% 70%',
      background: '240 10% 8%',
      foreground: '0 0% 95%',
    }
  },
  thanksgiving: {
    name: 'Thanksgiving',
    colors: {
      primary: '25 95% 53%',
      primaryForeground: '0 0% 100%',
      secondary: '30 67% 45%',
      accent: '45 93% 47%',
      background: '30 15% 10%',
      foreground: '40 10% 95%',
    }
  },
  july4th: {
    name: '4th of July',
    colors: {
      primary: '0 72% 51%',
      primaryForeground: '0 0% 100%',
      secondary: '221 83% 53%',
      accent: '0 0% 100%',
      background: '220 15% 10%',
      foreground: '0 0% 95%',
    }
  },
  halloween: {
    name: 'Halloween',
    colors: {
      primary: '24 100% 50%',
      primaryForeground: '0 0% 0%',
      secondary: '280 100% 25%',
      accent: '290 84% 60%',
      background: '0 0% 5%',
      foreground: '30 100% 85%',
    }
  }
};

export function getCurrentHoliday(): HolidayTheme {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // October - Halloween
  if (month === 10) {
    return 'halloween';
  }

  // November - Thanksgiving
  if (month === 11) {
    return 'thanksgiving';
  }

  // December 1-25 - Christmas
  if (month === 12 && day <= 25) {
    return 'christmas';
  }

  // December 26 - January 1 - New Years
  if ((month === 12 && day > 25) || (month === 1 && day === 1)) {
    return 'newyears';
  }

  // July - 4th of July
  if (month === 7) {
    return 'july4th';
  }

  return null;
}

export function getActiveTheme(): { theme: Theme; isHoliday: boolean; holidayName?: string } {
  const holiday = getCurrentHoliday();
  
  if (holiday) {
    return {
      theme: holidayThemes[holiday],
      isHoliday: true,
      holidayName: holidayThemes[holiday].name
    };
  }

  const savedTheme = localStorage.getItem('colorTheme') as ThemeColor || 'default';
  return {
    theme: themes[savedTheme],
    isHoliday: false
  };
}

export function applyTheme(themeColor: ThemeColor | null = null) {
  const root = document.documentElement;
  const { theme, isHoliday } = themeColor ? 
    { theme: themes[themeColor], isHoliday: false } : 
    getActiveTheme();

  // Apply theme colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVar}`, value);
  });

  // Save theme preference (only if not a holiday)
  if (themeColor && !isHoliday) {
    localStorage.setItem('colorTheme', themeColor);
  }
}

export function initializeTheme() {
  // Check if dark mode is enabled
  const isDark = localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  }

  // Apply color theme (holiday or user preference)
  applyTheme();
}
