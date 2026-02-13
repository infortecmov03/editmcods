
// src/languages/index.ts

import { languageManager } from './language-manager';
import { setupTypeScriptLanguage } from './typescript';
import { setupJavaScriptLanguage } from './javascript';

// Importante: Executa as funções de setup para registrar os provedores de linguagem.
// Isso conecta os provedores de linguagem ao gerenciador central.
setupTypeScriptLanguage();
setupJavaScriptLanguage();

// Re-exporta as interfaces e o gerenciador para serem usados em outras partes da aplicação.
export { languageManager } from './language-manager';
export * from './language-provider';
