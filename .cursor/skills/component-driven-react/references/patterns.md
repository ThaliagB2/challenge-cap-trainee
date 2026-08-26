# Padrões nomeados

Os três padrões que produzem monolito neste repo, com contrato de props fixo para cada um.

## Padrão A — aba-por-bloco

**Sintoma:** `{currentTab === N && (…)}` repetido no `return` da página.

Caso real, `development-detail-page.tsx`:

| Bloco | Linha | L |
|---|---|---|
| aba 0 — resumo | 550 | 22 |
| aba 1 — EF/IA | 573 | 20 |
| aba 2 — estimativa | 594 | **297** |
| aba 3 — documentos | 891 | 42 |
| aba 4 — validação | 933 | 80 |
| aba 5 — solicitações | 1013 | 97 |
| aba 6 — auditoria | 1110 | 40 |

**Doutrina:** 1 aba = 1 arquivo T1, **sempre** — inclusive a de 20 linhas. Uniformidade vale mais que economia de arquivo: quando todas as abas são arquivos, a próxima aba tem um lugar óbvio para nascer.

A barra de `Tabs` + o mapa `TAB_LABELS` viram uma seção T1 própria; o `switch` de status→abas visíveis vira T6:

```
development-detail/
├── development-detail-page.tsx         T0
├── utils/
│   └── get-visible-tabs.ts             T6  ⬅ o switch de :59-85 + teste
└── components/
    ├── development-detail-tabs.tsx     T1  ⬅ a barra de :544-548 + TAB_LABELS
    └── tabs/
        ├── summary-tab.tsx             T1
        ├── estimate-tab.tsx            T1
        └── …
```

### A armadilha: layout condicional da aba 1

`currentTab === 1` altera três coisas fora do corpo da aba:

```typescript
// :498-509 — sx da raiz
sx={{ p: 3, ...(currentTab === 1 && { px: 3, py: 1.5, height: 'calc(100dvh - 56px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }) }}

// :511 — margem do header
sx={{ mb: currentTab === 1 ? 1 : 2 }}

// :544 — margem da barra de abas
sx={{ borderBottom: 1, borderColor: 'divider', mb: currentTab === 1 ? 1 : 2 }}
```

Essas três condicionais **têm de ser preservadas byte a byte** ao extrair header e barra de abas. Derive um booleano na página e passe-o como prop:

```typescript
const isFullHeightTab = currentTab === 1;
```

Esquecer isso quebra o chat de EF em altura total — e não é o tipo de coisa que `qualityGate` pega.

### O mapa de abas é W5, não W3

```typescript
const tabContent: Record<TabIndex, ReactNode> = { 0: <SummaryTab … />, 1: <EfIaTab … />, … };
```

É mais bonito, mas constrói **todos** os elementos avidamente a cada render — não é code motion puro. Se alguém quiser, é consolidação de W5, com smoke próprio. Na W3, mantenha a cadeia `{currentTab === N && <SummaryTab … />}`, que a essa altura já são 7 one-liners.

## Padrão B — dialog-heavy

**Sintoma:** vários `<Dialog>` no fim do `return`, cada um com 3–5 `useState` de draft espalhados no topo do componente.

Caso real: 7 `<Dialog>` crus + 3 `<ConfirmDialog>` em `development-detail-page.tsx:1150-1443` (294 linhas).

### Contrato fixo

```typescript
interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: (payload: Payload) => Promise<boolean>;
    // + dados de leitura (listas, rótulos)
}
```

Regras:

- O **diálogo** é dono do draft e do `submitting`.
- O diálogo se fecha sozinho quando `onConfirm` resolve `true`. Isso casa com a assinatura de todos os mutators de `use-development-detail.ts`.
- A **página** guarda só `open: boolean` ou `target: string | null`.
- Isso deleta da página um handler por diálogo — 7 dos 17 handlers no caso canônico.

### Antes

```typescript
const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
const [rejectReasonId, setRejectReasonId] = useState('');
const [rejectingEstimate, setRejectingEstimate] = useState(false);

const handleConfirmRejectEstimate = async () => {
    setRejectingEstimate(true);
    const ok = await rejectEstimate(rejectReasonId);
    setRejectingEstimate(false);
    if (ok) {
        setRejectDialogOpen(false);
        setRejectReasonId('');
    }
};
```

### Depois

```typescript
const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

<RejectEstimateDialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} onConfirm={rejectEstimate} reasons={rejectReasons} />
```

Duas linhas na página; o resto mora no diálogo.

### Consolidação (W5) e o guard

Quatro dos sete diálogos são estruturalmente idênticos — `maxWidth="xs" fullWidth`, título, `TextField select` de motivos mapeando `r.id`/`r.label`, campo de nota opcional, e `disabled={submitting || !reasonId}`:

