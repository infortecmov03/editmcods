# Diretório `highlight`

Este diretório é responsável pela coloração de sintaxe (*syntax highlighting*) e por outras decorações visuais no editor. Ele utiliza os `tokens` gerados pelo `lexer` para saber que cor aplicar a cada parte do código. A sua principal função é melhorar a legibilidade do código, tornando mais fácil distinguir visualmente entre palavras-chave, *strings*, comentários, etc.

Além da coloração básica, este módulo também pode gerir outras decorações, como o sublinhado de erros, o realce de parênteses correspondentes ou a visualização de guias de indentação.

## Ficheiros Principais

### `highlighter.ts`
- **Descrição**: O orquestrador principal da coloração de sintaxe. Recebe o código e os `tokens` do `lexer` e, com base nas regras de um tema, gera uma lista de "estilos" a serem aplicados. Ele mapeia os tipos de token (ex: `TokenType.Keyword`) para classes de CSS ou estilos específicos.

### `theme.ts`
- **Descrição**: Define a paleta de cores para a coloração de sintaxe. Contém um ou mais objetos de tema (ex: `darkTheme`, `lightTheme`) que especificam que cor corresponde a cada tipo de token (`keyword`, `string`, `comment`, etc.). Isto permite que o utilizador troque de tema facilmente.

### `style-applier.ts`
- **Descrição**: Um componente que pega nos resultados do `highlighter` e os aplica efetivamente ao `renderer` (seja ele DOM ou Canvas). Ele traduz as instruções de estilo em atributos `style` de HTML, classes de CSS ou comandos de desenho do Canvas.

### Ficheiros de Linguagem (`javascript.ts`, `typescript.ts`, etc.)
- **Descrição**: Estes ficheiros contêm lógicas de *highlighting* específicas para cada linguagem. Embora o `lexer` faça a maior parte do trabalho, algumas linguagens podem ter nuances que requerem uma lógica de coloração mais sofisticada, que pode ser definida aqui.

### `decorators/`
- **Descrição**: Este subdiretório contém a lógica para decorações visuais que vão para além da simples coloração de texto. Cada ficheiro implementa uma funcionalidade específica:
    - **`selection.ts`**: Realça o texto que está selecionado pelo utilizador.
    - **`bracket-matcher.ts`**: Realça o par de parênteses, chavetas ou colchetes correspondente àquele onde o cursor está posicionado.
    - **`indent-guide.ts`**: Desenha linhas verticais para ajudar a visualizar o nível de indentação do código.

### `index.ts`
- **Descrição**: Exporta a interface pública do módulo de *highlighting*, pronta para ser consumida pelo `renderer` ou pela UI principal.
