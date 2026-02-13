
// src/core/editor-core/HistoryManager.ts

import { ICursorPosition } from './cursor';

/**
 * @interface IHistoryState
 * Representa um único "snapshot" na história, incluindo conteúdo e cursor.
 */
export interface IHistoryState {
  content: string;
  cursorPosition: ICursorPosition;
}

/**
 * @class HistoryManager
 * Gerencia o histórico de undo/redo para o documento do editor.
 */
export class HistoryManager {
  private undoStack: IHistoryState[] = [];
  private redoStack: IHistoryState[] = [];
  private static readonly MAX_HISTORY_SIZE = 100;

  /**
   * Adiciona um novo estado à pilha de undo.
   * @param {IHistoryState} state - O estado a ser salvo.
   */
  public push(state: IHistoryState): void {
    // Limpa a pilha de redo sempre que uma nova ação é realizada.
    this.redoStack = [];
    this.undoStack.push(state);

    if (this.undoStack.length > HistoryManager.MAX_HISTORY_SIZE) {
      this.undoStack.shift();
    }
  }

  /**
   * Tira um estado da pilha de undo e retorna-o.
   * @param {IHistoryState} currentState - O estado atual, para ser salvo na pilha de redo.
   * @returns {IHistoryState | null} O estado a ser restaurado, ou nulo se não houver nada para desfazer.
   */
  public undo(currentState: IHistoryState): IHistoryState | null {
    const lastState = this.undoStack.pop();
    if (!lastState) return null;

    this.redoStack.push(currentState);
    return lastState;
  }

  /**
   * Tira um estado da pilha de redo e retorna-o.
   * @param {IHistoryState} currentState - O estado atual, para ser salvo na pilha de undo.
   * @returns {IHistoryState | null} O estado a ser restaurado, ou nulo se não houver nada para refazer.
   */
  public redo(currentState: IHistoryState): IHistoryState | null {
    const nextState = this.redoStack.pop();
    if (!nextState) return null;

    this.undoStack.push(currentState);
    return nextState;
  }
}
