<!-- 392a4937-fa11-4826-bebe-154a215c29c7 -->
# Área de Projetos — Anel de aplicativos + Lista

## Contexto do site
- **Stack:** Next.js 15, next-intl (locales: pt-BR, en, es, de), Tailwind, shadcn/ui.
- **Página atual:** `app/projetos/page.tsx` está placeholder ("Em breve"); o restante do site usa rotas sob `app/[locale]/` (ex.: `app/[locale]/page.tsx`).
- **Padrão:** Páginas usam `getTranslations` e `Link` de `@/i18n/navigation`; container com `min-h-[calc(100vh-3.5rem)]`, `container`, `px-4`.

## Decisões de implementação

1. **Rota:** Criar a página em `app/[locale]/projetos/page.tsx` para manter i18n e layout com header; remover ou redirecionar a antiga `app/projetos/page.tsx` se ainda for acessada.
2. **Dados dos projetos:** Um único array (ex.: `data/projetos.ts` ou dentro da página) com estrutura por projeto: `id`, `name` (ou título traduzido via i18n), `date` (string ou Date), `icon` (nome ou componente, ex. Lucide). Você preenche depois com seus projetos reais.
3. **Anel à esquerda:** Componente cliente que desenha N itens em círculo (posição via `transform`/`rotate` calculada por índice). Cada item é um botão (ou link) com ícone/nome do app; opcional: animação de rotação contínua suave do anel (CSS `animation`).
4. **Lista à direita:** Lista de cards/itens (título + data); cada item pode ter `id` para scroll/ref. Item “aberto” = destacado (border, bg) e opcionalmente expandido (descrição/link).
5. **Interação:** Ao clicar em um item do anel, definir estado `selectedProjectId`; na lista, rolar até o item com esse `id` (ref + `scrollIntoView`) e aplicando destaque. Se quiser “abrir” = expandir apenas o item selecionado, o estado serve para isso também.

## Estrutura de arquivos

- `app/[locale]/projetos/page.tsx` — página da área de projetos (server component que importa o client da section).
- `components/projetos/projetos-section.tsx` — client component: layout esquerda (anel) + direita (lista), estado de seleção, scroll e destaque.
- `components/projetos/project-ring.tsx` — client: desenho do anel (círculo de itens clicáveis).
- `components/projetos/project-list.tsx` — client: lista com refs por projeto, destaque e scroll.
- `data/projetos.ts` — array de projetos (id, nameKey ou name, date, icon). nameKey pode apontar para chaves em `messages/*.json` (projetos.title1, etc.).
- Atualizar `components/site-header.tsx`: adicionar entrada "Projetos" em `navItems` (href `"/projetos"`).
- Mensagens i18n: adicionar em `messages/pt-BR.json` (e en, es, de) chave `nav.projects` e, se usar nameKey, `projetos.<id>` para títulos.

## Layout (visual)

```
+------------------+  +--------------------------------+
|                  |  |  Projeto A        Jan 2025      |
|    (  app1  )    |  |  Projeto B        Mar 2025  ◀── selecionado
|  app2      app3  |  |  Projeto C        Jun 2025      |
|    (  app4  )    |  |  ...                            |
|     anel         |  |  lista                          |
+------------------+  +--------------------------------+
     esquerda                 direita
```

- Responsivo: em mobile, empilhar (anel em cima, lista embaixo) ou manter duas colunas estreitas, conforme preferência.

## Detalhes técnicos

- **Círculo de itens:** Para N projetos, ângulo por item = `(360 / N) * index` (em graus). Cada item posicionado com `position: absolute`, centro do anel como referência, e `transform: rotate(angle) translateY(-radius)` (ou equivalente) para ficarem na circunferência. Container do anel com `aspect-square` e tamanho fixo (ex. 280px ou 320px).
- **Scroll + destaque:** No `projetos-section`, guardar `selectedProjectId`. Ao clicar no anel, atualizar e chamar `refs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` e aplicar classe de destaque (ex. `border-primary`, `bg-accent/20`) ao item da lista com esse `id`.
- **Acessibilidade:** Botões do anel com `aria-label` com nome do projeto; lista com `aria-current` ou `aria-selected` no item ativo.

## Ordem de implementação sugerida

1. Criar `data/projetos.ts` com 3–4 projetos de exemplo (id, name, date, icon).
2. Implementar `ProjectRing` (anel estático, clicável) e `ProjectList` (lista com data e refs).
3. Implementar `ProjetosSection` (layout esquerda/direita, estado, ligação clique anel → scroll + destaque na lista).
4. Criar `app/[locale]/projetos/page.tsx` e incluir `ProjetosSection`; adicionar "Projetos" no header e chaves i18n.
5. Ajustar responsividade e, se desejar, animação leve de rotação do anel (CSS).

## Opcional

- **Rotação contínua do anel:** Adicionar no container do anel uma classe CSS `animate-spin` (Tailwind) com `animation-duration` longa (ex. 20s) para efeito suave; ou desabilitar em `prefers-reduced-motion`.
- **Remover página antiga:** Se a rota `/projetos` (fora de locale) ainda existir, adicionar redirect em `next.config` ou middleware para `/[locale]/projetos`.

Nenhuma dependência nova necessária; ícones podem ser `lucide-react` já presente.
