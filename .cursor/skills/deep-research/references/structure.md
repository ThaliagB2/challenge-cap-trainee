# Structure — esqueleto canônico do `research.md`

> Template completo, com seções obrigatórias e opcionais, do arquivo `docs/researches/<slug>/research.md`. Use esta estrutura sempre que produzir um research, ajustando a profundidade de cada seção ao modo (Rápido/Padrão/Profundo).

## Princípios de forma

- **PT-BR no corpo**. Termos técnicos consagrados (API, scaffold, repository, MCP) ficam em inglês.
- **Sumário no topo** quando o arquivo passar de 15KB.
- **Tabelas > parágrafos** para comparativos. Bullets > parágrafos para enumerações.
- **Mermaid** para fluxos, arquiteturas e estados. Verificar `mermaid-studio` skill antes (se instalada, delegar).
- **Citações inline** com backticks: `` `path/arquivo.ts:linha` `` ou `[Título](URL)` para web.
- **Cabeçalho hierárquico** começando em `#` no título do doc; seções top-level usam `##`.

## Template

````markdown
# Pesquisa: <Título Descritivo>

> <Resumo em 1-3 linhas do escopo e do propósito da pesquisa.>

| Item | Valor |
|---|---|
| Slug | `<slug>` |
| Data | <YYYY-MM-DD> |
| Modo | Rápido / Padrão / Profundo |
| Consumidor previsto | `tlc-spec-driven` (Specify) / ADR / RFC / informal |
| Fontes utilizadas | Codebase atual + Modelo `<path>` + Web + ... |
| Status | Draft / Final |
| Autor | <agente / humano> |

---

## Sumário

<!-- Obrigatório quando o doc > 15KB. Pode ser gerado manualmente; manter atualizado. -->

