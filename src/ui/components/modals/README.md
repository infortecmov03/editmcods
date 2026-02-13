# Diretório `modals`

Este diretório contém os componentes React que são usados para exibir janelas modais (ou pop-ups) na aplicação. As modais são usadas para interações que requerem o foco total do utilizador, como caixas de diálogo de configurações, pesquisa e substituição, ou informações sobre a aplicação.

## Ficheiros Principais

### `settings-modal.tsx`
- **Descrição**: O componente que renderiza a janela de configurações da aplicação. Permite ao utilizador personalizar o comportamento do editor, atalhos de teclado, temas e outras preferências.

### `find-replace.tsx`
- **Descrição**: Um componente modal que fornece a funcionalidade de "Localizar e Substituir". Permite ao utilizador procurar por texto no documento atual e substituí-lo por outro texto, com opções como "substituir tudo" ou "sensível a maiúsculas/minúsculas".

### `about-modal.tsx`
- **Descrição**: Uma modal simples que exibe informações sobre a aplicação, como o número da versão, links para o código-fonte, ou créditos.

### `index.tsx`
- **Descrição**: O ficheiro de entrada que exporta os vários componentes modais, facilitando a sua importação e utilização noutras partes da aplicação onde estas janelas precisam de ser acionadas.
