---
name: component-driven-react
description: Constrói e decompõe UI React seguindo Component-Driven Development sob a react-clean-architecture da casa. Track A para feature nova, Track B para quebrar arquivo monolítico em ondas seguras de code motion puro. Use quando o usuário disser "criar página", "novo componente", "esse arquivo está gigante", "quebrar essa página", "componentizar", "extrair componente", "refatorar essa tela", "modularizar o frontend", "esse arquivo tem N mil linhas". NÃO use para lógica de domain/data/infra (siga o standard direto), backend (fastify-clean-architecture), auditoria pós-implementação (review-implementation) nem especificação de feature (tlc-spec-driven).
license: CC-BY-4.0
metadata:
  author: Numen DS
  version: '1.0.0'
---

# Component-Driven React

Skill de construção e decomposição de UI em `packages/frontend`, sob [`react-clean-architecture`](../../../docs/standards/react-clean-architecture/README.md) + [ADR-002](../../../docs/adr/002-rejeicao-divergencias-react-clean-architecture.md).

> **A doutrina é do standard; esta skill é a execução.** A taxonomia de tiers, os gatilhos de extração, o teto de 250 linhas, a partição de estado e a barra de teste por tier são normativos e vivem em [`granularity.md`](../../../docs/standards/react-clean-architecture/presentation-layer/granularity.md) e [`testing.md`](../../../docs/standards/react-clean-architecture/presentation-layer/testing.md) — **leia-os antes de decidir qualquer coisa**. Os `references/` desta skill trazem os mesmos conceitos com os caminhos, números e exemplos reais deste repositório, mais o workflow em fases que o standard não descreve.

> Filosofia: granularidade não é estética — é **testabilidade**. Um componente que não chama `useApp()` nem recebe controller não precisa de provider, decorator nem Storybook: `render()` + props **é** a story. Empurre lógica para baixo até que as camadas intestáveis sejam pura composição.

A prova disso já está no repo: `pages/developments/chat/` tem 9 arquivos co-localizados (11–350 L, mediana 62) e é o **único** lugar com testes de componente. `EfChatComposer` e `EfChatTimeline` são testáveis porque recebem `placeholder`, `sendLabel`, `hint` e `emptyLabel` **como props**. `AnalysisResultCard` (`ef-ia-tab.tsx:56`) chama `useApp()` internamente e não tem teste. A correlação não é coincidência — é a regra que sustenta toda esta skill.

## Quando usar

- Criar página, seção, diálogo ou componente novo em `presentation/`.
- Quebrar arquivo `.tsx` que passou de 250 linhas.
- Extrair componente reutilizável quando um segundo consumidor aparece.
- Decidir onde um artefato mora (página local vs componente global vs hook vs função pura).
- Decidir qual estado sobe, qual desce e qual vira hook.

Não use para:

- Lógica de `domain/`, `data/` ou `infra/` → siga o standard da camada direto.
- Backend → [`fastify-clean-architecture`](../../../docs/standards/fastify-clean-architecture/README.md).
- Especificar feature (spec/design/tasks) → [`tlc-spec-driven`](../tlc-spec-driven/SKILL.md).
- Auditar implementação pronta → [`review-implementation`](../review-implementation/SKILL.md).
- Registrar decisão arquitetural → [`create-adr`](../create-adr/SKILL.md).
- Stress-test de plano → [`the-fool`](../the-fool/SKILL.md).

## Workflow

```
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│ 0. TRIAGEM│→ │ 1. INVENT.│→ │ 2. ÁRVORE │→ │ 3. ONDAS  │→ │ 4. PINS   │→ │ 5. CONSOL.│
│  A ou B   │  │  A | B    │  │   -ALVO   │  │   build   │  │  testes   │  │ + débito  │
└───────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘
  required       required        required       required      required      Profundo só
```

Dois tracks, um único workflow. As fases 0, 2, 4 e 5 são idênticas; só 1 e 3 divergem.

| Track | Quando | Fase 1 | Fase 3 |
|---|---|---|---|
| **A — feature nova** | não existe arquivo ainda | inventário de reuso | build bottom-up |
| **B — refatoração** | arquivo existente passou do teto | scan métrico + mapa de faixas | 5 ondas de code motion puro |

### Fase 0 — Triagem (sempre)

