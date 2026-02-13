
// src/core/editor-core/events.ts

// Define um tipo para os callbacks dos eventos, garantindo tipagem forte.
type EventCallback = (...args: any[]) => void;

/**
 * @class EventManager
 * Implementa um sistema de publicação/inscrição (Pub/Sub) para comunicação desacoplada
 * entre diferentes partes do núcleo do editor.
 */
export class EventManager {
  private listeners: { [eventName: string]: EventCallback[] } = {};

  /**
   * Registra um callback para ser executado quando um evento específico é emitido.
   * @param {string} eventName - O nome do evento a ser ouvido (ex: 'contentChanged').
   * @param {EventCallback} callback - A função a ser executada.
   */
  public on(eventName: string, callback: EventCallback): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  /**
   * Remove um callback previamente registrado para um evento.
   * @param {string} eventName - O nome do evento.
   * @param {EventCallback} callback - O callback a ser removido.
   */
  public off(eventName: string, callback: EventCallback): void {
    if (!this.listeners[eventName]) {
      return;
    }
    this.listeners[eventName] = this.listeners[eventName].filter(
      (listener) => listener !== callback
    );
  }

  /**
   * Emite um evento, acionando todos os callbacks registrados para ele.
   * @param {string} eventName - O nome do evento a ser emitido.
   * @param {...any[]} args - Os argumentos a serem passados para os callbacks.
   */
  public emit(eventName: string, ...args: any[]): void {
    if (!this.listeners[eventName]) {
      return;
    }
    this.listeners[eventName].forEach((listener) => {
      try {
        listener(...args);
      } catch (err) {
        console.error(`Erro ao executar o callback para o evento '${eventName}':`, err);
      }
    });
  }
}
