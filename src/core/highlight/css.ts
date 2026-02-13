
import { h } from './highlighter';

const highlightCSS = (code: string): string => {
  const rules = {
    'selector': /([a-zA-Z0-9#.-]+)\s*\{/g,
    'property': /([a-zA-Z-]+):/g,
    'string': /"(.*?)"/g,
    'comment': /\/\*[\s\S]*?\*\//g,
  };

  return h(code, rules);
};

export { highlightCSS };
