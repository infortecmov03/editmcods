# Diretório `lexer`

O `lexer` (também conhecido como *scanner* ou *tokenizer*) é o primeiro passo no pipeline de compreensão de código do editor. A sua principal responsabilidade é transformar uma sequência de caracteres (o código fonte) numa sequência de `tokens`. Cada `token` é uma pequena unidade de significado, como uma palavra-chave, um identificador, um número ou um operador.

Este processo, chamado de análise léxica, simplifica muito o trabalho da fase seguinte, o `parser`.

## Ficheiros Principais

### `token.ts`
- **Descrição**: Define a estrutura de dados de um `Token`. Um token normalmente contém o seu tipo (ex: `TokenType.Keyword`), o seu valor (o texto real, como `"const"`) e a sua posição no código fonte (linha e coluna). Esta informação é crucial para o *syntax highlighting* e para a comunicação de erros.

### `scanner.ts`
- **Descrição**: Uma classe ou função de baixo nível que atua como um cursor que avança pelo código fonte, caractere a caractere. Expõe métodos como `peek()` (olhar o próximo caractere sem o consumir) e `advance()` (consumir o caractere e avançar). É a base sobre a qual o `tokenizer` é construído.

### `tokenizer.ts`
- **Descrição**: O coração do `lexer`. Utiliza o `scanner` para percorrer o código e agrupar caracteres em `tokens`. Contém a lógica principal para reconhecer diferentes tipos de tokens, como identificar se uma sequência de letras é uma palavra-chave (`if`, `else`) ou um identificador (nome de uma variável).

### `index.ts`
- **Descrição**: O ponto de entrada do módulo `lexer`. Ele exporta a função ou classe principal do `tokenizer`, que recebe o código fonte como entrada e retorna uma lista de `tokens` como saída, pronta para ser consumida pelo `parser` ou pelo `highlighter`.

### `utils/`
- **Descrição**: Este subdiretório contém utilitários que ajudam o `lexer`, como definições de padrões de `regex` para reconhecer números ou *strings*, ou funções para lidar com caracteres `unicode`.
