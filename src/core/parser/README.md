# Diretório `parser`

O `parser` (ou analisador sintático) é a segunda fase do pipeline de compreensão de código, atuando logo após o `lexer`. Ele recebe a lista de `tokens` e tenta construir uma estrutura em árvore chamada *Abstract Syntax Tree* (AST). A AST representa a estrutura gramatical do código, mostrando como os diferentes `tokens` se relacionam uns com os outros de acordo com as regras da linguagem.

Uma AST é fundamental para funcionalidades avançadas como a validação de sintaxe em tempo real, *linting*, refatoração de código e *code intelligence* (como o autocompletar sensível ao contexto).

## Ficheiros Principais

### `ast.ts`
- **Descrição**: Define as estruturas de dados (classes ou interfaces TypeScript) para os nós da *Abstract Syntax Tree*. Cada tipo de construção da linguagem (como uma declaração de variável, uma chamada de função ou uma expressão `if`) terá o seu próprio tipo de nó na AST (ex: `VariableDeclaration`, `FunctionCall`, `IfStatement`).

### `grammar.ts`
- **Descrição**: Este ficheiro contém a definição formal da gramática da linguagem que o editor suporta. É aqui que as regras sintáticas são especificadas, por exemplo, "uma declaração de variável consiste na palavra-chave `const`, seguida por um identificador, um sinal de igual e uma expressão". O `parser` usa estas regras para construir a AST.

### `syntax-validator.ts`
- **Descrição**: Um componente que percorre a AST (ou que funciona em conjunto com o `parser`) para encontrar erros de sintaxe. Quando o `parser` não consegue construir uma parte da árvore de acordo com as regras da `grammar`, este módulo é responsável por reportar um erro, indicando a sua localização no código.

### `index.ts`
- **Descrição**: O ponto de entrada do módulo `parser`. Exporta a função principal que recebe uma lista de `tokens` (do `lexer`) e retorna a raiz da *Abstract Syntax Tree* (AST). Se a análise falhar, ele pode retornar a AST parcial juntamente com uma lista de erros de sintaxe.
