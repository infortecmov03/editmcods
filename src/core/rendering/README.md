# Diretório `rendering`

O diretório `rendering` é a camada final do `core`, responsável por pegar na representação interna do documento e em todas as informações de estilo (do `highlighter`) e desenhar tudo no ecrã. A performance desta camada é absolutamente crítica para garantir uma experiência de escrita e de *scrolling* fluída, especialmente com ficheiros grandes.

Este módulo abstrai a tecnologia de renderização utilizada (ex: DOM vs. Canvas), permitindo otimizações de baixo nível sem afetar o resto da aplicação.

## Ficheiros Principais

### `renderer.ts`
- **Descrição**: Define a interface ou a classe base para todos os *renderers*. Abstrai as operações de desenho principais, como `drawText()`, `drawCursor()`, `clear()`, e a gestão da *viewport* (a área visível do ficheiro).

### `canvas-renderer.ts`
- **Descrição**: Uma implementação concreta da interface do `renderer` que utiliza a API de `Canvas` do HTML5. O `Canvas` oferece um controlo de baixo nível sobre os *pixels*, o que pode levar a uma performance de renderização superior em comparação com a manipulação do DOM, especialmente para editores com muitas decorações complexas e animações.

### `line-renderer.ts`
- **Descrição**: Um componente especializado em renderizar uma única linha de código. Ele recebe o texto da linha, os `tokens` de *highlighting* e as decorações, e desenha-os. Virtualizar a renderização ao nível da linha (desenhar apenas as linhas que estão visíveis) é uma técnica de otimização chave.

### `text-measurer.ts`
- **Descrição**: Um utilitário crucial para qualquer `renderer`. A sua função é medir as dimensões do texto (largura e altura) com uma determinada fonte. Esta informação é essencial para calcular a posição do cursor, para o *word wrapping* (quebra de linhas) e para alinhar corretamente as decorações com o texto.

### `index.ts`
- **Descrição**: O ponto de entrada que exporta o `renderer` principal a ser utilizado pela aplicação.
