
// src/languages/common/keywords.ts

/**
 * Cria um array de palavras-chave e um mapa para pesquisa rápida.
 * @param keywords A lista de palavras-chave.
 * @returns Um objeto contendo a lista e o mapa.
 */
function createKeywordMap(keywords: string[]) {
  const map = new Map<string, boolean>();
  keywords.forEach(k => map.set(k, true));
  return { list: keywords, map };
}

// Palavras-chave de controle de fluxo
export const flowKeywords = createKeywordMap([
  'break', 'case', 'catch', 'continue', 'default', 'do', 'else', 'finally', 'for', 'if',
  'return', 'switch', 'throw', 'try', 'while', 'yield', 'await', 'async'
]);

// Palavras-chave de declaração e tipo
export const declarationKeywords = createKeywordMap([
  'class', 'const', 'let', 'var', 'function', 'enum', 'export', 'import', 'from', 'in',
  'of', 'get', 'set', 'new', 'this', 'super', 'extends', 'implements', 'interface',
  'package', 'private', 'protected', 'public', 'static', 'readonly', 'abstract'
]);

// Literais especiais e valores booleanos
export const literalKeywords = createKeywordMap([
  'true', 'false', 'null', 'undefined', 'Infinity', 'NaN'
]);

// Palavras-chave relacionadas a módulos e tipos (comuns em TS/JS moderno)
export const moduleKeywords = createKeywordMap([
  'import', 'export', 'from', 'as', 'type', 'of'
]);
