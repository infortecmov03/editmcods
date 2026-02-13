# Módulo de Configuração (`src/config`)

Este diretório contém todos os arquivos relacionados à configuração estática do editor. Ele define o comportamento padrão, os atalhos de teclado e a estrutura de configuração geral.

## Arquivos

### `default-settings.ts`
- **Função**: Define a interface `IEditorSettings` e fornece um objeto com os valores de configuração padrão do editor.
- **Propósito**: Serve como a "fonte da verdade" para todas as configurações possíveis e seus valores iniciais (ex: `fontSize`, `tabSize`, `theme`).

### `editor-config.ts`
- **Função**: Cria uma instância de configuração principal para o editor, utilizando o padrão Singleton.
- **Propósito**: Carrega as configurações padrão e permite que configurações do usuário (ainda não implementado) as substituam. Ele garante que toda a aplicação acesse a mesma instância de configuração, mantendo o estado consistente.

### `keybindings.ts`
- **Função**: Define a interface `IKeyBinding` e exporta uma lista de atalhos de teclado padrão.
- **Propósito**: Mapeia combinações de teclas (ex: `ctrl+s`) a identificadores de comando (ex: `file.save`). Isso desacopla a entrada do teclado da ação que ela executa, permitindo uma arquitetura mais limpa.
