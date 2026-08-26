---
name: review-implementation
description: Multi-agent reviewer para validar uma implementação local (sem PR) contra a spec, design e tasks no disco. Use APENAS quando o usuário pedir explicitamente uma revisão: "revisa essa implementação", "review da feature X", "valida o que eu fiz", "confere essa feature". NÃO dispara automaticamente durante desenvolvimento ou perguntas gerais.
license: CC-BY-4.0
metadata:
  author: Adaptado de pr-review (Fakeflix)
  version: 1.0.0
  mode: local-no-pr
---

# Review Implementation — Orchestration Protocol

Coordena 6 subagentes especializados (via tool Task) e depois consolida os achados num relatório único em Markdown. Modo **local sem PR**: opera sobre o working copy / staging / diff do branch atual contra um branch base.

Cada subagente carrega os docs de padrões do próprio projeto — esta skill não duplica regras.

---

## Step 1: Initialize

1. **Identificar a feature**: pegar o nome no contexto da conversa ou perguntar ao usuário (ex.: `cap-clean-arch`). Se não houver nome, perguntar.

2. **Localizar a spec da feature**: procurar nessa ordem
   - `docs/specs/features/<feature>/` (estrutura padrão do projeto)
   - `docs/specs/<feature>/`
   - Caso nada exista, perguntar ao usuário onde estão os specs/tasks.

3. **Identificar o escopo do diff** (modo local):
   - Detectar branch base (default: `main`; fallback `master`, `develop`):
     ```bash
     git remote show origin | sed -n '/HEAD branch/s/.*: //p' || echo main
     ```
   - Coletar o diff completo da feature:
     ```bash
     git diff --no-color {BASE_BRANCH}...HEAD                  # commits do branch atual
     git diff --no-color                                       # working tree não-staged
     git diff --no-color --cached                              # staged
     git ls-files --others --exclude-standard                  # untracked files
     ```
   - Consolidar tudo em um único "diff lógico" para os subagentes. Para arquivos untracked, tratar o conteúdo inteiro como linhas `+`.
   - Listar arquivos afetados:
     ```bash
     git diff --name-only {BASE_BRANCH}...HEAD; git diff --name-only; git diff --name-only --cached; git ls-files --others --exclude-standard
     ```

4. **Carregar os docs do projeto** (uma vez, no orquestrador, para passar aos subagentes):
   - `docs/coding-patterns.md` — padrões de código transversais
   - `docs/integration-patterns.md` — segurança, I/O, integrações
   - Outros docs em `docs/` cujo nome bata com o domínio da feature

5. **Não há comentários inline existentes para dedup** (modo local). Pular o passo de "skip duplicates" do original.

---

## Step 2: Launch Subagents in Parallel

Enviar **uma única mensagem** com **seis chamadas paralelas da tool Task** — todas disparadas simultaneamente. Passar para cada subagente:

- `FEATURE_NAME`
- `BASE_BRANCH`
- `SPEC_DIR` (caminho da pasta `docs/specs/features/<feature>/`)
- O diff consolidado
- A lista de arquivos afetados
- Os docs já carregados (ou os caminhos)
- O caminho do output do subagente: `.review-results/<feature>/<agent>.md`

Cada subagente **escreve** seu relatório em Markdown no arquivo indicado em vez de postar inline. Depois que todos terminam, rodar Step 3.

---

## Severity Labels (todos os subagentes usam essas)

- 🚨 Critical — bugs ou erros de lógica que vão causar falhas
- 🔒 Security — vulnerabilidades de segurança ou exposição de dados
- ⚡ Performance — preocupações significativas de performance
- ⚠️ Warning — code smells ou problemas de manutenção
- 💡 Suggestion — melhorias opcionais

---

## Universal Rules (todo subagente deve seguir)

1. **Escopo de comentário:** Só comentar sobre linhas do diff que começam com `+` (excluindo `+++`). Para arquivos untracked, todo conteúdo conta como `+`.
2. **False positive guard:** Só reportar achados com confiança ≥ 80%. Pular quando incerto.
3. **Positive highlight:** Incluir pelo menos um aspecto bem feito antes de listar problemas.
4. **Tom:** Específico, acionável, colegial. Explicar **por quê** algo é problema.
5. **Nunca** modificar arquivos do projeto. Só escrever no próprio relatório em `.review-results/<feature>/<agent>.md`.
6. **Marker no relatório:** Começar o arquivo com `<!-- review:{type} -->` (usado pela consolidação).
7. **Formato do arquivo de relatório:** Markdown com header de seções por arquivo do diff. Cada finding é uma entrada com:
   - Path + número de linha (do arquivo no working tree, não do diff)
   - Severidade
   - Título curto
   - Descrição (cite o trecho ofensivo)
   - Recomendação concreta

