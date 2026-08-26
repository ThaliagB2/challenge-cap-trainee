---
name: deep-research
description: Realiza pesquisas exploratórias profundas e robustas como insumo para a fase Specify do TLC Spec-Driven. Combina três fontes — codebase atual, codebases modelo (referência) e web — para consolidar um relatório versionado em `docs/researches/<slug>/`. Use quando o usuário disser "preciso pesquisar", "fazer uma pesquisa", "research", "investigar antes de especificar", "mapear como X funciona hoje", "comparar nossa stack com Y", "entender padrão", "estudar tema", ou antes de iniciar uma feature nova/ambígua que demande embasamento. NÃO use para escrever especificação funcional (use tlc-spec-driven), decisões fechadas (use create-adr), propostas em aberto (use create-rfc) ou crítica de planos (use the-fool).
license: CC-BY-4.0
metadata:
  author: Numen DS
  version: '1.0.0'
---

# Deep Research

Skill de pesquisa exploratória profunda. Produz um relatório consolidado em `docs/researches/<slug>/research.md` (PT-BR) com qualidade suficiente para alimentar diretamente a fase **Specify** da skill [`tlc-spec-driven`](../tlc-spec-driven/SKILL.md).

> Filosofia: pesquisa é insumo, não decisão. Esta skill **mapeia, compara e evidencia** — nunca recomenda implementação nem fecha escopo. Recomendações vão para o handoff final como hipóteses, não como verdades.

## Quando usar

- Antes de uma feature nova/ambígua que exija embasamento factual.
- Para mapear um padrão existente na codebase (legacy ou referência) antes de replicá-lo/substituí-lo.
- Para comparar abordagens (nossa stack vs alternativas, lib A vs B, padrão antigo vs novo).
- Para investigar um tema desconhecido (nova API, novo protocolo, nova lib) antes de desenhar.
- Para consolidar tribal knowledge espalhado em vários repositórios/docs em um único documento navegável.

Não use para:

- Escrever especificação funcional → `tlc-spec-driven` (fase Specify).
- Registrar decisão já tomada → `create-adr`.
- Propor decisão ainda em aberto com prós/contras formais → `create-rfc`.
- Stress-test/red-team de um plano pronto → `the-fool`.
- Auditar implementação após PR → `review-implementation`.

## Princípios

1. **Idioma**: todo o output (research.md, prompts, transcrições, sumário) em **PT-BR**. Termos técnicos consagrados ficam em inglês (API, scaffold, repository, etc.).
2. **Citações sempre**: toda afirmação não-trivial cita a fonte (arquivo + linha para código local, URL para web, "transcrição #N" para conversas humanas).
3. **Nunca fabricar**: se não encontrar resposta nas fontes disponíveis, escrever literalmente "Não encontrei evidência para X — verificar com [pessoa/doc]". Falha de busca > invenção.
4. **Maleabilidade de fontes**: a skill se adapta ao tipo de pesquisa (ver [`references/sources.md`](references/sources.md)). Pode usar 1, 2 ou as 3 fontes em paralelo.
5. **Output estruturado**: o `research.md` segue o template em [`references/structure.md`](references/structure.md), pensado para ser consumido pela fase Specify do `tlc-spec-driven`.
6. **Snapshot reproduzível**: documentos da web são parafraseados com URL + data; trechos de código são citados por path:linha + commit/branch quando disponível.
7. **Sem código de implementação**: o research **descreve** padrões e mostra trechos curtos como evidência, mas **não escreve** componentes prontos. Isso é trabalho da fase Execute.

## Cadeia de verificação de conhecimento

Igual à do `tlc-spec-driven` — segue na ordem estrita, nunca pula etapas:

```
1. Codebase atual   → arquivos, padrões e convenções já em uso aqui
2. Codebase modelo  → repositórios de referência indicados pelo usuário (legacy, monorepo irmão, outro time)
3. Docs do projeto  → README, AGENTS.md, docs/, comentários, ADR/RFC, STATE.md
4. Context7 MCP     → resolver lib → API/padrões atuais (quando disponível)
5. Web search       → docs oficiais, fontes reputadas, padrões da comunidade
6. Flag como incerto → "Não tenho certeza sobre X — aqui está meu raciocínio, mas verifique"
```

- Nunca pular para a etapa 6 se 1–5 estiverem disponíveis.
- Etapa 6 é **sempre** marcada como incerta — nunca apresentada como fato.

## Workflow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 1. ESCOPO    │ → │ 2. COLETA    │ → │ 3. SÍNTESE   │ → │ 4. HANDOFF   │
│  + PROMPT    │   │  (paralela)  │   │  (research)  │   │  (TLC ready) │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
   required           required           required           required