1. [Visão geral comparativa](#1-visão-geral-comparativa)
2. [Achados por dimensão](#2-achados-por-dimensão)
3. [Padrões observados](#3-padrões-observados)
4. [Gaps & incógnitas](#4-gaps--incógnitas)
5. [Recomendações como hipóteses](#5-recomendações-como-hipóteses)
6. [Fontes consultadas](#6-fontes-consultadas)
7. [Handoff TLC Spec-Driven](#7-handoff-tlc-spec-driven)

---

## 1. Visão geral comparativa

<!-- OBRIGATÓRIA quando há comparação (codebases modelo vs atual, lib A vs B, padrão antigo vs novo). 
     OPCIONAL quando é mapeamento puro de um único objeto.
     Use UMA TABELA MESTRA que sintetize o "estado do mundo" em uma tela.
-->

| Objeto | Localização | Atributo A | Atributo B | Atributo C |
|---|---|---|---|---|
| <item 1> | `<path>` | ... | ... | ... |
| <item 2> | `<path>` | ... | ... | ... |

### Conclusões iniciais

- <Observação 1 com citação inline.>
- <Observação 2 com citação inline.>
- <Observação 3 com citação inline.>

---

## 2. Achados por dimensão

<!-- Uma subseção por eixo investigado. Eixos típicos:
     - Estrutura de pastas
     - Naming
     - Dependências
     - Convenções de código
     - Testes
     - Build/CI
     - Lint/format
     - Configs específicas do tema
     Adapte os eixos ao escopo. Cada achado deve ter EVIDÊNCIA citada.
-->

### 2.1 <Dimensão 1 — ex.: Estrutura de pastas>

| # | Tipo | Achado | Evidência | Impacto |
|---|---|---|---|---|
| D1 | Divergência | <descrição curta> | `<arquivo:linha>` | <alto/médio/baixo> |
| D2 | Lacuna | <descrição curta> | `<arquivo:linha>` | <alto/médio/baixo> |
| D3 | Padrão consistente | <descrição curta> | `<arquivo:linha>` | <alto/médio/baixo> |

<Texto de apoio quando a tabela não basta. Bullets > parágrafos.>

### 2.2 <Dimensão 2 — ex.: Naming convention>

<idem>

### 2.N <Dimensão N>

---

## 3. Padrões observados

<!-- Recorrências, anti-padrões e débitos detectados que valem destaque. Esta seção é
     a destilação dos achados em "regras de fato" que existem no codebase. -->

### 3.1 Padrões consistentes

- **<Nome do padrão>**: <descrição em 1-2 linhas>. Aparece em `<arquivo1>`, `<arquivo2>`, `<arquivo3>`.
- **<Padrão 2>**: ...

### 3.2 Anti-padrões / débitos

- **<Nome>**: <descrição>. Detectado em `<arquivo>`. Tipo: TODO / `any` / código morto / duplicação.
- **<Anti-padrão 2>**: ...

---

## 4. Gaps & incógnitas

<!-- O que NÃO foi possível responder, e por quê. Esta seção é o oposto da
     fabricação: declare incertezas explicitamente. -->

| # | Pergunta sem resposta | Por que não respondemos | Como descobrir |
|---|---|---|---|
| G1 | <pergunta> | <doc ausente / código não inspecionado / fonte externa indisponível> | <ler X / perguntar a Y / spike de Z> |
| G2 | ... | ... | ... |

---

## 5. Recomendações como hipóteses

<!-- IMPORTANTÍSSIMO: hipóteses, não decisões. A skill deep-research NÃO fecha escopo
     nem aprova abordagem. Decisões saem da Specify (tlc-spec-driven), do RFC ou do ADR. -->

> ⚠️ Esta seção lista hipóteses para a fase Specify avaliar. **Nada aqui é decisão final.**

### H1: <Hipótese curta>
- **Racional**: <por que faz sentido considerar isso>
- **Suportada por**: <achados da seção 2 que apoiam>
- **Riscos**: <o que pode dar errado>
- **Alternativas**: <opções equivalentes que merecem comparação>

### H2: <Hipótese 2>
...

---

## 6. Fontes consultadas

<!-- Bibliografia auditável. Tudo que foi lido durante a pesquisa. -->

### 6.1 Codebase atual

- `<path/arquivo>` — <o que foi extraído>
- ...

### 6.2 Codebase modelo `<nome ou path>`

- `<path/arquivo>` — <o que foi extraído>
- ...

### 6.3 Documentação interna

- `AGENTS.md` (seção X) — <ponto extraído>
- `docs/standards/<file>.md` — <ponto extraído>
- ...

### 6.4 Web

- [<Título da página>](<URL>) — acessado em <YYYY-MM-DD> — <ponto extraído>
- ...

### 6.5 Context7 MCP (quando usado)

- `<lib>@<versão>` — consultado em <YYYY-MM-DD> — <ponto extraído>

---

## 7. Handoff TLC Spec-Driven

<!-- Seção obrigatória sempre. Detalha como esta pesquisa será consumida.
     Ver references/handoff-tlc.md para o template completo. -->

**Próximo passo**: invocar a skill `tlc-spec-driven` → fase **Specify** carregando este `research.md` como contexto base.

### 7.1 Requirements candidatos

| ID provisório | P? | Descrição em 1 linha | Suporte no research |
|---|---|---|---|
| REQ-01 | P1 | <user story candidata> | Seção 2.X, achado DN |
| REQ-02 | P2 | <user story candidata> | Seção 2.Y, achado DM |
| ... | ... | ... | ... |

### 7.2 Gray areas para discutir na Specify

Áreas que a fase Specify precisa **discutir** (não decidir agora):

- **<Tema 1>**: <pergunta aberta para o usuário>. Suporte: seção X.
- **<Tema 2>**: ...

### 7.3 Decisões que merecem ADR/RFC separados

Pontos que não cabem como requirements e devem virar documento de decisão antes da Specify:

- **<Decisão pendente>**: criar **RFC** (decisão em aberto) ou **ADR** (decisão já tomada implicitamente).
- ...

### 7.4 Bibliografia mínima para a Specify carregar

A fase Specify deve carregar (além do spec template):

- Este `research.md`.
- `<arquivo do codebase>` (referência central do padrão).
- `<docs interno>` (constraints/decisões existentes).

---

**Fontes consultadas neste documento:** (replicar resumido da seção 6 quando útil para leitura rápida)
````

## Quais seções são obrigatórias por modo

| Seção | Rápido | Padrão | Profundo |
|---|---|---|---|
| Cabeçalho/tabela meta | obrigatório | obrigatório | obrigatório |
| Sumário (TOC) | opcional | recomendado | obrigatório |
| 1. Visão geral comparativa | só se houver comparação | só se houver comparação | obrigatório |
| 2. Achados por dimensão | obrigatório (1-2 dimensões) | obrigatório (3-5 dimensões) | obrigatório (5+ dimensões) |
| 3. Padrões observados | opcional | obrigatório | obrigatório |
| 4. Gaps & incógnitas | obrigatório | obrigatório | obrigatório |
| 5. Recomendações como hipóteses | opcional | obrigatório | obrigatório |
| 6. Fontes consultadas | resumido | obrigatório detalhado | obrigatório detalhado |
| 7. Handoff TLC Spec-Driven | obrigatório quando consumidor = TLC | obrigatório | obrigatório |

## Variações reconhecidas

Pesquisas mais profundas podem gerar **artefatos auxiliares** ao lado do `research.md`, exatamente como nos exemplos atuais (`docs/researches/organizacao-projeto/`):

- `padroes-a-cobrir.md` — quando o research detecta muitas dimensões e cada uma merece página própria.
- `decisoes-pendentes.md` — quando há tantos pontos abertos que viram um documento separado (linkado a partir do handoff).
- `pontas-soltas.md` — quando há muitos gaps/incógnitas que merecem trackability própria.
- `entendimento-inicial.md` — quando o research é tão grande que vale dividir em "primeira leitura" + "deep dive".

**Regra**: artefatos auxiliares vivem no **mesmo diretório** do `research.md`. Não criar subpastas.
