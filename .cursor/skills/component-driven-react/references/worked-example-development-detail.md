# Exemplo canônico — `development-detail-page.tsx`

O caso completo: **1446 linhas → 36 arquivos, em 23 commits**, cada um com `yarn qualityGate` verde.

Use este documento como modelo da Árvore-alvo (Fase 2) e do plano de commits (Fase 3). Todas as faixas de linha abaixo foram medidas no arquivo real.

## Diagnóstico (Fase 0)

| Métrica | Valor | Gatilho | Limiar |
|---|---|---|---|
| Linhas | **1446** | 1 | >350 hard |
| `useState` | **54** | 2 | >6 |
| `useEffect` | **9** (8 são carga de lookup) | 3 | >2 |
| Handlers inline | **17** | 4 | >5 |
| Blocos `{currentTab === N && …}` | **7** (um deles 297 L) | 5, 8 | >3 |
| `<Dialog>` no mesmo arquivo | **7** (+3 `ConfirmDialog`) | 9 | qualquer |
| Membros retornados pelo hook | **39** | 12 | >20 |

7 gatilhos estourados → **modo Profundo**, 5 ondas, Árvore-alvo aprovada antes de escrever.

## Mapa antes → depois

| Faixa | L | Conteúdo | Destino |
|---|---|---|---|
| 1–40 | 40 | imports | encolhe para ~20 |
| 42–48 | 7 | `interface Props` | permanece |
| 50–97 | 48 | `TabIndex`, `ALL_TABS`, `getVisibleTabs`, `COMPLEXITY_OPTIONS`, `TAB_LABELS` | T6 + T1 |
| 99–113 | 15 | `useApp` + 10 booleanos de permissão | **T6** |
| 115–153 | 39 | destruturação do hook (37 membros) | permanece |
| 154–207 | 54 | os 54 `useState` | → diálogos + hooks; ~5 permanecem |
| 209–298 | 90 | 9 `useEffect` — 8 carregam lookup | → 2 hooks T5 |
| 300–308 | 9 | guards `isLoading` / `error` / `!data` | permanecem |
| 310–317 | 8 | `latestAnalysis`, `visibleTabs`, `tabLabelMap`, `showEstimateForm` | T6 + T1 |
| 319–493 | 175 | 17 handlers | → diálogos e seções; ~2 permanecem |
| 495–548 | 54 | `currentTab`, `sx` da raiz, header, barra de `Tabs` | T1 ×2 |
| 550–571 | 22 | aba 0 — resumo | T1 |
| 573–592 | 20 | aba 1 — delega a `EfIaTab` | permanece (one-liner) |
| 594–890 | **297** | aba 2 — estimativa | T1 ×5 + T3 ×2 |
| 891–932 | 42 | aba 3 — documentos | T1 |
| 933–1012 | 80 | aba 4 — validação | T1 + T3 |
| 1013–1109 | 97 | aba 5 — solicitações | T1 + T3 |
| 1110–1149 | 40 | aba 6 — auditoria | T1 |
| 1150–1443 | 294 | 7 `<Dialog>` + 3 `<ConfirmDialog>` | T2 ×6 + **T4 ×1** |

## Árvore-alvo

`~` = LOC estimada, incluindo imports e `interface Props`.

A página ganha **pasta própria** (`development-detail/`), porque `pages/developments/` abriga três rotas — lista, formulário e detalhe. Dentro dela, `components/` recebe toda a extração de UI, subdividida em orquestradores (raiz), `tabs/` e `dialogs/`; e `utils/` recebe as funções puras, que não são componentes. Convenção em [`pages.md`](../../../../docs/standards/react-clean-architecture/presentation-layer/pages.md) e [`granularity.md`](../../../../docs/standards/react-clean-architecture/presentation-layer/granularity.md).

