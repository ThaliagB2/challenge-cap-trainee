# Track A — feature nova

Ordem de construção e checklist de fiação para uma tela nova em `packages/frontend`.

> **Princípio:** construir bottom-up, mas **desenhar** top-down. A Árvore-alvo da Fase 2 é pensamento top-down; o build da Fase 3 é bottom-up, para que cada artefato entre no repo já verde e já testado.

## Inventário obrigatório antes de escrever

Nada se escreve novo que já exista. Verifique, nesta ordem:

| Onde | O que tem hoje |
|---|---|
| `presentation/components/index.ts` | **16 componentes**: `AiAnalysisProgressPanel`, `AiCritiqueSettingsHelp`, `AiModelSelect`, `AiScoreGauge`, `BrandSignature`, `ConfirmDialog`, `DataTable`, `EmptyState`, `ErrorState`, `FileUpload`, `InfoRow`, `LoadingState`, `NumenLogo`, `SlaFormSection`, `StatusBadge`, `ThemeModeSelector` |
| `presentation/hooks/` | 13 hooks — inclusive `use-app.ts`, que é como você obtém `translate` e stores |
| `shared/utils/` | `format-date`, `format-status`, `format-file-size`, `file-to-base64`, `brand-gradient` |
| `shared/constants/` | `routes`, `brand`, `typography`, `ai-models`, `document-categories` |
| `presentation/controllers/` | 10 controllers + `base/` — pode já existir um para a sua entidade |
| `main/factories/` | 16 `*PageFactory` em `factories/pages/index.tsx` |

Casos frequentes de reuso esquecido:

- Tabela com paginação, ordenação e toggle de colunas → **`DataTable`** (não escreva `<Table>` cru; `project-form-page.tsx` e `client-form-page.tsx` já cometeram esse erro).
- Confirmação destrutiva → **`ConfirmDialog`**.
- Upload de arquivo → **`FileUpload`**.
- Bloco de SLAs com override → **`SlaFormSection`**.
- Estados de carregamento/erro/vazio → **`LoadingState`**, **`ErrorState`**, **`EmptyState`**.

## Ordem de construção

```
1. T6  funções puras          → validação, derivação, mapeamento, em <page>/utils/ (+ teste)
2. T3  folhas                 → props-only, data-testid (+ teste)
3. T1  seções                 → compõem folhas
4. T2  diálogos               → draft state próprio
5. T0  página                 → guards isLoading → error → conteúdo
6. T5  hook                   → um useState<State>, result.fold, reload nos mutators
7.     controller             → classe, estende BaseControllerImpl
8.     main/factories/        → use cases → controller → page factory
9.     ROUTES + app.tsx       → rota e guard de perfil
10.    app-shell.tsx          → item de menu, se a feature tem entrada de navegação
11.    i18n                   → chaves nos DOIS JSONs
```

Passos 1–5 são a decomposição CDD; 6–11 são fiação da arquitetura. Se a feature reusa um controller existente, 7 e 8 encolhem para "adicionar método".

## Checklist de fiação

Este é o checklist que hoje não existe escrito em lugar nenhum do repo. Pular um item produz tela que compila, passa no lint e não aparece.

### 1. Rota

- [ ] Constante em `shared/constants/routes.ts` (`ROUTES` é a **única** fonte de verdade de URL).
- [ ] Rota dinâmica ganha builder (`developmentDetail(id)`), e todo valor dinâmico passa por `encodeURIComponent`.

### 2. Factory de página

- [ ] `main/factories/pages/index.tsx`: novo `React.FC` chamado `<Page>Factory`.
- [ ] Controllers montados com `useMemo(() => make…Controller(httpClient), [])` — o `httpClient` é o `const` de escopo de módulo já existente no arquivo.
- [ ] Exportado nomeadamente.

### 3. Rota em `main/app.tsx`

- [ ] `<Route path={ROUTES.X} element={<XPageFactory />} />` dentro de `<Route element={<AppShell …/>}>`, se a tela é autenticada.
- [ ] Se a tela é restrita, envolver em `<RequireProfile profiles={[…]}>`. Note que `RequireProfile` já libera `isGlobalAdmin` automaticamente (`app.tsx:49`) — **não** inclua `'ADM'` esperando que seja isso que autoriza o admin global.
- [ ] Tela pública (sem login) vai fora do `PrivateRoute`, envolvida em `<PublicRoute>`.

### 4. Menu em `app-shell.tsx`

