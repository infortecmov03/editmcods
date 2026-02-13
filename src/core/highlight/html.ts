
import { h } from './highlighter';

const highlightHTML = (code: string): string => {
  const rules = {
    'tag': /<\/?([a-zA-Z0-9]+)/g,
    'attribute': /\s([a-zA-Z-]+)=/g,
    'string': /"(.*?)"/g,
    'comment': /<!--[\s\S]*?-->/g,
  };

  return h(code, rules);
};

export { highlightHTML };
