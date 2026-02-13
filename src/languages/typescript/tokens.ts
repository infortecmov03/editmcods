
// src/languages/typescript/tokens.ts

/**
 * Define os nomes dos tipos de token para TypeScript.
 * A nomenclatura segue um padrão comum: `tipo.linguagem`
 * Para manter a consistência, usamos nomes que podem ser mapeados
 * para os tokens de JavaScript, mas com um sufixo `.ts`.
 */
export const TSToken = {
  Keyword: 'keyword.ts',
  Identifier: 'identifier.ts',
  Operator: 'operator.ts',
  Number: 'number.ts',
  String: 'string.ts',
  Comment: 'comment.ts',
  Delimiter: 'delimiter.ts',      // Para {}, [], ()
  Punctuation: 'punctuation.ts',    // Para ,, ;, .
  Type: 'type.ts',                  // Para tipos como: string, number, boolean, ou interfaces personalizadas
  Builtin: 'builtin.ts',            // Para console, Math, etc.
};
