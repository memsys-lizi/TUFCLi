/**
 * Theme system for TUFCLi
 * Based on OpenCode's theming approach with consistent colors and borders
 */

export interface Theme {
  // Primary colors
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Text colors
  text: string;
  textMuted: string;
  textBold: string;
  
  // Background colors
  background: string;
  backgroundPanel: string;
  backgroundHighlight: string;
  
  // Border colors
  border: string;
  borderActive: string;
  borderMuted: string;
  
  // Special colors
  accent: string;
  dimmed: string;
}

export const defaultTheme: Theme = {
  // Primary colors - vibrant and modern
  primary: 'cyan',
  secondary: 'magenta',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'blue',
  
  // Text colors
  text: 'white',
  textMuted: 'gray',
  textBold: 'white',
  
  // Background colors
  background: 'black',
  backgroundPanel: 'black',
  backgroundHighlight: 'cyan',
  
  // Border colors
  border: 'gray',
  borderActive: 'cyan',
  borderMuted: 'gray',
  
  // Special colors
  accent: 'magenta',
  dimmed: 'gray',
};

/**
 * Border style configuration
 * Using rounded borders consistently across all components
 */
export const borderStyle = 'round' as const;

/**
 * Spacing constants
 */
export const spacing = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

/**
 * Get theme instance
 */
export const getTheme = (): Theme => defaultTheme;
