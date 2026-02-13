import React from 'react';
import { highlightJS } from './javascript';
import { highlightTS } from './typescript';
import { highlightHTML } from './html';
import { highlightCSS } from './css';

type HighlighterProps = {
  code: string;
  language: string;
  scrollTop: number;
  scrollLeft: number;
};

const Highlighter: React.FC<HighlighterProps> = ({ code, language, scrollTop, scrollLeft }) => {
  const getHighlightedCode = () => {
    switch (language) {
      case 'javascript':
        return highlightJS(code);
      case 'typescript':
        return highlightTS(code);
      case 'html':
        return highlightHTML(code);
      case 'css':
        return highlightCSS(code);
      default:
        return code; // No highlighting for unsupported languages
    }
  };

  const highlightedHTML = getHighlightedCode();

  return (
    <pre 
      className="code-highlighter"
      style={{ top: -scrollTop, left: -scrollLeft }}
      dangerouslySetInnerHTML={{ __html: highlightedHTML }}
    />
  );
};

export default Highlighter;
