# Sources — playbook de coleta por fonte

> Como a `deep-research` extrai evidência de cada tipo de fonte. Use isto como guia operacional na **Fase 2 (Coleta)**.

## Escopo + perguntas de abertura (Fase 1)

Quando o usuário não trouxer todo o contexto, use `AskQuestion` com este conjunto base. Adapte conforme o tema.

```json
{
  "title": "Escopo da pesquisa",
  "questions": [
    {
      "id": "tema",
      "prompt": "Em uma frase, qual é o objetivo desta pesquisa?",
      "options": [
        { "id": "free_text", "label": "Vou descrever abaixo" }
      ]
    },
    {
      "id": "fontes",
      "prompt": "Quais fontes devo usar? (pode marcar mais de uma)",
      "allow_multiple": true,
      "options": [
        { "id": "codebase_atual", "label": "Codebase atual deste repo" },
        { "id": "codebase_modelo", "label": "Codebase(s) modelo (vou indicar o path)" },
        { "id": "web", "label": "Web (docs oficiais, posts, comparativos)" },
        { "id": "context7", "label": "Context7 MCP (API atual de libs específicas)" },
        { "id": "docs_projeto", "label": "Documentação interna (AGENTS.md, README, docs/, docs/specs/)" }
      ]
    },
    {
      "id": "profundidade",
      "prompt": "Qual a profundidade desejada?",
      "options": [
        { "id": "rapido", "label": "Rápido — dúvida pontual (~5KB, sem prompts/transcricoes)" },
        { "id": "padrao", "label": "Padrão — feature média (1 sessão, ~20KB)" },
        { "id": "profundo", "label": "Profundo — migração/refactor (multi-sessão, 40KB+)" }
      ]
    },
    {
      "id": "consumidor",
      "prompt": "A saída final será consumida por...",
      "options": [
        { "id": "tlc_spec", "label": "tlc-spec-driven (fase Specify)" },
        { "id": "adr", "label": "ADR (registrar decisão já tomada)" },
        { "id": "rfc", "label": "RFC (decisão em aberto)" },
        { "id": "pessoal", "label": "Uso pessoal / decisão informal" }
      ]
    }
  ]
}
```

**Quando pular o `AskQuestion`**: se o usuário já trouxer briefing detalhado (tema + fontes + path modelo + consumidor), ir direto para a Fase 2 e capturar o briefing verbatim em `prompts/<slug>.md`.

---

## Fonte 1 — Codebase atual

**Objetivo**: mapear como o tema X é feito **hoje neste repositório**.

**Tooling**:

- `Glob` para descobrir arquivos por padrão (`**/*.config.{ts,js,mjs}`, `**/*.test.ts`).
- `Grep` para localizar símbolos, padrões, decoradores (preferir a `find`/`rg` direto).
- `Read` para inspecionar arquivos relevantes; usar `offset`/`limit` em arquivos grandes (>500 linhas).
- `SemanticSearch` (quando disponível) para perguntas de comportamento ("onde validamos token?").

**O que extrair** (checklist genérico — adaptar ao tema):

- [ ] Estrutura de pastas relevante ao tema (até 3 níveis).
- [ ] Convenções de naming (arquivos, classes, funções, símbolos exportados).
- [ ] Dependências usadas (`package.json`, lockfile, configs).
- [ ] Configs/scripts pertinentes (eslint, tsconfig, vitest, scripts npm).
- [ ] Padrões repetidos (3+ ocorrências = padrão; 1 = exceção).
- [ ] Anti-padrões/débitos (TODOs, `any` espalhado, comentários `HACK`).

**Como citar**:

```
`src/tools/scaffold-react-project.ts:42` — define o handler.
```

**Delegação a sub-agente** (recomendado para áreas >30 arquivos):

> "Mapeie o padrão de `<tema>` em `<caminho>/`. Para cada ocorrência, anote arquivo, linha-chave e variação observada. Devolva apenas uma tabela markdown com colunas: Arquivo | Padrão | Variação | Frequência. Sem trechos de código longos."

---

## Fonte 2 — Codebase modelo (referência)

**Objetivo**: extrair padrões de **outros repositórios** indicados pelo usuário para servir de espelho ou contraste.

**Como o usuário indica**:

- Path absoluto local (ex.: `/home/mlucascardoso/projects/numen/mro/numen-mro/backend/mro-application-service`).
- URL de repositório (ex.: GitHub) — converter para fetch via web ou pedir clone.
- Nome de pacote interno (ex.: `react-mcp` legacy) — mapear ao path quando conhecido.

**Tooling**:

- `Shell` (`ls`, `cat`) **apenas para listar/ler arquivos em paths absolutos fora do workspace**.
- Glob/Grep só funcionam no workspace atual — para path externo, use `Read` com path absoluto ou `Shell`.

**O que extrair**:

