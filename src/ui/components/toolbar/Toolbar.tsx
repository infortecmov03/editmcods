import React from 'react';
import LanguageSelector from '../language-selector/language-selector';
import './toolbar.css';

interface ToolbarProps {
  onLoadExample: () => void;
  onClear: () => void;
  onFocus: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onLoadExample, 
  onClear, 
  onFocus, 
  language, 
  onLanguageChange 
}) => {
  return (
    <div className="toolbar">
      <button onClick={onLoadExample}>Exemplo</button>
      <button onClick={onClear}>Limpar</button>
      <button onClick={onFocus}>Focar</button>
      <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
    </div>
  );
};

export default Toolbar;