8. **Second pass obrigatório:** Cada subagente faz uma releitura completa do diff. Para cada arquivo/hunk que não comentou, deve declarar explicitamente por que está limpo (ou voltar e comentar).

---

## Subagent 1: Security

**Marker:** `<!-- review:security -->`
**Output:** `.review-results/<feature>/security.md`

Carregar `docs/integration-patterns.md` (foco na seção **Security**). Revisar o diff procurando violações dos padrões de segurança ali listados:

- Segredos hardcoded (tokens, API keys, senhas, PATs)
- Falta de validação de input em fronteiras (handlers, endpoints, tool args)
- PII em logs
- Logs ou stdout escrevendo dados que deveriam ficar em stderr (quebra protocolo / vaza informação)
- Caminhos de arquivo sem `path.resolve` ou validação (path traversal)
- Imports relativos pulando boundaries do alias `@/`
- Tokens literais em config files (ex.: `~/.npmrc` com token cru) em vez de `${VAR_ENV}`
- Webhook/handler sem validação de assinatura quando aplicável
- CORS permissivo demais (quando houver HTTP)
- Concatenação de query strings / SQL sem parametrização

**Second pass:** Reler o diff inteiro. Para cada arquivo não comentado, declarar explicitamente por que está limpo do ponto de vista de segurança.

**Formato de finding no relatório:**
```markdown
### 🔒 [Título curto] — `path/file.ts:LN`

[Descrição do problema e por que importa.]

**Trecho:**
```
[código ofensivo]
```

**Recomendação:** [Fix específico]
```

---

## Subagent 2: Requirements & Definition of Done

**Marker:** `<!-- review:requirements -->`
**Output:** `.review-results/<feature>/requirements.md`
**Posta:** apenas o relatório consolidado (não cria findings inline por arquivo).

### Track A — Spec File (sempre disponível em modo local)

1. Ler `<SPEC_DIR>/spec.md` na íntegra.
2. Extrair:
   - Acceptance criteria de cada User Story (`WHEN ... THEN ... SHALL ...`)
   - Edge cases
   - Tabela de **Requirement Traceability** (IDs como `CAP-01`, `FEAT-12` etc.)
   - Success Criteria

### Track B — Tasks File

1. Ler `<SPEC_DIR>/tasks.md`.
2. Extrair cada task com:
   - ID (T1, T2, ...)
   - Acceptance criteria da task
   - Requirement ID que ela cobre (campo `Requirement:`)
3. Cruzar tasks ↔ requirements para detectar gaps de cobertura.

### Track C — Design File (opcional)

Se `<SPEC_DIR>/design.md` existir, ler para entender quais components/integration points foram planejados. Útil para detectar "implementação divergente do design" (entra como ⚠️ Warning, não bloqueador).

### Resolution Logic

| Tracks com conteúdo | Ação |
|---|---|
| spec + tasks | Avaliar cada requirement e cada task contra o diff |
| spec apenas | Avaliar requirements; alertar que tasks.md não foi encontrado |
| tasks apenas | Avaliar tasks; alertar que spec.md não foi encontrado |
| Nenhum | Escrever `⚠️ Sem spec/tasks encontrados em <SPEC_DIR> — verificação de requisitos pulada.` e parar |

Comparar requirements + tasks contra o diff e escrever o relatório em `.review-results/<feature>/requirements.md`.

**Second pass:** Depois de escrever o resumo, reler a lista completa de requirements **um por um** e perguntar: "Avaliei este critério contra o diff?" Para qualquer item não avaliado, achar a seção relevante e marcar ✅ / ❌ / 🔲.

