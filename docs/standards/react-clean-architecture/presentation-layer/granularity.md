# Presentation layer — Granularidade e decomposição

A presentation layer é a única camada onde um único arquivo pode crescer sem limite natural: JSX não força extração, e o ESLint raramente mede componente. Este documento define **quando** quebrar um componente, **em que** quebrar e **onde** cada pedaço mora.

> **Princípio orientador:** granularidade não é estética — é **testabilidade**. Um componente que não depende de contexto (i18n, stores, controller) é testável com `render()` + props. Empurre lógica para baixo até que as partes intestáveis sejam pura composição.

Os demais documentos desta camada dizem *o que* cada tipo de arquivo faz. Este diz *quão grande* ele pode ser e *como* dividi-lo.

> **Doutrina aqui, execução na skill.** Este documento é normativo: define tiers, gatilhos, teto e partição de estado. Para *executar* — medir antes de decidir, propor Árvore-alvo para aprovação, quebrar em ondas com gate por onda — use a skill `component-driven-react`, em `.cursor/skills/component-driven-react/SKILL.md` (a partir da raiz do projeto). Obrigatória ao criar página nova ou editar `.tsx` que já passou do teto.

## Taxonomia de artefatos

A taxonomia é organizada por **capacidade de dependência**, não por tamanho visual. Um tier é definido pelo que **não pode** fazer.

| Tier | Nome | Onde vive | Estado próprio | Contexto (i18n/store) | Controller | Teste |
|---|---|---|---|---|---|---|
| **T0** | Página | `pages/<page>/<page>-page.tsx` | só navegação e flags `open` | ✅ | recebe via props | e2e |
| **T1** | Seção | `pages/<page>/components/…` | ⚠️ só UI transiente | ✅ | ❌ recebe callbacks já bound | opcional |
| **T2** | Diálogo | `pages/<page>/components/dialogs/` | ✅ draft + `submitting` | ✅ | ❌ `onConfirm(payload)` | opcional |
| **T3** | **Folha** | junto de quem a usa | ❌ nenhum (ou 1 input controlado) | ❌ **proibido** | ❌ | ✅ **obrigatório** |
| **T4** | Componente global | `presentation/components/<nome>/` + barrel | como T3 | ❌ preferencialmente | ❌ | ✅ **obrigatório** |
| **T5** | Hook | `presentation/hooks/<feature>/` | 1 `useState<State>` | n/a | recebe como argumento | ✅ quando deriva lógica |
| **T6** | Função pura | `utils/` ao lado de quem usa | ❌ | ❌ | ❌ | ✅ **obrigatório** |

**T3 é o alvo da decomposição.** Uma folha recebe rótulos já resolvidos como props em vez de traduzir por conta própria:

```typescript
// src/presentation/pages/sales-orders/components/sales-order-status-chip.tsx

interface Props {
    status: SalesOrderStatus;
    label: string;
    onClick?: () => void;
}

export function SalesOrderStatusChip({ status, label, onClick }: Props) {
    return <Chip label={label} color={STATUS_COLOR[status]} onClick={onClick} data-testid="sales-order-status-chip" />;
}
```

O pai (T1/T2) resolve `label` e passa. Isso torna a folha renderizável sem provider algum — é o que substitui uma ferramenta de catálogo de componentes.

> **Não use vocabulário de atomic design** (atoms/molecules/organisms) neste padrão. Ele exige 5 níveis que não mapeiam para nenhuma decisão real aqui e gera discussão insolúvel ("`InfoRow` é atom ou molecule?"). A única decisão que importa é: *este artefato ganha teste obrigatório ou não?* — e é isso que a tabela acima responde.

## Estrutura de pastas

### Feature com uma página

Estrutura canônica de [`pages.md`](./pages.md):

```
presentation/pages/customers/
├── components/
│   ├── dialogs/
│   └── tables/
└── customers-page.tsx
```

### Feature com mais de uma página

Quando a feature tem várias rotas (lista, formulário, detalhe), **cada página ganha a própria pasta**, e `pages/<feature>/components/` fica reservado para o que é compartilhado entre as páginas irmãs:

