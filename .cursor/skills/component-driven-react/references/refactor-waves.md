# Track B — as 5 ondas de refatoração

Protocolo para quebrar um `.tsx` monolítico sem alterar comportamento.

> **Premissa que define tudo:** não existe **nenhum** teste cobrindo as páginas grandes deste repo. `vitest.config.ts` sequer inclui `presentation/` em `coverage.include`. Logo a segurança **não pode** vir de teste — tem de vir de o diff ser mecanicamente verificável linha a linha por um humano.

## Regra de code motion puro

O JSX movido é textualmente idêntico ao original, exceto por estas quatro coisas:

| # | Mudança permitida | Exemplo |
|---|---|---|
| a | `state` → `props.x` | `{rejectReasons.map(…)}` → `{reasons.map(…)}` |
| b | linhas de `import` | novos imports no arquivo de destino |
| c | o bloco `interface Props` | novo, no topo do arquivo |
| d | **um** `data-testid` | `data-testid="reason-prompt-dialog-reason"` |

**Nada mais.** Proibido no mesmo commit:

- ❌ renomear chave de `translate`
- ❌ mudar qualquer valor de `sx`
- ❌ adicionar `useMemo` / `useCallback` / `React.memo`
- ❌ reordenar condicional ou early return
- ❌ trocar prop de componente MUI
- ❌ trocar `<Table>` cru pelo `DataTable`
- ❌ "consertar" bug que você notou no caminho
- ❌ ajustar formatação além do que o Prettier faz sozinho

Tudo isso vai para `## Débitos observados` no reporte e vira **commit separado depois da onda**.

Por quê tão rígido: um diff de code motion puro é revisável por comparação visual em 30 segundos. Um diff que mistura movimentação com melhoria é irrevisável — e é exatamente onde regressão silenciosa entra.

### `data-testid` é a única mudança aditiva permitida

Porque é **inerte em runtime** e é precisamente o que torna o componente testável. É o mecanismo que `ef-chat-composer.test.tsx` usa (`getByTestId('ef-chat-composer-input')`). Convenção: `<component-slug>-<part>`.

## Expectativa de LOC

> O **código-fonte cresce 10–25%**: cada arquivo novo carrega imports, `interface Props` e assinatura de função. Os **testes somam por cima** — no caso canônico, 1.446 L → 1.665 L de fonte em 28 arquivos (+15%), mais 392 L de teste em 8 arquivos (+42% no total).
>
> **Se o total de fonte cair, comportamento foi deletado. Reverta e reveja.**

Declare isso ao usuário na Fase 2, antes de começar. Sem essa expectativa explícita, alguém vai medir o total no fim, concluir que a refatoração "piorou o código" e/ou começar a apagar coisa para fechar a conta.

## As 5 ondas

### W0 — Funções puras (T6)

**O que sai:** derivação de booleanos de perfil, mapeamento status→visibilidade, reducers, qualquer cálculo determinístico sobre os dados.

**Para onde:** `pages/<feature>/<page>/utils/`. Não em `components/` (que é só `.tsx` que renderiza), não solto na raiz da pasta da página. O teste **não vai ao lado** — vai em `tests/unit/` espelhando o caminho. Promoção para `pages/<feature>/utils/` ou `shared/utils/` é assunto da W5 — nesta onda tudo nasce local.

**Por que primeiro:** é o único artefato que pode ser **travado com teste antes de qualquer JSX se mover**. Cria a única rede de proteção possível para as ondas seguintes.

**Commit:** um por resolver, sempre com o `.test.ts` no mesmo commit.

**Gate:** `yarn qualityGate` + teste novo verde. A página encolhe pouco nesta onda (é normal).

### W1 — Diálogos (T2)

**O que sai:** um `<Dialog>` por commit, levando consigo o próprio draft state e o handler de confirmação.

**Por que aqui:** é a coisa mais autocontida do arquivo. Cada `<Dialog>` + seus 3–5 `useState` + seu handler **não têm leitor fora do diálogo**. A página retém apenas `open`/`target`.

**Contrato fixo:**
```typescript
interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: (payload: Payload) => Promise<boolean>;
    // + dados de leitura
}
```
O **diálogo** é dono do `submitting` e se fecha sozinho quando `onConfirm` resolve `true` — o que casa com a assinatura de todos os mutators de `use-development-detail.ts`.

