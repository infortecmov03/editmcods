
// src/languages/language-provider.ts

/**
 * @interface IToken
 * Define a estrutura de um token de sintaxe.
 * Um token representa a menor unidade de código com significado, como uma palavra-chave, um operador ou um nome de variável.
 */
export interface IToken {
  /** O índice onde o token começa na string da linha. */
  startIndex: number;
  /** O comprimento do token. */
  length: number;
  /** O tipo do token (ex: 'keyword.ts', 'string.js'), usado para aplicar o estilo. */
  type: string;
}

/**
 * @interface ILanguageProvider
 * Define o contrato para um provedor de linguagem.
 * Cada linguagem (como JavaScript, TypeScript, CSS) implementará esta interface
 * para fornecer a lógica de tokenização específica da linguagem.
 */
export interface ILanguageProvider {
  /** O nome da linguagem (ex: 'javascript', 'typescript'). */
  readonly language: string;

  /**
   * Recebe uma linha de texto e a divide em uma matriz de tokens de sintaxe.
   * @param line - O texto da linha a ser tokenizada.
   * @returns Uma matriz de tokens que descrevem a sintaxe da linha.
   */
  getTokensForLine(line: string): IToken[];
}