```

### Fase 1 — Escopo + Prompt (sempre)

**Objetivo**: capturar o que o usuário quer pesquisar, com qual profundidade e quais fontes usar.

1. Detectar slug da pesquisa (snake-case curto, kebab-case ou em PT-BR sem acentos: `cap-clean-arch`, `organizacao-projeto`, `auth-strategy`).
2. Criar diretório:

   ```
   docs/researches/<slug>/
   ├── prompts/<slug>.md      # ⬅ briefing inicial (verbatim do usuário se possível)
   └── transcricoes/          # ⬅ vazio inicialmente; preencher em iterações multi-sessão
   ```

3. Usar `AskQuestion` quando o usuário não trouxer todo o contexto. Perguntas-chave:

   - **Tema/objetivo**: o que você quer entender? (campo aberto)
   - **Fontes a usar**: codebase atual / codebases modelo (quais paths?) / web / combinação
   - **Profundidade**: rápida (1-3h, ~5KB) / média (1 sessão, ~20KB) / profunda (multi-sessão, 40KB+)
   - **Saída final será consumida por**: Specify TLC / ADR / RFC / decisão pessoal
   - **Restrições**: temas/áreas a ignorar, prazo, formato preferido

   Veja templates de perguntas em [`references/sources.md`](references/sources.md).

4. **Verbatim do usuário**: se ele colar um briefing pronto, salvar **palavra por palavra** em `prompts/<slug>.md` sem editar. Esse arquivo é histórico — não é o research.

### Fase 2 — Coleta (paralela quando possível)

**Objetivo**: extrair evidência bruta de cada fonte ativada.

Para cada fonte, delegar a um sub-agente (ferramenta `Task` ou equivalente) quando o volume justificar — mantém o contexto principal enxuto. Ver [`references/sources.md`](references/sources.md) para o playbook completo de cada fonte.

**Resumo por fonte:**

| Fonte | Tooling preferido | O que extrair |
|---|---|---|
| Codebase atual | Glob + Grep + Read | estrutura de pastas, padrões, convenções, naming, dependências, lints, configs, scripts |
| Codebase modelo | Glob + Grep + Read (path absoluto) | mesmas categorias da atual, com foco em **divergências** vs atual |
| Docs do projeto | Read em AGENTS.md, README.md, docs/, docs/specs/ | decisões já tomadas, history, débito conhecido |
| Web | `WebSearch` + `WebFetch` (paráfrase obrigatória) | API oficial, releases, comparativos, posts reputados |
| Context7 MCP | `resolve-library-id` + `get-library-docs` | API atualizada de libs específicas (quando relevante) |

**Regras de coleta:**

- Toda evidência é guardada com **path + linha** (código) ou **URL + data** (web).
- Quando o usuário aponta um path modelo (ex.: `/home/.../numen-mro/backend/.../eslint.config.mjs`), tratar como **leitura obrigatória** — não inferir.
- Quando uma área é vasta (>50 arquivos), delegar a sub-agente com instrução clara sobre o que mapear; sub-agente devolve apenas o sumário.
- Multi-sessão: salvar transcrição/diálogo iterativo em `transcricoes/N.descricao.md` (ex.: `1.inicial.md`, `2.ajustes.md`).

### Fase 3 — Síntese (sempre)

**Objetivo**: consolidar a evidência bruta em `docs/researches/<slug>/research.md`, no formato consumível pela fase Specify do `tlc-spec-driven`.

Usar o template completo de [`references/structure.md`](references/structure.md). Seções obrigatórias:

1. **Cabeçalho** com slug, data, escopo em 1 frase, status (Draft/Final).
2. **Visão geral comparativa** (quando há comparação) — tabela mestra que sintetiza o "estado do mundo".
3. **Achados por dimensão** — uma seção por eixo investigado, com evidência citada.
4. **Padrões observados** — recorrências, anti-padrões, débitos detectados.
5. **Gaps & incógnitas** — o que NÃO foi possível responder (e por quê).
6. **Recomendações como hipóteses** — sem decidir; sugerir caminhos para a Specify avaliar.
7. **Fontes consultadas** — bibliografia auditável (arquivos lidos, URLs, paths modelo).
8. **Handoff para TLC Spec-Driven** — checklist explícito de o que está pronto para virar requirement (ver [`references/handoff-tlc.md`](references/handoff-tlc.md)).

**Tamanho**: o `research.md` pode ser longo (referências reais no repo têm 20-60KB). Use sumário no topo, índice clicável e seções autocontidas. Prefira tabelas a parágrafos.

### Fase 4 — Handoff (sempre)

**Objetivo**: deixar o research "TLC-ready" para a próxima skill consumir sem fricção.

1. Adicionar ao final do `research.md` uma seção `## Handoff TLC Spec-Driven` seguindo o template em [`references/handoff-tlc.md`](references/handoff-tlc.md). Esta seção lista:

   - Pontos prontos para virar requirements (P1/P2/P3 candidatos).
   - Gray areas que a Specify precisará discutir.
   - Decisões pendentes que valem ADR/RFC separados antes da Specify.
   - Bibliografia mínima que a Specify deve carregar.

2. Verificar checklist de qualidade (ver final deste arquivo).
3. Imprimir um one-liner ao final da sessão indicando o próximo passo natural:

   ```
   Research consolidado em docs/researches/<slug>/research.md.
   Próximo passo sugerido: `tlc-spec-driven` fase Specify, carregando este research como contexto base.
   ```

