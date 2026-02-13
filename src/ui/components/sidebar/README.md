# Diretório `sidebar`

Este diretório contém os componentes React que compõem a barra lateral da aplicação. A barra lateral é uma parte crucial da interface, fornecendo ao utilizador ferramentas de navegação e de análise de código que são essenciais para um fluxo de trabalho de desenvolvimento produtivo.

## Ficheiros Principais

### `file-explorer.tsx`
- **Descrição**: Este é o explorador de ficheiros, um dos componentes mais importantes da barra lateral. Ele renderiza a estrutura de pastas e ficheiros do projeto numa vista em árvore, permitindo ao utilizador navegar, abrir, criar e eliminar ficheiros e pastas.

### `search.tsx`
- **Descrição**: Implementa a funcionalidade de pesquisa em todo o projeto. Permite que o utilizador procure por uma string de texto em todos os ficheiros e veja os resultados de forma organizada. Geralmente, interage com um serviço de pesquisa em segundo plano para não bloquear a UI.

### `outline.tsx`
- **Descrição**: Apresenta uma vista de "contorno" ou "estrutura" do ficheiro atualmente aberto. Por exemplo, num ficheiro de código, pode listar as funções, classes ou variáveis definidas, permitindo uma navegação rápida para essas secções.

### `index.tsx`
- **Descrição**: O ficheiro de entrada que provavelmente compõe os diferentes painéis da barra lateral (Explorador, Pesquisa, etc.) num único componente coeso. Pode incluir um sistema de abas ou ícones para alternar entre as diferentes vistas.
