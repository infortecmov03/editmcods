# Diretório `toolbar`

Este diretório contém os componentes que formam a barra de ferramentas principal da aplicação. A barra de ferramentas oferece ao utilizador acesso rápido a ações e configurações importantes, como a seleção de linguagem e de tema.

## Ficheiros Principais

### `toolbar.tsx`
- **Descrição**: O componente principal que renderiza a barra de ferramentas. Ele serve como um contentor para os vários botões e seletores que compõem a `toolbar`.
- **CSS**: `toolbar.css` contém os estilos para o layout, aparência e posicionamento da barra de ferramentas.

### `language-selector.tsx`
- **Descrição**: Um componente de seleção (`dropdown` ou similar) que permite ao utilizador escolher a linguagem do ficheiro atual. Esta seleção influencia diretamente o *syntax highlighting* e outras funcionalidades dependentes da linguagem.

### `theme-selector.tsx`
- **Descrição**: Um componente que permite ao utilizador mudar o tema de cores do editor. Interage com o sistema de gestão de temas para aplicar os estilos do tema selecionado a toda a aplicação.

### `index.tsx`
- **Descrição**: O ponto de entrada que exporta o componente `Toolbar` principal para ser utilizado no layout da aplicação.
