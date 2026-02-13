/**
 * Escapa caracteres HTML especiais para prevenir a renderização indesejada.
 * Substitui `&`, `<`, e `>` por suas respectivas entidades HTML.
 * @param text O texto a ser escapado.
 * @returns O texto com os caracteres HTML escapados.
 */
const escapeHTML = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

/**
 * Envolve o conteúdo de um token em um `<span>` com uma classe CSS específica.
 * O conteúdo é escapado para garantir que seja exibido como texto literal.
 * As classes são prefixadas com "token-" para evitar conflitos de nome.
 *
 * @param content O texto do token a ser envolvido.
 * @param className O tipo do token (ex: "keyword", "string").
 * @returns Uma string HTML com o conteúdo estilizado e seguro.
 */
const applyStyle = (content: string, className: string): string => {
  const escapedContent = escapeHTML(content);
  // Retorna um span com a classe prefixada, por exemplo: <span class="token-keyword">...</span>
  return `<span class="token-${className}">${escapedContent}</span>`;
};

export { applyStyle };
