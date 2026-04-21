import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { palettes, ThemePalette } from './colors';
import { getThemePreference, setThemePreference, ThemePreference } from '../store/settingsStore';

interface ThemeContextValue {
  palette: ThemePalette;
  mode: 'light' | 'dark';
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => Promise<void>;
  toggle: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const resolveMode = (pref: ThemePreference, system: ColorSchemeName): 'light' | 'dark' => {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  return system === 'light' ? 'light' : 'dark';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getThemePreference().then(pref => {
      setPreferenceState(pref);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setPreference = useCallback(async (pref: ThemePreference) => {
    setPreferenceState(pref);
    await setThemePreference(pref);
  }, []);

  const toggle = useCallback(async () => {
    const current = resolveMode(preference, systemScheme);
    const next: ThemePreference = current === 'dark' ? 'light' : 'dark';
    await setPreference(next);
  }, [preference, systemScheme, setPreference]);

  const mode = resolveMode(preference, systemScheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      palette: palettes[mode],
      mode,
      preference,
      setPreference,
      toggle,
    }),
    [mode, preference, setPreference, toggle]
  );

  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export function usePalette(): ThemePalette {
  return useTheme().palette;
}
