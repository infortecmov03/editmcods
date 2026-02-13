// document.ts
import { ICursorPosition } from './cursor';

export interface IDocumentLine {
  text: string;
  tokens: any[];
}

export class EditorDocument {
  private lines: IDocumentLine[] = [];

  constructor(initialContent: string = '') {
    this.setContent(initialContent);
  }

  public setContent(newContent: string): void {
    const textLines = newContent.split('\n');
    this.lines = textLines.map(line => ({
      text: line,
      tokens: []
    }));
  }

  public insertText(text: string, position: ICursorPosition): ICursorPosition {
    const lineIndex = position.lineNumber - 1;
    
    if (lineIndex < 0 || lineIndex >= this.lines.length) return position;
    
    const currentLine = this.lines[lineIndex];
    const textBefore = currentLine.text.substring(0, position.column - 1);
    const textAfter = currentLine.text.substring(position.column - 1);
    
    currentLine.text = textBefore + text + textAfter;
    
    return {
      lineNumber: position.lineNumber,
      column: position.column + text.length
    };
  }

  public handleTabInsertion(position: ICursorPosition, tabSize: number): ICursorPosition {
    const spaces = ' '.repeat(tabSize);
    return this.insertText(spaces, position);
  }

  public insertNewLine(position: ICursorPosition): ICursorPosition {
    const lineIndex = position.lineNumber - 1;
    const currentLine = this.lines[lineIndex];
    const textBefore = currentLine.text.substring(0, position.column - 1);
    const textAfter = currentLine.text.substring(position.column - 1);
    
    // Auto-indentação
    const indent = textBefore.match(/^\s*/)?.[0] || '';
    
    currentLine.text = textBefore;
    
    this.lines.splice(lineIndex + 1, 0, {
      text: indent + textAfter,
      tokens: []
    });
    
    return {
      lineNumber: position.lineNumber + 1,
      column: indent.length + 1
    };
  }

  public deleteBackward(position: ICursorPosition): ICursorPosition {
    const lineIndex = position.lineNumber - 1;
    
    if (position.column > 1) {
      // Deleta caractere à esquerda
      const currentLine = this.lines[lineIndex];
      const textBefore = currentLine.text.substring(0, position.column - 2);
      const textAfter = currentLine.text.substring(position.column - 1);
      currentLine.text = textBefore + textAfter;
      
      return {
        lineNumber: position.lineNumber,
        column: position.column - 1
      };
    } else if (position.lineNumber > 1) {
      // Junta com linha anterior
      const prevLineIndex = lineIndex - 1;
      const prevLine = this.lines[prevLineIndex];
      const currentLine = this.lines[lineIndex];
      
      const newColumn = prevLine.text.length + 1;
      prevLine.text += currentLine.text;
      
      this.lines.splice(lineIndex, 1);
      
      return {
        lineNumber: position.lineNumber - 1,
        column: newColumn
      };
    }
    
    return position;
  }

  public getLine(lineNumber: number): IDocumentLine {
    return this.lines[lineNumber - 1];
  }

  public getLineLength(lineNumber: number): number {
    if (lineNumber < 1 || lineNumber > this.lines.length) return 0;
    return this.lines[lineNumber - 1].text.length;
  }

  public getLineCount(): number {
    return this.lines.length;
  }

  public getFullText(): string {
    return this.lines.map(line => line.text).join('\n');
  }
}