```
packages/frontend/src/presentation/pages/developments/
├── development-detail/
│   ├── development-detail-page.tsx                   ~130   T0  ⬅ de 1446
│   ├── utils/
│   │   ├── get-visible-tabs.ts                        ~32   T6
│   │   ├── resolve-detail-permissions.ts              ~34   T6   10 booleanos
│   │   └── resolve-latest-analysis.ts                 ~12   T6
│   └── components/
│       ├── development-detail-header.tsx              ~62   T1   orquestrador · de :511-543
│       ├── development-detail-tabs.tsx                ~34   T1   orquestrador · de :544-548 + TAB_LABELS
│       ├── tabs/
│       │   ├── summary-tab.tsx                        ~42   T1   de :550-571
│       │   ├── estimate-tab.tsx                      ~105   T1   orquestrador da aba
│       │   ├── estimate-analysis-banner.tsx           ~48   T3 ✅
│       │   ├── estimate-form.tsx                      ~92   T1
│       │   ├── estimate-summary-card.tsx              ~58   T3 ✅
│       │   ├── tech-lead-assignment-card.tsx          ~56   T1
│       │   ├── developers-assignment-card.tsx         ~72   T1
│       │   ├── documents-tab.tsx                      ~68   T1   de :891-932
│       │   ├── validation-tab.tsx                     ~78   T1   de :933-1012
│       │   ├── validation-evidence-list.tsx           ~56   T3 ✅
│       │   ├── solicitations-tab.tsx                  ~72   T1   de :1013-1109
│       │   ├── solicitation-row.tsx                   ~78   T3 ✅
│       │   └── audit-tab.tsx                          ~52   T1   de :1110-1149
│       └── dialogs/
│           ├── create-solicitation-dialog.tsx         ~98   T2   de :1217-1275
│           ├── reclassify-solicitation-dialog.tsx     ~74   T2   de :1317-1357
│           ├── resolve-solicitation-dialog.tsx        ~58   T2   de :1359-1382
│           ├── remove-evidence-confirm.tsx            ~28   T2   de :1208-1215
│           ├── delete-development-confirm.tsx         ~26   T2   de :1424-1433
│           └── reactivate-development-confirm.tsx     ~28   T2   de :1435-1443
├── development-list-page.tsx                           182        intocado nesta passada
├── development-form-page.tsx                           194        intocado nesta passada
├── ef-ia-tab.tsx                                       361        intocado nesta passada
└── chat/                                              1151        intocado nesta passada

packages/frontend/src/presentation/components/
└── reason-prompt-dialog/
    └── reason-prompt-dialog.tsx                        ~78   T4 ✅  ⬅ colapsa 4 diálogos
    (+ 1 linha em components/index.ts)

packages/frontend/src/presentation/hooks/
├── use-reason-options.ts                               ~46   T5  ⬅ 4 useState + 4 useEffect
└── use-project-members.ts                              ~48   T5  ⬅ 2 useState + 2 useEffect
```

Os testes **não ficam ao lado do fonte** — vivem em `tests/`, espelhando o caminho sem o segmento `src/`:

```
packages/frontend/tests/unit/presentation/
├── pages/developments/development-detail/
│   ├── utils/
│   │   ├── get-visible-tabs.test.ts                    ~48        7 branches
│   │   ├── resolve-detail-permissions.test.ts          ~66        6 perfis
│   │   └── resolve-latest-analysis.test.ts             ~26
│   └── components/tabs/
│       ├── estimate-analysis-banner.test.tsx           ~40
│       ├── estimate-summary-card.test.tsx              ~44
│       ├── validation-evidence-list.test.tsx           ~46
│       └── solicitation-row.test.tsx                   ~50
└── components/reason-prompt-dialog/
    └── reason-prompt-dialog.test.tsx                   ~72
```

### Onde cada folha mora