1. Classificar o track (A ou B) e o modo (Rápido / Padrão / Profundo — tabela abaixo).
2. **Track A:** confirmar que a rota existe ou precisa ser criada — checar `shared/constants/routes.ts` e `main/app.tsx`.
3. **Track B:** rodar o scan métrico no arquivo-alvo e imprimir a tabela de violações:

   ```bash
   wc -l <arquivo>
   grep -c 'useState' <arquivo>
   grep -c 'useEffect(' <arquivo>
   grep -c 'const handle' <arquivo>
   grep -c '<Dialog' <arquivo>
   ```

   Comparar contra os 12 gatilhos em [`references/extraction-triggers.md`](references/extraction-triggers.md). Sem medição não há decisão — nunca decida granularidade "no olho".
4. Declarar o modo escolhido ao usuário antes de seguir.

### Fase 1 — Inventário

**Track A** — listar o que **já existe** e deve ser reusado. Nada se escreve novo que já exista:

- 16 componentes globais em `presentation/components/index.ts` (`DataTable`, `ConfirmDialog`, `FileUpload`, `InfoRow`, `StatusBadge`, `EmptyState`, `ErrorState`, `LoadingState`, `SlaFormSection`, `AiModelSelect`, …).
- 13 hooks em `presentation/hooks/`.
- Utils em `shared/utils/` (`format-date`, `format-status`, `format-file-size`, `file-to-base64`).
- Controller + factory da feature, se já existirem.

**Track B** — segmentar o arquivo em faixas de linha, classificar cada faixa num tier ([`references/taxonomy.md`](references/taxonomy.md)) e marcar duplicação intra-arquivo (blocos JSX quase idênticos) e inter-arquivo (o mesmo bloco em outra página). Produzir o mapa antes/depois faixa por faixa.

### Fase 2 — Árvore-alvo (sempre)

Produzir a árvore de arquivos com: caminho, tier, LOC estimada e **contrato de props** de cada artefato. No Track B, incluir a onda de cada artefato e a ordem dos commits.

> **O usuário aprova a Árvore-alvo antes de qualquer escrita.** Esta é a única fase que trava. Decomposição errada aprovada rápido custa mais que decomposição certa aprovada devagar.

Modelo em [`references/worked-example-development-detail.md`](references/worked-example-development-detail.md).

### Fase 3 — Ondas (build)

**Track A** — bottom-up, detalhado em [`references/new-feature-track.md`](references/new-feature-track.md):

```
funções puras (T6) → folhas (T3) → seções (T1) → diálogos (T2) → página (T0)
  → hook (T5) → controller → main/factories/ → ROUTES → app.tsx → app-shell.tsx
```

**Track B** — as 5 ondas, detalhadas em [`references/refactor-waves.md`](references/refactor-waves.md). Resumo:

| Onda | O que sai | Por que nessa ordem | Gate |
|---|---|---|---|
| **W0** funções puras | derivação de permissões, `getVisibleTabs`, reducers → para `<page>/utils/` | único artefato que pode ser travado com teste **antes** de qualquer JSX se mover | `qualityGate` + teste novo verde |
| **W1** diálogos | um `<Dialog>` por commit, levando seu draft state | o estado de um diálogo não tem leitor fora dele — extração sempre segura | `qualityGate` + abrir o diálogo em `yarn dev` |
| **W2** folhas | rows, cards, banners, grupos de campo | pequenas e props-only; ganham `data-testid` e teste | `qualityGate` + teste verde |
| **W3** corpos de aba | um componente por `{currentTab === N && …}` | a essa altura cada aba já é quase só composição; o contrato de props é **descoberto**, não inventado | `qualityGate` + clicar todas as abas |
| **W4** hooks | pares `useState`+`useEffect` de lookup → hooks dedicados | só com a página pequena dá para ver qual estado ficou órfão | `qualityGate` + smoke da rota |
| **W5** consolidação | colapso de duplicatas, promoção para `components/` | **última, sempre**: o code motion é o que torna a duplicação visível e comparável byte a byte | `qualityGate` + teste no global + smoke em **todos** os call sites |

#### Regra de code motion puro (dura, W1–W4)

O JSX movido é textualmente idêntico ao original, exceto:

(a) `state` → `props.x` · (b) linhas de `import` · (c) o bloco `interface Props` · (d) um `data-testid`.

**Nada mais.** Proibido **no mesmo commit**: renomear chave de `translate`, mudar valor de `sx`, adicionar `useMemo`/`useCallback`, reordenar condicional, trocar prop do MUI, "consertar" bug que você notou. Tudo isso vai para `## Débitos observados` e vira commit separado, depois da onda.

Por que tão rígido: **não existe teste cobrindo essas páginas**. A segurança não vem de teste — vem de o diff ser mecanicamente verificável linha a linha por um humano.