```
presentation/pages/sales-orders/
├── components/                             → compartilhado entre as páginas de sales-orders
│   └── sales-order-status-chip.tsx
├── sales-order-list/
│   ├── sales-order-list-page.tsx           T0
│   └── components/
│       └── …
└── sales-order-detail/
    ├── sales-order-detail-page.tsx         T0
    ├── utils/                              T6   ← funções puras da página
    │   └── get-visible-tabs.ts
    └── components/
        ├── sales-order-detail-header.tsx   T1   ← orquestradores na raiz de components/
        ├── sales-order-detail-tabs.tsx     T1
        ├── tabs/                           T1 + folhas privadas de cada aba
        │   ├── summary-tab.tsx
        │   └── items-tab.tsx
        └── dialogs/                        T2
            └── cancel-order-dialog.tsx
```

Regras de colocação de **componentes**, da mais específica para a mais geral:

| O componente é usado por… | Onde vive |
|---|---|
| uma aba só | `components/tabs/`, ao lado da aba |
| 2+ abas da mesma página | raiz de `components/` |
| 2+ páginas da mesma feature | `pages/<feature>/components/` |
| 2+ features | `presentation/components/` + linha no barrel |

### Funções puras — a pasta `utils/`

**Funções puras não são componentes** e não moram em `components/`, que contém apenas `.tsx` que renderizam. Também **não moram dentro de um `.tsx`**: exportar um predicado de um arquivo de componente arrasta React e MUI para o grafo de quem só queria a função — inclusive para o teste dela. Elas vão para arquivos `.ts` numa pasta `utils/` **ao lado de quem as usa**:

| A função é usada por… | Onde vive |
|---|---|
| uma página, numa feature de página única | `pages/<feature>/utils/` |
| uma página, numa feature multi-página | `pages/<feature>/<page>/utils/` |
| 2+ páginas da mesma feature | `pages/<feature>/utils/` |
| um componente global (é predicado *dele*) | `.ts` ao lado do componente, em `presentation/components/<nome>/`, exportado pelo barrel |
| 2+ features, **sem** depender de camada | `shared/utils/` |

O nome `utils/` é o mesmo em todos os degraus **de propósito**: promover vira uma mudança de caminho, não de conceito.

Uma pasta `utils/` por pasta de página — **não aninhe** `utils/` dentro de `components/` ou de `tabs/`. A proximidade que importa é a da página; abaixo disso a pasta vira ruído.

Os testes dessas funções **não ficam ao lado delas**: vão para `tests/unit/`, espelhando o caminho. Ver [`testing.md`](./testing.md).

> **Restrição de promoção para `shared/`:** a shared layer **não importa de nenhuma outra camada** — nem de `domain/`. Uma função tipada contra um model de domínio (`(order: SalesOrderModel) => …`) **não pode** subir para `shared/utils`. Bibliotecas externas (`dayjs`, tipos do MUI) são permitidas em `shared/`.
>
> Quando uma função assim é usada por **2+ features**, ela não fica sem casa: se pertence conceitualmente a um componente global, mora num `.ts` ao lado dele e sai pelo barrel — o componente e os demais consumidores importam do mesmo lugar. A alternativa é generalizá-la para receber primitivos e então subir para `shared/`.

Promoção acontece quando o **segundo consumidor real** aparece — nunca por antecipação. Enquanto há um só, a função fica na página, mesmo que pareça genérica.

## Gatilhos de extração

Réguas objetivas. **Meça antes de decidir** — granularidade decidida "no olho" vira discussão de gosto.

| # | Gatilho | Limiar | Por quê |
|---|---|---|---|
| 1 | Linhas por arquivo `.tsx` | **warn >250 · hard >350** | 250 é o teto do que um revisor lê sem rolar perdendo contexto; acima de 350 ninguém sustenta a árvore JSX mentalmente |
| 2 | `useState` por componente | **>6** | o padrão da camada colapsa dados de feature em **um** `useState<State>` no hook; acima de 6 há mais de uma responsabilidade no arquivo |
| 3 | `useEffect` por componente | **>2** | [`hooks.md`](./hooks.md) prescreve exatamente um (`useEffect(() => { load(); }, [load])`); o excedente costuma ser carga de lista de referência, que pertence a um hook próprio |
| 4 | Handlers inline (`const handleX = async`) | **>5** | a ~12 linhas cada, 5 handlers já consomem um quarto do orçamento de 250 |
| 5 | Blocos `{cond && (…)}` no topo do `return` | **>3 · e nunca >15 L** | qualquer bloco condicional acima de 15 linhas é um componente |
| 6 | Profundidade de aninhamento JSX | **>6** | ponto em que o leitor perde a árvore |
| 7 | Props num componente | **>12** | acima disso o filho virou proxy de estado — dê a ele um hook ou divida-o |
| 8 | Abas/telas distintas no mesmo arquivo | **>1** | 1 aba = 1 arquivo, absoluto |
| 9 | `<Dialog>` no mesmo arquivo do gatilho que o abre | **qualquer** | o estado de um diálogo não tem leitor fora dele — é sempre extraível |
| 10 | Objeto `sx` literal idêntico em 2+ arquivos | **qualquer** | é a regra do "2+" aplicada a estilo |
| 11 | Componente declarado **dentro** do corpo de outro | **qualquer** | remonta a cada render do pai: perde foco e estado interno. **É bug, não estilo** |
| 12 | Membros retornados por um hook | **>20** | o hook virou fachada de várias features |

