
// src/languages/javascript/grammar.ts

import { IToken } from '../language-provider';
import { JSToken } from './tokens';
import { flowKeywords, declarationKeywords, literalKeywords } from '../common/keywords';
import { builtinMap } from '../common/builtins';

// Tipos de regras de tokenização
interface ITokenizerRule {
  regex: RegExp;
  type: string;
}

// Regras de expressão regular para identificar diferentes partes da sintaxe JS
// A ordem é importante! A primeira regra a corresponder vence.
const rules: ITokenizerRule[] = [
  { regex: /^\s+/, type: 'whitespace' }, // Ignorar espaços em branco
  { regex: /^\/\/.*/, type: JSToken.Comment }, // Comentários de linha única
  { regex: /^\/\*.*?\*\//, type: JSToken.Comment }, // Comentários de bloco (simplificado)

  // Strings (com aspas simples ou duplas)
  { regex: /^"(?:\\.|[^\\"])*"/, type: JSToken.String },
  { regex: /^'(?:\\.|[^\\'])*'/, type: JSToken.String },
  { regex: /^`[^`]*`/, type: JSToken.String }, // Template literals (simplificado)

  // Números (inteiros, decimais, hex, etc.)
  { regex: /^\b(0[xX][0-9a-fA-F]+|\d*\.?\d+([eE][+-]?\d+)?)\b/, type: JSToken.Number },

  // Delimitadores e Pontuação
  { regex: /^[\(\)\{\}\[\]]/, type: JSToken.Delimiter },
  { regex: /^[\.,;:]/, type: JSToken.Punctuation },

  // Operadores
  { regex: /^[+\-*\/%=<>&|\^!~?]/, type: JSToken.Operator },

  // Identificadores (palavras-chave, built-ins ou variáveis)
  { regex: /^[a-zA-Z_\$][a-zA-Z0-9_\$]*/, type: 'identifier' }, 
];

/**
 * Realiza a tokenização de uma única linha de código JavaScript.
 * @param lineText A linha de texto a ser processada.
 * @returns Um array de IToken.
 */
export function tokenize(lineText: string): IToken[] {
  const tokens: IToken[] = [];
  let currentIndex = 0;

  while (currentIndex < lineText.length) {
    let matched = false;

    for (const rule of rules) {
      const match = lineText.substring(currentIndex).match(rule.regex);

      if (match && match[0]) {
        const value = match[0];
        // Não adiciona tokens de espaço em branco
        if (rule.type !== 'whitespace') {
            let tokenType = rule.type;
            
            // Se for um identificador, verifica se é uma palavra-chave ou built-in
            if (tokenType === 'identifier') {
                if (flowKeywords.map.has(value) || declarationKeywords.map.has(value) || literalKeywords.map.has(value)) {
                    tokenType = JSToken.Keyword;
                } else if (builtinMap.has(value)) {
                    tokenType = JSToken.Builtin;
                } else {
                    tokenType = JSToken.Identifier;
                }
            }

            tokens.push({
                startIndex: currentIndex,
                type: tokenType,
                length: value.length,
            });
        }

        currentIndex += value.length;
        matched = true;
        break;
      }
    }

    // Se nenhuma regra corresponder, avança um caractere para evitar loop infinito
    if (!matched) {
      currentIndex++;
    }
  }

  return tokens;
}