> **Expectativa de LOC, declarada antes para ninguém se assustar nem trapacear:** o **código-fonte cresce 10–25%** (imports + `interface Props` + boilerplate por arquivo), e os **testes somam por cima**. No caso canônico: 1.446 L → 1.665 L de fonte em 28 arquivos (+15%), mais 392 L de teste. **Se o total de fonte cair, comportamento foi deletado — reverta.**

### Fase 4 — Pins (sempre)

Teste no **momento da extração**, nunca em lote no fim. Regras e helpers em [`references/testing-components.md`](references/testing-components.md).

| Tier | Teste |
|---|---|
| T6 resolver puro | **obrigatório** — todo branch |
| T3 folha / T4 global | **obrigatório** — uma interação + um branch condicional |
| T5 hook | obrigatório quando deriva lógica |
| T0 / T1 / T2 | opcional (dependem de `AppContext`) |

Essa assimetria é deliberada: ela é a pressão que empurra lógica para as folhas.

### Fase 5 — Consolidação (modo Profundo)

1. Promover o que passou a ter 2+ consumidores: **componente** → `presentation/components/` + barrel `components/index.ts`; **função pura** → `pages/<feature>/utils/` (2+ páginas da feature) ou `shared/utils/` (2+ features, e só se não depender de camada nenhuma).
2. Colapsar duplicatas — **respeitando o guard**: só colapsa se a superfície de props ficar ≤8 e nenhuma prop booleana trocar a estrutura do componente. Agrupe props relacionadas em objeto (`notes?: { label, placeholder, rows, required }`) antes de desistir.
3. Registrar `## Débitos observados` no reporte. **Sem consertos silenciosos.**

## Modos (auto-size)

| Modo | Gatilho (qualquer um) | Fases | Ondas | Commits |
|---|---|---|---|---|
| **Rápido** | ≤2 arquivos novos; ou 1 extração de <80 L; nenhum estado se move | 0 → 3 → 4 | 1 | 1 |
| **Padrão** | página nova; ou alvo de 250–600 L; ≤10 artefatos | 0 → 4 | 2–3 | 1 por artefato |
| **Profundo** | alvo >600 L; ou ≥15 artefatos; ou toca `components/index.ts`, hook compartilhado ou `app-context.ts` | 0 → 5 | 5 | 1 por artefato + 1 por consolidação |

> Regra de bolso: `development-detail-page.tsx` (1446), `project-form-page.tsx` (1176), `client-form-page.tsx` (779) e `user-form-dialog.tsx` (486) → **sempre Profundo**. Todo o resto de `pages/` hoje tem ≤376 L → Padrão.

## Trigger patterns

Disclosure progressivo — carregue só o reference que a situação pede.

| A situação é / o usuário diz | Carregar |
|---|---|
| "que tier é isso", "onde esse componente vai", política de imports por tier | [`references/taxonomy.md`](references/taxonomy.md) |
| "esse arquivo está grande", medir antes de decidir, onde cada estado vai | [`references/extraction-triggers.md`](references/extraction-triggers.md) |
| "quebra essa página", "refatora essa tela" — Track B | [`references/refactor-waves.md`](references/refactor-waves.md) |
| "nova página", "nova feature" — Track A, checklist de fiação | [`references/new-feature-track.md`](references/new-feature-track.md) |
| aba-por-bloco, muitos diálogos, formulário gigante | [`references/patterns.md`](references/patterns.md) |
| escrever teste de componente, `renderWithTheme`, `data-testid` | [`references/testing-components.md`](references/testing-components.md) |
| "me mostra um exemplo completo" | [`references/worked-example-development-detail.md`](references/worked-example-development-detail.md) |

## Integrações com outras skills

| Skill | Cruzamento |
|---|---|
| [`tlc-spec-driven`](../tlc-spec-driven/SKILL.md) | esta skill roda **dentro** da fase Execute; a Árvore-alvo da Fase 2 alimenta a seção de decomposição do `design.md` |
| [`review-implementation`](../review-implementation/SKILL.md) | roda **depois**; o subagent de Architecture & Coding Patterns deve carregar [`references/extraction-triggers.md`](references/extraction-triggers.md) — hoje ele não tem régua de granularidade nenhuma |
| [`the-fool`](../the-fool/SKILL.md) | stress-test da Árvore-alvo antes de refatoração Profunda em arquivo >1000 L |
| [`create-adr`](../create-adr/SKILL.md) | se a Fase 5 propuser mudar `docs/standards/`, `eslint.config.mjs` ou `vitest.config.ts` → ADR/RFC, nunca commit silencioso |
| [`handoff`](../handoff/SKILL.md) | refatoração Profunda raramente cabe numa sessão; gere handoff com a onda atual e os commits já feitos |

