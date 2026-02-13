import React from 'react';
import { EditorProvider, useEditor } from '../hooks/use-editor';
import Toolbar from '../components/toolbar/toolbar';
import LineNumbers from '../components/editor/line-numbers';
import './main-layout.css';

// O componente do Editor principal, que consome o contexto
const EditorView: React.FC = () => {
  const { code, setCode } = useEditor();

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className="editor-main-area">
      {/* A calha de números de linha */}
      <LineNumbers />
      {/* O editor de texto real */}
      <textarea 
        className="editor-textarea"
        value={code}
        onChange={handleCodeChange}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />
    </div>
  );
}

// O Layout Principal que inclui o Provedor de Contexto
const MainLayout: React.FC = () => {
  return (
    <EditorProvider>
      <div className="main-layout">
        <Toolbar />
        <EditorView />
      </div>
    </EditorProvider>
  );
};

export default MainLayout;