**Formato do relatório:**
```markdown
<!-- review:requirements -->
# 📋 Requirements Review — <feature>

**Fontes:**
- Spec: `<SPEC_DIR>/spec.md`
- Tasks: `<SPEC_DIR>/tasks.md`
- Design: `<SPEC_DIR>/design.md` (se existir)

## Cobertura por Requirement ID

| ID | Status | Evidência no diff |
|---|---|---|
| FEAT-01 | ✅ Implemented | `src/foo.ts:42-58` — implementa `bar()` conforme acceptance criteria 1 |
| FEAT-02 | ❌ Missing | Não encontrado em nenhum arquivo do diff |
| FEAT-03 | 🔲 Partial | `src/baz.ts:10` cobre o happy path mas falta error handling do AC#3 |

## ✅ Implementado
- [FEAT-01] ...
- [FEAT-04] ...

## ❌ Faltando ou Incompleto
- [FEAT-02] ...
- [FEAT-03] (parcial) ...

## 🔲 Definition of Done (Success Criteria da spec)
- [x] Quality gate verde (verificável)
- [ ] Cobertura ≥ X% — não foi possível verificar pelo diff; rodar `yarn test:coverage`
- [x] ...

## Coverage de Tasks ↔ Requirements
- Tasks completas neste diff: T1, T2, T3
- Tasks com requirement mas sem código no diff: T7 (requirement FEAT-02)
- Requirements sem task associada: nenhum

## 💬 Notas
[Observações livres sobre divergências do design, decisões de escopo, etc.]
```

---

## Subagent 3: Test Coverage

**Marker:** `<!-- review:tests -->`
**Output:** `.review-results/<feature>/tests.md`

Carregar `docs/coding-patterns.md` (seção **Testing**). Usar esses padrões como referência do que é um teste correto neste projeto.

Revisar o diff procurando:

- **🚨 Critical** — código de produção novo (handlers, generators, services, módulos puros) sem teste correspondente
- **⚠️ Warning** — testes existem mas:
  - Localização errada (não espelha a estrutura de `src/` em `test/unit/`)
  - Falta cleanup de mocks (`vi.clearAllMocks()` no `beforeEach` quando há `vi.mock`)
  - Usa imports relativos em vez do alias `@/`
  - Não testa edge cases listados na spec
- **💡 Suggestion** — anti-patterns:
  - IDs hardcoded sem factory/fixture
  - Asserções fracas (só `toBeDefined()` ou `toBeTruthy()`)
  - Mock retornando dados que não refletem o tipo real
  - Falta asserção sobre o conteúdo da resposta, só sobre o status

**Second pass:** Reler o diff. Listar cada arquivo novo ou modificado em `src/`. Para cada um, perguntar: "Existe um teste correspondente em `test/unit/` cobrindo o happy path **e** pelo menos um caso de erro listado nos edge cases da spec?" Só pular um arquivo quando puder declarar explicitamente por que cobertura existe ou não se aplica (ex.: pure type file, barrel export).

**Formato de finding:**
```markdown
### [🚨/⚠️/💡] [Título] — `src/path/file.ts`

[Descrição da gap ou anti-pattern]

**Recomendação:** [Padrão do `docs/coding-patterns.md` Testing section ou link específico]
```

---

## Subagent 4: Architecture & Coding Patterns

**Marker:** `<!-- review:architecture -->`
**Output:** `.review-results/<feature>/architecture.md`

### Phase 0 — Carregar todos os docs de referência

Carregar **todos** estes antes de tocar no diff:

1. `docs/coding-patterns.md`
2. `docs/integration-patterns.md`
3. `<SPEC_DIR>/design.md` (se existir — descreve a arquitetura **planejada** desta feature; serve como referência adicional)

### Phase 1 — Extrair a matriz de regras dos docs carregados

**Não usar lista hardcoded.** Depois de carregar os docs, escanear cada um e extrair toda regra explícita para um único checklist numerado. Por documento:

- **`coding-patterns.md`** — toda regra marcada `✅` ou `❌` em cada seção
- **`integration-patterns.md`** — toda regra marcada `✅` ou `❌`, e cada item nas seções "Rules" ou "Checklist"
- **`design.md`** (se existir) — extrair as decisões da seção **Architecture Overview**, **Components** e **Integration Points** que afirmem invariantes (ex.: "única ponte com `fs` é `tool-executor.ts`", "generators puros sem efeito colateral", "alias `@/` obrigatório")

Numerar a lista combinada sequencialmente a partir de 1. Essa lista é a matriz de avaliação para a Phase 2. Não adicionar regras que não estão nos docs nem omitir nenhuma encontrada.

### Phase 2 — Avaliar a matriz

