
// src/core/editor-core/selection.ts
import { ICursorPosition } from './cursor';
import { EditorDocument } from './document';

/**
 * @class SelectionManager
 * Gerencia o estado da seleção de texto dentro do documento.
 * A seleção é definida por um ponto de âncora (início) e um ponto de cabeça (fim).
 */
export class SelectionManager {
  private anchor: ICursorPosition;
  private head: ICursorPosition;

  constructor(initialPosition: ICursorPosition = { lineNumber: 1, column: 1 }) {
    this.anchor = { ...initialPosition };
    this.head = { ...initialPosition };
  }

  /**
   * Define ou atualiza a seleção.
   * @param {ICursorPosition} anchor - O ponto de início da seleção.
   * @param {ICursorPosition} head - O ponto final da seleção (a posição do cursor).
   */
  public setSelection(anchor: ICursorPosition, head: ICursorPosition): void {
    this.anchor = anchor;
    this.head = head;
  }

  /**
   * Retorna as posições de início e fim da seleção.
   * @returns {{ anchor: ICursorPosition, head: ICursorPosition }} Os pontos da seleção.
   */
  public getSelection(): { anchor: ICursorPosition; head: ICursorPosition } {
    return { anchor: this.anchor, head: this.head };
  }

  /**
   * Verifica se a seleção está vazia (ou seja, é apenas um cursor).
   * @returns {boolean} Verdadeiro se não houver texto selecionado.
   */
  public isEmpty(): boolean {
    return (
      this.anchor.lineNumber === this.head.lineNumber &&
      this.anchor.column === this.head.column
    );
  }

  /**
   * Retorna o texto contido na seleção atual.
   * A implementação desta função é complexa e requer a colaboração com o EditorDocument.
   * @param {EditorDocument} document - O documento do qual extrair o texto.
   * @returns {string} O texto selecionado.
   */
  public getSelectedText(document: EditorDocument): string {
    if (this.isEmpty()) {
      return '';
    }

    // Lógica para normalizar a seleção (início antes do fim)
    const { start, end } = this.getNormalizedRange();

    if (start.lineNumber === end.lineNumber) {
      // Seleção na mesma linha
      const lineContent = document.getLine(start.lineNumber);
      return lineContent.substring(start.column - 1, end.column - 1);
    } else {
      // Seleção de múltiplas linhas (implementação mais complexa)
      let text = '';
      // Pega o resto da primeira linha
      text += document.getLine(start.lineNumber).substring(start.column - 1) + '\n';
      // Pega as linhas inteiras no meio
      for (let i = start.lineNumber + 1; i < end.lineNumber; i++) {
        text += document.getLine(i) + '\n';
      }
      // Pega o começo da última linha
      text += document.getLine(end.lineNumber).substring(0, end.column - 1);
      return text;
    }
  }

  /**
   * Retorna a seleção com o ponto inicial sempre antes do final.
   */
  public getNormalizedRange(): { start: ICursorPosition; end: ICursorPosition } {
    const isReversed =
      this.anchor.lineNumber > this.head.lineNumber ||
      (this.anchor.lineNumber === this.head.lineNumber && this.anchor.column > this.head.column);

    return isReversed
      ? { start: this.head, end: this.anchor }
      : { start: this.anchor, end: this.head };
  }
}
