# Testes de componente

Como testar UI neste repo, sem Storybook e sem MSW.

> A doutrina de teste da camada é normativa em [`testing.md`](../../../../docs/standards/react-clean-architecture/presentation-layer/testing.md). Este documento registra o **estado atual deste repositório** — o que existe, o que falta, e como trabalhar enquanto falta.

## Por que não há Storybook

Não está instalado, não há `.storybook/`, não há `*.stories.*` — e a skill **não** propõe adicionar.

> **A proibição de `useApp()` em T3/T4 é o substituto do Storybook.** Uma folha sem dependência de contexto não precisa de decorator, provider tree nem story: `render(<Folha {...props} />)` já é a story, e vive no arquivo de teste, onde também assere comportamento.

A evidência é direta. Os únicos dois componentes testados do repo — `EfChatComposer` e `EfChatTimeline` — recebem `placeholder`, `sendLabel`, `hint` e `emptyLabel` como props. `AnalysisResultCard` (`ef-ia-tab.tsx:56`) chama `useApp()` e não tem teste. Storybook resolveria o sintoma (renderizar em isolamento) sem resolver a causa (acoplamento a contexto).

## Infra existente

| Item | Onde |
|---|---|
| Setup global | hoje `src/test/setup.ts`; **destino `tests/unit/setup.ts`** |
| Config | `vitest.config.ts` — `environment: 'jsdom'`, `globals: true`; `include` hoje aponta para `src/**` e **precisa migrar** para `tests/unit/**` |
| Libs | `@testing-library/react` 16, `/dom` 10, `/jest-dom` 6, `/user-event` 14 (**instalado e não usado**) |
| Comando | `yarn test:unit` (o `yarn test` é Playwright) |

## Onde o arquivo de teste vai

> **Nenhum arquivo de teste dentro de `src/`.** Teste vive em `tests/unit/`, espelhando o caminho do fonte sem o segmento `src/`. Regra normativa em [`testing.md`](../../../../docs/standards/react-clean-architecture/presentation-layer/testing.md).

```
src/presentation/pages/developments/development-detail/utils/get-visible-tabs.ts
  → tests/unit/presentation/pages/developments/development-detail/utils/get-visible-tabs.test.ts

src/presentation/pages/developments/development-detail/components/tabs/estimate-form.tsx
  → tests/unit/presentation/pages/developments/development-detail/components/tabs/estimate-form.test.tsx
```

Helpers compartilhados em `tests/unit/support/`. Import do sujeito sempre pelo alias `@/`, nunca relativo atravessando para `src/`.

⚠️ **Estado atual do repo diverge disto.** Os 14 arquivos de teste existentes estão co-localizados em `src/`, e o `vitest.config.ts` ainda tem `include: ['src/**/*.test.ts', 'src/**/*.test.tsx']`. Enquanto a migração não acontece (registrada como pendência no `STATE.md`):

- **Teste novo já nasce em `tests/unit/`** — não replique o padrão antigo.
- Isso exige que o `include` do `vitest.config.ts` cubra os dois caminhos, ou que a migração venha antes. **Mudança de config é decisão do usuário** — não altere por conta própria; sinalize e pergunte.

## `renderWithTheme`

Padrão verbatim de `src/presentation/pages/developments/chat/ef-chat-composer.test.tsx:9-13`. O destino dele é `tests/unit/support/render-with-theme.tsx`; enquanto não existir, copie para cada arquivo de teste novo:

```typescript
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EstimateForm } from '@/presentation/pages/developments/development-detail/components/tabs/estimate-form.js';

const theme = createTheme();

function renderWithTheme(ui: ReactElement) {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}
```

O `ThemeProvider` é necessário porque componentes MUI leem o tema; sem ele, qualquer `sx` com callback de tema quebra.

`afterEach(cleanup)` em cada `describe` — o repo não configura `globals: { cleanup: true }`.

## `data-testid`

Convenção: **`<component-slug>-<part>`**.

```
ef-chat-composer-input     ef-chat-composer-send     ef-chat-composer-reason
ef-chat-timeline-empty     ef-chat-message-<id>
reason-prompt-dialog-reason    reason-prompt-dialog-confirm
estimate-form-hours            estimate-form-complexity
```

Adicionado **no momento da extração**, no mesmo commit. É a única mudança aditiva permitida durante code motion puro, porque é inerte em runtime.

Selecione por `getByTestId`, não por texto: o texto vem de `pt-br.json` e muda sem aviso. (Os testes e2e em `tests/e2e/` fazem o oposto — usam `getByRole`/`getByLabel` com texto PT-BR — e é justamente por isso que estão acoplados à cópia.)

## Barra mínima por tier