Trabalhar o diff **um arquivo por vez**. Para cada arquivo:

- Para cada regra da Phase 1, decidir: **PASS** / **VIOLATION** / **N/A**
- N/A só vale quando a regra é estruturalmente inaplicável (ex.: regra de "transação" em arquivo de tipo puro; regra de "stderr only" em arquivo de teste)
- Para cada VIOLATION: anotar no relatório a linha exata do `+` que é a evidência. Incluir o número da regra e o doc fonte.

**Second pass:** Depois de completar a matriz para todos os arquivos, reler o diff inteiro. Listar arquivos/hunks não avaliados. Para qualquer um descoberto, rodar a matriz de novo. Só pular um arquivo quando puder afirmar explicitamente quais regras são N/A e por quê.

**Formato de finding:**
```markdown
### [🚨/⚠️/💡] [Título] — `path/file.ts:LN`

**Regra:** [Número da regra + doc, ex.: "Regra 8 — coding-patterns.md §Imports"]

**Trecho ofensivo:**
```
[linha exata]
```

**Recomendação:** [Fix exato; snippet curto se < 6 linhas]
```

---

## Subagent 5: Regression & Hallucination Detection

**Marker:** `<!-- review:regression -->`
**Output:** `.review-results/<feature>/regression.md`

Revisar o diff procurando mudanças não relacionadas ao propósito da feature, ou artefatos típicos de geração por LLM. Procurar:

- **🚨 Critical** — código deletado sem relação com a feature (ex.: PR é "adicionar generator X" mas removeu lógica de Y)
- **🚨 Critical** — phantom imports referenciando símbolos inexistentes (ex.: `import { foo } from '@/main/utils/x.js'` quando `x.js` não existe)
- **🚨 Critical** — chamadas de método com assinatura errada (parâmetros a mais/menos, tipos errados)
- **⚠️ Warning** — `TODO`, `FIXME`, `XXX` deixados em código de produção
- **⚠️ Warning** — type assertions (`as any`, `as unknown as X`, `!`) escondendo erros do compilador
- **⚠️ Warning** — lógica duplicada que já existe no módulo (procurar funções/utilities com nome similar antes de criar nova)
- **⚠️ Warning** — error handling enfraquecido (catch silencioso, `catch (e) {}`, swallowing de exceções)
- **⚠️ Warning** — asserções de teste enfraquecidas (mudou de `toBe(specific)` para `toBeTruthy()` sem justificativa)
- **💡 Suggestion** — dead code que não é chamado por nada (verificar com grep no diff inteiro)
- **💡 Suggestion** — função `console.log` sobrevivendo em código de produção (especialmente em STDIO MCPs, onde quebra o protocolo)

**Second pass:** Reler o diff. Para cada arquivo não comentado, declarar por que nenhuma categoria acima se aplica.

**Formato de finding:**
```markdown
### [🚨/⚠️/💡] [Título] — `path/file.ts:LN`

**Tipo:** [unrelated-deletion | phantom-import | hallucination | duplicate | regression | dead-code | console-log]

[Descrição com evidência citada do diff]

**Recomendação:** [Fix exato]
```

---

## Subagent 6: Performance

**Marker:** `<!-- review:performance -->`
**Output:** `.review-results/<feature>/performance.md`

Carregar `docs/coding-patterns.md` (seções relevantes a performance: I/O, loops, queries, async). Só flaggar issues **claramente visíveis no diff** — sem especulação.

Procurar:

- N+1 pattern (lookup dentro de loop)
- I/O síncrono em loop (ex.: `writeFileSync` num `for` quando poderia ser batch)
- Sequential `await` para operações independentes que poderiam usar `Promise.all`
- Allocations grandes desnecessárias (concatenação string em loop em vez de array.join)
- Regex compilado dentro de loop em vez de fora
- Falta de cache para computação repetida com input idêntico
- JSON parsing/stringify de objetos enormes sem streaming

**Second pass:** Reler o diff. Listar cada método de serviço, repository call e loop não comentado. Para cada bloco, perguntar: "Contém algum issue de performance claramente visível?" Só pular quando puder afirmar explicitamente por que nenhum dos patterns acima se aplica.

**Formato de finding:**
```markdown
### ⚡ [Título] — `path/file.ts:LN`

[Descrição com impacto estimado, ex.: "O(N) writes síncronos por chamada"]

**Recomendação:** [Fix com sketch curto se < 6 linhas]
```

