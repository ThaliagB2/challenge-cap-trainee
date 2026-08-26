# Gatilhos de extração e partição de estado

Réguas objetivas para decidir **quando** extrair. Cada limiar é derivado de dado real deste repo — não de blog post.

> Os gatilhos e a invariante de partição de estado são normativos em [`granularity.md`](../../../../docs/standards/react-clean-architecture/presentation-layer/granularity.md). Este documento acrescenta a medição do baseline real deste repositório e a justificativa numérica de cada limiar.

> **Regra:** medir antes de decidir. Granularidade decidida "no olho" produz discussão de gosto; granularidade decidida por medida produz decisão.

## Medição (Fase 0)

```bash
cd packages/frontend/src/presentation
f=pages/developments/development-detail-page.tsx

wc -l "$f"                      # linhas
grep -c '= useState' "$f"       # declarações de estado
grep -c 'useEffect(' "$f"       # efeitos
grep -c 'const handle' "$f"     # handlers inline
grep -c '<Dialog ' "$f"         # diálogos crus
grep -n '{currentTab === ' "$f" # blocos de aba, com linha
```

Baseline medido (2026-08-05) — use como calibração:

| Arquivo | L | `useState` | `useEffect` | handlers | `<Dialog>` |
|---|---|---|---|---|---|
| `pages/developments/development-detail-page.tsx` | 1446 | **54** | **9** | **17** | 7 (+3 `ConfirmDialog`) |
| `pages/projects/project-form-page.tsx` | 1176 | 18 | 1 | 2 | 5 |
| `pages/clients/client-form-page.tsx` | 779 | **24** | 1 | 3 | 3 |
| `pages/users/user-form-dialog.tsx` | 486 | 13 | 1 | 1 | 1 |
| `pages/developments/chat/ef-chat-composer.tsx` | 119 | 1 | 0 | 0 | 0 |
| `pages/developments/chat/ef-chat-timeline.tsx` | 41 | 0 | 0 | 0 | 0 |

## Os 12 gatilhos

| # | Gatilho | Limiar | Justificativa no dado real |
|---|---|---|---|
| 1 | Linhas por arquivo `.tsx` | **warn >250, hard >350** | Os maiores arquivos escritos **de propósito** são `sap-connection-section.tsx` (270), `data-table.tsx` (300) e `ef-chat-panel.tsx` (350). Os 9 arquivos-fonte de `chat/` vão de 11 a 350, mediana **62**. 250 = p90 da autoria deliberada; 350 = o máximo observado. Acima de 376 em `pages/` é arquivo que ninguém planejou. |
| 2 | `useState` por componente | **>6** | O bom padrão do repo colapsa tudo em **um** `useState<State>` (`use-development-detail.ts`); folhas de `chat/` têm 0–1. Os monolitos têm 54 / 24 / 18 / 13. 6 ≈ o conteúdo de um diálogo (campos de draft + flag de submit). |
| 3 | `useEffect` por componente | **>2** | O standard prescreve exatamente 1 (`useEffect(() => { load(); }, [load])`). A detail page tem 9 — e **8 são "carrega lista de lookup"** (`:209-292`), que pertencem a hooks T5. 2 = load + uma sincronização legítima. |
| 4 | Handlers inline (`const handleX = async`) | **>5** | A detail page tem 17 em `:319-493` (175 L, média 11,6 L cada). 5 × 12 = 60 L, já um quarto do orçamento de 250. Acima de 5, os handlers pertencem a diálogos diferentes — ou seja, a arquivos diferentes. |
| 5 | Blocos `{cond && (…)}` no topo do `return` | **>3; e nunca >15 L** | A detail page tem 7 blocos de aba (`:550, 573, 594, 891, 933, 1013, 1110`) medindo 22, 20, **297**, 42, 80, 97 e 40 linhas. Qualquer `{cond && (…)}` acima de 15 L é um componente, sem exceção. |
| 6 | Profundidade de aninhamento JSX | **>6** | `project-form-page.tsx` alcança `Dialog > DialogContent > Box > Stack > Card > CardContent > TableContainer > Table > TableBody > TableRow > TableCell` ≈ 11 níveis. 6 é onde o leitor deixa de conseguir sustentar a árvore mentalmente. |
| 7 | Props num componente | **>12** | `EfIaTab` tem 14 (`ef-ia-tab.tsx:23-37`) e está visivelmente no limite. Acima de 12, o filho está sendo usado como proxy de estado — dê a ele um hook T5 ou divida-o. |
| 8 | "Telas"/abas distintas no mesmo arquivo | **>1** | 1 aba = 1 arquivo. Absoluto, mesmo para a aba de 20 linhas. |
| 9 | `<Dialog>` no mesmo arquivo do seu gatilho | **qualquer** | 7 na detail page, 5 em `project-form-page`. O estado de um diálogo não tem leitor fora dele — é **sempre** extraível com segurança. |
| 10 | Objeto `sx` literal idêntico em ≥2 arquivos | **qualquer** | `gradientBtn` aparece em **6 arquivos** (15 ocorrências): `client-form-page`, `client-list-page`, `project-form-page`, `project-list-page`, `user-form-dialog`, `user-list-page`. Já 3× além da regra "2+ páginas" do standard. |
| 11 | Componente declarado **dentro** do corpo de outro | **qualquer** | `SlaField` em `project-form-page.tsx:454`. Remonta a cada render do pai → perde foco e estado interno. **É bug, não questão de estilo.** |
| 12 | Membros retornados por um hook | **>20** | `use-development-detail.ts` retorna **39** e é destruturado em 39 linhas na página (`:115-153`). Sinalize como débito; **não** divida na mesma passada (ver `refactor-waves.md`, seção "O que fica de fora"). |

