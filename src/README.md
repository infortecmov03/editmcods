# Diretório `src`

Este diretório é o coração da aplicação, contendo todo o código-fonte do nosso editor de código. A arquitetura é organizada de forma modular para separar claramente as responsabilidades, desde a lógica de baixo nível do editor até à interface do utilizador construída em React.

## Estrutura de Diretórios

A estrutura de pastas foi desenhada para ser modular, escalável e fácil de navegar.

### `/config`
Contém ficheiros de configuração estática da aplicação.
- **Responsabilidade**: Definir configurações que raramente mudam, como as definições padrão do editor (tamanho da fonte, família da fonte), temas de cores, e mapeamentos de atalhos de teclado.
- **Exemplos**: `editor-config.ts`, `keybindings.ts`.

### `/core`
É o "cérebro" do editor. Contém toda a lógica de baixo nível que não depende de nenhuma framework de UI (como o React).
- **Responsabilidade**: Gerir o estado do documento (texto e linhas), a posição do cursor, o histórico de alterações (undo/redo), o sistema de eventos, e a lógica de coloração de sintaxe (*highlighting*).
- **Exemplos**: `document.ts`, `cursor.ts`, `HistoryManager.ts`, `highlighter.ts`.

### `/languages`
Define as especificidades de cada linguagem de programação suportada pelo editor.
- **Responsabilidade**: Conter as palavras-chave, regras gramaticais para o *parser*, e *snippets* (fragmentos de código) para linguagens como JavaScript, CSS, etc.
- **Exemplos**: `javascript/grammar.ts`, `css/keywords.ts`.

### `/services`
Contém serviços de longa duração ou que comunicam com sistemas externos.
- **Responsabilidade**: Implementar funcionalidades como um cliente para o Language Server Protocol (LSP) para obter autocompletar e diagnósticos, ou um *runner* para compilar e executar código num *sandbox*.
- **Exemplos**: `lsp-client.ts`, `javascript-runner.ts`.

### `/tests`
Contém todos os testes automatizados da aplicação.
- **Responsabilidade**: Garantir a qualidade e a estabilidade do código através de testes unitários (para funções isoladas), testes de integração (para múltiplos componentes a funcionar em conjunto), e `fixtures` (dados de teste).
- **Exemplos**: `editor.test.ts`, `highlighter.test.ts`.

### `/types`
Define as interfaces e tipos TypeScript usados em toda a aplicação.
- **Responsabilidade**: Garantir a consistência e a segurança de tipos no projeto. Centraliza todas as formas de dados.
- **Exemplos**: `editor.types.ts`, `theme.types.ts`.

### `/ui`
Contém todos os componentes React e hooks que formam a interface do utilizador.
- **Responsabilidade**: Renderizar o estado do editor, lidar com a interação do utilizador e apresentar a informação visualmente. É aqui que a "magia" do `/core` se torna visível.
- **Exemplos**: `CodeEditor.tsx`, `FileExplorer.tsx`, `use-editor.tsx`.

### `/utils`
Uma coleção de funções utilitárias reutilizáveis, organizadas por categoria.
- **Responsabilidade**: Fornecer ferramentas para tarefas comuns, como manipulação do DOM, operações de texto, otimização de performance (ex: `debounce`), e acesso ao `localStorage`.
- **Exemplos**: `dom-events.ts`, `string-utils.ts`.

### `/workers`
Código para os Web Workers.
- **Responsabilidade**: Executar tarefas computacionalmente pesadas (como compilação, *linting* ou *highlighting* de ficheiros grandes) em *threads* de segundo plano, para não bloquear a interface principal e manter a aplicação fluida.
- **Exemplos**: `compile.worker.ts`, `highlight.worker.ts`.

## Ficheiros na Raiz

Os ficheiros na raiz do `src` são o ponto de entrada e a configuração global da aplicação.

- **`main.tsx`**: O ponto de entrada principal da aplicação React. É aqui que o componente `App` é renderizado no DOM da página.
- **`App.tsx`**: O componente React raiz que compõe toda a interface da aplicação, juntando os vários layouts, painéis e componentes da UI.
- **`index.css` / `App.css`**: Ficheiros de estilos CSS globais que se aplicam a toda a aplicação ou ao componente `App` principal.