**Gate:** `yarn qualityGate` + abrir o diálogo em `yarn dev` e confirmar/cancelar.

### W2 — Folhas (T3)

**O que sai:** rows, cards, banners, grupos de campo, indicadores — tudo que só recebe dados e dispara callbacks.

**Por que aqui:** pequenas, props-only, e cada uma ganha `data-testid` + teste no mesmo commit. É a onda que gera valor de regressão permanente.

**A única onda paralelizável:** folhas não dependem umas das outras. Um sub-agente por folha.

**Gate:** `yarn qualityGate` + teste novo verde.

### W3 — Corpos de aba / blocos de seção (T1)

**O que sai:** um componente por `{cond && (…)}`.

**Por que só agora:** a essa altura cada bloco já é quase só composição de folhas e diálogos extraídos, então o contrato de props é **descoberto** a partir do que o corpo realmente referencia — não inventado antes da hora.

**Mantenha a cadeia `{currentTab === N && <Tab/>}`** nesta onda. Trocar por um `Record<TabIndex, ReactNode>` constrói todos os elementos avidamente — não é code motion puro. Isso é consolidação de W5, se alguém quiser.

**Gate:** `yarn qualityGate` + clicar todas as abas visíveis, em pelo menos 3 status diferentes (tabela de smoke abaixo).

### W4 — Hooks (T5)

**O que sai:** pares `useState` + `useEffect` que carregam listas de referência, agora visivelmente órfãos na página.

**Por que último entre os movimentos:** só com a página pequena dá para ver qual estado ficou sem dono.

**Gate:** `yarn qualityGate` + smoke da rota completa.

### W5 — Consolidação

**O que sai:** colapso de duplicatas em componente T4 e promoção do que ganhou um segundo consumidor real.

| Artefato | 2+ consumidores na feature | 2+ consumidores fora dela |
|---|---|---|
| Componente | `pages/<feature>/components/` | `presentation/components/` + barrel |
| Função pura | `pages/<feature>/utils/` | `shared/utils/` |

Promover é `git mv` + ajuste de imports — o nome da pasta é `utils/` em todos os degraus justamente para isso. **Só sobe a `shared/` o que não importa de camada nenhuma** (nem de `domain/`): função tipada contra model para no nível da feature, ou é generalizada para receber primitivos.

**Por que tem de ser a última:** o code motion é o que **torna a duplicação visível e comparável byte a byte**. Consolidar antes significa comparar texto dissimilar espalhado em 300 linhas de contexto e adivinhar se as diferenças são intencionais.

**Guard de consolidação:** só colapse se a superfície de props final ficar **≤8** e **nenhuma prop booleana trocar a estrutura** do componente. Agrupe props relacionadas em objeto antes de desistir:

```typescript
interface Props {
    open: boolean;
    title: string;
    reasons: ReasonModel[];
    reasonLabel: string;
    notes?: { label: string; placeholder: string; rows: number; required: boolean };
    confirm: { label: string; pendingLabel: string; color?: 'error' | 'primary' };
    onConfirm: (payload: { reasonId: string; notes: string }) => Promise<boolean>;
    onClose: () => void;
}
```
8 props, agrupando o que varia. Se precisar de uma prop `mode` que troca o layout — **não colapse**.

**Gate:** `yarn qualityGate` + teste no componente novo + smoke em **todos** os call sites.

## Gates e smoke

| Onda | Gate automático | Smoke manual |
|---|---|---|
| W0 | `qualityGate` + teste novo | — |
| W1 | `qualityGate` | abrir cada diálogo, confirmar e cancelar |
| W2 | `qualityGate` + teste novo | — |
| W3 | `qualityGate` | clicar todas as abas em 3 status |
| W4 | `qualityGate` | rota completa: carregar, navegar, uma mutação |
| W5 | `qualityGate` + teste novo | todos os call sites do componente promovido |

`yarn qualityGate` = `type-check && lint && test:unit`. **Verde em cada commit** — não acumule.

### Matriz status ↔ abas visíveis (para o smoke de W3)

