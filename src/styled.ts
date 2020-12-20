// themed-styled-component.ts
import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';
import { theme } from './theme';

type Theme = typeof theme

const library: ThemedStyledComponentsModule<Theme> = styledComponents as any

const {
  default: styled,
  css,
  createGlobalStyle,
  ThemeProvider,
  ThemeConsumer,
  keyframes,
} = library

interface PropsWithTheme extends Record<string, any> {
  theme: Theme
}

type ArrayIndex<T extends readonly any[]> = keyof Omit<Record<keyof T, string>, keyof any[]>

export const getTColor = <C extends keyof Theme['color']>(color: C, index?: ArrayIndex<Theme['color'][C]>) => {
  return ({ theme }: PropsWithTheme) => {
    return theme.color[color][index as any]
  }
}

export { css, createGlobalStyle, keyframes, ThemeProvider, ThemeConsumer };
export default styled;