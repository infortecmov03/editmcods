# Diretório `languages`

Este diretório é responsável por definir as especificidades de cada linguagem de programação suportada pelo editor. Ao isolar a configuração de cada linguagem, tornamos o sistema de *highlighting* e análise de código modular e extensível.

## Estrutura de Diretórios

A pasta de cada linguagem contém a sua "identidade" para o editor.

### `common`
- **Descrição**: Contém listas de *tokens* que são partilhados por múltiplas linguagens de programação, como palavras-chave comuns (`if`, `else`, `for`, `while`), valores booleanos (`true`, `false`), e operadores (`+`, `-`, `*`, `/`).
- **Objetivo**: Evitar a duplicação de código e manter a consistência entre as definições de linguagens semelhantes.

### `css`, `html`, `javascript`, `typescript`
- **Descrição**: Cada uma destas pastas representa uma linguagem específica. Dentro de cada uma, encontramos ficheiros que definem as suas características únicas:
  - **`grammar.ts`**: Define as regras gramaticais da linguagem. Estas regras são usadas pelo *parser* para validar a sintaxe e construir a Árvore de Sintaxe Abstrata (AST).
  - **`index.ts`**: O ponto de entrada que exporta a configuração completa da linguagem, combinando as suas regras, palavras-chave e outras definições num único objeto.
  - **`snippets.ts`**: Contém *snippets* de código (fragmentos pré-definidos) para essa linguagem, que podem ser usados para acelerar o desenvolvimento.
  - **`tokens.ts`**: Define listas de *tokens* específicos da linguagem, como palavras-chave (`function`, `var`, `let` em JS), propriedades (`color`, `font-size` em CSS), etc.

## Ficheiros Principais

### `language-manager.ts`
- **Descrição**: Uma classe central que gere todas as linguagens disponíveis. É responsável por carregar as definições de cada linguagem e fornecer acesso a elas para outras partes do editor, como o *highlighter* ou o *parser*.

### `language-provider.ts`
- **Descrição**: Atua como um provedor que facilita o acesso à linguagem ativa ou a uma linguagem específica a pedido. Abstrai a lógica de "onde encontrar" as definições de uma linguagem.

### `index.ts`
- **Descrição**: Exporta as funcionalidades mais importantes do diretório, tornando-as facilmente acessíveis para o resto da aplicação.
