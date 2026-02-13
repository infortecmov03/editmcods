# Diretório `editor`

Este diretório contém todos os componentes React que, juntos, formam a experiência de edição de código. É o coração visual e interativo da aplicação, onde o utilizador escreve e vê o seu código a ser realçado e formatado.

## Ficheiros Principais

### `CodeEditor.tsx`
- **Descrição**: Este é o componente principal e o mais complexo. Ele junta a `textarea` (onde o utilizador de facto escreve) com a área de visualização onde o código é renderizado com a coloração de sintaxe (*syntax highlighting*). É responsável por:
  - Gerir os eventos do teclado e do rato.
  - Sincronizar o estado da `textarea` com o `EditorCore` (o nosso "cérebro").
  - Coordenar a renderização dos números de linha, do minimapa e do texto realçado.
- **CSS**: `CodeEditor.css` contém os estilos para o layout do `CodeEditor`, posicionando a `textarea` por cima da área de realce de forma invisível.

### `Editor.tsx`
- **Descrição**: Um componente "wrapper" ou "container" que envolve o `CodeEditor`. A sua principal responsabilidade é fornecer um contexto ou estado global para o editor, se necessário, e ligá-lo a outras partes da UI, como a barra de status ou a barra de ferramentas.

### `line-numbers.tsx`
- **Descrição**: Um componente dedicado a renderizar a calha de números de linha à esquerda do editor. Ele calcula a quantidade de linhas com base no conteúdo do documento e exibe os números correspondentes.
- **CSS**: `line-numbers.css` estiliza a calha, os números e garante que o alinhamento e o *scroll* fiquem perfeitamente sincronizados com o `CodeEditor`.

### `minimap.tsx`
- **Descrição**: Renderiza uma "visão de pássaro" ou um mapa em miniatura de todo o código no lado direito do editor. Permite que o utilizador navegue rapidamente por ficheiros grandes.

### `index.tsx`
- **Descrição**: O ficheiro de entrada do módulo, que exporta o componente `Editor` principal para ser facilmente consumido por outras partes da aplicação, como o layout principal.
