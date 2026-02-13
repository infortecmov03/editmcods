import React, { useState, useCallback } from 'react';
import { EditorCore } from '../../../core/editor-core';
import CodeEditor from './CodeEditor';
import LineNumbers from './line-numbers';
import StatusBar from '../statusbar/StatusBar';
import Toolbar from '../toolbar/Toolbar';
import './Editor.css';

const Editor: React.FC = () => {
  const [editorState, setEditorState] = useState(() => {
    const initialContent = '';
    const core = new EditorCore(initialContent);
    return {
      core,
      content: initialContent,
      cursorPosition: core.cursor.getPosition(),
    };
  });

  const [language, setLanguage] = useState('javascript');

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setEditorState(prevState => {
      prevState.core.document.setContent(newContent);
      return {
        ...prevState,
        content: newContent,
        cursorPosition: prevState.core.cursor.getPosition(),
      };
    });
  }, []);

  const handleLoadExample = () => {
    const exampleContent = `function hello() {\n  console.log("Hello, World!");\n}`;
    setEditorState(prevState => {
      prevState.core.document.setContent(exampleContent);
      prevState.core.cursor.moveTo(1, 1);
      return {
        core: prevState.core,
        content: exampleContent,
        cursorPosition: prevState.core.cursor.getPosition(),
      };
    });
  };

  const handleClear = () => {
    setEditorState(prevState => {
      prevState.core.document.setContent('');
      prevState.core.cursor.moveTo(1, 1);
      return {
        core: prevState.core,
        content: '',
        cursorPosition: prevState.core.cursor.getPosition(),
      };
    });
  };

  const handleFocus = () => {
    // Lógica de foco
  };

  const lineCount = editorState.core.document.getLineCount();
  const { lineNumber, column } = editorState.cursorPosition;

  return (
    <div className="editor-container">
      <Toolbar 
        onLoadExample={handleLoadExample} 
        onClear={handleClear} 
        onFocus={handleFocus}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      <div className="editor-area">
        <LineNumbers lineCount={lineCount} />
        <CodeEditor 
          initialContent={editorState.content} 
          onContentChange={handleContentChange} 
          language={language}
        />
      </div>
      <StatusBar 
        lineNumber={lineNumber} 
        column={column} 
        totalLines={lineCount} 
      />
    </div>
  );
};

export default Editor;
