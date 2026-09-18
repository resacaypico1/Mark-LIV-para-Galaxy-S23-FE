# Mark LIV Mobile

Asistente móvil inspirado en Mark LIV para Android, con chat, lectura en voz alta, memoria local, recordatorios y acciones rápidas.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mark-liv-mobile/app/(tabs)/index.tsx` — pantalla principal del asistente
- `artifacts/mark-liv-mobile/context/AssistantContext.tsx` — estado persistente local
- `artifacts/mark-liv-mobile/lib/assistant.ts` — parser de comandos móviles
- `artifacts/mark-liv-mobile/constants/colors.ts` — tokens visuales holográficos

## Architecture decisions

- La primera versión es local-first: el chat, la memoria y los recordatorios se guardan con AsyncStorage para funcionar sin servidor.
- La salida de voz usa `expo-speech`; la entrada de voz aprovecha el dictado del teclado Samsung para mantener compatibilidad con Expo Go.
- Los comandos móviles se interpretan explícitamente para evitar prometer controles de escritorio que Android no puede ejecutar de forma directa.

## Product

Mark LIV Mobile ofrece una interfaz de asistente de voz/chat con avatar holográfico, respuestas en español, lectura en voz alta, comandos rápidos para YouTube y búsquedas, recordatorios, memoria personal, actividad y configuración del perfil.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