### Como usar os gatilhos

- **1 gatilho estourado** → extração pontual, modo Rápido.
- **2–3 gatilhos** → modo Padrão.
- **4+ gatilhos, ou o gatilho 1 em hard (>350 L)** → modo Profundo, com Árvore-alvo aprovada.
- **Gatilho 11 (componente dentro de componente)** → corrija **sempre**, independente do modo. É bug.

## Partição de estado

A invariante única, e a skill deve enunciá-la exatamente nesta forma:

> **Estado migra para a raiz da subárvore que é sua única leitora.** Se um `useState` só é lido dentro de um `<Dialog>`, ele pertence ao arquivo daquele diálogo. Se é lido por duas abas, fica na página. Se vem de um controller, pertence a um hook.

| Tipo de estado | Exemplo real | Destino |
|---|---|---|
| Dados de servidor + `isLoading` + `error` | `use-development-detail.ts:22-30` | permanece no hook T5, **um** `useState<State>` |
| Listas de referência carregadas de controller | `rejectReasons`, `returnReasons`, `rejectSolicitationReasons`, `cancelReasons` (`:160, 165, 171, 196`) + os 4 `useEffect` (`:209, 221, 233, 270`); `techLeads`, `projectDevs` (`:190, 205`) + 2 `useEffect` (`:245, 282`) | **novos hooks T5**: `use-reason-options.ts` (parametrizado por categoria) e `use-project-members.ts` (parametrizado por papel) |
| Aba aberta | `tab` (`:154`) | permanece na página — é estado de navegação |
| `open` / `target` de diálogo | `rejectDialogOpen`, `rejectSolTarget`, `reclassifyTarget`, `resolveTarget` | permanece na página — **só o booleano ou o id** |
| Draft do diálogo + flag de submit | `rejectReasonId` + `rejectingEstimate`; `solType`/`solTitle`/`solDescription`/`solSteps` + `creatingSolicitation` | **desce para dentro do diálogo (T2)** |
| Draft de formulário de entidade | `FormState` de **28 campos** (`project-form-page.tsx:56-85`) | **um** `useState<FormState>` em `use-<entity>-form.ts` (T5) + `setField(key, value)` |
| Booleanos derivados de perfil | as 10 permissões em `:103-113` | **função pura T6** em `<page>/utils/` + teste |
| Eco transitório de UI | `uploadingEfFlag`, `efVersionBeforeUpload`, `efUploadSuccessVersion` (`:193-195`) | desce para a seção dona do upload |
| Valor derivável de props | `latestAnalysis` (`:311`) | **T6** `<page>/utils/resolve-latest-analysis.ts` |
| Estado global de app | usuário autenticado, tema, projeto ativo | já está em `infra/stores/` — **nunca** duplique em `useState` |

### Teste da única leitora

Antes de mover um `useState`, responda: **quem lê este valor?**

```
1 leitor, dentro de uma subárvore  → desce para a raiz daquela subárvore
2+ leitores em subárvores irmãs    → fica no ancestral comum (normalmente a página)
vem de controller / é assíncrono   → vira hook T5
é calculável a partir de outro     → não é estado: é T6
```

O último caso é o mais comum e o mais esquecido. `latestAnalysis` e as 10 permissões não são estado — são funções dos dados que já existem.

## Anti-padrões

❌ **Extrair por linha, sem olhar quem lê o estado:**
```typescript
// "vou cortar nas linhas 594-890 porque são 297 linhas"
// ← sem o teste da única leitora, o filho vira proxy de 20 props e nada melhorou
```

❌ **Um `useState` por campo de formulário:**
```typescript
const [name, setName] = useState('');
const [abbreviation, setAbbreviation] = useState('');
const [logoUrl, setLogoUrl] = useState(''); // ← 24 destes em client-form-page.tsx
```
Correto: `useState<FormState>` + `setField<K extends keyof FormState>`.

❌ **Guardar em estado o que é derivável:**
```typescript
const [canApprove, setCanApprove] = useState(false);
useEffect(() => { setCanApprove(user?.profile === 'GPC'); }, [user]); // ← é T6, não estado
```

❌ **Subir estado de diálogo para a página "para reaproveitar":**
```typescript
const [reasonId, setReasonId] = useState(''); // ← compartilhado por 4 diálogos: cada um contamina o outro
```
Correto: cada diálogo é dono do seu draft; a página guarda só `open`/`target`.

## Regras de ouro

1. **Medir antes de decidir.** Rode o scan e imprima a tabela; sem isso não há Fase 1.
2. Um gatilho estourado justifica extração; quatro exigem Árvore-alvo aprovada.
3. **Gatilho 11 é bug** — conserte sempre, em qualquer modo.
4. Estado migra para a raiz da subárvore que é sua **única leitora**.
5. Antes de mover estado, pergunte se ele é **derivável** — se for, não é estado, é T6.
6. `useState` por campo é anti-padrão; um `useState<FormState>` é o padrão.
7. Hook com >20 membros retornados é débito **registrado**, não débito **consertado na mesma passada**.