## Sub-agentes

Paralelizar **só a W2**: folhas não têm dependência entre si, uma por sub-agente. W0, W1, W3, W4 e W5 são sequenciais — cada onda altera o arquivo que a próxima vai ler, então paralelizá-las produz conflito garantido.

Cada sub-agente recebe: faixa de linhas de origem, contrato de props, caminho de destino, e a regra de code motion puro. Devolve **apenas** o sumário + resultado do `qualityGate` — não o conteúdo dos arquivos.

## Checklist de qualidade

### Estrutura
- [ ] Nenhum `.tsx` novo passa de 250 L.
- [ ] 1 aba = 1 arquivo; 1 diálogo = 1 arquivo.
- [ ] Nenhum componente declarado dentro do corpo de outro.
- [ ] Componente com 2+ consumidores está em `components/` + barrel.
- [ ] Funções puras em `.ts` dentro de `utils/` — nunca em `components/`, nunca soltas na raiz, **nunca exportadas de um `.tsx`**.
- [ ] Nenhum re-export pass-through de função pura através de um componente.
- [ ] Nada foi promovido a `shared/utils` por antecipação, nem levando import de camada junto.

### Arquitetura
- [ ] Zero `import … from '@/infra/**'` em `presentation/`.
- [ ] Toda import `@/` com extensão `.js`.
- [ ] Named exports apenas.
- [ ] Nenhum controller ou repository abaixo de T0.
- [ ] Nenhum componente T3/T4 chamando `useApp()`.
- [ ] Página mantém a sequência `isLoading → error → conteúdo`.

### Testes
- [ ] Todo T6 extraído tem teste cobrindo todo branch.
- [ ] Todo T3/T4 extraído tem teste com uma interação + um branch.
- [ ] **Nenhum arquivo de teste dentro de `src/`** — todos em `tests/unit/`, espelhando o caminho do fonte.
- [ ] `data-testid` no padrão `<component-slug>-<part>`.
- [ ] Nomes de teste em PT-BR.

### Refatoração (Track B)
- [ ] Cada commit fecha com `yarn qualityGate` verde.
- [ ] Diff de W1–W4 é code motion puro (as 4 exceções, nada mais).
- [ ] LOC total **cresceu** — não caiu.
- [ ] Smoke por onda executado conforme a tabela de gates.
- [ ] Débitos listados no reporte, não consertados de carona.

### Repositório
- [ ] `pt-br.json` e `en.json` com exatamente as mesmas chaves.
- [ ] Sem arquivo órfão, import quebrado ou diretório vazio.
- [ ] Nada em `docs/standards/`, `eslint.config.mjs`, `vitest.config.ts` ou `package.json` foi tocado.

## Constraints

**MUST DO**
- Medir antes de decidir (Fase 0), sempre.
- Obter aprovação da Árvore-alvo antes da primeira escrita.
- Um artefato por commit no modo Profundo.
- Escrever o teste junto da extração da folha, no mesmo commit.
- Reportar débito observado.

**MUST NOT DO**
- Inventar tier novo ou usar vocabulário de atomic design (atoms/molecules/organisms).
- Misturar consolidação com code motion no mesmo commit.
- Tocar `docs/standards/`, configs de lint/test/build ou dependências.
- Adicionar comentário no código (a menos que o usuário peça).
- Passar controller ou repository abaixo de T0.
- Declarar pronto com `qualityGate` vermelho.
- Matar portas de dev server.

## Referências

- [`references/taxonomy.md`](references/taxonomy.md) — tiers T0–T6, política de imports e propagação, naming, anti-padrões.
- [`references/extraction-triggers.md`](references/extraction-triggers.md) — os 12 gatilhos com justificativa numérica, one-liners de medição, partição de estado.
- [`references/refactor-waves.md`](references/refactor-waves.md) — Track B: W0–W5, code motion puro, gates e smoke, como reverter.
- [`references/new-feature-track.md`](references/new-feature-track.md) — Track A: ordem bottom-up e checklist de fiação completo.
- [`references/patterns.md`](references/patterns.md) — aba-por-bloco, dialog-heavy, formulário de N campos.
- [`references/testing-components.md`](references/testing-components.md) — `renderWithTheme`, `data-testid`, barra mínima por tier, por que não há Storybook.
- [`references/worked-example-development-detail.md`](references/worked-example-development-detail.md) — o caso canônico: 1446 L → 36 arquivos em 23 commits.
