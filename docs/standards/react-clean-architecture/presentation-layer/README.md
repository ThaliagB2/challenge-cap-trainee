# Presentation layer

A presentation layer é a **fronteira entre a lógica de negócio e a interface do usuário**. Ela contém tudo que é React: componentes, páginas, layouts, hooks e controllers. Não contém regras de negócio — apenas orquestra a apresentação dos dados e traduz interações do usuário em chamadas aos use cases.

> **Regra de isolamento:** a presentation layer importa de `domain/` (tipos, modelos, erros) e de `infra/` (stores, i18n). **Não importa** diretamente de `data/` — o acesso aos use cases acontece via controllers injetados por `main/factories/`.
>
> **Divergência opcional:** o acesso a `infra/` é a divergência `presentation → infra` descrita no [README do padrão](../README.md). Projetos com dependency rule estrita a rejeitam e recebem i18n, tema e stores por composição em `main/` — ver [ADR-002](../../../adr/002-rejeicao-divergencias-react-clean-architecture.md). Os exemplos desta seção usam a forma com `infra/`; leia-os pelo padrão estrutural.

## Estrutura canônica

```
src/presentation/
├── components/         → componentes reutilizáveis (dumb/presentational)
│   ├── <categoria>/
│   │   └── <nome>.tsx
│   └── index.ts        → barrel export de todos os componentes
├── controllers/        → orquestração de use cases e estado de apresentação
│   ├── base/
│   │   ├── protocols.ts        → BaseController + BaseControllerState
│   │   ├── implementation.ts   → BaseControllerImpl
│   │   └── index.ts
│   └── <feature>/
│       └── <feature>-controller.ts
├── hooks/              → custom hooks que conectam controller ao React state
│   └── <feature>/
│       └── use-<feature>.ts
├── layouts/            → wrappers de layout de página inteira
│   └── app-shell/
│       └── app-shell.tsx
└── pages/              → componentes de rota (nível de página)
    └── <feature>/
        ├── components/         → componentes locais da página
        └── <feature>-page.tsx

        # feature com mais de uma rota → uma pasta por página:
        # <feature>/components/           → compartilhado entre as páginas irmãs
        # <feature>/<page>/components/    → local daquela página (tabs/, dialogs/)
        # <feature>/<page>/<page>-page.tsx
```

## Responsabilidades por subpasta

| Subpasta | Responsabilidade |
|---|---|
| `controllers/` | Orquestra use cases, gerencia estado de apresentação, expõe métodos tipados |
| `hooks/` | Conecta controller ao React state (`useState`, `useCallback`, `useEffect`) |
| `components/` | Componentes reutilizáveis e puramente visuais — recebem dados via props |
| `pages/` | Componentes de rota — compõem hooks e components para uma tela completa |
| `layouts/` | Wrappers de layout globais (sidebar, header, outlet) |

Quão grande cada um desses arquivos pode ser, e como quebrá-los quando crescem, está em [granularity.md](./granularity.md).

## Fluxo de dados

```
main/factories/
    ↓ injeta controller via props
pages/<feature>-page.tsx
    ↓ passa controller para hook
hooks/use-<feature>.ts
    ↓ chama métodos do controller
controllers/<feature>-controller.ts
    ↓ executa use cases e retorna Either
data/use-cases/...
    ↓ resultado volta como estado React
hooks/use-<feature>.ts
    ↓ expõe { data, isLoading, error } para a página
pages/<feature>-page.tsx
    ↓ renderiza components com os dados
components/...
```

## Regras de ouro

1. **Nenhuma chamada direta a use cases ou repositórios** — a página recebe o controller via props e delega ao hook.
2. **Controllers são injetados via props** — nunca instanciados dentro de componentes.
3. **Hooks gerenciam estado local de feature** — não estado global (esse fica em stores na infra).
4. **Components são puramente visuais** — recebem apenas props, sem lógica de negócio.
5. **Barrel exports em `components/index.ts`** — centraliza imports dos componentes reutilizáveis.
6. **Sem imports de `data/`** diretamente — sempre via controller.
7. **Nenhum `.tsx` acima de 250 linhas** — acima de 350 é defeito. Ver [granularity.md](./granularity.md). Ao criar página nova ou editar `.tsx` que já passou do teto, execute via skill `component-driven-react`, em `.cursor/skills/component-driven-react/SKILL.md` (a partir da raiz do projeto).
8. **Componentes de folha não consomem contexto** (i18n, stores) — recebem rótulos por props, e por isso têm teste obrigatório. Ver [testing.md](./testing.md).

## Naming

| Elemento | Convenção | Exemplo |
|---|---|---|
| Arquivo de componente | `kebab-case.tsx` | `sales-order-table.tsx` |
| Arquivo de hook | `use-kebab-case.ts` | `use-sales-orders.ts` |
| Arquivo de controller | `kebab-case-controller.ts` | `sales-orders-controller.ts` |
| Arquivo de página | `kebab-case-page.tsx` | `sales-orders-page.tsx` |
| Componente (função) | `PascalCase` | `SalesOrderTable`, `SalesOrdersPage` |
| Hook | `use` + `PascalCase` | `useSalesOrders` |
| Controller (classe) | `PascalCase` + `Controller` | `SalesOrdersController` |
| Factory de página | `PascalCase` + `Factory` | `SalesOrdersPageFactory` |

## Documentos desta seção

- [controllers.md](./controllers.md) — `BaseControllerImpl`, injeção de use cases, `handleResult()`
- [hooks.md](./hooks.md) — custom hooks, `useState + useCallback + useEffect`, assinatura `use*(controller)`
- [components.md](./components.md) — componentes reutilizáveis, barrel exports, organização por categoria
- [pages.md](./pages.md) — componentes de rota, recebem controller via props, composição de hooks + components
- [layouts.md](./layouts.md) — wrappers de layout, `AppShell`, `Outlet`
- [granularity.md](./granularity.md) — taxonomia T0–T6, gatilhos de extração, teto de 250 linhas, partição de estado
- [testing.md](./testing.md) — `renderWithTheme`/`renderWithApp`, `data-testid`, barra mínima de teste por tier

> **Execução:** estes documentos são a doutrina. O workflow que a aplica — medir, propor Árvore-alvo, decompor em ondas com gate — é a skill `component-driven-react`.
