
// src/config/editor-config.ts

import { defaultSettings, IDefaultSettings } from './default-settings';

/**
 * @interface IEditorConfig
 * Define a estrutura completa de configuração do editor.
 * Atualmente, ela apenas utiliza as configurações padrão, mas pode ser expandida no futuro.
 */
export interface IEditorConfig {
  settings: IDefaultSettings;
  // Outras seções de configuração poderiam ser adicionadas aqui, como:
  // keybindings: any;
  // uiState: any;
}

/**
 * @const editorConfig
 * O objeto de configuração principal para o editor.
 * Ele agrega todas as diferentes partes da configuração em um único lugar.
 * Por enquanto, ele apenas encapsula as configurações padrão.
 */
export const editorConfig: IEditorConfig = {
  settings: defaultSettings,
};
