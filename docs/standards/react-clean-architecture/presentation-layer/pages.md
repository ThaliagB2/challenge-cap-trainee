# Presentation layer — Pages

Páginas são **componentes de nível de rota**: recebem o controller (montado pela factory na `main/`) via props, usam o hook correspondente para gerenciar estado e compõem os componentes da tela. Cada página corresponde a uma rota definida em `shared/constants/routes.ts`.

## Estrutura

### Feature com uma página

```
src/presentation/pages/
└── <feature>/
    ├── components/                     → componentes locais (usados apenas nessa página)
    │   ├── dialogs/
    │   │   ├── index.ts
    │   │   └── <nome>-dialog.tsx
    │   └── tables/
    │       ├── index.ts
    │       └── <nome>-table.tsx
    └── <feature>-page.tsx              → componente de rota
```

### Feature com mais de uma página

Quando a feature tem várias rotas (lista, formulário, detalhe), **cada página ganha a própria pasta** e `pages/<feature>/components/` passa a ser o espaço do que é compartilhado entre as páginas irmãs:

```
src/presentation/pages/
└── <feature>/
    ├── components/                     → compartilhado entre as páginas da feature
    │   └── <nome>.tsx
    ├── <feature>-list/
    │   ├── components/
    │   └── <feature>-list-page.tsx
    └── <feature>-detail/
        ├── utils/                      → funções puras da página
        │   └── <verb>-<noun>.ts
        ├── components/
        │   ├── <feature>-detail-header.tsx      → orquestradores na raiz de components/
        │   ├── tabs/                            → um arquivo por aba
        │   └── dialogs/                         → um arquivo por diálogo
        └── <feature>-detail-page.tsx
```

Sem essa separação, uma feature com três rotas acumula os componentes locais das três num único `components/`, e deixa de ser possível saber a qual tela cada arquivo pertence.

Critério de colocação e limites de tamanho em [`granularity.md`](./granularity.md); a execução (medir, Árvore-alvo, ondas) na skill `component-driven-react`, em `.cursor/skills/component-driven-react/SKILL.md` (a partir da raiz do projeto).

## Padrão de página

```typescript
// src/presentation/pages/sales-orders/sales-orders-page.tsx

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { translate } from '@/infra/i18n';
import { ErrorMessage, Loader } from '@/presentation/components';
import { useSalesOrders } from '@/presentation/hooks/sales-orders/use-sales-orders';
import type { SalesOrdersController } from '@/presentation/controllers/sales-orders/sales-orders-controller';
import { SalesOrderTable } from '@/presentation/pages/sales-orders/components/tables/sales-order-table';

interface Props {
    controller: SalesOrdersController;
}

export function SalesOrdersPage({ controller }: Props) {
    const { salesOrders, isLoading, error, reload, clone } = useSalesOrders(controller);

    if (isLoading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorMessage message={error.message} onRetry={reload} />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
                {translate('salesOrders.title')}
            </Typography>
            <SalesOrderTable
                orders={salesOrders}
                onClone={clone}
            />
        </Box>
    );
}
```

## Exemplo 2 — Página de detalhe com parâmetro de rota

```typescript
// src/presentation/pages/sales-orders/sales-orders-detail-page.tsx

import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { translate } from '@/infra/i18n';
import { ErrorMessage, Loader } from '@/presentation/components';
import { useSalesOrderDetail } from '@/presentation/hooks/sales-orders/use-sales-order-detail';
import type { SalesOrdersController } from '@/presentation/controllers/sales-orders/sales-orders-controller';
import { SalesOrderDetailTable } from './components/tables/sales-order-detail-table';

interface Props {
    controller: SalesOrdersController;
}

export function SalesOrdersDetailPage({ controller }: Props) {
    const { id } = useParams<{ id: string }>();
    const { salesOrder, isLoading, error } = useSalesOrderDetail(controller, id!);

    if (isLoading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorMessage message={error.message} />;
    }
    if (!salesOrder) {
        return null;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
                {translate('salesOrders.detail.title', { id: salesOrder.id })}
            </Typography>
            <SalesOrderDetailTable items={salesOrder.items} />
        </Box>
    );
}
```

