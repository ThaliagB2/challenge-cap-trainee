# vet-clinic

## Estrutura

| Pasta | Descrição |
|-------|-----------|
| `vet-clinic/` | Aplicação React (Vite + TypeScript + Clean Architecture) |
| `app-router/` | SAP BTP App Router (autenticação XSUAA) |
| `html5deployer/` | Deploy para HTML5 Application Repository |

## Desenvolvimento

```bash
yarn install
cd vet-clinic
yarn install
yarn dev
```

## Build e Deploy BTP

```bash
yarn bd        # clean + build + deploy
yarn undeploy  # remover do Cloud Foundry
```
