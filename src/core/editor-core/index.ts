
// src/core/editor-core/index.ts

import { EditorDocument } from './document';
import { Cursor, ICursorPosition } from './cursor';
import { HistoryManager, IHistoryState } from './HistoryManager';

/**
 * @class EditorCore
 * Main facade for the editor core.
 */
export class EditorCore {
  public readonly document: EditorDocument;
  public readonly cursor: Cursor;
  public readonly history: HistoryManager;

  constructor(initialContent: string = '') {
    this.document = new EditorDocument(initialContent);
    this.cursor = new Cursor();
    this.history = new HistoryManager();

    const initialState: IHistoryState = {
      content: this.document.getFullText(),
      cursorPosition: this.cursor.getPosition(),
    };
    this.history.push(initialState);
  }

  /**
   * Sets the document content, saving the previous state.
   * @param {string} newContent - The new content.
   * @param {ICursorPosition} newCursorPosition - The new cursor position.
   */
  public setContent(newContent: string, newCursorPosition: ICursorPosition): void {
    const currentState: IHistoryState = {
      content: this.document.getFullText(),
      cursorPosition: this.cursor.getPosition(),
    };
    this.history.push(currentState);

    this.document.setContent(newContent);
    const lineCount = this.document.getLineCount();
    const maxColumn = this.document.getLine(newCursorPosition.lineNumber).length;
    this.cursor.setPosition(newCursorPosition, lineCount, maxColumn);
  }

  /**
   * Undoes the last change, restoring content and cursor position.
   */
  public undo(): void {
    const currentState: IHistoryState = {
      content: this.document.getFullText(),
      cursorPosition: this.cursor.getPosition(),
    };

    const stateToRestore = this.history.undo(currentState);

    if (stateToRestore) {
      this.document.setContent(stateToRestore.content);
      const lineCount = this.document.getLineCount();
      const maxColumn = this.document.getLine(stateToRestore.cursorPosition.lineNumber).length;
      this.cursor.setPosition(stateToRestore.cursorPosition, lineCount, maxColumn);
    }
  }

  /**
   * Redoes the last undone change, restoring content and cursor position.
   */
  public redo(): void {
    const currentState: IHistoryState = {
      content: this.document.getFullText(),
      cursorPosition: this.cursor.getPosition(),
    };

    const stateToRestore = this.history.redo(currentState);

    if (stateToRestore) {
      this.document.setContent(stateToRestore.content);
      const lineCount = this.document.getLineCount();
      const maxColumn = this.document.getLine(stateToRestore.cursorPosition.lineNumber).length;
      this.cursor.setPosition(stateToRestore.cursorPosition, lineCount, maxColumn);
    }
  }
}