| Diálogo | Linhas | Variação |
|---|---|---|
| rejeitar estimativa | 1150–1177 | só motivo |
| devolver à análise | 1179–1206 | só motivo; botão sem `color="error"` |
| rejeitar solicitação | 1277–1315 | motivo + notas opcionais |
| cancelar desenvolvimento | 1384–1422 | motivo + justificativa **obrigatória** |

134 linhas colapsam em um T4 de ~78 linhas com teste, compartilhado por 4 call sites. **Mas só na W5.**

O guard diz ≤8 props e nenhuma booleana estrutural. A superfície ingênua daria 11+; agrupando o que varia, fecha em 8:

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

`notes` ausente = diálogo sem campo de nota. Isso é **dados**, não flag estrutural — o layout é o mesmo, um campo a menos.

Os outros três diálogos (reclassificar, resolver, criar solicitação) **ficam separados**: mesclá-los exigiria uma prop `mode` que troca quais campos existem. O guard barra, e está certo.

## Padrão C — formulário de N campos

**Sintoma:** um `useState` por campo. `client-form-page.tsx` tem **24**; `project-form-page.tsx` colapsou em um `FormState` de **28 campos** (`:56-85`) e acertou nessa parte.

### Doutrina, em 6 passos

1. **`type FormState` + `EMPTY_FORM` no escopo do módulo.** Já correto em `project-form-page.tsx:87`.
2. **Hook T5** `use-<entity>-form.ts`: um `useState<FormState>`, mais `errors` e `saving`.
   ```typescript
   const setField = <K extends keyof FormState>(key: K, value: FormState[K]): void => {
       setForm((prev) => ({ ...prev, [key]: value }));
   };
   ```
3. **Validação é T6**, pura e testada: `<page>/utils/validate-<entity>-form.ts` → `Record<string, string>`. É o teste de maior valor de um refactor de formulário — hoje a validação vive inline com regex de e-mail no meio do dialog.
4. **Campos agrupados em seções T1** por bloco semântico (identificação / contatos / SLAs / documentos), 40–90 L cada, recebendo **3 props**:
   ```typescript
   interface Props {
       form: FormState;
       errors: Record<string, string>;
       onField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
   }
   ```
   3 props, não 28. É isso que mantém o gatilho 7 (>12 props) satisfeito.
5. **Campo reutilizável vira T3 com teste.** `SlaField` (`project-form-page.tsx:454`, declarado dentro do corpo do pai) deve reusar **`components/sla-form-section/`, que já existe** — não reinventar.
6. **`<Table>` cru → `DataTable`**, em commit separado (muda markup renderizado).

### O caso do `useEffect` de 82 linhas

`project-form-page.tsx:144-225` reseta todo o estado e faz 4 cargas em um único efeito. Ao mover para o hook T5:

- Uma carga por `useCallback`, compostas por `Promise.all` — padrão já usado em `use-development-detail.ts`.
- O reset no `open` fica explícito e separado das cargas.
- ⚠️ **Bug latente para registrar como débito, não consertar de carona:** o efeito faz `clients.find(...)` com `clients` fora do array de dependências. Corrigir muda comportamento — commit próprio.

## Anti-padrões

❌ **Filho recebendo 28 props:**
```typescript
<IdentificationSection name={form.name} abbreviation={form.abbreviation} description={form.description} … /> // ← passe { form, errors, onField }
```

❌ **Diálogo cujo draft vive na página:**
```typescript
const [reasonId, setReasonId] = useState(''); // ← compartilhado por 4 diálogos: um contamina o outro
```

❌ **Extrair a aba e perder o layout condicional:**
```typescript
<Box sx={{ p: 3 }}> // ← sumiu o ...(currentTab === 1 && { height: 'calc(100dvh - 56px)', … })
```

❌ **Colapsar diálogos com flag estrutural:**
```typescript
<GenericDialog mode="reclassify" /> // ← prop booleana/enum que troca quais campos existem: o guard barra
```

❌ **Validação inline no handler:**
```typescript
if (!/^[^@]+@[^@]+$/.test(form.clientPmEmail)) { … } // ← é T6 puro e testável
```

## Regras de ouro

1. **1 aba = 1 arquivo**, mesmo a de 20 linhas.
2. Layout condicional que depende da aba **sai como booleano derivado** e é preservado byte a byte.
3. Mapa `Record<TabIndex, ReactNode>` é W5, nunca W3.
4. Diálogo é dono do próprio draft e do `submitting`; a página guarda só `open`/`target`.
5. `onConfirm` devolve `Promise<boolean>`; o diálogo se fecha em `true`.
6. Colapso de diálogos só com **≤8 props e zero flag estrutural** — agrupe antes de desistir.
7. Formulário = um `useState<FormState>` + `setField` + validação T6 + seções de 3 props.
8. Bug encontrado no caminho vira débito registrado, não commit de carona.
