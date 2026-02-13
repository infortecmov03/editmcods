
// src/languages/language-manager.ts

import { ILanguageProvider, IToken } from './language-provider';

/**
 * @class LanguageManager
 * Orquestra os diferentes provedores de linguagem disponíveis no editor.
 * Ele mantém um registro dos provedores e seleciona o apropriado para
 * tokenizar o código com base na linguagem atual.
 */
class LanguageManager {
  private providers: Map<string, ILanguageProvider> = new Map();
  private currentLanguage: string = 'typescript'; // Define um padrão

  /**
   * Registra um novo provedor de linguagem.
   * @param provider - A instância do provedor de linguagem a ser registrada.
   */
  public registerProvider(provider: ILanguageProvider): void {
    this.providers.set(provider.language, provider);
  }

  /**
   * Define a linguagem ativa para tokenização.
   * @param language - O nome da linguagem a ser usada (ex: 'javascript', 'typescript').
   */
  public setLanguage(language: string): void {
    if (this.providers.has(language)) {
      this.currentLanguage = language;
    } else {
      console.warn(`Provedor de linguagem para "${language}" não encontrado.`);
    }
  }

  /**
   * Obtém os tokens para uma linha de texto usando o provedor de linguagem ativo.
   * @param line - A string de texto da linha a ser tokenizada.
   * @returns Uma matriz de IToken. Se nenhum provedor for encontrado, retorna uma matriz vazia.
   */
  public getTokensForLine(line: string): IToken[] {
    const provider = this.providers.get(this.currentLanguage);
    if (provider) {
      return provider.getTokensForLine(line);
    }
    return []; // Retorna vazio se nenhum provedor for encontrado
  }
}

// Exporta uma instância única (singleton) do LanguageManager para ser usada em toda a aplicação.
export const languageManager = new LanguageManager();