Folha usada por **uma aba** fica em `components/tabs/`, ao lado da aba que a consome — é o caso das quatro folhas T3 acima. Folha usada por **2+ abas** sobe para a raiz de `components/`. Componente usado por **2+ páginas de developments** iria para `pages/developments/components/` (hoje vazio). Usado por **2+ features**, vai para `presentation/components/` + barrel — que é exatamente o caminho do `ReasonPromptDialog`.

### Onde cada função pura mora

As três T6 acima ficam em `development-detail/utils/` e **nenhuma delas sobe**, por razões diferentes: `get-visible-tabs` e `resolve-latest-analysis` têm um consumidor só; `resolve-detail-permissions` recebe o `user` do store e é lógica de perfil deste projeto — mesmo com um segundo consumidor, pararia em `pages/developments/utils/`, porque `shared/` não importa de camada nenhuma.

O contraexemplo do que **sobe até o topo** é o `gradientBtn`, hoje duplicado literalmente em 6 arquivos: recebe só o `Theme` do MUI, não depende de camada, e vai direto para `shared/utils/` (é o que já aconteceu com `brand-gradient.ts`).

### Estado final da feature (fora do escopo desta passada)

Com a convenção aplicada, `pages/developments/` termina assim — mas mover as outras duas páginas e o `chat/` **não** faz parte desta decomposição:

```
pages/developments/
├── components/                    → compartilhado entre as três páginas
├── development-list/
├── development-form/
└── development-detail/
    └── components/
        ├── tabs/
        │   └── ef-ia-tab.tsx      ⬅ hoje solto em pages/developments/
        └── chat/                  ⬅ hoje solto em pages/developments/
```

Mover `ef-ia-tab.tsx` e `chat/` é renomeação de caminho pura, mas quebra os imports dos 3 arquivos de teste existentes em `chat/`. Faça em commit próprio, **depois** da W5 — não misture com a decomposição.

## Contabilidade

| | Arquivos | Linhas | Onde |
|---|---|---|---|
| Antes | 1 | 1.446 | `src/` |
| Depois — fonte | 28 | **1.665** (+15%) | `src/` |
| Depois — testes | 8 | 392 | `tests/unit/` |
| **Total** | **36** | **2.057** (+42%) | |

- Maior arquivo novo: **130 L** (a própria página) — bem abaixo do teto de 250.
- Mediana dos 27 artefatos extraídos: **56 L** — praticamente igual à mediana de 62 L de `chat/`.
- 8 testes novos travando: 7 branches de visibilidade de aba, 10 permissões × 6 perfis, e a interação do diálogo de motivo que passa a ser compartilhada por 4 call sites.

> O crescimento de **+15% no código-fonte** é o custo de boilerplate por arquivo; os **392 L de teste** são ganho novo, não custo. Se o número de fonte tivesse **caído**, comportamento teria sido deletado.

## A prova de que a doutrina se paga

Quatro dos sete `<Dialog>` crus são estruturalmente idênticos: `maxWidth="xs" fullWidth`, `DialogTitle`, `TextField select` mapeando `reasons` por `r.id`/`r.label`, campo de nota opcional, e `disabled={submitting || !reasonId}`.

| Diálogo | Faixa | L | Variação |
|---|---|---|---|
| rejeitar estimativa | 1150–1177 | 28 | só motivo |
| devolver à análise | 1179–1206 | 28 | só motivo; botão sem `color="error"` |
| rejeitar solicitação | 1277–1315 | 39 | motivo + notas opcionais |
| cancelar desenvolvimento | 1384–1422 | 39 | motivo + justificativa obrigatória |

**134 linhas → um T4 de ~78 linhas com teste**, consumido por 4 call sites. A superfície de props fecha em 8 agrupando o que varia (`notes?`, `confirm`) — dentro do guard.

Os outros três diálogos ficam separados: mesclá-los exigiria uma prop `mode` trocando quais campos existem, e o guard barra corretamente.

## Plano de commits

23 commits, `yarn qualityGate` verde em cada.

