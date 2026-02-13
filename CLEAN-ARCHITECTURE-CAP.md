# Clean Architecture em SAP CAP

Guia de referência para a arquitetura utilizada nos projetos backend CAP com TypeScript.

> Repositório de referência: [natura-loss-provision-management-backend](https://github.com/VAEES/natura-loss-provision-management-backend/tree/quality) (branch `quality`)

---

## Visão Geral da Estrutura do Projeto

```
projeto/
├── db/                          # Camada de Persistência (CDS)
│   ├── models/                  # Definições de entidades (tabelas)
│   ├── views/                   # Views CDS (consultas prontas)
│   ├── types/                   # Tipos para actions/functions
│   ├── data/                    # Dados iniciais (CSV seed)
│   └── src/                     # Configuração HDI
│
├── application-service/         # Serviço OData (voltado para o frontend)
│   └── src/
│       ├── presentation/        # Camada de Apresentação
│       ├── domain/              # Camada de Domínio (regras de negócio)
│       ├── data/                # Camada de Dados (implementação dos use cases)
│       ├── infra/               # Camada de Infraestrutura (implementações concretas)
│       └── main/                # Camada de Composição (cola tudo junto)
│
├── processing-service/          # Serviço de Processamento (jobs background)
│   └── src/
│       ├── presentation/        # Mesma estrutura do application-service
│       ├── domain/
│       ├── data/
│       ├── infra/
│       └── main/
│
└── mta.yaml                     # Deploy descriptor (BTP)
```

---

## Divisão de Microservices

O projeto separa as responsabilidades em **dois serviços independentes**:

| Serviço | Responsabilidade | Quem consome |
|---------|-----------------|--------------|
| `application-service` | Expõe endpoints OData para o frontend (CRUD, actions, functions) | UI5 / Fiori |
| `processing-service` | Executa processamentos em background, jobs, integração com S4 | Schedulers / Eventos |

Ambos os serviços seguem **exatamente a mesma arquitetura interna** com as 5 camadas.

---

## As 5 Camadas

### 1. Presentation (`src/presentation/`)

**O que é:** Ponto de entrada das requisições. Recebe a request, extrai os dados necessários e delega para o use case.

**Responsabilidade:** Receber a requisição, chamar o use case correto e retornar a resposta.

**Estrutura:**
```
presentation/
└── controllers/
    ├── actions/       # Controllers para CDS Actions (operações que alteram dados)
    ├── functions/     # Controllers para CDS Functions (operações de leitura)
    ├── entities/      # Controllers para eventos de entidades (before/on/after READ, CREATE, etc.)
    └── base/          # Controllers base/genéricos reutilizáveis
```

**Regras:**
- NÃO contém lógica de negócio
- NÃO acessa banco de dados diretamente
- Apenas extrai dados da request e repassa para o use case
- Cada controller recebe seu use case via **injeção de dependência** (pela factory)

---

### 2. Domain (`src/domain/`)

**O que é:** O coração da aplicação. Define **O QUE** o sistema faz, sem dizer **COMO**.

**Responsabilidade:** Definir interfaces (contratos), regras de negócio puras e modelos de domínio.

**Estrutura:**
```
domain/
├── use-cases/         # Interfaces dos casos de uso
│   ├── actions/       # Contratos para actions
│   ├── functions/     # Contratos para functions
│   ├── entities/      # Contratos para operações de entidades
│   └── s4/            # Contratos para integração S4
├── repositories/      # Interfaces dos repositórios (contratos de acesso a dados)
├── adapters/          # Interfaces dos adapters (contratos de ferramentas externas)
├── external-apis/     # Interfaces para chamadas a APIs externas
├── hidrators/         # Interfaces para hydrators (transformação de dados)
├── models/            # Tipagens TypeScript das entidades (db/ e s4/)
│   ├── db/            # Interfaces que espelham as entidades do db/models/ (CDS → TS)
│   └── s4/            # Interfaces que representam entidades do sistema S4 externo
├── errors/            # Erros customizados do domínio
└── translation/       # Interface para tradução/i18n
```

**Regras:**
- Contém APENAS **interfaces** e **tipos** (nunca implementações concretas)
- NÃO depende de nenhuma outra camada
- NÃO importa nada do CAP, HANA, ou qualquer framework
- É a camada mais estável do projeto

---

### 3. Data (`src/data/`)

**O que é:** Implementação concreta dos use cases. Contém a **orquestração** da lógica de negócio.

**Responsabilidade:** Implementar as interfaces de use case definidas no domain, coordenando repositórios, adapters e APIs externas.

**Estrutura:**
```
data/
├── base/              # Implementações base reutilizáveis
└── use-cases/
    ├── actions/       # Implementação dos use cases de actions
    ├── functions/     # Implementação dos use cases de functions
    ├── entities/      # Implementação dos use cases de entidades
    └── s4/            # Implementação dos use cases de integração S4
```

**Regras:**
- Implementa as interfaces de use case do `domain/`
- Depende APENAS das interfaces do domain (repositórios, adapters, etc.)
- NÃO conhece implementações concretas (não sabe se é HANA, SQLite, API REST, etc.)
- Recebe suas dependências por **injeção no construtor**

---

### 4. Infra (`src/infra/`)

**O que é:** Implementações concretas de tudo que é "externo". Aqui mora o acesso real ao banco, chamadas HTTP, etc.

**Responsabilidade:** Implementar as interfaces definidas no domain com tecnologias concretas (HANA, APIs REST, JWT, etc.)

**Estrutura:**
```
infra/
├── repositories/      # Implementação concreta dos repositórios (acesso ao HANA/CDS)
├── adapters/          # Implementação concreta dos adapters (JWT decoder, etc.)
├── external-apis/     # Implementação concreta das chamadas a APIs externas (S4, etc.)
├── hidrators/         # Implementação concreta dos hydrators
└── translation/       # Implementação concreta de tradução/i18n
```

**Regras:**
- Implementa as interfaces do `domain/`
- É a ÚNICA camada que conhece tecnologias concretas (cds, HANA, axios, etc.)
- Pode ser trocada sem afetar o restante da aplicação
- Cada arquivo implementa uma interface correspondente do domain

---

### 5. Main (`src/main/`)

**O que é:** A camada de composição. É o **ponto de entrada** que conecta todas as outras camadas.

**Responsabilidade:** Montar (compor) todas as dependências, definir rotas CDS e registrar handlers.

**Estrutura:**
```
main/
├── factories/             # Fábricas que montam as dependências
│   ├── controllers/       # Fábricas de controllers
│   ├── use-cases/         # Fábricas de use cases
│   └── adapters/          # Fábricas de adapters
├── routes/                # Definição do serviço CDS (.cds) + registro de handlers (.ts)
├── annotations/           # Annotations CDS (UI, capabilities, etc.)
├── config/                # Configurações do serviço
├── match-codes/           # Value helps / match codes
├── scripts/               # Scripts utilitários
├── external/              # Definições de serviços externos
└── external-production/   # Definições de serviços externos (produção)
```

**Regras:**
- É a ÚNICA camada que conhece TODAS as outras
- Responsável pela **injeção de dependência manual** (sem framework DI)
- As factories instanciam as classes concretas e passam as dependências
- O arquivo `routes/main.ts` registra os handlers CDS chamando as factories

---

## Fluxo de uma Requisição

```
Request HTTP/OData
       │
       ▼
┌─────────────┐
│   Routes    │  main/routes/main.ts  (registra o handler no evento CDS)
│   (main)    │  Chama a factory para obter o controller
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Factory    │  main/factories/controllers/  (monta o controller com suas dependências)
│   (main)    │  Instancia: InfraRepo → DataUseCase → Controller
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  presentation/controllers/  (recebe request, extrai dados)
│(presentation)│  Chama o use case
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Use Case   │  data/use-cases/  (orquestra a lógica de negócio)
│   (data)    │  Usa repositórios, adapters, APIs
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repository  │  infra/repositories/  (acessa o banco HANA via CDS)
│  (infra)    │  Retorna os dados
└─────────────┘
```

---

## Mapa de Dependências entre Componentes

### Quando crio uma **Action** nova, o que preciso criar?

| # | O que criar | Onde fica | Depende de |
|---|------------|-----------|------------|
| 1 | Tipo CDS (payload/retorno) | `db/types/` | - |
| 2 | Action no serviço CDS | `main/routes/main.cds` | Tipo CDS |
| 3 | Interface do Use Case | `domain/use-cases/actions/` | Models do domain (tipagens já existentes) |
| 4 | Implementação do Use Case | `data/use-cases/actions/` | Interface do Use Case + Interfaces de Repositories + Models |
| 5 | Interface do Repository (se novo) | `domain/repositories/` | Models do domain |
| 6 | Implementação do Repository (se novo) | `infra/repositories/` | Interface do Repository |
| 7 | Controller | `presentation/controllers/actions/` | Interface do Use Case |
| 8 | Factory do Use Case | `main/factories/use-cases/` | Implementação concreta (data + infra) |
| 9 | Factory do Controller | `main/factories/controllers/` | Controller + Factory do Use Case |
| 10 | Registro do Handler | `main/routes/main.ts` | Factory do Controller |

### Quando crio uma **Function** nova (leitura)?

| # | O que criar | Onde fica | Depende de |
|---|------------|-----------|------------|
| 1 | Tipo CDS (retorno) | `db/types/` | - |
| 2 | Function no serviço CDS | `main/routes/main.cds` | Tipo CDS |
| 3 | Interface do Use Case | `domain/use-cases/functions/` | Models do domain (tipagens já existentes) |
| 4 | Implementação do Use Case | `data/use-cases/functions/` | Interface do Use Case + Interfaces de Repositories + Models |
| 5 | Interface do Repository (se novo) | `domain/repositories/` | Models do domain |
| 6 | Implementação do Repository (se novo) | `infra/repositories/` | Interface do Repository |
| 7 | Controller | `presentation/controllers/functions/` | Interface do Use Case |
| 8 | Factory do Use Case | `main/factories/use-cases/` | Implementação concreta (data + infra) |
| 9 | Factory do Controller | `main/factories/controllers/` | Controller + Factory do Use Case |
| 10 | Registro do Handler | `main/routes/main.ts` | Factory do Controller |

### Quando crio um **handler de Entidade** (before/on/after READ, CREATE, etc.)?

| # | O que criar | Onde fica | Depende de |
|---|------------|-----------|------------|
| 1 | Modelo CDS (se nova entidade) | `db/models/` | - |
| 2 | Exposição no serviço CDS | `main/routes/main.cds` | Modelo CDS |
| 3 | Interface do Use Case | `domain/use-cases/entities/` | Models do domain (tipagens já existentes) |
| 4 | Implementação do Use Case | `data/use-cases/entities/` | Interface do Use Case + Interfaces de Repositories + Models |
| 5 | Interface do Repository (se novo) | `domain/repositories/` | Models do domain |
| 6 | Implementação do Repository (se novo) | `infra/repositories/` | Interface do Repository |
| 7 | Controller | `presentation/controllers/entities/` | Interface do Use Case |
| 8 | Factory do Use Case | `main/factories/use-cases/` | Implementação concreta (data + infra) |
| 9 | Factory do Controller | `main/factories/controllers/` | Controller + Factory do Use Case |
| 10 | Registro do Handler | `main/routes/main.ts` | Factory do Controller |

---

## Regra de Dependência (A Regra de Ouro)

```
presentation  ──►  domain  ◄──  data
                     ▲
                     │
                   infra

                   main ──► conhece TODOS
```

- **Presentation** depende apenas do **Domain** (interfaces de use case)
- **Data** depende apenas do **Domain** (interfaces de use case, repository, adapter)
- **Infra** depende apenas do **Domain** (interfaces de repository, adapter, external-api)
- **Domain** NÃO depende de ninguém (é o centro)
- **Main** conhece TODAS as camadas (é quem faz a composição)

> As setas apontam para onde a dependência flui. Todas apontam para o **Domain**. Isso é o princípio da **Inversão de Dependência** (o "D" do SOLID).

---

## Camada DB (Banco de Dados)

A pasta `db/` fica **fora** dos serviços e é compartilhada entre eles.

| Pasta | Responsabilidade | Exemplo |
|-------|-----------------|---------|
| `db/models/` | Definição das entidades (tabelas no HANA) | `loss-provision-base.cds`, `parameters.cds` |
| `db/views/` | Views CDS para consultas otimizadas | `loss-provisions-base.cds`, `jobs-by-plant.cds` |
| `db/types/` | Tipos estruturados usados em actions/functions | `save-loss-provisions.cds`, `mass-update-by-excel.cds` |
| `db/data/` | Arquivos CSV para carga inicial de dados | Seeds para tabelas de configuração |
| `db/src/` | Configuração HDI container | `.hdiconfig` |

---

## Mapeamento Espelho entre Camadas

Um dos padrões mais importantes: as pastas se **espelham** entre domain e infra, e entre domain e data.

### Repositories

| Domain (Interface) | Infra (Implementação) |
|--------------------|-----------------------|
| `domain/repositories/loss-provision-base.ts` | `infra/repositories/loss-provision-base.ts` |
| `domain/repositories/parameters.ts` | `infra/repositories/parameters.ts` |
| `domain/repositories/calendar-cycles.ts` | `infra/repositories/calendar-cycles.ts` |

### Use Cases

| Domain (Interface) | Data (Implementação) |
|--------------------|----------------------|
| `domain/use-cases/actions/` | `data/use-cases/actions/` |
| `domain/use-cases/functions/` | `data/use-cases/functions/` |
| `domain/use-cases/entities/` | `data/use-cases/entities/` |

### Adapters

| Domain (Interface) | Infra (Implementação) |
|--------------------|-----------------------|
| `domain/adapters/jwt-decoder.ts` | `infra/adapters/jwt-decoder.ts` |
| `domain/adapters/request-user-extractor.ts` | `infra/adapters/request-user-extractor.ts` |

### External APIs

| Domain (Interface) | Infra (Implementação) |
|--------------------|-----------------------|
| `domain/external-apis/` | `infra/external-apis/` |

### Hydrators

| Domain (Interface) | Infra (Implementação) |
|--------------------|-----------------------|
| `domain/hidrators/` | `infra/hidrators/` |

---

## Domain Models: Tipagens TypeScript das Entidades

A pasta `domain/models/` contém **classes TypeScript** que representam as entidades do sistema de forma tipada. Elas **não são modelos novos criados por feature** — são representações das entidades que já existem no banco (`db/models/`) e nos sistemas externos (S4/HANA).

### Estrutura

```
domain/models/
├── db/     # Tipagens das entidades do banco de dados (espelham db/models/*.cds)
└── s4/     # Tipagens das entidades do sistema SAP S4/HANA
```

### O que fica dentro de `models/db/`

Cada arquivo representa **uma entidade do banco** (definida em `db/models/*.cds`), convertida para uma classe TypeScript com:

- Um **tipo/classe Props** que define o formato dos dados (campos e tipos)
- Uma **classe Model** que encapsula os dados com getters
- Um **método estático `with()`** para instanciar o model a partir de props
- Alguns possuem **enums** com valores de domínio (ex: status, tipos)

**Arquivos encontrados em `models/db/`:**

| Arquivo | Entidade que representa |
|---------|------------------------|
| `loss-provision-base.ts` | Base de provisão de perdas |
| `parameter.ts` | Parâmetros de configuração |
| `calendar-cycle.ts` | Ciclos do calendário |
| `status.ts` | Status com enum de valores |
| `authorized-scrapping.ts` | Sucateamento autorizado |
| `authorization-group.ts` | Grupos de autorização |
| `plants-by-country.ts` | Plantas por país |
| `notification-email.ts` | Configuração de e-mails |

### O que fica dentro de `models/s4/`

Mesma lógica, porém para **entidades que vêm do sistema SAP S4/HANA** (via APIs externas). Os nomes dos campos seguem a convenção **PascalCase do SAP**. Também possuem Props + Model class + `with()` + getters, e alguns incluem `toObject()` ou `toJSON()` para serialização.

**Arquivos encontrados em `models/s4/`:**

| Arquivo | Entidade S4 que representa |
|---------|---------------------------|
| `plant.ts` | Plantas (centros) |
| `company.ts` | Empresas / centros de custo |
| `product.ts` | Produtos / materiais |
| `batch.ts` | Lotes |
| `supplier.ts` | Fornecedores |
| `stock.ts` | Estoque |
| `storage-location.ts` | Depósitos |
| `material-document-item.ts` | Itens de documento de material |

### Diferenças entre `models/db/` e `models/s4/`

| Aspecto | `models/db/` | `models/s4/` |
|---------|-------------|-------------|
| **Origem dos dados** | Banco HANA (entidades CDS) | API SAP S4/HANA (serviços externos) |
| **Convenção de nomes** | camelCase (`id`, `description`) | PascalCase (`Plant`, `PlantName`) |
| **Espelha** | `db/models/*.cds` | Serviços OData do S4 |
| **Usado por** | Repositórios, Use Cases, Controllers | External APIs, Hydrators, Use Cases |

### Por que existem essas classes?

1. **Tipagem segura** — O CDS não gera tipos TypeScript automaticamente. Sem essas classes, tudo seria `any`
2. **Encapsulamento** — Os dados ficam protegidos atrás de getters (imutabilidade)
3. **Independência de framework** — As classes não importam nada do CAP/CDS, pertencem ao domain puro
4. **Compartilhadas** — Actions, Functions e Entity handlers usam os **mesmos models**, não criam modelos próprios por feature

> **Ponto importante:** Quando você cria uma nova Action ou Function, você **não cria** um novo model. Você reutiliza os models das entidades que já existem em `domain/models/db/` ou `domain/models/s4/`. Só se cria um novo model quando surge uma **nova entidade no banco** ou uma **nova integração S4**.

---

## Domain Errors: Tratamento de Erros do Domínio

A pasta `domain/errors/` contém as **classes de erro customizadas** da aplicação. Elas ficam no domain porque representam **situações de erro de negócio** — independentes de framework ou tecnologia.

### Estrutura

```
domain/errors/
├── abstract.ts          # Classe base abstrata para todos os erros
├── bad-request.ts       # Erro 400 - Requisição inválida
├── not-found.ts         # Erro 404 - Recurso não encontrado
├── forbidden.ts         # Erro 403 - Sem permissão
├── conflict.ts          # Erro 409 - Conflito de dados
├── server.ts            # Erro 500 - Erro interno do servidor
├── types.ts             # Tipos auxiliares para erros de gateway/S4
└── index.ts             # Barrel export (re-exporta tudo)
```

### Como funciona

A hierarquia segue um padrão simples:

1. **`AbstractError`** — Classe base que estende `Error` nativo do JavaScript. Adiciona `code` (código HTTP) e `args` (argumentos extras) ao erro padrão
2. **Erros específicos** — Cada classe filha define seu código HTTP fixo no construtor (400, 403, 404, 409, 500)
3. **`types.ts`** — Define tipos auxiliares para tratar respostas de erro vindas de APIs externas (Gateway/S4)

### Mapa de erros disponíveis

| Classe | Código HTTP | Quando usar |
|--------|-------------|-------------|
| `BadRequestError` | 400 | Dados inválidos, validação falhou, payload incorreto |
| `ForbiddenError` | 403 | Usuário sem permissão para executar a operação |
| `NotFoundError` | 404 | Entidade não encontrada no banco |
| `ConflictError` | 409 | Conflito de dados (registro duplicado, estado inconsistente) |
| `ServerError` | 500 | Erro inesperado no servidor |

### Quem usa os errors

- **Use Cases (`data/`)** — Lançam os erros quando regras de negócio são violadas (ex: `throw new NotFoundError('Provisão não encontrada')`)
- **Controllers (`presentation/`)** — Podem capturar e tratar os erros para retornar a resposta HTTP adequada
- **Repositories/Adapters (`infra/`)** — Podem lançar `ServerError` quando falhas de infraestrutura ocorrem

### Por que os errors ficam no Domain?

1. **Pertencem ao negócio** — "Registro não encontrado" e "Sem permissão" são conceitos de negócio, não de framework
2. **Sem dependência externa** — As classes estendem apenas o `Error` nativo do JavaScript
3. **Compartilhados** — Todas as camadas (data, infra, presentation) podem usar os mesmos erros
4. **Padronização** — Garante que toda a aplicação usa os mesmos tipos de erro com códigos HTTP consistentes

---

## Domain Translation: Internacionalização (i18n)

A pasta `domain/translation/` contém a **interface** para o serviço de tradução da aplicação. Seguindo a Clean Architecture, o domain define apenas **o contrato** — a implementação concreta fica na infra.

### Estrutura

```
domain/translation/
└── translator.ts        # Interface do serviço de tradução
```

### O que a interface define

A interface `Translator` define um único método `translate` que recebe:

- **`text`** — A chave do texto a ser traduzido (ex: `"error.not.found"`)
- **`language`** — O idioma desejado (ex: `"pt-BR"`, `"es-ES"`, `"en"`)
- **`args`** — Argumentos opcionais para interpolação de variáveis no texto

E retorna a **string traduzida** pronta para uso.

### Implementação concreta (na Infra)

A implementação fica em `infra/translation/` e utiliza o **`@sap/textbundle`** (ResourceManager do SAP) para carregar os textos dos arquivos `.properties`.

```
infra/translation/
├── translator.ts              # Implementação concreta (usa @sap/textbundle)
└── i18n/                      # Arquivos de tradução
    ├── i18n.properties        # Textos padrão (inglês)
    ├── i18n_pt.properties     # Textos em português
    ├── i18n_es.properties     # Textos em espanhol
    ├── messages.properties    # Mensagens padrão (inglês)
    ├── messages_pt.properties # Mensagens em português
    └── messages_es.properties # Mensagens em espanhol
```

### Idiomas suportados

| Código | Idioma |
|--------|--------|
| `en` | Inglês (padrão/fallback) |
| `pt` / `pt-BR` | Português |
| `es` / `es-ES` | Espanhol |

### Como se encaixa na Clean Architecture

| Camada | Arquivo | Papel |
|--------|---------|-------|
| **Domain** | `domain/translation/translator.ts` | Define a interface (contrato) |
| **Infra** | `infra/translation/translator.ts` | Implementa usando `@sap/textbundle` |
| **Infra** | `infra/translation/i18n/*.properties` | Arquivos com os textos traduzidos |
| **Main** | Factory instancia o `TranslatorImpl` | Injeta nos use cases que precisam |

### Por que fica no Domain?

1. **O conceito de tradução pertence ao negócio** — Mensagens de erro, labels e textos são requisitos funcionais
2. **Independência de tecnologia** — O domain não sabe se a tradução vem de `.properties`, JSON, banco ou API externa
3. **Substituível** — Se trocar o `@sap/textbundle` por outra lib, só muda a infra

---

## Factories: Como funciona a Composição

As factories ficam na camada `main/` e são responsáveis por **instanciar e conectar** todas as peças.

### Hierarquia de composição:

```
Factory do Controller
  └── instancia o Controller (presentation)
       └── passando o Use Case como dependência
            │
            └── Factory do Use Case
                 └── instancia o Use Case (data)
                      └── passando Repositories, Adapters como dependência
                           │
                           ├── instancia o Repository (infra)
                           ├── instancia o Adapter (infra)
                           └── instancia a External API (infra)
```

### Tipos de Factories:

| Factory | Onde fica | O que monta |
|---------|-----------|-------------|
| Factory de Controller | `main/factories/controllers/` | Controller + Use Case |
| Factory de Use Case | `main/factories/use-cases/` | Use Case + Repositories + Adapters |
| Factory de Adapter | `main/factories/adapters/` | Adapters isolados |

---

## Resumo Visual: Responsabilidade de cada Camada

| Camada | Conhece | Contém | Não pode |
|--------|---------|--------|----------|
| **Presentation** | Domain (interfaces) | Controllers | Acessar banco, conter lógica de negócio |
| **Domain** | Ninguém | Interfaces, Tipos, Modelos, Erros | Importar frameworks, ter implementação concreta |
| **Data** | Domain (interfaces) | Implementação dos Use Cases | Acessar banco diretamente, conhecer frameworks |
| **Infra** | Domain (interfaces) | Repositórios concretos, Adapters concretos | Conter lógica de negócio |
| **Main** | Todas as camadas | Factories, Routes, Config, Annotations | Conter lógica de negócio |

---

## Por que usar essa arquitetura?

1. **Testabilidade** - Cada camada pode ser testada isoladamente com mocks
2. **Manutenção** - Mudanças em uma camada não afetam as outras
3. **Flexibilidade** - Trocar o banco de HANA para SQLite? Só muda a infra
4. **Padronização** - Todo dev sabe exatamente onde colocar cada coisa
5. **Escalabilidade** - Fácil adicionar novas features seguindo o padrão
6. **Independência de framework** - O domain não sabe que CAP existe