| Tier | Obrigatório? | Barra mínima |
|---|---|---|
| **T6** função pura | ✅ sim | **todo branch.** `utils/get-visible-tabs.ts` tem 6 `case` + `default` → 7 asserções |
| **T3** folha | ✅ sim | **uma interação + um branch condicional** |
| **T4** global | ✅ sim | idem T3, mais o caso de cada consumidor se o contrato variar |
| **T5** hook | quando deriva lógica | estado inicial, sucesso, erro |
| **T0/T1/T2** | opcional | ver limitação abaixo |

A barra de T3 é exatamente o que `ef-chat-composer.test.tsx` faz: `Enter` envia vs `Shift+Enter` não envia (interação), mais `disabled` com `disabledReason` (branch).

```typescript
it('envia com Enter e não envia com Shift+Enter', () => {
    const onSend = vi.fn();
    renderWithTheme(<EfChatComposer onSend={onSend} placeholder="Digite" sendLabel="Enviar" hint="…" />);

    const input = screen.getByTestId('ef-chat-composer-input');
    fireEvent.change(input, { target: { value: 'olá' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });
    expect(onSend).toHaveBeenCalledWith('olá');
});
```

## Convenções

- **Nomes de teste em PT-BR**, descrevendo comportamento: `it('desabilita o confirmar sem motivo selecionado')`.
- **`fireEvent`, não `user-event`.** `@testing-library/user-event` está instalado e não é usado em nenhum lugar; trocar é decisão de tooling separada, fora do escopo desta skill.
- Callbacks são `vi.fn()`; assere **o que foi chamado e com quê**, não o estado interno.
- `expect(...).toBeDisabled()` / `toHaveTextContent()` vêm do `jest-dom` já carregado pelo setup.
- Sem snapshot. Snapshot de JSX de MUI é ruído que ninguém revisa.

## Duas limitações declaradas

Estas são reais e não devem ser maquiadas:

**1. T1/T2 exigem um wrapper de `AppContext` que não existe.**

Componentes que chamam `useApp()` precisam de `AppContext.Provider` com `{ translate, useAuthStore, useProjectStore, useThemeStore }` — e não há helper para isso hoje. Por isso **T1/T2 são opcionais e T3/T4 obrigatórios**.

Essa assimetria não é acidente de conveniência: é a pressão que empurra lógica para as folhas. Quando testar a seção é difícil e testar a folha é trivial, a folha fica com a lógica.

Se e quando um `render-with-app.tsx` for criado (~40 L em `tests/unit/support/`), a barra de T1/T2 sobe. É decisão pendente, fora do escopo desta skill.

**2. Estes testes não geram número de coverage.**

`vitest.config.ts` tem `coverage.include` = `['src/domain/**/*.ts', 'src/infra/**/*.ts', 'src/data/**/*.ts']`. `presentation/` nunca entra na conta.

Ou seja: são **pins de regressão**, não cobertura. Não persiga percentual aqui e não reporte coverage de presentation — não existe.

## Anti-padrões

❌ **Selecionar por texto traduzido:**
```typescript
screen.getByText('Rejeitar estimativa'); // ← quebra quando pt-br.json muda
```

❌ **Testar componente que chama `useApp()` sem provider:**
```typescript
renderWithTheme(<SolicitationRow solicitation={s} />); // ← lança "useApp must be used within AppContext"
```
Correto: torne-o T3 (recebe rótulos por prop) — ou aceite que ele é T1 e não tem teste.

❌ **Teste em lote no fim da refatoração:**
```
"extraio as 12 folhas e depois escrevo os 12 testes" // ← o teste é o gate da extração; junto, no mesmo commit
```

❌ **Snapshot de árvore MUI:**
```typescript
expect(container).toMatchSnapshot(); // ← 400 linhas de emotion que ninguém revisa
```

❌ **Assertar estado interno em vez de comportamento:**
```typescript
expect(component.state.submitting).toBe(true); // ← assere o que o callback recebeu e o que a UI mostra
```

## Regras de ouro

1. **Nenhum teste dentro de `src/`** — vai em `tests/unit/`, espelhando o caminho do fonte. Teste novo já nasce lá.
2. **T3/T4 e T6 têm teste obrigatório**; T0/T1/T2 são opcionais por limitação real de infra.
3. Teste no **mesmo commit** da extração — nunca em lote.
4. `renderWithTheme` copiado por arquivo; não há helper compartilhado hoje (destino: `tests/unit/support/`).
5. Selecione por `data-testid` no padrão `<component-slug>-<part>`.
6. Barra de T3: uma interação + um branch. Barra de T6: todo branch.
7. Nomes em PT-BR; `fireEvent`, não `user-event`.
8. São pins de regressão, **não** coverage — `presentation/` não está em `coverage.include`.
9. **Config de teste é decisão do usuário** — não mexa em `vitest.config.ts` por conta própria.
