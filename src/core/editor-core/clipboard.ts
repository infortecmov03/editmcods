
// src/core/editor-core/clipboard.ts

/**
 * @class ClipboardManager
 * Fornece uma camada de abstração para interagir com a área de transferência do navegador.
 * Isso centraliza a lógica de copiar e colar, facilitando o gerenciamento de permissões e a compatibilidade.
 */
export class ClipboardManager {
  /**
   * Escreve um texto na área de transferência do sistema.
   * @param {string} text - O texto a ser copiado.
   * @returns {Promise<void>} Uma promessa que é resolvida quando a operação é concluída.
   * @throws {Error} Se a área de transferência não estiver disponível ou a permissão for negada.
   */
  public async copy(text: string): Promise<void> {
    if (!navigator.clipboard) {
      throw new Error('A API de Clipboard não está disponível neste navegador.');
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
      throw new Error('Não foi possível escrever na área de transferência.');
    }
  }

  /**
   * Lê o texto da área de transferência do sistema.
   * @returns {Promise<string>} Uma promessa que resolve com o texto colado.
   * @throws {Error} Se a área de transferência não estiver disponível ou a permissão for negada.
   */
  public async paste(): Promise<string> {
    if (!navigator.clipboard) {
      throw new Error('A API de Clipboard não está disponível neste navegador.');
    }
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (err) {
      console.error('Falha ao colar texto: ', err);
      throw new Error('Não foi possível ler da área de transferência.');
    }
  }
}

// Exporta uma instância única para ser usada em todo o aplicativo.
export const clipboardManager = new ClipboardManager();
