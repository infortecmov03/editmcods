# Diretório `ui`

Este diretório contém todo o código relacionado com a interface do utilizador (UI) da aplicação. É aqui que a lógica de baixo nível do `core` ganha vida e se torna interativa para o utilizador. A estrutura é baseada em React e segue as melhores práticas de organização de componentes, hooks e layouts.

## Estrutura de Diretórios

### `components`
- **Descrição**: O coração da nossa UI. Este diretório contém componentes React reutilizáveis que formam os blocos de construção da aplicação. A filosofia é criar componentes pequenos, focados e compoñíveis.
- **Organização**: Os componentes estão agrupados por funcionalidade (por exemplo, `editor`, `sidebar`, `toolbar`) para facilitar a navegação e a manutenção. Cada grupo de componentes tem o seu próprio `README.md` que detalha a sua função específica.
- **Exemplos**: `CodeEditor.tsx`, `FileExplorer.tsx`, `StatusBar.tsx`.

### `hooks`
- **Descrição**: Contém os *custom hooks* do React. Os *hooks* permitem-nos extrair e reutilizar lógica com estado entre diferentes componentes, mantendo o código dos componentes mais limpo e focado na renderização.
- **Responsabilidade**: Encapsular lógica complexa de UI, como a gestão de atalhos de teclado (`use-keyboard.ts`), a interação com o estado do editor (`use-editor.tsx`), ou a gestão do tema da aplicação (`use-theme.ts`).

### `layouts`
- **Descrição**: Componentes React responsáveis pela estrutura visual e pelo layout geral da aplicação. Eles definem as principais áreas da interface, como o painel principal, a barra lateral e a barra de status.
- **Responsabilidade**: Orquestrar a forma como os componentes principais são organizados no ecrã. Por exemplo, `main-layout.tsx` pode definir um layout com uma barra lateral à esquerda e uma área de conteúdo principal à direita, enquanto `split-pane.tsx` permite que o utilizador redimensione essas áreas.

## Ficheiros `README.md`

Cada subdiretório principal (`components`, `hooks`, `layouts`) e cada subpasta de componentes (ex: `editor`, `sidebar`) tem o seu próprio ficheiro `README.md`, explicando em detalhe o propósito dos ficheiros que contém. Esta documentação granular é vital para a manutenção e escalabilidade do projeto.
