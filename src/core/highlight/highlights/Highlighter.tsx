import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import './Highlighter.css';

interface HighlighterProps {
  code: string;
  language: string;
  scrollTop: number;
  scrollLeft: number;
}

const Highlighter: React.FC<HighlighterProps> = ({ code, language, scrollTop, scrollLeft }) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollTop, scrollLeft]);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre ref={preRef} className="code-editor-highlight" aria-hidden="true">
      <code className={`language-${language}`}>
        {`${code}\n`}
      </code>
    </pre>
  );
};

export default Highlighter;
