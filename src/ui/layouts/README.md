# Diretório `layouts`

Este diretório é responsável por definir a estrutura e a organização visual da aplicação. Os componentes de layout não se preocupam com a lógica de negócio, mas sim em como os outros componentes (da `sidebar`, `toolbar`, `editor`, etc.) são posicionados e interagem uns com os outros no ecrã.

## Ficheiros Principais

### `main-layout.tsx`
- **Descrição**: Este é o componente de layout de topo. Ele compõe a aplicação inteira, juntando todos os pedaços principais da UI: a `Toolbar`, a `Sidebar`, o `Editor`, a `Console` e a `StatusBar`. É aqui que a grelha principal da aplicação é definida.
- **CSS**: `main-layout.css` contém o CSS essencial para criar esta estrutura, utilizando provavelmente `flexbox` ou `grid` para conseguir um layout responsivo e ajustável.

### `split-pane.tsx`
- **Descrição**: Um componente reutilizável que cria painéis redimensionáveis. É usado para permitir que o utilizador ajuste o tamanho da `sidebar` em relação ao editor, ou o tamanho da `console` em relação à área de código. É uma peça fundamental para uma UI flexível.

### `tabs.tsx`
- **Descrição**: Este componente implementa um sistema de abas (tabs) para gerir múltiplos ficheiros abertos. Ele lida com a renderização das abas, o fecho de ficheiros e a troca entre eles, garantindo que apenas o ficheiro ativo é mostrado no `CodeEditor`.