## Barrel export de páginas

```typescript
// src/presentation/pages/index.ts

export { SalesOrdersPage } from './sales-orders/sales-orders-page';
export { SalesOrdersDetailPage } from './sales-orders/sales-orders-detail-page';
```

## Como a factory conecta a página à rota

```typescript
// src/main/factories/pages/sales-orders-page-factory.tsx

import { useMemo } from 'react';
import { FetchHttpClient } from '@/infra/http/fetch-http-client';
import { makeSalesOrdersController } from '@/main/factories/controllers/sales-orders-controller';
import { SalesOrdersPage } from '@/presentation/pages/sales-orders/sales-orders-page';

const httpClient = new FetchHttpClient();

export const SalesOrdersPageFactory: React.FC = () => {
    const controller = useMemo(() => makeSalesOrdersController(httpClient), []);
    return <SalesOrdersPage controller={controller} />;
};
```

```typescript
// src/main/app.tsx (ou routes.tsx)

<Route path={ROUTES.SALES_ORDERS} element={<SalesOrdersPageFactory />} />
```

## Padrão de renderização condicional

Toda página segue a sequência:

```typescript
if (isLoading) {
    return <Loader />;
}
if (error) {
    return <ErrorMessage message={error.message} onRetry={reload} />;
}
// estado de sucesso: renderiza o conteúdo
return <Box>...</Box>;
```

## Componentes locais da página

Componentes usados apenas em uma página ficam em `pages/<feature>/components/`:

```typescript
// src/presentation/pages/sales-orders/components/tables/sales-order-table.tsx

interface Props {
    orders: SalesOrderHeaderModel[];
    onClone: (id: string) => Promise<void>;
}

export function SalesOrderTable({ orders, onClone }: Props) {
    return (
        <BaseTable
            columns={[
                { key: 'id', header: translate('salesOrders.columns.id') },
                { key: 'customerName', header: translate('salesOrders.columns.customer') },
                {
                    key: 'actions',
                    header: translate('common.actions'),
                    render: (row) => (
                        <Button size="small" onClick={() => onClone(row.id)}>
                            {translate('salesOrders.actions.clone')}
                        </Button>
                    )
                }
            ]}
            rows={orders}
            getRowKey={(o) => o.id}
        />
    );
}
```

## Anti-padrões

❌ **Instanciar controller dentro da página:**
```typescript
export function SalesOrdersPage() {
    const controller = new SalesOrdersController(...); // ← deve vir via props
}
```

❌ **Chamar use case diretamente na página:**
```typescript
export function SalesOrdersPage() {
    useEffect(() => {
        loadSalesOrdersUseCase.execute(); // ← vai pelo hook, que vai pelo controller
    }, []);
}
```

❌ **Lógica de negócio na página:**
```typescript
const pendingOrders = orders.filter((o) => o.status === 'PENDING'); // ← vai no use case
```

## Regras de ouro

1. Páginas recebem **sempre o controller via props** — nunca instanciado ou importado diretamente.
2. O estado da feature é gerenciado pelo **hook correspondente** — a página só consome.
3. A sequência `isLoading → error → conteúdo` é **obrigatória** em toda página com dados assíncronos.
4. Componentes usados só nessa página ficam em `pages/<page>/components/` — os reutilizáveis em `presentation/components/`. Feature com mais de uma página → **uma pasta por página**.
5. A página **não conhece** como o controller foi montado — a factory faz esse papel.
6. **A página é orquestração, não implementação.** Ela compõe seções e diálogos; o teto de 250 linhas vale aqui como em qualquer `.tsx` (ver [`granularity.md`](./granularity.md)).
7. **Página nova ou página acima do teto** → execute via skill `component-driven-react`, nunca de cabeça.
