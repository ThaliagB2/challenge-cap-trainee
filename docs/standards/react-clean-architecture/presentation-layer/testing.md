# Presentation layer — Testes

Como testar UI neste padrão. Complementa [`granularity.md`](./granularity.md): a taxonomia de tiers existe para tornar a maior parte da camada testável sem infraestrutura.

> **Regra de isolamento:** teste de presentation não faz I/O. Controllers e use cases entram como dublês (`vi.fn()`); nenhum teste desta camada sobe servidor, toca rede ou lê `localStorage` real.

## Stack

| Item | Escolha |
|---|---|
| Runner | Vitest, `environment: 'jsdom'`, `globals: true` |
| Biblioteca | `@testing-library/react` + `@testing-library/jest-dom` |
| Localização | **fora de `src/`**, em `tests/unit/`, espelhando a estrutura de `src/` |
| Setup global | `tests/unit/setup.ts` → `import '@testing-library/jest-dom/vitest';` |
| Idioma dos nomes de teste | PT-BR, descrevendo comportamento |

## Isolamento — teste não mora junto do código produtivo

> **Regra:** nenhum arquivo `.test.ts`/`.test.tsx` dentro de `src/`. Toda a árvore de testes vive em `tests/`, irmã de `src/`, replicando a hierarquia de pastas do código que exercita.

Misturar teste com código produtivo confunde o que é entregue com o que é andaime: infla a leitura de qualquer pasta, faz `src/` deixar de ser o retrato do que vai para o bundle, e obriga todo filtro de build, lint e cobertura a carregar exceções. Manter os dois lados separados e **simétricos** dá o melhor dos dois: isolamento real e navegação óbvia — o caminho do teste é o caminho do fonte com um prefixo.

```
packages/<app>/
├── src/
│   └── presentation/
│       └── pages/sales-orders/
│           ├── components/sales-order-table.tsx
│           └── utils/get-visible-tabs.ts
└── tests/
    ├── unit/
    │   ├── setup.ts                      → setup global do Vitest
    │   ├── support/                      → helpers de render, stubs, fixtures
    │   │   ├── render-with-theme.tsx
    │   │   └── render-with-app.tsx
    │   └── presentation/
    │       └── pages/sales-orders/       ← mesmo caminho de src/, sem o src/
    │           ├── components/sales-order-table.test.tsx
    │           └── utils/get-visible-tabs.test.ts
    └── e2e/                              → Playwright
        ├── support/
        └── *.spec.ts
```

Regras da simetria:

1. **Espelho exato.** `src/<caminho>/<arquivo>.tsx` → `tests/unit/<caminho>/<arquivo>.test.tsx`. Sem o segmento `src/`.
2. **Um arquivo de teste por arquivo de fonte.** Nome do teste = nome do fonte + `.test`.
3. **Helpers compartilhados em `tests/unit/support/`** — nunca em `src/`.
4. **Imports sempre pelo alias `@/`**, nunca relativos atravessando para `src/`. O teste importa o sujeito como qualquer outro consumidor importaria — o que também garante que o módulo é de fato exportável.
5. `tests/e2e/` (Playwright) e `tests/unit/` (Vitest) são irmãs e não se importam.

Configuração correspondente:

```typescript
// vitest.config.ts
test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx']
}
```

> **Alinhamento com o backend:** o padrão `fastify-clean-architecture` usa `test/unit/**` espelhando `src/`, com `test/integration/` ao lado. A separação unit/e2e e o espelhamento são os mesmos; o frontend usa `tests/` (plural) porque é a pasta que o Playwright já ocupa e para a qual o alias `@tests` já aponta.

## Por que não há ferramenta de catálogo de componentes

O padrão **não** adota Storybook (ou equivalente), e isso é decisão, não omissão.

> A proibição de consumir contexto em folhas (T3) e componentes globais (T4) **é** o substituto. Um componente sem dependência de i18n, store ou controller não precisa de decorator nem provider tree: `render(<Componente {...props} />)` já é a story — e vive no arquivo de teste, onde também assere comportamento em vez de só exibir aparência.

