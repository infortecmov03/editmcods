
// src/core/highlight/theme.ts

/**
 * @interface ITheme
 * Define a estrutura para um tema de syntax highlighting.
 * É um mapa onde a chave é o tipo do token (ex: 'keyword.js') e o valor
 * é a classe CSS a ser aplicada.
 */
export interface ITheme {
  [tokenType: string]: string;
}

/**
 * @const defaultTheme
 * Um tema padrão e simples para syntax highlighting. Mapeia os tipos de token
 * que definimos em nossos provedores de linguagem para nomes de classes CSS.
 */
export const defaultTheme: ITheme = {
  // Tokens de JavaScript
  'keyword.js': 'hl-keyword',
  'identifier.js': 'hl-identifier',
  'operator.js': 'hl-operator',
  'number.js': 'hl-number',
  'string.js': 'hl-string',
  'comment.js': 'hl-comment',
  'delimiter.js': 'hl-delimiter',
  'punctuation.js': 'hl-punctuation',
  'builtin.js': 'hl-builtin',

  // Tokens de TypeScript (muitos podem reutilizar estilos de JS)
  'keyword.ts': 'hl-keyword',
  'identifier.ts': 'hl-identifier',
  'operator.ts': 'hl-operator',
  'number.ts': 'hl-number',
  'string.ts': 'hl-string',
  'comment.ts': 'hl-comment',
  'delimiter.ts': 'hl-delimiter',
  'punctuation.ts': 'hl-punctuation',
  'builtin.ts': 'hl-builtin',
  'type.ts': 'hl-type', // Estilo específico para tipos do TS
};