- [ ] Entrada em `NAV_ITEMS` (`app-shell.tsx:44-52`) com `label` (chave i18n), `icon` (lucide-react), `path` e `profiles`.
- [ ] ⚠️ **`NAV_ITEMS[].profiles` e `RequireProfile profiles={…}` têm de dizer a mesma coisa.** A autorização está duplicada nesses dois lugares hoje; divergir gera item de menu que navega para um redirect. Confira os dois lado a lado.

### 5. i18n

- [ ] Chaves adicionadas em `infra/i18n/pt-br.json` **e** `infra/i18n/en.json` — os dois arquivos têm de ter **exatamente** as mesmas chaves (1046 linhas cada hoje).
- [ ] Nova feature ganha chave raiz própria, em camelCase aninhado.
- [ ] Nenhuma string visível hardcoded no JSX.
- [ ] Rótulo de menu como `nav.<feature>`.

### 6. Controller e use cases

- [ ] Controller em `presentation/controllers/<feature>-controller.ts`, estendendo `BaseControllerImpl`.
- [ ] Use cases tipados pelas **interfaces do domain** no construtor, nunca pelas classes de implementação.
- [ ] Modificadores de acesso explícitos (`private readonly …`) — `explicit-member-accessibility` é erro.
- [ ] Um método público por operação, sem lógica intermediária.
- [ ] Factory em `main/factories/controllers/<feature>-controller.ts`.

### 7. Testes

- [ ] Nenhum `*.test.ts(x)` dentro de `src/` — todos em `tests/unit/`, espelhando o caminho do fonte sem o segmento `src/`.
- [ ] Helpers e stubs em `tests/unit/support/`; import do sujeito pelo alias `@/`.
- [ ] Funções puras e componentes de folha com teste obrigatório (ver [`testing-components.md`](testing-components.md)).

### 8. Hook

- [ ] `presentation/hooks/use-<feature>.ts`, recebendo o controller como primeiro parâmetro.
- [ ] `type State` local e **não exportada**, com `isLoading: true` no estado inicial.
- [ ] `result.fold(onLeft, onRight)` para assentar o estado.
- [ ] `useEffect(() => { load(); }, [load])`.
- [ ] Mutators recarregam via `await load()` quando `isRight()` e devolvem o `Either` cru ao chamador.

## Verificação final

```bash
cd packages/frontend
yarn qualityGate     # type-check && lint && test:unit
yarn dev             # porta 5000 — NÃO matar depois
```

Depois, no Browser MCP: navegar até a rota, tirar **accessibility snapshot** (não screenshot), confirmar que o item de menu aparece para os perfis certos e que o console está limpo.

## Anti-padrões

❌ **Escrever `<Table>` cru:**
```typescript
<TableContainer><Table><TableHead>… // ← use DataTable; ele já tem paginação, sort e toggle de colunas
```

❌ **`ADM` na lista de perfis esperando que seja isso que libera o admin global:**
```typescript
<RequireProfile profiles={['ADM']}> // ← isGlobalAdmin já passa por app.tsx:49; 'ADM' aqui é o perfil nomeado
```

❌ **Chave i18n em um idioma só:**
```json
// pt-br.json ganhou "myFeature.title"; en.json não ← quebra o idioma inglês silenciosamente
```

❌ **Controller instanciado na página:**
```typescript
export function MyFeaturePage() {
    const controller = makeMyFeatureController(new FetchHttpClient()); // ← papel da factory
```

❌ **Página nova nascendo com 400 linhas:**
```
"depois eu quebro" ← o teto de 250 L vale para código novo também; feature nova nasce decomposta
```

❌ **Item de menu sem rota, ou rota sem item de menu:**
```typescript
NAV_ITEMS: { path: ROUTES.MY_FEATURE, profiles: ['CF'] }   // menu libera CF
<RequireProfile profiles={['LT']}>                         // ← rota nega CF: menu vira link morto
```

## Regras de ouro

1. **Inventário antes de invenção** — 16 componentes, 13 hooks e 4 utils já existem.
2. Construir bottom-up; desenhar top-down.
3. Feature nova **nasce decomposta** — o teto de 250 L não é dívida futura.
4. `ROUTES` é a única fonte de verdade de URL.
5. `NAV_ITEMS[].profiles` e `RequireProfile profiles` têm de concordar — confira os dois.
6. Chave i18n entra nos **dois** JSONs, sempre.
7. Composição só em `main/factories/`; a página não sabe como o controller foi montado.
