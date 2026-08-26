# Taxonomia de artefatos — T0 a T6

Vocabulário canônico da decomposição. A taxonomia é organizada por **capacidade de dependência e testabilidade**, não por tamanho visual.

> **Regra de isolamento:** um tier é definido pelo que ele **não pode** fazer. O nome descreve o papel; as colunas de proibição descrevem o contrato.

## Por que não atomic design

Rejeitado deliberadamente, por três razões factuais:

1. **Não existe no repo.** `grep -ri 'atomic\|atoms\|molecules\|organisms'` em `docs/` e `packages/frontend/src/`: zero ocorrências. Já `página`, `componente local`, `componente global`, `layout`, `hook` e `controller` são termos load-bearing no `AGENTS.md` e no standard.
2. **Produz discussão insolúvel sem valor de decisão.** `InfoRow` (21 L) é atom ou molecule? A resposta não muda nada no código.
3. **A única decisão que importa aqui é outra:** *este artefato ganha teste obrigatório ou não?* Atomic design não responde isso; a taxonomia abaixo responde.

## Os 7 tiers

| Tier | Nome | Caminho | Estado próprio | `useApp()` | Controller | Teste |
|---|---|---|---|---|---|---|
| **T0** | Página | `pages/<feature>/<page>/<page>-page.tsx` | só navegação + flags `open` | ✅ | recebe via props | ❌ (só e2e) |
| **T1** | Seção | `pages/<feature>/<page>/components/…` | ⚠️ só UI transiente | ✅ | ❌ recebe callbacks já bound | opcional |
| **T2** | Diálogo | `pages/<feature>/<page>/components/dialogs/` | ✅ draft + `submitting` | ✅ | ❌ `onConfirm(payload) => Promise<boolean>` | opcional |
| **T3** | **Folha** | ao lado de quem a consome | ❌ zero (ou 1 input controlado) | ❌ **PROIBIDO** | ❌ | ✅ **obrigatório** |
| **T4** | Componente global | `presentation/components/<name>/<name>.tsx` + barrel | como T3 (preferido) ou T2 | ❌ preferencialmente | ❌ | ✅ **obrigatório** |
| **T5** | Hook de página | `presentation/hooks/use-<x>.ts` | 1 `useState<State>` | n/a | recebe como argumento | ✅ quando deriva lógica |
| **T6** | Função pura | **`utils/`** ao lado de quem usa, `<verb>-<noun>.ts` | ❌ | ❌ | ❌ | ✅ **obrigatório** |

> Esta é a taxonomia de [`granularity.md`](../../../../docs/standards/react-clean-architecture/presentation-layer/granularity.md) no standard. Aqui ela vem com os caminhos e exemplos deste repo.

### T3 é o ponto inteiro da doutrina

Uma folha é definida pela proibição: **não chama `useApp()`, não recebe controller, não faz async.** Recebe labels já resolvidas como props.

É exatamente a forma de `pages/developments/chat/ef-chat-composer.tsx` e `ef-chat-timeline.tsx` — e exatamente por isso são os dois únicos componentes testados do repo. `AnalysisResultCard` (`ef-ia-tab.tsx:56`) chama `useApp()` e não tem teste.

> A proibição de `useApp()` em T3 **é** o substituto do Storybook. Sem dependência de contexto não existe decorator, provider tree nem story a manter: `render(<Folha {...props} />)` já é a story.

### T1 vs T2 vs T3 na prática

| Pergunta | Resposta → tier |
|---|---|
| É um `<Dialog>`? | T2, sempre |
| Renderiza um bloco de tela e compõe outros componentes? | T1 |
| É folha da árvore, só recebe dados e dispara callbacks? | T3 |
| Já é usado por 2+ páginas? | T4 |
| É lógica de estado + chamada de controller? | T5 |
| É cálculo determinístico sobre dados? | T6 |

## Política de propagação

Como `translate`, stores, controllers e repositories descem a árvore sem violar o ADR-002.

