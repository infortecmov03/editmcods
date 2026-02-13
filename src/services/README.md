# Diretório `services`

Este diretório contém módulos que funcionam como "serviços" de longa duração ou que fornecem funcionalidades complexas e encapsuladas. São responsáveis por tarefas que vão além da edição de texto, como análise de código em tempo real, compilação e comunicação com ferramentas externas.

## Estrutura de Diretórios

### `analytics`
- **Descrição**: Módulo dedicado à recolha de dados de uso da aplicação (telemetria). É fundamental para entendermos como os utilizadores interagem com o editor e onde podemos fazer melhorias.
  - **`usage-tracker.ts`**: Implementa a lógica para registar eventos importantes, como a abertura de ficheiros, o uso de certas funcionalidades, ou a ocorrência de erros.

### `compiler`
- **Descrição**: Responsável por compilar e executar o código escrito pelo utilizador num ambiente seguro e isolado.
  - **`javascript-runner.ts`**: Contém a lógica para executar código JavaScript.
  - **`sandbox.ts`**: Cria um ambiente de *sandbox* (caixa de areia) para a execução de código. O objetivo é impedir que o código do utilizador aceda a APIs sensíveis ou afete a estabilidade da aplicação principal.

### `language-server`
- **Descrição**: Implementa a comunicação com um Language Server Protocol (LSP) externo. O LSP é um padrão que permite que editores de código obtenham funcionalidades inteligentes, como autocompletar, diagnósticos de erros e navegação de código, a partir de um "servidor" de linguagem separado.
  - **`lsp-client.ts`**: A implementação do cliente que se conecta ao servidor LSP, envia o conteúdo do editor e recebe de volta os diagnósticos e sugestões.
  - **`completion.ts`**: Lida especificamente com as sugestões de autocompletar recebidas do servidor LSP.

## Ficheiros `index.ts`

Cada subdiretório possui um ficheiro `index.ts` que serve como a fachada pública do módulo, exportando apenas as funções e classes que precisam de ser consumidas por outras partes da aplicação. Isto ajuda a manter a organização e a reduzir o acoplamento entre os diferentes módulos.
