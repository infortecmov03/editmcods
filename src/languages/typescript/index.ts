
// src/languages/typescript/index.ts

import { ILanguageProvider, IToken } from '../language-provider';
import { languageManager } from '../language-manager'; // Correção: Importar do language-manager
import { tokenize } from './grammar';

/**
 * @class TypeScriptLanguageProvider
 * Implementa o ILanguageProvider para a linguagem TypeScript.
 */
class TypeScriptLanguageProvider implements ILanguageProvider {
  // Correção: A propriedade deve se chamar 'language' para corresponder à interface.
  readonly language = 'typescript';

  /**
   * Utiliza o tokenizer de gramática do TypeScript.
   * Correção: O método deve se chamar 'getTokensForLine'.
   */
  getTokensForLine(lineText: string): IToken[] {
    return tokenize(lineText);
  }
}

/**
 * Função para inicializar e registrar o provedor de linguagem TypeScript.
 */
export function setupTypeScriptLanguage() {
  // Correção: Usar o 'languageManager' importado.
  languageManager.registerProvider(new TypeScriptLanguageProvider());
}
