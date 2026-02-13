
import { h } from './highlighter';
import { defaultTheme } from './theme';

const highlightJS = (code: string): string => {
  const rules = {
    'keyword': /\b(function|const|let|var|if|else|return)\b/g,
    'string': /"(.*?)"/g,
    'comment': /\/\/.*|\/\*[\s\S]*?\*\//g,
  };

  return h(code, rules, defaultTheme);
};

export { highlightJS };
