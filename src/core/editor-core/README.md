# Diretório `editor-core`

Este diretório é o cérebro da lógica do editor. Ele gere o estado fundamental da aplicação, independentemente de como a UI o apresenta. O `editor-core` é responsável pelo modelo de dados do documento, pelo controlo do cursor e da seleção, pela gestão do histórico (undo/redo) e pela coordenação de eventos.

## Ficheiros Principais

### `document.ts`
- **Descrição**: Define a estrutura de dados que representa o documento de texto. Em vez de uma simples *string*, é comum usar uma estrutura mais otimizada (como um *Rope* ou uma lista de linhas) que permite edições eficientes (inserções, remoções) em ficheiros grandes sem ter de mover grandes blocos de memória.

### `cursor.ts`
- **Descrição**: Contém a lógica para gerir a posição do cursor (ou múltiplos cursores) no documento. Define o que acontece quando o utilizador prime as setas, `PageUp`/`PageDown`, `Home`/`End`, e como o cursor se move em resposta a edições de texto.

### `selection.ts`
- **Descrição**: Gere a lógica de seleção de texto. Baseia-se no movimento do cursor enquanto uma tecla (como `Shift`) está pressionada. Mantém o controlo do intervalo de texto selecionado para operações como copiar, recortar ou apagar.

### `HistoryManager.ts`
- **Descrição**: Implementa as funcionalidades de "desfazer" (*undo*) e "refazer" (*redo*). Guarda um histórico das ações do utilizador (como inserções de texto, remoções) e permite navegar por esse histórico, aplicando ou revertendo alterações ao estado do documento.

### `clipboard.ts`
- **Descrição**: Gere as operações de copiar e colar. Interage com o *clipboard* do sistema operativo e com a lógica de `document.ts` e `selection.ts` para inserir ou extrair texto do editor.

### `events.ts`
- **Descrição**: Um sistema de *event emitter* ou *dispatcher* que permite que diferentes partes do `core` (e até da UI) comuniquem de forma desacoplada. Por exemplo, quando o documento muda, ele emite um evento `documentChanged`, para que a UI saiba que precisa de se re-renderizar.

### `index.ts`
- **Descrição**: O ponto de entrada do `editor-core`. Ele agrega todas as peças anteriores numa única classe ou objeto coeso (ex: `EditorCore`), que é a principal interface que a camada de UI (`React`) utiliza para interagir com o motor do editor.
