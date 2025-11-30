import { useColorScheme as _useColorScheme } from 'react-native';

// Esse hook garante que sempre retorna 'light' ou 'dark'
export function useColorScheme() {
  const theme = _useColorScheme();
  return theme ?? 'light';
}