## Estrutura de pastas produzida

```
docs/researches/
└── <slug>/
    ├── prompts/
    │   └── <slug>.md          # briefing verbatim do usuário (histórico)
    ├── transcricoes/
    │   ├── 1.inicial.md       # iteração 1 (opcional, multi-sessão)
    │   └── 2.ajustes.md       # iteração N (opcional)
    └── research.md            # ⭐ entrega consolidada (PT-BR)
```

- `prompts/` e `transcricoes/` são opcionais para pesquisas rápidas (≤5KB). O `research.md` é o único arquivo **obrigatório**.
- Quando a pesquisa é longa o suficiente para gerar artefatos secundários (ex.: `padroes-a-cobrir.md`, `decisoes-pendentes.md`, `pontas-soltas.md`), salvá-los **ao lado** do `research.md` no mesmo diretório (não criar subpastas).

## Modos de pesquisa (auto-size)

A skill se ajusta ao escopo. Use o mesmo princípio do `tlc-spec-driven`:

| Modo | Quando usar | Saída |
|---|---|---|
| **Rápido** | Dúvida pontual, 1 fonte, ≤3 perguntas claras | `research.md` único, ≤5KB, sem prompts/ ou transcricoes/ |
| **Padrão** | Feature média, 2 fontes, 1 sessão | `research.md` (10-25KB) + `prompts/<slug>.md` |
| **Profundo** | Migração/refatoração/nova stack, 3+ fontes, multi-sessão | `research.md` (30KB+) + `prompts/` + `transcricoes/` + artefatos auxiliares |

**Regra de bolso**: se o usuário menciona "TLC Spec-Driven", "Specify", "vai virar feature" → assumir mínimo modo Padrão.

## Integrações com outras skills

| Skill | Quando se cruza com Deep Research |
|---|---|
| [`tlc-spec-driven`](../tlc-spec-driven/SKILL.md) | Consumidor primário. O `research.md` alimenta `spec.md` (Problem Statement, Out of Scope, decisões iniciais). |
| [`the-fool`](../the-fool/SKILL.md) | Use **depois** do research e **antes** da Specify para stress-testar as hipóteses listadas no handoff. |
| [`create-rfc`](../create-rfc/SKILL.md) | Quando o research detectar decisão em aberto com 2+ opções equivalentes, gerar um RFC ao invés de empurrar para Specify. |
| [`create-adr`](../create-adr/SKILL.md) | Quando o research apenas **descobrir** uma decisão já tomada implicitamente (ex.: STDIO em todos os novos MCPs), registrar como ADR retroativo. |

## Sub-agentes

Para pesquisas profundas, **delegar coleta a sub-agentes em paralelo** mantém o contexto principal lean. Padrão:

- 1 sub-agente por fonte (ex.: "mapeia codebase atual", "mapeia codebase modelo X", "consulta web sobre tema Y").
- Cada sub-agente recebe: escopo específico, output esperado (sumário com citações), e tamanho-alvo.
- Sub-agente devolve **apenas o sumário com citações**, não o conteúdo bruto.
- Agente principal sintetiza no `research.md`.

## Checklist de qualidade (rodar antes de fechar)

Antes de declarar o research pronto:

### Conteúdo
- [ ] Toda afirmação não-trivial tem citação (arquivo:linha ou URL+data).
- [ ] Gaps & incógnitas estão explícitos (não maquiados).
- [ ] Recomendações estão como **hipóteses**, não como decisões.
- [ ] Nenhum trecho fabricado (especialmente em APIs de libs).
- [ ] Web search marcou tudo como incerto/verificar.

### Forma
- [ ] PT-BR no corpo; termos técnicos em inglês quando consagrados.
- [ ] Sumário/índice no topo (TOC) quando >15KB.
- [ ] Tabelas usadas para comparativos (preferíveis a parágrafos).
- [ ] Mermaid usado para fluxos quando aplicável.

### Handoff
- [ ] Seção `## Handoff TLC Spec-Driven` presente.
- [ ] Lista P1/P2/P3 candidatos preenchida.
- [ ] Gray areas listadas para a fase discuss da Specify.
- [ ] Decisões pendentes apontadas (ADR/RFC se aplicável).

### Repositório
- [ ] `research.md` salvo em `docs/researches/<slug>/`.
- [ ] `prompts/<slug>.md` salvo com verbatim do usuário (modos Padrão/Profundo).
- [ ] Slug é único (verificar `ls docs/researches/`).
- [ ] Convenção de naming consistente (mesmo slug para futura feature em `docs/specs/features/<slug>/`).

## Referências

- [`references/sources.md`](references/sources.md) — playbook por fonte (codebase atual, modelo, web, MCP, docs).
- [`references/structure.md`](references/structure.md) — template completo do `research.md` com seções obrigatórias e opcionais.
- [`references/templates.md`](references/templates.md) — templates curtos: tabela comparativa, achado-por-dimensão, fonte consultada.
- [`references/handoff-tlc.md`](references/handoff-tlc.md) — seção de handoff e como o research vira insumo de `spec.md`.