Adotar catálogo resolveria o sintoma (renderizar em isolamento) sem resolver a causa (acoplamento a contexto), e adicionaria um segundo lugar para manter exemplos desatualizados.

## Helpers de render

Dois helpers cobrem a camada inteira. Vivem em `tests/unit/support/` — fora de `src/`, como todo o resto da árvore de testes.

### `renderWithTheme` — para T3/T4

Componentes MUI leem o tema; sem provider, qualquer `sx` com callback quebra.

```typescript
// tests/unit/support/render-with-theme.tsx

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

const theme = createTheme();

export function renderWithTheme(ui: ReactElement) {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}
```

### `renderWithApp` — para T0/T1/T2

Necessário apenas em projetos que injetam i18n/stores por composição em vez de importar de `infra/` (ver [ADR-002](../../../adr/002-rejeicao-divergencias-react-clean-architecture.md)). Fornece o contexto de aplicação com dublês:

```typescript
// tests/unit/support/render-with-app.tsx

export function renderWithApp(ui: ReactElement, overrides: Partial<AppContextValue> = {}) {
    const value: AppContextValue = {
        translate: (key: string) => key,           // devolve a chave: assere-se a chave, não a tradução
        useAuthStore: (selector) => selector({ user: null, isAuthenticated: true }),
        ...overrides
    };
    return render(
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={value}>{ui}</AppContext.Provider>
        </ThemeProvider>
    );
}
```

`translate` devolvendo a própria chave é deliberado: o teste assere que a chave certa foi pedida, e não quebra quando a tradução muda.

## `data-testid`

Convenção: **`<component-slug>-<part>`**.

```
sales-order-table-row-<id>       cancel-order-dialog-reason
sales-order-table-empty          cancel-order-dialog-confirm
```

Selecione por `data-testid`, **não por texto traduzido** — o texto vem dos JSONs de i18n e muda sem aviso. (Testes e2e fazem o oposto, por design: lá o texto visível é parte do contrato com o usuário.)

O `data-testid` é adicionado no momento em que o componente é extraído. É inerte em runtime, e é a única alteração aditiva aceitável durante uma refatoração de code motion puro.

## Barra mínima por tier

| Tier | Obrigatório? | Barra |
|---|---|---|
| **T6** resolver puro | ✅ | **todo branch** — é o teste de maior retorno da camada |
| **T3** folha | ✅ | **uma interação + um branch condicional** |
| **T4** global | ✅ | idem T3, mais o caso de cada consumidor quando o contrato varia |
| **T5** hook | quando deriva lógica | estado inicial, caminho de sucesso, caminho de erro |
| **T0/T1/T2** | opcional | fluxo principal, com `renderWithApp` |

A assimetria é deliberada: **tornar o teste barato exatamente onde a lógica deveria estar** é o que empurra lógica para fora dos componentes que consomem contexto.

### T3 — uma interação e um branch

```typescript
describe('SalesOrderStatusChip', () => {
    afterEach(() => {
        cleanup();
    });

    it('dispara onClick com o status', () => {
        const onClick = vi.fn();
        renderWithTheme(<SalesOrderStatusChip status="OPEN" label="Aberto" onClick={onClick} />);

        fireEvent.click(screen.getByTestId('sales-order-status-chip'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('não é clicável sem onClick', () => {
        renderWithTheme(<SalesOrderStatusChip status="CLOSED" label="Fechado" />);
        expect(screen.getByTestId('sales-order-status-chip')).toHaveTextContent('Fechado');
    });
});
```

### T6 — todo branch

```typescript
describe('getVisibleTabs', () => {
    it('mostra só resumo e histórico enquanto o pedido está em rascunho', () => {
        expect(getVisibleTabs('DRAFT')).toEqual([0, 4]);
    });

    it('libera itens e entrega após a confirmação', () => {
        expect(getVisibleTabs('CONFIRMED')).toEqual([0, 1, 2, 4]);
    });

    it('cai no conjunto completo para status desconhecido', () => {
        expect(getVisibleTabs('QUALQUER_COISA')).toEqual(ALL_TABS);
    });
});
```

