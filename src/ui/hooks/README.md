# Diretório `hooks`

Este diretório contém os *custom hooks* do React, que são a chave para a nossa estratégia de partilha de lógica com estado entre componentes. A utilização de *hooks* permite-nos manter os nossos componentes de UI mais limpos, focados na renderização e fáceis de manter, enquanto a lógica complexa é abstraída e reutilizada.

## Ficheiros Principais

### `use-editor.tsx`
- **Descrição**: Este *hook* provavelmente encapsula a lógica de interação com o estado do `EditorCore`. Ele pode fornecer aos componentes uma forma de aceder e modificar o conteúdo do documento, obter informações sobre a seleção do cursor, ou acionar ações como *undo/redo*. É a ponte entre a UI do React e o "cérebro" do editor.

### `use-keyboard.ts`
- **Descrição**: Um *hook* crucial para a experiência de utilização do editor. É responsável por gerir os atalhos de teclado. Ele ouve os eventos de teclado, interpreta as combinações de teclas (ex: `Ctrl+S`, `Cmd+F`) e executa as ações correspondentes, como salvar o ficheiro ou abrir a caixa de diálogo de pesquisa.

### `use-theme.ts`
- **Descrição**: Este *hook* gere o tema da aplicação. Ele provavelmente expõe o tema atual (ex: "dark" ou "light") e uma função para o alterar. Os componentes podem usar este *hook* para adaptar os seus estilos dinamicamente com base no tema selecionado, garantindo uma aparência consistente em toda a aplicação.
