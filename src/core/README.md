# Diretório `core`

O diretório `core` é o coração técnico da aplicação, onde toda a lógica fundamental do editor de código reside. Este módulo é independente da UI (React) e pode, teoricamente, ser executado num ambiente não-visual (como o lado do servidor ou um terminal). Ele lida com a manipulação de texto, análise de código, gestão do estado e renderização.

A sua arquitetura é modular, dividida em várias partes distintas que trabalham em conjunto para proporcionar uma experiência de edição de código rica e performante.

## Subdiretórios Principais

### `editor-core`
- **Responsabilidade**: Gestão do estado central do editor. Contém a lógica para a estrutura do documento, a posição do cursor, a gestão da seleção, o histórico de alterações (undo/redo) e o mecanismo de eventos. É o "cérebro" que coordena todas as ações de edição.

### `lexer`
- **Responsabilidade**: Análise Léxica (*Lexical Analysis*). O `lexer` (ou *tokenizer*) lê o código fonte como uma sequência de caracteres e divide-o numa sequência de "tokens" (ex: `keyword`, `identifier`, `operator`). É o primeiro passo crucial para a compreensão do código.

### `parser`
- **Responsabilidade**: Análise Sintática (*Syntactic Analysis*). O `parser` recebe a lista de tokens do `lexer` e tenta construir uma estrutura de dados em árvore, chamada *Abstract Syntax Tree* (AST). Esta árvore representa a estrutura gramatical do código e é usada para funcionalidades avançadas como validação de sintaxe e *code outlining*.

### `highlight`
- **Responsabilidade**: *Syntax Highlighting* (Coloração de Sintaxe). Este módulo utiliza a informação do `lexer` (e, por vezes, do `parser`) para aplicar estilos e cores ao texto do código, tornando-o muito mais fácil de ler e compreender. Ele gere temas e a aplicação de estilos dinâmicos.

### `rendering`
- **Responsabilidade**: Renderização do Texto. Este módulo é responsável por desenhar o texto, o cursor e as decorações (como o *highlight* da seleção ou guias de indentação) no ecrã. Pode usar diferentes estratégias, como `Canvas` ou DOM, para otimizar a performance e garantir uma experiência de escrita fluída.