---

## Step 3: Consolidation

Depois que todos os 6 subagentes terminam, o orquestrador (não outro subagente) faz a consolidação local:

1. Ler todos os arquivos em `.review-results/<feature>/`:
   - `security.md`
   - `requirements.md`
   - `tests.md`
   - `architecture.md`
   - `regression.md`
   - `performance.md`

2. Parsear cada arquivo extraindo:
   - Severidade
   - Path + linha
   - Título
   - Marker do subagente

3. **Agrupar por severidade:** 🔒 Security → 🚨 Critical → ⚡ Performance → ⚠️ Warning → 💡 Suggestion.

4. **Deduplicar:** Findings no mesmo `{path, line}` (±3 linhas) viram uma entrada só, citando todos os subagentes que reportaram.

5. **Coletar um highlight positivo** de cada subagente.

6. **Gap detection:**
   - Pegar a lista de arquivos afetados (já computada no Step 1).
   - Cross-reference contra todos os paths citados nos findings.
   - Para qualquer arquivo sem findings, adicionar à seção `### 🔍 Files Without Findings`.
   - Omitir desta seção: arquivos de config/lock (`*.json`, `*.yaml`, `*.lock`, `*.toml`), arquivos puros de tipo sem lógica, snapshots de teste.

7. **Escrever o relatório consolidado** em `.review-results/<feature>/SUMMARY.md`.

**Formato do relatório consolidado:**
```markdown
# 🤖 Review Summary — <feature>

| | |
|---|---|
| **Feature** | <feature> |
| **Branch base** | <base_branch> |
| **Modo** | Local (sem PR) |
| **Subagentes invocados** | 6 (Security · Requirements · Tests · Architecture · Regression · Performance) |
| **Docs carregados** | `docs/coding-patterns.md`, `docs/integration-patterns.md`, `<SPEC_DIR>/{spec,design,tasks}.md` |
| **Arquivos no diff** | N |
| **Findings totais** | M |

---

## 📋 Requirements Coverage

[Cópia da tabela de cobertura por Requirement ID do relatório do Subagent 2]

---

## 🔒 Security ({N})
- [`path/file.ts:L42`] [security] Título do finding
- ...

## 🚨 Critical ({N})
- [`path/file.ts:L10`] [architecture, regression] Título — reportado por dois subagentes
- ...

## ⚡ Performance ({N})

## ⚠️ Warnings ({N})

## 💡 Suggestions ({N})

---

## 🔍 Files Without Findings
- `path/to/file.ts` — sem findings de nenhum subagente (verificar manualmente ou rodar review focado)

_(Omitir esta seção quando todos os arquivos de lógica receberam pelo menos um finding.)_

---

## ✅ Highlights
- **Security:** [Highlight do Subagent 1]
- **Requirements:** [Highlight do Subagent 2]
- **Tests:** [Highlight do Subagent 3]
- **Architecture:** [Highlight do Subagent 4]
- **Regression:** [Highlight do Subagent 5]
- **Performance:** [Highlight do Subagent 6]

---

## Próximos passos sugeridos

1. Resolver primeiro: 🔒 Security e 🚨 Critical
2. Atender requirements ❌ Missing antes de seguir
3. Rodar `yarn qualityGate` (ou equivalente) localmente
4. Verificar manualmente os arquivos sem findings

> Veja os relatórios detalhados em `.review-results/<feature>/{security,requirements,tests,architecture,regression,performance}.md`
```

8. Se **zero findings** em todos os subagentes: ainda escrever o SUMMARY.md com a metadata table e a linha `✅ Nenhum issue encontrado nas seis dimensões de revisão.`

---

## Notas operacionais

- **Diretório de saída:** `.review-results/<feature>/` é onde a skill grava tudo. Adicionar `.review-results/` ao `.gitignore` se ainda não estiver lá.
- **Sem rede:** Esta skill não precisa de `gh`, GitHub API, ou Jira. Tudo é local.
- **Re-runs:** Apagar `.review-results/<feature>/` antes de rodar de novo, ou a skill faz isso no Step 1 (perguntar ao usuário se sobrescreve).
- **Quando NÃO usar:** Durante implementação ativa (a skill assume que a feature está "pronta para conferência"). Durante reviews casuais de uma função específica (use leitura direta de código).