Derivada de `getVisibleTabs` em `development-detail-page.tsx:59-85`. Cubra ao menos um status de cada faixa:

| Status | Abas visíveis |
|---|---|
| `EF_EM_ELABORACAO`, `EF_REJEITADA_IA`, `EF_EM_VALIDACAO_IA` | 0, 1, 6 |
| `EF_VALIDADA_IA`, `AGUARDANDO_ATRIBUICAO_TECNICA`, `EM_ANALISE_TECNICA`, `AGUARDANDO_APROVACAO_ESTIMATIVA`, `ESTIMATIVA_EM_REVISAO` | 0, 1, 2, 6 |
| `AGUARDANDO_INICIO` | 0, 1, 2, 3, 6 |
| `EM_DESENVOLVIMENTO`, `AGUARDANDO_REVISAO_DOCUMENTACAO` | 0, 1, 2, 3, 5, 6 |
| `EM_VALIDACAO_CONSULTOR`, `EM_VALIDACAO_USUARIO_CHAVE`, `COM_SOLICITACOES_PENDENTES`, `ENCERRADO`, `CANCELADO` | todas |

> Esta função **já esteve errada uma vez**: o comentário em `:54-58` documenta que nomes de status inexistentes caíam no `default` e exibiam abas em excesso (achados T15–T23). Extraí-la com teste cobrindo todo branch, na W0, é a extração de maior valor do arquivo inteiro.

## Como reverter

Um artefato por commit existe exatamente para isso.

```bash
git log --oneline -15          # localizar o commit da onda
git revert <sha>               # reverter um artefato isolado
```

Se o smoke falha e você não sabe qual commit quebrou: `git revert` da onda inteira, na ordem inversa, e refaça artefato por artefato validando cada um. **Nunca** conserte para frente empilhando commit em cima de comportamento quebrado — o diff deixa de ser verificável e a premissa da segurança se perde.

## Ordenação — por que bottom-up

| Ordem | Veredito | Por quê |
|---|---|---|
| T6 puras primeiro | ✅ obrigatório | única coisa travável com teste antes de tocar JSX |
| Depois T2 diálogos e T3 folhas | ✅ | estado autocontido → a extração é *provadamente* code motion puro |
| Depois T1 seções | ✅ | o contrato de props é **descoberto**, não inventado |
| T5 hooks por último | ✅ | só com a página pequena se vê o estado órfão |
| Top-down (esqueleto da página primeiro) | ❌ **nunca no Track B** | exige inventar todo contrato de props antecipadamente, sem teste para pegar drift. Mudança de comportamento garantida. |

## O que fica de fora

Registre como débito, **não conserte na mesma passada**:

| Item | Por que fica fora |
|---|---|
| Dividir hook com >20 membros (`use-development-detail.ts`, 444 L, 37 membros) | muda o contrato da página inteira enquanto 30 arquivos se movem — a única mudança que **não** é verificável como code motion puro |
| `gradientBtn` duplicado em 6 arquivos | passada própria; toca 6 páginas fora do alvo |
| Prop drill de `aiChatRepository` | exige criar controller + factory: é mudança de arquitetura, não de granularidade |
| `<Table>` cru → `DataTable` | muda markup renderizado; commit separado, com smoke próprio |
| Duplicação de autorização entre `main/app.tsx` e `app-shell.tsx` | fora de `presentation/pages/`; merece ADR |
| Migrar `fireEvent` → `user-event` | decisão de tooling, não de decomposição |
| Aba em `?tab=` search param | **mudança de comportamento** — nunca dentro de commit de refatoração |

## Regras de ouro

1. **Code motion puro**: só as 4 mudanças permitidas, nada além.
2. Um artefato por commit; `qualityGate` verde em cada um.
3. **`data-testid` é a única adição permitida** durante movimentação.
4. LOC total **cresce** 20–40%. Se cair, comportamento foi deletado.
5. Bottom-up sempre: T6 → T2/T3 → T1 → T5.
6. Consolidação é **W5**, nunca antes — e respeita o guard de ≤8 props sem flag estrutural.
7. Bug notado durante movimentação vai para o reporte, não para o diff.
8. Smoke por onda conforme a tabela; W3 exige 3 status diferentes.
