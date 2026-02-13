
// src/config/default-settings.ts

/**
 * @interface IDefaultSettings
 * Define the structure for the editor's default settings.
 */
export interface IDefaultSettings {
  theme: string;          // Default editor theme (e.g., 'vs-dark', 'dracula')
  language: string;       // Default language for syntax highlighting
  fontSize: number;       // Font size in pixels
  fontFamily: string;     // Font family (e.g., 'monospace', 'Fira Code')
  tabSize: number;        // Number of spaces to insert on tab press
  lineNumbers: 'on' | 'off'; // Control for displaying line numbers
}

/**
 * @const defaultSettings
 * Stores the default values for the editor's settings.
 * These are used on initial load or when user settings are not available.
 */
export const defaultSettings: IDefaultSettings = {
  theme: 'vs-dark',
  language: 'javascript',
  fontSize: 14,
  fontFamily: 'monospace', // Sensible default for a code editor
  tabSize: 2,
  lineNumbers: 'on',
};
