
// src/core/highlight/highlighter.ts

import { IDocumentLine } from '../editor-core/document';
import { defaultTheme, ITheme } from './theme';

// Helper function to escape HTML special characters
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * A simple regex-based highlighter function that uses a theme.
 * @param code The code to highlight.
 * @param rules An object where keys are token types and values are regexes.
 * @param theme The theme object to map token types to CSS classes.
 * @returns An HTML string with highlighted code.
 */
export const h = (code: string, rules: { [key: string]: RegExp }, theme: ITheme = defaultTheme): string => {
  let result = '';
  let pos = 0;

  const matches = Object.entries(rules).flatMap(([tokenType, regex]) =>
    [...code.matchAll(new RegExp(regex, 'g'))].map(match => ({
      start: match.index!,
      end: match.index! + match[0].length,
      token: tokenType,
      match: match[0],
    }))
  ).sort((a, b) => a.start - b.start);

  const filteredMatches = matches.reduce((acc, current) => {
    const last = acc[acc.length - 1];
    if (!last || current.start >= last.end) {
      acc.push(current);
    }
    return acc;
  }, [] as typeof matches);

  for (const match of filteredMatches) {
    if (match.start > pos) {
      result += escapeHtml(code.substring(pos, match.start));
    }
    const tokenClass = theme[match.token] || '';
    result += `<span class="${tokenClass}">${escapeHtml(match.match)}</span>`;
    pos = match.end;
  }

  if (pos < code.length) {
    result += escapeHtml(code.substring(pos));
  }

  return result;
};


/**
 * @class Highlighter
 * Responsável por transformar uma linha de documento tokenizada em uma string HTML
 * com a sintaxe colorida.
 */
export class Highlighter {
  private theme: ITheme;

  constructor(theme: ITheme = defaultTheme) {
    this.theme = theme;
  }

  /**
   * Processa uma única linha do documento e gera o HTML estilizado.
   * @param {IDocumentLine} line - A linha do documento, contendo o texto e os tokens.
   * @returns {string} Uma string HTML com os tokens envolvidos por spans estilizados.
   */
  public highlightLine(line: IDocumentLine): string {
    const { text, tokens } = line;

    if (!tokens || tokens.length === 0) {
      return escapeHtml(text);
    }

    let html = '';
    let lastIndex = 0;

    tokens.forEach(token => {
      if (token.startIndex > lastIndex) {
        html += escapeHtml(text.substring(lastIndex, token.startIndex));
      }

      const tokenText = text.substring(token.startIndex, token.startIndex + token.length);
      const tokenClass = this.theme[token.type] || '';
      
      html += `<span class="${tokenClass}">${escapeHtml(tokenText)}</span>`;

      lastIndex = token.startIndex + token.length;
    });

    if (lastIndex < text.length) {
      html += escapeHtml(text.substring(lastIndex));
    }

    return html;
  }
}

// Exporta uma instância singleton do Highlighter para ser usada pela UI.
export const highlighter = new Highlighter();
