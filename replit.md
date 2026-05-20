# Cidade Alerta

Aplicativo mobile de registro de problemas urbanos (iluminação, buracos e focos de dengue) com CRUD completo e persistência local.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: React Native (Expo) + Expo Router (file-based routing)
- Navegação: Expo Router com Tab Bar (Tabs + Stack)
- Persistência: AsyncStorage (offline, funciona sem internet)
- UI: React Native StyleSheet + @expo/vector-icons
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (backend, não usado pelo app mobile ainda)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cidade-alerta/` — App mobile Expo
  - `app/(tabs)/index.tsx` — Tela principal com lista de ocorrências + filtros
  - `app/(tabs)/stats.tsx` — Tela de estatísticas por categoria/status
  - `app/problem/new.tsx` — Formulário de criação de ocorrência
  - `app/problem/[id].tsx` — Detalhe, edição e exclusão de ocorrência
  - `context/ProblemsContext.tsx` — Estado global + operações CRUD com AsyncStorage
  - `components/ProblemCard.tsx` — Card de exibição de ocorrência
  - `components/FilterChip.tsx` — Chip de filtro reutilizável
  - `constants/colors.ts` — Tema de cores (azul cívico)
- `artifacts/api-server/` — Servidor Express (backend)
- `lib/api-spec/openapi.yaml` — Especificação OpenAPI

## Architecture decisions

- Persistência via AsyncStorage para funcionar 100% offline sem necessidade de credenciais externas
- Expo Router (file-based) em vez de React Navigation manual — simplifica a navegação em Stack + Tabs
- ProblemsContext centraliza todo o estado e operações CRUD com persistência automática
- Dados de exemplo (seed) carregados automaticamente no primeiro uso
- Filtros combinados por categoria + status no mesmo feed

## Product

Aplicativo mobile para cidadãos registrarem problemas urbanos: postes apagados (iluminação), buracos nas vias e focos de dengue. Permite criar, visualizar, editar e excluir registros com título, descrição, endereço, categoria, prioridade e status. Tela de estatísticas mostra distribuição por categoria, status e prioridade.

## User preferences

- Framework: React Native (Expo)
- Navegação: Expo Router com tabs e stack
- Persistência: AsyncStorage (offline first)
- Idioma da interface: Português

## Gotchas

- Para testar no celular: escanear QR code via Expo Go
- Firebase pode ser adicionado futuramente substituindo AsyncStorage no ProblemsContext
- `@react-native-async-storage/async-storage` já está no package.json

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