- Mesmas categorias da Fonte 1, **mais**:
- [ ] Divergências vs codebase atual (esta é a estrela do show).
- [ ] Decisões aparentes (configs, lock de versão, scripts) que diferem do nosso padrão.
- [ ] Histórico (se houver `CHANGELOG`, `AGENTS.md`, `STATE.md`).

**Boa prática**: para cada padrão modelo, anote:

```
Modelo `<path>`: <descrição curta>
Atual `<path>`: <como está hoje OU "ausente">
Diferença: <1 linha>
```

**Quando usar sub-agente**: codebases modelo grandes (>100 arquivos) sempre devem ir para sub-agente paralelo, um por modelo. Cada sub-agente devolve um sumário "modelo X em 30 linhas".

---

## Fonte 3 — Web

**Objetivo**: ancorar o research em docs oficiais e padrões da comunidade quando o conhecimento interno é insuficiente.

**Tooling**:

- `WebSearch` para descobrir fontes.
- `WebFetch` para puxar conteúdo de URLs específicas.
- Preferir docs oficiais (`*.dev`, `docs.*`, GitHub README/Discussions) sobre blogs.

**Regras críticas**:

1. **Paráfrase obrigatória**. Nunca copiar parágrafos longos de páginas externas. Sintetizar em 1-3 frases com citação.
2. **Data sempre**. Anote a data da consulta (`acessado em YYYY-MM-DD`) — APIs evoluem.
3. **Marcar incerteza**. Se a fonte não é canônica (blog, fórum), anotar "fonte secundária — verificar".
4. **Versão da lib**. Ao discutir uma lib, sempre anote a versão consultada.
5. **Múltiplas fontes para afirmações fortes**. Não confiar em uma única página para "X é melhor que Y".

**Quando usar**:

- Comparativo de tecnologias/protocolos.
- Verificação de API atual de uma lib.
- Buscar best practices reconhecidas.
- Investigar novidades (versões recentes, changelogs).

**Quando NÃO usar**:

- Para responder algo que está no codebase ou nas docs do projeto. Web é a **última camada** da cadeia de verificação.

---

## Fonte 4 — Context7 MCP (quando disponível)

**Objetivo**: obter snapshot atualizado da API de uma lib específica, sem ruído de fórum.

**Fluxo**:

1. `resolve-library-id` com o nome da lib (ex.: `@modelcontextprotocol/sdk`).
2. `get-library-docs` com o ID resolvido.
3. Citar como `Context7: <lib> (data)`.

**Vantagem sobre Web**: Context7 indexa docs oficiais e tende a ter snapshots mais fiéis do que blogs.

---

## Fonte 5 — Documentação interna do projeto

**Objetivo**: capturar conhecimento já registrado no próprio repositório antes de inventar.

**Onde olhar** (ordem):

1. `AGENTS.md` raiz e por subpasta.
2. `README.md` (raiz + pacotes).
3. `docs/` inteiro: `architecture/`, `standards/`, `specs/`.
4. `docs/specs/project/STATE.md` (decisões persistentes).
5. `docs/specs/features/*/spec.md` (decisões por feature).
6. `docs/researches/` (pesquisas anteriores — evitar redundância).
7. Comentários inline em arquivos críticos (configs, factories, módulos centrais).

**Anti-padrão**: pesquisar na web algo que está em `AGENTS.md` há 6 meses. Sempre varrer docs internas primeiro.

---

## Combinação de fontes — exemplos reais

| Tipo de pesquisa | Fontes ativadas |
|---|---|
| Migração de padrão legacy → novo (ex.: `cap-clean-arch`) | Codebase atual + 4 codebases modelo + docs internas |
| Organização interna de processo (ex.: `organizacao-projeto`) | Codebase atual + docs internas + 5 sub-agentes paralelos |
| Diagnóstico de fluxo agêntico (ex.: `agentic-development`) | Codebase atual + docs internas (vários níveis) + web pontual |
| Nova feature com lib desconhecida | Codebase atual (padrões aplicáveis) + Web + Context7 |
| Comparativo de bibliotecas | Web + Context7 (cada lib) + codebase atual (se já tem alguma instalada) |

---

## Padrão de paralelização

Para pesquisas Padrão/Profunda, paralelize a coleta:

```
Agente principal
├─ Sub-agente A: codebase atual → sumário (≤30 linhas)
├─ Sub-agente B: codebase modelo X → sumário (≤30 linhas)
├─ Sub-agente C: codebase modelo Y → sumário (≤30 linhas)
├─ Sub-agente D: web/Context7 sobre tema Z → sumário (≤30 linhas)
└─ síntese final no research.md
```

Cada sub-agente recebe:

- Escopo específico (1 fonte, 1 tema).
- Output esperado (tabela ou bullets com citações).
- Tamanho-alvo (≤30 linhas, ~2KB).
- Proibição de propor decisões ("apenas descreva o que viu").
