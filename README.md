
# Three Step Map App (Vite + React + TS)

App mobile-first com três etapas gamificadas, mapa estilo "tesouro", persistência em `localStorage`, e bilhete dourado (intro e final).

## Features
- **Intro**: bilhete dourado com mensagem e botão "Iniciar jornada".
- **Mapa**: caminho curvado tracejado, máscara para não passar por baixo dos pontos, "X" no final, clique nos checkpoints desbloqueados.
- **Passo 1**: upload de foto (modal + preview).
- **Passo 2**: relacionar 4 nomes e 4 avatares (tap-to-assign).
- **Passo 3**: quebra-cabeça 4×4 com **drag & drop** por Pointer Events; usa **imagem fixa** (`src/assets/puzzle.svg`). Tem constante **ZOOM** para evitar bordas pretas.
- **Final**: bilhete dourado cobrindo a tela + botão "Recomeçar".
- **Persistência**: progresso salvo (inclui `introDone`).

## Rodar
```bash
npm install
npm run dev
```

## Customizações
- **Zoom do puzzle**: altere `ZOOM` em `src/components/PuzzleStep.tsx` (ex.: 1.2 → 1.3).
- **Imagem do puzzle**: troque `src/assets/puzzle.svg` (pode usar PNG/JPG, ajuste o import).