| Mecanismo | Regra | Precedente no repo |
|---|---|---|
| `translate` em T0/T1/T2 | chamar `useApp()` localmente. `@/presentation/hooks/use-app.js` é import de **presentation** — o ADR-002 não é violado | `ef-ia-tab.tsx:17` |
| `translate` em T3/T4 | **proibido.** Recebe `label`, `placeholder`, `emptyLabel`, `confirmLabel` como props; o pai T1/T2 resolve | `ef-chat-composer.tsx`, `ef-chat-timeline.tsx` |
| Stores (`useAuthStore`) | só em T0, e preferencialmente só para alimentar um resolver T6 | `development-detail-page.tsx:100-101` |
| Controllers | **nunca abaixo de T0.** A página passa os callbacks já bound pelo hook (`onApproveEstimate: () => Promise<boolean>`) | `ef-ia-tab.tsx` recebe `onUploadEf`, `onDeleteEf`, … |
| Repositories | **nunca.** `aiChatRepository` em `development-detail-page.tsx:47` é desvio existente **tolerado** — não replicar | — |
| `@/infra/**` | **nunca**, em nenhum tier de `presentation/` | ADR-002 |

> **O ADR-002 e o CDD apontam para o mesmo lado.** Como a presentation não pode alcançar `infra`, tudo já chega por injeção — e é isso que torna folhas props-only naturais aqui. CDD não é uma restrição nova neste repo; é a restrição que o repo já escolheu, aplicada um nível mais fundo.

## Naming e localização

| Elemento | Convenção | Exemplo |
|---|---|---|
| Arquivo | `kebab-case.tsx` / `.ts` | `estimate-form.tsx` |
| Componente | `PascalCase` | `EstimateForm` |
| Hook | `use-kebab-case.ts` → `useCamelCase` | `use-reason-options.ts` → `useReasonOptions` |
| Função pura T6 | `<verb>-<noun>.ts` em `utils/` | `utils/resolve-detail-permissions.ts`, `utils/get-visible-tabs.ts` |
| Teste | **fora de `src/`**, em `tests/unit/` espelhando o caminho | `tests/unit/presentation/pages/…/utils/get-visible-tabs.test.ts` |
| Props | `interface Props` local, **não exportada** | — |

### Pasta por página

Todas as features de `pages/` neste repo têm **mais de uma rota** (`developments` tem 3; `clients`, `projects` e `users` têm 2 cada). Logo vale sempre a forma multi-página do standard: **cada página ganha a própria pasta**, com um `components/` dentro dela.

```
pages/developments/
├── components/                             ⬅ compartilhado entre as 3 páginas (hoje vazio)
├── development-list/
│   └── development-list-page.tsx           T0
└── development-detail/
    ├── development-detail-page.tsx         T0
    ├── utils/                              T6  ⬅ funções puras: não são componentes
    │   └── get-visible-tabs.ts          ⬅ o teste espelha em tests/unit/…
    └── components/
        ├── development-detail-header.tsx   T1  ⬅ orquestradores na raiz de components/
        ├── tabs/                           T1 + folhas T3 privadas de cada aba
        └── dialogs/                        T2
```

Três níveis de decisão para **componentes**, do mais específico ao mais geral:

| O componente é usado por… | Onde vive |
|---|---|
| uma aba só | `components/tabs/`, ao lado da aba |
| 2+ abas da mesma página | raiz de `components/` |
| 2+ páginas da mesma feature | `pages/<feature>/components/` |
| 2+ features | `presentation/components/` + barrel |

### Funções puras — a pasta `utils/`

Função pura extraída de uma página **não vai em `components/`** (que é só `.tsx` que renderiza), nem solta na raiz da pasta, nem **dentro de um `.tsx`** — exportar predicado de arquivo de componente arrasta React e MUI para o grafo de quem só queria a função, inclusive para o teste dela. Vai num `.ts` dentro de `utils/`:

