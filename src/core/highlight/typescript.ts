
import { h } from './highlighter';
import { defaultTheme } from './theme';

const highlightTS = (code: string): string => {
  const rules = {
    'keyword': /\b(function|const|let|var|if|else|return|type|interface|enum|public|private|protected|implements|extends)\b/g,
    'type': /\b(string|number|boolean|any|void|null|undefined)\b/g,
    'string': /"(.*?)"/g,
    'comment': /\/\/.*|\/\*[\s\S]*?\*\//g,
  };

  return h(code, rules, defaultTheme);
};

export { highlightTS };
