
// src/languages/typescript/grammar.ts

import { IToken } from '../language-provider';
import { TSToken } from './tokens';
import { flowKeywords, declarationKeywords, literalKeywords, moduleKeywords } from '../common/keywords';
import { builtinMap } from '../common/builtins';

// Palavras-chave adicionais específicas do TypeScript
const tsKeywords = new Set([
    'type', 'interface', 'public', 'private', 'protected', 'implements', 'declare', 
    'readonly', 'abstract', 'enum', 'namespace', 'as', 'is', 'in'
]);

// Tipos primitivos e especiais do TypeScript
const tsTypes = new Set([
    'string', 'number', 'boolean', 'any', 'void', 'unknown', 'never', 'null', 'undefined', 'symbol', 'bigint'
]);

// Regras de expressão regular (semelhantes ao JS, mas o tratamento pós-match será diferente)
const rules = [
  { regex: /^\s+/, type: 'whitespace' },
  { regex: /^\/\/.*/, type: TSToken.Comment },
  { regex: /^\/\*.*?\*\//, type: TSToken.Comment },
  { regex: /^"(?:\\.|[^\\"])*"/, type: TSToken.String },
  { regex: /^'(?:\\.|[^\\'])*'/, type: TSToken.String },
  { regex: /^`[^`]*`/, type: TSToken.String },
  { regex: /^\b(0[xX][0-9a-fA-F]+|\d*\.?\d+([eE][+-]?\d+)?)\b/, type: TSToken.Number },
  { regex: /^[\(\)\{\}\[\]]/, type: TSToken.Delimiter },
  { regex: /^[\.,;:]/, type: TSToken.Punctuation },
  { regex: /^[+\-*\/%=<>&|\^!~?]/, type: TSToken.Operator },
  { regex: /^[a-zA-Z_\$][a-zA-Z0-9_\$]*/, type: 'identifier' },
];

export function tokenize(lineText: string): IToken[] {
  const tokens: IToken[] = [];
  let currentIndex = 0;

  while (currentIndex < lineText.length) {
    let matched = false;

    for (const rule of rules) {
      const match = lineText.substring(currentIndex).match(rule.regex);

      if (match && match[0]) {
        const value = match[0];
        if (rule.type !== 'whitespace') {
            let tokenType = rule.type;

            // Lógica de refinamento de token para TypeScript
            if (tokenType === 'identifier') {
                if (flowKeywords.map.has(value) || declarationKeywords.map.has(value) || literalKeywords.map.has(value) || moduleKeywords.map.has(value) || tsKeywords.has(value)) {
                    tokenType = TSToken.Keyword;
                } else if (tsTypes.has(value)) {
                    tokenType = TSToken.Type;
                } else if (builtinMap.has(value)) {
                    tokenType = TSToken.Builtin;
                } else {
                    // Verificação para ver se é um nome de tipo (geralmente começa com letra maiúscula)
                    if (value.length > 0 && value[0] === value[0].toUpperCase()) {
                        // Isso é uma heurística, não é 100% preciso sem um compilador completo,
                        // mas é bom para syntax highlighting.
                        tokenType = TSToken.Type;
                    } else {
                        tokenType = TSToken.Identifier;
                    }
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

    if (!matched) {
      currentIndex++;
    }
  }

  return tokens;
}
