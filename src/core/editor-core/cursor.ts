import { EditorDocument } from './document';

/**
 * Interface that defines the structure of a cursor position object.
 */
export interface ICursorPosition {
  lineNumber: number;
  column: number;
}

/**
 * Manages the cursor's position and movement within the editor.
 */
export class Cursor {
  private position: ICursorPosition;
  private editorDocument: EditorDocument;

  /**
   * Creates a new instance of the cursor manager.
   * @param {EditorDocument} editorDocument - The instance of the editor document.
   */
  constructor(editorDocument: EditorDocument) {
    this.position = { lineNumber: 1, column: 1 };
    this.editorDocument = editorDocument;
  }

  /**
   * Gets the current cursor position.
   * @returns {ICursorPosition} The current cursor position.
   */
  public getPosition(): ICursorPosition {
    return this.position;
  }

  /**
   * Sets the cursor's position, ensuring it is valid.
   * @param {ICursorPosition} position - The new cursor position.
   */
  public setPosition(position: ICursorPosition): void {
    const { lineNumber, column } = position;
    const lineCount = this.editorDocument.getLineCount();
    const line = this.editorDocument.getLine(lineNumber);
    const lineLength = line ? line.text.length : 0;

    // Clamp the line number to be within the document's bounds
    const clampedLineNumber = Math.max(1, Math.min(lineNumber, lineCount));

    // Clamp the column number to be within the line's bounds
    const clampedColumn = Math.max(1, Math.min(column, lineLength + 1));

    this.position = {
      lineNumber: clampedLineNumber,
      column: clampedColumn,
    };
  }

  /**
   * Moves the cursor to a new position.
   * @param {number} lineNumber - The target line number.
   * @param {number} column - The target column number.
   */
  public moveTo(lineNumber: number, column: number): void {
    this.setPosition({ lineNumber, column });
  }

  /**
   * Moves the cursor up one line.
   */
  public moveUp(): void {
    if (this.position.lineNumber > 1) {
      this.moveTo(this.position.lineNumber - 1, this.position.column);
    }
  }

  /**
   * Moves the cursor down one line.
   */
  public moveDown(): void {
    const lineCount = this.editorDocument.getLineCount();
    if (this.position.lineNumber < lineCount) {
      this.moveTo(this.position.lineNumber + 1, this.position.column);
    }
  }

  /**
   * Moves the cursor left one column.
   */
  public moveLeft(): void {
    if (this.position.column > 1) {
      this.moveTo(this.position.lineNumber, this.position.column - 1);
    } else if (this.position.lineNumber > 1) {
      // Move to the end of the previous line
      const targetLine = this.position.lineNumber - 1;
      const prevLine = this.editorDocument.getLine(targetLine);
      this.moveTo(targetLine, (prevLine?.text.length || 0) + 1);
    }
  }

  /**
   * Moves the cursor right one column.
   */
  public moveRight(): void {
    const line = this.editorDocument.getLine(this.position.lineNumber);
    const currentLineLength = line ? line.text.length : 0;

    if (this.position.column <= currentLineLength) {
      this.moveTo(this.position.lineNumber, this.position.column + 1);
    } else if (this.position.lineNumber < this.editorDocument.getLineCount()) {
      // Move to the beginning of the next line
      this.moveTo(this.position.lineNumber + 1, 1);
    }
  }
}
