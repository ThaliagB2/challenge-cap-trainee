# Templates — snippets curtos prontos para colar

> Pedaços auto-contidos para reusar dentro de um `research.md`. Use como blocos de montagem; ajuste os exemplos ao contexto real.

## 1. Tabela comparativa mestra (Seção 1 — Visão geral)

Use quando há 2+ objetos sendo comparados em paralelo (codebases modelo, libs, abordagens).

```markdown
| Objeto | Localização | Transporte | Auth | Dep. externa | API | # Tools |
|---|---|---|---|---|---|---|
| `react-mcp` (legacy) | raiz | HTTP + WS | `MCP_API_KEY` | Arcanum Electron | high-level | 3 |
| `cap-mcp` (legacy) | raiz | HTTP + WS | `MCP_API_KEY` | Arcanum Electron | high-level | 8 |
| `hana-cloud-mcp` | raiz | STDIO/HTTP | opcional | Nenhuma | low-level | 14 |
| `mcp-react-clean-arch` (novo) | `numen-mcps/` | STDIO | Nenhuma | Nenhuma | low-level | 1 |
```

**Boas práticas**:
- Colocar a coluna mais discriminante perto da esquerda.
- Limitar a 6-8 colunas; se passar disso, quebrar em 2 tabelas.
- Usar `**negrito**` para destacar a célula que diverge do padrão.

## 2. Achado-por-dimensão (Seção 2)

Tabela de tipo "auditoria" — eixo `Tipo | Achado | Evidência | Impacto`.

