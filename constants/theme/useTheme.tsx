import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from './themes';
import { Theme } from './types';

type ExtendedTheme = Theme & { mode: 'light' | 'dark' };

export const useAppTheme = (): ExtendedTheme => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    ...(isDark ? DarkTheme : LightTheme),
    mode: isDark ? 'dark' : 'light',
  };
};