Um `switch` de status é exatamente o tipo de código que regride em silêncio: um nome de status renomeado no backend cai no `default` e ninguém percebe até a tela mostrar aba demais.

### T5 — hook

```typescript
it('expõe erro quando o controller falha', async () => {
    const controller = { loadSalesOrders: vi.fn().mockResolvedValue(left(new ServerError())) };
    const { result } = renderHook(() => useSalesOrders(controller as unknown as SalesOrdersController));

    await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBeInstanceOf(ServerError);
});
```

O controller é um objeto literal com `vi.fn()` — nunca a classe real, nunca um `HttpClient` de verdade.

## O que não testar

| Não teste | Por quê |
|---|---|
| Snapshot de árvore MUI | centenas de linhas de emotion que ninguém revisa; quebra a cada upgrade |
| Que o `sx` tem determinado valor | é estilo, não comportamento |
| Página inteira com todos os providers | é trabalho de e2e; aqui vira teste lento e frágil |
| Que `translate` foi chamado | assere o `data-testid` e o conteúdo, não a mecânica de i18n |
| Componentes de terceiros (MUI) | já são testados a montante |

## Cobertura

Configure `coverage.include` para incluir `src/presentation/**/*.ts` — **só `.ts`**, não `.tsx`. Isso captura resolvers puros e hooks, onde percentual de cobertura significa alguma coisa, sem criar uma meta artificial para JSX que ninguém persegue honestamente.

Testes de componente são **pins de regressão**, não instrumento de cobertura. Julgue-os por "isto quebraria se alguém regredisse o comportamento?", não por percentual.

## Anti-padrões

❌ **Selecionar por texto traduzido:**
```typescript
screen.getByText('Cancelar pedido'); // ← quebra quando o JSON de i18n muda
```

❌ **Testar componente que consome contexto sem provider:**
```typescript
renderWithTheme(<SalesOrderDetailHeader order={order} />); // ← lança se o componente chama o contexto de app
```

❌ **Instanciar controller real no teste:**
```typescript
const controller = new SalesOrdersController(new LoadSalesOrdersUseCaseImpl(repo)); // ← use vi.fn()
```

❌ **Escrever os testes em lote depois da refatoração:**
```
"extraio as 12 folhas e depois escrevo os 12 testes" // ← o teste é o gate da extração, vai no mesmo commit
```

❌ **Assertar estado interno:**
```typescript
expect(result.current.state.submitting).toBe(true); // ← assere o que a UI mostra e o que o callback recebeu
```

❌ **Arquivo de teste dentro de `src/`:**
```
src/presentation/pages/sales-orders/utils/get-visible-tabs.test.ts
// ← vai em tests/unit/presentation/pages/sales-orders/utils/get-visible-tabs.test.ts
```

❌ **Helper de teste dentro de `src/`:**
```
src/test/setup.ts   // ← tests/unit/setup.ts
```

❌ **Import relativo do teste para o fonte:**
```typescript
import { getVisibleTabs } from '../../../../src/presentation/pages/…'; // ← use o alias @/
```

## Regras de ouro

1. **Nenhum arquivo de teste dentro de `src/`.** A árvore de testes vive em `tests/unit/`, espelhando `src/` caminho a caminho.
2. **Funções puras (T6), folhas (T3) e componentes globais (T4) têm teste obrigatório.** Página, seção e diálogo são opcionais.
3. O teste entra no **mesmo commit** da extração — nunca em lote no fim.
4. Helpers e stubs compartilhados em `tests/unit/support/`; imports sempre pelo alias `@/`.
5. **Selecione por `data-testid`**, no padrão `<component-slug>-<part>`; nunca por texto traduzido.
6. Controllers e use cases entram como `vi.fn()` — **nenhum I/O** na camada.
7. `translate` dublê devolve a **chave**; assere-se a chave, não a tradução.
8. Sem snapshot de árvore MUI.
9. `coverage.include` cobre `src/presentation/**/*.ts`, não `.tsx` — testes de componente são pins de regressão.