```markdown
### 2.1 Estrutura de pastas

| # | Tipo | Achado | Evidência | Impacto |
|---|---|---|---|---|
| E1 | Divergência | `db/` real tem layout diferente do documentado em `docs/standards/.../replication.md` | `db/` (real) vs `docs/standards/.../replication.md:42` | Alto — agente cria arquivo no lugar errado |
| E2 | Lacuna | Camadas `domain/services`, `infrastructure/adapters` não documentadas | grep `**/domain/services/*.ts` retorna 12 arquivos; doc não menciona | Médio |
| E3 | Padrão consistente | Todos os MCPs novos usam `src/tools/<tool>/generators/` | `mcp-react-clean-arch/src/tools/scaffold-react-project/generators/` e `cap-clean-arch/src/tools/scaffold-project/generators/` | — |
```

**Convenção de "Tipo"**: use vocabulário fixo:

- **Divergência** — código diverge da documentação ou de outro modelo.
- **Lacuna** — algo que existe mas não está documentado.
- **Padrão consistente** — recorrência observada.
- **Anti-padrão** — recorrência problemática.
- **Referência quebrada** — link ou import quebrado.
- **Débito técnico** — TODO/HACK/comentário sinalizando dívida.

## 3. Fonte consultada (Seção 6)

### 3.1 Citação de arquivo local

```markdown
- `src/tools/scaffold-react-project/scaffold-react-project.ts:23-45` — define o handler com Zod schema e chama `executeFiles(files, targetPath)`.
- `vitest.config.ts` — confirma threshold de cobertura 50% e exclusão de `src/index.ts`.
```

### 3.2 Citação de URL web

```markdown
- [Extend Claude with skills](https://code.claude.com/docs/en/skills.md) — acessado em 2026-05-26 — confirma estrutura YAML frontmatter + body markdown para SKILL.md.
- [MCP SDK 1.11.0 release notes](https://github.com/modelcontextprotocol/sdk/releases/tag/v1.11.0) — acessado em 2026-05-26 — `McpServer.tool()` é estável no high-level API.
```

### 3.3 Citação Context7

```markdown
- `@modelcontextprotocol/sdk@^1.11.0` — consultado via Context7 em 2026-05-26 — `StdioServerTransport` exposto em `dist/server/stdio.js`.
```

### 3.4 Citação de transcrição/conversa

```markdown
- `docs/researches/<slug>/transcricoes/1.inicial.md` (turno 4) — usuário definiu que `prompts/` deve guardar verbatim do briefing.
```

## 4. Hipótese / recomendação (Seção 5)

Bloco padrão para cada hipótese — não decisão.

```markdown
### H1: Adotar STDIO puro nos novos MCPs

- **Racional**: o `mcp-react-clean-arch` já implementa STDIO sem dependências externas. O HANA Cloud e BTP Management MCPs também já têm modo STDIO. Padronizar elimina o acoplamento ao Arcanum.
- **Suportada por**: Seção 2.1 (E3), Seção 1 (tabela mestra).
- **Riscos**: clientes que dependem de HTTP precisariam de migração. Ainda não mapeado se há algum.
- **Alternativas**: manter modo dual STDIO/HTTP (como `hana-cloud-mcp`) para compatibilidade.
- **Decisão**: deixada para a Specify (`tlc-spec-driven`).
```

## 5. Diagrama Mermaid

Use para fluxos de execução, arquitetura ou estado. Antes de gerar mermaid, **verifique se a skill `mermaid-studio` está instalada** — se sim, delegue.

### 5.1 Arquitetura comparativa

```markdown
\`\`\`mermaid
flowchart LR
    subgraph Legacy["Legacy (Arcanum-coupled)"]
        L_Dev[Dev] -->|HTTP| L_MCP[MCP Server]
        L_MCP -->|WS| L_Arc[Arcanum Electron]
        L_Arc -->|fs local| L_Disk[(Disco)]
    end

    subgraph Novo["Novo (STDIO local)"]
        N_Dev[Dev] -->|STDIO| N_MCP[MCP Server]
        N_MCP -->|fs direto| N_Disk[(Disco)]
    end
\`\`\`
```

### 5.2 Fluxo agêntico

```markdown
\`\`\`mermaid
flowchart LR
    A[Prompt inicial] --> B[Pesquisa em<br/>docs/researches/&lt;slug&gt;/]
    B --> C[Specify<br/>spec.md]
    C --> D[Design<br/>design.md]
    D --> E[Tasks<br/>tasks.md]
    E --> F[Execute<br/>código + testes]
    F --> G[Review<br/>.review-results/&lt;slug&gt;/]
\`\`\`
```

## 6. Gap / incógnita (Seção 4)

```markdown
| # | Pergunta sem resposta | Por que não respondemos | Como descobrir |
|---|---|---|---|
| G1 | Quem ainda depende do HTTP no `react-mcp` legacy? | Nenhum doc lista consumidores; código não tem rastro | Perguntar nos canais internos; auditar logs de produção |
| G2 | Versão do `@sap/cds` suportada pelo BTP atual? | `package.json` do `cap-mcp` legacy fixa em `^7.x`, mas BTP doc não confirma | Confirmar com SAP support / docs oficiais SAP BTP |
```

## 7. Cabeçalho com metadados

```markdown
# Pesquisa: Padrão de MCPs Numen DS

> Mapeamento detalhado dos MCPs internos da Numen DS (legacy e nova abordagem), preparado como base para o planejamento da nova implementação `cap-clean-arch`.

| Item | Valor |
|---|---|
| Slug | `cap-clean-arch` |
| Data | 2026-05-19 |
| Modo | Profundo |
| Consumidor previsto | `tlc-spec-driven` (Specify) |
| Fontes utilizadas | Codebase atual + 4 codebases modelo (`react-mcp`, `cap-mcp`, `hana-cloud-mcp`, `btp-management-mcp`) |
| Status | Final |
| Autor | Agente Cursor |
```

## 8. Prompt verbatim (em `prompts/<slug>.md`)

Sempre que o usuário trouxer um briefing pronto, salvá-lo **palavra por palavra**. Não editar, não resumir, não corrigir.

```markdown
<!-- prompts/<slug>.md -->

<conteúdo verbatim do usuário, copiado e colado>

---

<segundo turno do usuário, se houver, separado por hr>
```

Se houver múltiplas iterações em sessões diferentes, separar por `---` em ordem cronológica.

## 9. Transcrição multi-sessão (em `transcricoes/N.descricao.md`)

Naming: `<ordem>.<descricao-kebab>.md`. Exemplos: `1.inicial.md`, `2.ajustes.md`, `3.aprofundamento-build.md`.

```markdown
# <Título da iteração>
_Exported on <data> from Cursor (X.Y.Z)_

---

**User**

<turno do usuário>

---

**Cursor**

<turno do agente, podendo incluir blocos de código, tool calls referenciados, etc.>

---

**User**

<próximo turno>
```

Manter formato consistente entre iterações facilita auditoria.