| A função é usada por… | Onde vive |
|---|---|
| uma página, em feature de página única (`clients`, `reasons`) | `pages/<feature>/utils/` |
| uma página, em feature multi-página (`developments`) | `pages/<feature>/<page>/utils/` |
| 2+ páginas da mesma feature | `pages/<feature>/utils/` |
| um componente global (é predicado *dele*) | `.ts` ao lado do componente em `presentation/components/<nome>/`, exportado pelo barrel |
| 2+ features, **sem** depender de camada | `shared/utils/` — que **já existe** (`format-date`, `format-status`, `format-file-size`, `file-to-base64`, `brand-gradient`) |

O nome é `utils/` nos três degraus de propósito: promover é `git mv`, não redesenho.

**Uma `utils/` por pasta de página.** Não aninhe `utils/` dentro de `components/` nem de `tabs/` — a proximidade que importa é a da página.

> **Restrição real para subir a `shared/utils`:** a shared layer **não importa de nenhuma camada** deste projeto — nem de `domain/`. Verificável: hoje `shared/utils/` só importa `dayjs` e tipos do MUI. Logo, função tipada contra model de domínio (`(dev: DevelopmentDetailModel) => …`) **não pode** subir. `resolve-detail-permissions.ts`, que recebe o `user` do store, é exemplo do que **não** sobe.

Promoção acontece no **segundo consumidor real**, e é trabalho de W5 — nunca por antecipação. `brand-gradient.ts` em `shared/utils/` é o caso canônico do que sobe até o topo: nasceu como `gradientBtn` duplicado em 6 páginas, recebe só o `Theme` do MUI, não depende de camada nenhuma.

### Caso real — a refatoração de `clients`

Vale ler como aplicação da escada, porque os três degraus aparecem juntos:

| Função | Situação hoje | Onde deveria estar |
|---|---|---|
| `validateClientForm` / `normalizeEmailDomains` | soltas em `pages/clients/validate-client-form.ts` | `pages/clients/utils/validate-client-form.ts` — `clients` é feature de **página única** (só `client-list-page.tsx`; o formulário virou `components/dialogs/client-form-dialog.tsx`), então não há pasta de página |
| `isValidEmailDomain` | definida **dentro** de `components/email-domains-section.tsx:20` | `pages/clients/utils/is-valid-email-domain.ts` — usada pelo componente **e** pela validação, ambas dentro de `clients` |
| `areThemeColorsValid` | em `components/theme-palette-editor/theme-palette-editor.tsx:93`, com **re-export pass-through** em `components/client-theme-section.tsx:11` | `.ts` ao lado do componente que a possui (`presentation/components/theme-palette-editor/`), saindo pelo barrel — é usada por `appearance` **e** `clients`, mas recebe `ThemeColors` de `@/domain`, então **não pode** subir para `shared/utils` |

O último caso é o que mostra por que a escada tem o degrau do componente global: sem ele, uma função pura cross-feature tipada contra domínio ficaria sem casa legítima.

Quando a pasta já nomeia o contexto (`development-detail/components/tabs/`), **não** prefixe os arquivos: `estimate-form.tsx`, não `development-detail-estimate-form.tsx`. Prefixe apenas quando os arquivos vazam para imports de fora da pasta — é o que `chat/` faz com `ef-chat-*`.

### Regra do 2+ e o barrel

- O barrel `presentation/components/index.ts` é o **único** barrel permitido em `presentation/` (`AGENTS.md` §2 regra 13 proíbe barrels dentro das camadas; este é a exceção que o standard exige).
- Nada de `index.ts` dentro de `pages/**/components/` — importe cada arquivo direto.

Promover é trabalho de **W5**, não de W2. Enquanto há só um consumidor, o artefato fica local.

## Anti-padrões

