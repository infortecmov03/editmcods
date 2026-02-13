import React, { createContext, useContext, useState } from "react";

// Estratégias de numeração de linha
export type LineNumberStrategy = "on" | "off" | "relative";

// Interface para uma decoração de gutter (ex: breakpoint)
export interface IGutterDecoration {
  line: number;      // A linha que receberá a decoração
  className: string; // A classe CSS para o ícone (ex: 'breakpoint')
}

// Interface para o estado completo do editor
interface IEditorState {
  code: string;
  language: string;
  lineNumberStrategy: LineNumberStrategy;
  decorations: IGutterDecoration[];
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setLineNumberStrategy: (strategy: LineNumberStrategy) => void;
  toggleGutterDecoration: (decoration: IGutterDecoration) => void;
}

// Contexto do Editor com valores padrão
const EditorContext = createContext<IEditorState>({
  code: "",
  language: "javascript",
  lineNumberStrategy: "on",
  decorations: [],
  setCode: () => {},
  setLanguage: () => {},
  setLineNumberStrategy: () => {},
  toggleGutterDecoration: () => {},
});

// Provedor do Contexto
export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [lineNumberStrategy, setLineNumberStrategy] = useState<LineNumberStrategy>("on");
  const [decorations, setDecorations] = useState<IGutterDecoration[]>([]);

  // Adiciona ou remove uma decoração
  const toggleGutterDecoration = (decoration: IGutterDecoration) => {
    setDecorations(prev => {
      const exists = prev.some(d => d.line === decoration.line && d.className === decoration.className);
      if (exists) {
        // Remove a decoração se ela já existir
        return prev.filter(d => d.line !== decoration.line || d.className !== decoration.className);
      } else {
        // Adiciona a decoração se ela não existir
        return [...prev, decoration];
      }
    });
  };

  const value = {
    code,
    language,
    lineNumberStrategy,
    decorations,
    setCode,
    setLanguage,
    setLineNumberStrategy,
    toggleGutterDecoration,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

// Hook customizado para acesso fácil ao contexto
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor deve ser usado dentro de um EditorProvider");
  }
  return context;
};