Leitura dos gatilhos: **1 estourado** → extração pontual. **2–3** → decomposição planejada. **4+, ou o gatilho 1 em hard** → decomposição com árvore-alvo aprovada antes de escrever. **Gatilho 11 corrige-se sempre**, em qualquer contexto — é defeito.

## Partição de estado

> **Estado migra para a raiz da subárvore que é sua única leitora.** Se um `useState` só é lido dentro de um `<Dialog>`, ele pertence ao arquivo daquele diálogo. Se é lido por duas abas, fica na página. Se vem de um controller, pertence a um hook.

Antes de mover um `useState`, responda **quem lê este valor?**

| Resposta | Destino |
|---|---|
| 1 leitor, dentro de uma subárvore | desce para a raiz daquela subárvore |
| 2+ leitores em subárvores irmãs | fica no ancestral comum |
| vem de controller / é assíncrono | vira hook (T5) |
| é calculável a partir de outro valor | **não é estado** — é resolver puro (T6) |

O último caso é o mais comum e o mais esquecido: booleanos de permissão derivados do perfil do usuário, "o item mais recente da lista", "o formulário está sujo" — nada disso é estado.

| Tipo de estado | Destino |
|---|---|
| Dados de servidor + `isLoading` + `error` | hook (T5), **um** `useState<State>` |
| Listas de referência vindas de controller | hook próprio, parametrizado |
| Aba ativa, rota interna | página (T0) |
| `open`/`target` de diálogo | página — **só o booleano ou o id** |
| Draft de diálogo + flag de submit | dentro do diálogo (T2) |
| Draft de formulário de entidade | **um** `useState<FormState>` num hook + `setField` |
| Booleano derivado de perfil/status | resolver puro (T6) |
| Estado global (usuário, tema, projeto ativo) | store Zustand — **nunca** duplicado em `useState` |

### Formulário com muitos campos

Um `useState` por campo é anti-padrão. O padrão é:

```typescript
// src/presentation/hooks/customers/use-customer-form.ts

type FormState = { name: string; email: string; /* … */ };

const EMPTY_FORM: FormState = { name: '', email: '' /* … */ };

export function useCustomerForm(controller: CustomersController) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]): void => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    return { form, setField /* … */ };
}
```

As seções do formulário recebem **três props** — `{ form, errors, onField }` — em vez de uma prop por campo. A validação vira função pura testável (T6), não `if` inline no handler de salvar.

## Ordem de decomposição

Sempre **bottom-up**, tanto para código novo quanto para refatoração:

```
resolvers puros (T6) → folhas (T3) → diálogos (T2) → seções (T1) → página (T0) → hook (T5)
```

Motivo: resolvers puros são a única parte travável com teste **antes** de qualquer JSX se mover; e o contrato de props de uma seção é **descoberto** a partir do que ela referencia, não inventado antecipadamente. Desenhe top-down (a árvore-alvo), construa bottom-up.

A sequência de ondas que operacionaliza essa ordem — o que sai em cada uma, o gate de cada uma e a ordem dos commits — está na skill `component-driven-react`.

Ao refatorar um arquivo existente sem cobertura de teste, cada extração deve ser **code motion puro**: o JSX movido é textualmente idêntico ao original, exceto por (a) `state` → `props.x`, (b) imports, (c) o bloco `interface Props`, (d) um `data-testid`. Renomear chave de i18n, ajustar `sx`, adicionar `useMemo` ou corrigir bug notado no caminho são **commits separados** — misturar torna o diff irrevisável, que é justamente onde regressão silenciosa entra.

