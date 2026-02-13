import React from 'react';
import './line-numbers.css';

interface LineNumbersProps {
  lineCount: number;
}

const LineNumbers: React.FC<LineNumbersProps> = ({ lineCount }) => {
  // Garante um mínimo de 1 linha para o cálculo de caracteres
  const totalLines = Math.max(lineCount, 1);
  // Calcula o número de caracteres necessários para o maior número de linha
  const minChars = String(totalLines).length;

  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Estilo CSS para garantir que o espaçamento seja consistente
  const gutterStyle = {
    '--line-number-min-chars': `${minChars}ch`,
  } as React.CSSProperties;

  return (
    <div 
      className="line-numbers-gutter" 
      aria-hidden="true"
      style={gutterStyle}
    >
      {lines.map((lineNumber) => (
        <div key={lineNumber} className="line-number">
          {lineNumber}
        </div>
      ))}
    </div>
  );
};

export default LineNumbers;
