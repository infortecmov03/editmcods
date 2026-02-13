import React, { useState, useRef, useEffect } from 'react';
import Highlighter from '../../../core/highlight/Highlighter'; // Importa o componente
import './CodeEditor.css';

interface CodeEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  language: string; // Adiciona a propriedade da linguagem
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialContent,
  onContentChange,
  language,
}) => {
  const [content, setContent] = useState(initialContent);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newContent = event.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
    setScrollLeft(event.currentTarget.scrollLeft);
  };

  return (
    <div className="code-editor-wrapper">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        onScroll={handleScroll}
        className="code-input"
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
      />
      <Highlighter
        code={content}
        language={language}
        scrollTop={scrollTop}
        scrollLeft={scrollLeft}
      />
    </div>
  );
};

export default CodeEditor;