> **A contagem de linhas cresce.** Decompor 1.000 linhas em 20 arquivos produz mais linhas totais (imports, `interface Props`, assinatura por arquivo) — tipicamente 10–25% a mais de código-fonte. **Se o total cair, comportamento foi deletado.**

## Anti-padrões

❌ **Componente declarado dentro do corpo de outro:**
```typescript
export function CustomerFormDialog() {
    const Field = ({ label }: { label: string }) => <TextField label={label} />; // ← remonta a cada render: perde foco
    return <Field label="Nome" />;
}
```

❌ **Folha traduzindo por conta própria:**
```typescript
export function SalesOrderStatusChip({ status }: Props) {
    return <Chip label={translate(`salesOrders.status.${status}`)} />; // ← agora exige provider no teste
}
```

❌ **Controller descendo abaixo da página:**
```typescript
<ItemsTab controller={controller} /> // ← passe o callback já bound: onAddItem={handleAddItem}
```

❌ **Um `useState` por campo de formulário:**
```typescript
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState(''); // ← use um useState<FormState> + setField
```

❌ **Guardar em estado o que é derivável:**
```typescript
const [canApprove, setCanApprove] = useState(false);
useEffect(() => { setCanApprove(user?.profile === 'MANAGER'); }, [user]); // ← é resolver puro
```

❌ **Função pura solta na raiz da pasta da página, ou dentro de `components/`:**
```
sales-order-detail/get-visible-tabs.ts            // ← vai em utils/
sales-order-detail/components/get-visible-tabs.ts // ← components/ é só .tsx que renderiza
```

❌ **Função pura exportada de dentro de um arquivo de componente:**
```typescript
// components/email-domains-section.tsx
export function isValidEmailDomain(domain: string): boolean { … } // ← quem importar isto carrega React e MUI junto
export function EmailDomainsSection(props: Props) { … }
```
Mova para `utils/is-valid-email-domain.ts`; o componente passa a importar de lá como qualquer outro consumidor.

❌ **Re-export pass-through de função pura através de um componente:**
```typescript
// components/client-theme-section.tsx
export { areThemeColorsValid } from '@/presentation/components/theme-palette-editor/theme-palette-editor';
// ← cria dependência falsa: quem precisa do predicado passa a depender do componente de seção
```
Importe da origem real, ou mova o predicado para um `.ts` ao lado do componente que o possui.

❌ **Promover para `shared/utils` por antecipação:**
```
shared/utils/get-visible-tabs.ts // ← um consumidor só: fica na pasta da página
```

❌ **Promover para `shared/` algo tipado contra o domínio:**
```typescript
// shared/utils/resolve-order-total.ts
import type { SalesOrderModel } from '@/domain/models/sales-order'; // ← shared não importa camada nenhuma
```

❌ **Extrair por linha, sem olhar quem lê o estado:**
```typescript
// "corto nas linhas 400-700 porque são 300 linhas"
// ← sem o teste da única leitora, o filho vira proxy de 20 props e nada melhorou
```

## Regras de ouro

1. **Nenhum `.tsx` acima de 250 linhas.** Acima de 350 é defeito, não débito.
2. Um tier é definido pelo que **não pode** fazer — respeite a coluna de proibição antes de discutir o nome.
3. **Folhas (T3) e componentes globais (T4) não consomem contexto** — recebem rótulos por prop. É isso que os torna testáveis sem provider.
4. **Controller nunca desce abaixo da página** — descem callbacks já bound.
5. **1 aba = 1 arquivo; 1 diálogo = 1 arquivo.** Sem exceção por tamanho.
6. Estado migra para a raiz da subárvore que é sua **única leitora**; antes de movê-lo, verifique se ele é apenas **derivável**.
7. Feature com mais de uma página → **uma pasta por página**; `pages/<feature>/components/` fica para o compartilhado entre elas.
8. **Funções puras vão em `utils/`**, ao lado de quem as usa — nunca em `components/`. Sobem para `pages/<feature>/utils/` com o segundo consumidor na feature, e para `shared/utils/` com o segundo consumidor fora dela — desde que não dependam de nenhuma camada.
9. Decomponha **bottom-up**; desenhe top-down.
10. Refatoração sem teste é **code motion puro** — melhoria vai em commit separado.
11. **Não execute de cabeça.** Página nova ou `.tsx` acima do teto → carregue a skill `component-driven-react` **antes** de escrever: ela mede, propõe a Árvore-alvo para aprovação e conduz as ondas.