❌ **Folha T3 chamando `useApp()`:**
```typescript
export function SolicitationRow({ solicitation }: Props) {
    const { translate } = useApp(); // ← agora precisa de provider no teste: deixou de ser T3
    return <Chip label={translate(`requestStatusLabels.${solicitation.status}`)} />;
}
```
Correto: o pai T1 resolve e passa `statusLabel` como prop.

❌ **Controller descendo abaixo de T0:**
```typescript
<EstimateTab detailController={detailController} /> // ← T1 não recebe controller
```
Correto: `<EstimateTab onSubmitEstimate={handleSubmitEstimate} />`, já bound pela página.

❌ **Componente declarado dentro do corpo de outro:**
```typescript
export function ProjectFormDialog() {
    const SlaField = ({ label }: { label: string }) => <TextField label={label} />; // ← remonta a cada render
```
É bug, não estilo: o input perde foco e estado interno a cada keystroke do pai. Ocorrência real em `project-form-page.tsx:454`.

❌ **Import de `infra` em qualquer tier:**
```typescript
import { translate } from '@/infra/i18n/index.js'; // ← ADR-002
import { useThemeStore } from '@/infra/stores/theme-store.js'; // ← ADR-002
```
O standard (`components.md` regra 5) autoriza isso. **O ADR-002 vence.**

❌ **Barrel dentro de pasta de página:**
```typescript
// pages/developments/development-detail/components/tabs/index.ts ← proibido; importe cada arquivo direto
```

❌ **Promover para `components/` com um único consumidor:**
```
presentation/components/estimate-form/ ← usado só pela detail page:
                                         fica em pages/developments/development-detail/components/tabs/
```

❌ **Função pura dentro de `components/`, ou solta na raiz da pasta da página:**
```
components/get-visible-tabs.ts ← components/ é só .tsx que renderiza
development-detail/get-visible-tabs.ts ← vai em development-detail/utils/
clients/validate-client-form.ts ← vai em clients/utils/
```

❌ **Função pura exportada de dentro de um `.tsx`:**
```typescript
// pages/clients/components/email-domains-section.tsx
export function isValidEmailDomain(domain: string): boolean { … } // ← quem importar carrega React + MUI junto
export function EmailDomainsSection(props: Props) { … }
```
O componente também passa a importar de `utils/` — ele é só mais um consumidor.

❌ **Re-export pass-through de função pura através de um componente:**
```typescript
// pages/clients/components/client-theme-section.tsx
export { areThemeColorsValid } from '@/presentation/components/theme-palette-editor/theme-palette-editor.js';
// ← validate-client-form passa a depender do componente de seção para algo que ele não possui
```

❌ **Subir para `shared/utils` por antecipação, ou algo acoplado ao domínio:**
```typescript
// shared/utils/resolve-detail-permissions.ts
import type { UserModel } from '@/domain/models/user.js'; // ← shared não importa camada nenhuma
```

## Regras de ouro

1. Um tier é definido pelo que **não pode** fazer — respeite a coluna de proibição antes de discutir o nome.
2. **T3/T4 nunca chamam `useApp()`.** Labels chegam por prop. Essa proibição é o que substitui o Storybook.
3. **Controller e repository nunca descem abaixo de T0.** Callbacks já bound descem; dependências não.
4. **Zero `@/infra/**` em `presentation/`**, em qualquer tier, sem exceção.
5. Um artefato só vira T4 quando tem **2+ consumidores reais** — e isso se decide na W5.
6. **Uma pasta por página**, com `components/` dentro dela (`tabs/`, `dialogs/`, orquestradores na raiz). `pages/<feature>/components/` fica reservado para o compartilhado entre páginas irmãs.
7. **Funções puras em `utils/`**, ao lado de quem usa — nunca em `components/`, nunca soltas na raiz. Sobem para `pages/<feature>/utils/` e depois `shared/utils/` conforme aparecem consumidores, e só se não dependerem de nenhuma camada.
8. **Não invente tier.** Se algo não cabe em T0–T6, é sinal de que a decomposição está errada — não de que falta um tier.
