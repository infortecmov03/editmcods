
// src/config/keybindings.ts

/**
 * @interface IKeyBinding
 * Define a estrutura para um único atalho de teclado, associando uma combinação de teclas a um comando.
 */
export interface IKeyBinding {
  key: string;      // A combinação de teclas (ex: 'ctrl+s', 'tab').
  command: string;  // O identificador único para o comando a ser executado.
}

/**
 * @const keybindings
 * Uma lista dos atalhos de teclado padrão do editor.
 * Esta configuração permite que a lógica de entrada do usuário seja desacoplada das ações que ela aciona.
 */
export const keybindings: IKeyBinding[] = [
  // Ações de Arquivo
  { key: 'ctrl+s', command: 'file.save' },
  { key: 'cmd+s', command: 'file.save' }, // Atalho para macOS

  // Ações de Edição
  { key: 'ctrl+z', command: 'editor.undo' },
  { key: 'cmd+z', command: 'editor.undo' }, // Atalho para macOS
  { key: 'ctrl+y', command: 'editor.redo' },
  { key: 'shift+cmd+z', command: 'editor.redo' }, // Atalho comum para macOS

  // Ações de Busca
  { key: 'ctrl+f', command: 'editor.find' },
  { key: 'cmd+f', command: 'editor.find' }, // Atalho para macOS

  // Ações de Indentação
  { key: 'tab', command: 'editor.indent' },
  { key: 'shift+tab', command: 'editor.outdent' },
];
