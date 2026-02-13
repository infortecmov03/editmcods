
// src/languages/javascript/index.ts

import { ILanguageProvider, IToken } from '../language-provider';
import { languageManager } from '../language-manager'; // Correção: Importar do language-manager
import { tokenize } from './grammar';

/**
 * @class JavaScriptLanguageProvider
 * Implementa o ILanguageProvider para a linguagem JavaScript.
 */
class JavaScriptLanguageProvider implements ILanguageProvider {
  // Correção: A propriedade deve se chamar 'language' para corresponder à interface.
  readonly language = 'javascript';

  /**
   * Utiliza o tokenizer de gramática do JavaScript.
   * Correção: O método deve se chamar 'getTokensForLine'.
   */
  getTokensForLine(lineText: string): IToken[] {
    return tokenize(lineText);
  }
}

/**
 * Função para inicializar e registrar o provedor de linguagem JavaScript.
 */
export function setupJavaScriptLanguage() {
  // Correção: Usar o 'languageManager' importado.
  languageManager.registerProvider(new JavaScriptLanguageProvider());
}