| Onda | Commits | O que entra | Verificação |
|---|---|---|---|
| **W0** | 3 | `get-visible-tabs`, `resolve-detail-permissions`, `resolve-latest-analysis` — cada um com seu teste | testes novos verdes; a página encolhe pouco (~1.350 L) |
| **W1** | 6 | um diálogo por commit. Os 4 "de motivo" saem extraídos **mas ainda duplicados** | abrir cada diálogo em `yarn dev`, confirmar e cancelar |
| **W2** | 4 | as 4 folhas T3, cada uma com `data-testid` + teste | testes verdes |
| **W3** | 7 | header + barra de abas (1 commit), depois uma aba por commit | clicar as abas visíveis em 3 status: `EF_EM_ELABORACAO` (3 abas), `EM_DESENVOLVIMENTO` (6), `ENCERRADO` (7) |
| **W4** | 2 | `use-reason-options`, `use-project-members` | smoke da rota completa |
| **W5** | 1 | `ReasonPromptDialog` + teste + os 4 call sites + linha no barrel | smoke nos **4** call sites |

Ordem dentro da W3 é do menor para o maior: `summary-tab` (22 L) primeiro, `estimate-tab` (297 L) por último — quando a mecânica já está rodada.

## Armadilhas específicas deste arquivo

**1. Layout condicional da aba 1.** `currentTab === 1` altera o `sx` da raiz (`:501-508`), o `mb` do header (`:511`) e o `mb` da barra de abas (`:544`). Derive `const isFullHeightTab = currentTab === 1;` e passe como prop. Esquecer quebra o chat de EF em altura total — e o `qualityGate` não pega.

**2. `getVisibleTabs` já esteve errada.** O comentário em `:54-58` documenta que nomes de status inexistentes caíam no `default` e exibiam abas em excesso (achados T15–T23). É a extração de maior valor do arquivo: teste com os 7 branches, na W0, antes de qualquer JSX se mover.

**3. `currentTab` é derivado, não estado.** `:495` faz `visibleTabs.includes(tab) ? tab : (visibleTabs[0] ?? 0)`. Ao extrair a barra de abas, esse fallback tem de continuar na página — mover para o filho muda o comportamento quando o status troca e a aba ativa deixa de existir.

**4. `aiChatRepository` é prop drill tolerado.** `:47` recebe o repository e o repassa via `EfIaTab` até `EfChatPanel`. Legal sob a dependency rule (é tipo de `domain/repositories`), mas é presentation orquestrando I/O sem controller. **Não replique** — e não conserte nesta passada.

## O que fica de fora — débito registrado

| Item | Por quê |
|---|---|
| `use-development-detail.ts` — 444 L, 37 membros, `eslint-disable` na linha 1 | dividir muda o contrato da página inteira enquanto 30 arquivos se movem: é a única mudança do plano que **não** é verificável como code motion puro. Passada própria, depois da W5 |
| Prop drill de `aiChatRepository` | exige criar controller + factory — mudança de arquitetura, não de granularidade |
| `gradientBtn` em 6 arquivos (15 ocorrências) | toca 6 páginas fora do alvo |
| Duplicação de autorização `main/app.tsx` ↔ `app-shell.tsx` | fora de `pages/`; merece ADR |
| Aba em `?tab=` search param | mudança de comportamento — nunca dentro de refatoração |

## Reporte final esperado

```
Status:       concluído
Arquivos:     36 (28 fonte, 8 teste) — detalhe na Árvore-alvo aprovada
              development-detail-page.tsx: 1446 → 130 L
              fonte total: 1446 → 1665 L (+15%); testes: +392 L
Gate:         yarn qualityGate verde nos 23 commits
Débito visto: use-development-detail.ts (444 L, 37 membros); prop drill de aiChatRepository;
              gradientBtn em 6 arquivos; autorização duplicada app.tsx ↔ app-shell.tsx;
              bug latente de deps em project-form-page.tsx:144 (clients fora do array)
Desvios:      nenhum
```
