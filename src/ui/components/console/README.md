# Diretório `console`

Este diretório contém os componentes relacionados com a área do terminal e da consola de output da aplicação. Esta funcionalidade é essencial para que os utilizadores possam ver os resultados da execução do seu código, logs e interagir com um shell de linha de comandos.

## Ficheiros Principais

### `console.tsx`
- **Descrição**: Um componente de "consola" que é usado para exibir *output* de processos, como os resultados de um `console.log()` do código do utilizador. Geralmente, é uma área de texto só de leitura que mostra os logs de forma formatada.

### `terminal.tsx`
- **Descrição**: Este é um componente mais avançado que emula um terminal de linha de comandos (shell) real dentro da aplicação. Permite que o utilizador execute comandos, como `npm install` ou `git`, diretamente no ambiente do editor.

### `index.tsx`
- **Descrição**: O ficheiro de entrada que provavelmente combina os componentes `Console` e `Terminal` (talvez num sistema de abas) e os exporta como um único módulo para serem facilmente integrados no layout principal da aplicação.
