# Repository Guidelines

## Project Structure & Module Organization
- `src/app.module.ts` composes the Nest module tree; feature code stays within `src/<feature-name>/` where controller, service, repository, `dto/`, and `entities/` are separated for clarity.
- `src/main.ts` bootstraps the HTTP server; update global pipes or middleware here when adjusting request handling.
- API contracts and mocks belong with their feature in `src/<feature-name>/dto` and `src/<feature-name>/entities`; share-only utilities can live in a future `src/common/` folder.
- Integration tests sit in `test/` (`<feature-name>.e2e-spec.ts`); keep fixtures close to their spec files to simplify maintenance.

## Build, Test, and Development Commands
- `npm run start:dev` — launches the Nest server with watch mode for local iteration.
- `npm run build` — compiles TypeScript via `nest build` into `dist/` for deployment packaging.
- `npm test` — executes the Jest unit test suite; prefer this for quick feedback.
- `npm run test:e2e` — runs the end-to-end flow defined in `test/jest-e2e.json`; ensure the HTTP server is free on the default port.
- `npm run lint` / `npm run format` — apply ESLint with Prettier integration and enforce formatting before opening a pull request.

## Coding Style & Naming Conventions
- TypeScript uses 2-space indentation, trailing commas, and single quotes enforced by the repo `.prettierrc`.
- Name classes and files by role (`BookingsService`, `bookings.service.ts`); DTOs end with `Dto`, enums with `Enum`.
- Keep controllers slim, delegate business logic to services, and guard repository methods for data integrity.

## Testing Guidelines
- Favor Jest unit tests colocated beside services or repositories when logic grows; mirror file names with `.spec.ts` suffix.
- Exercise HTTP contracts in `test/*.e2e-spec.ts` using Supertest, covering success and failure cases for each endpoint.
- Aim for meaningful coverage of booking lifecycle paths; add regression cases whenever a bug fix lands.

## Commit & Pull Request Guidelines
- Follow the existing history: short, sentence-case summaries such as `Add bookings status patch handler`; include context in the body when necessary.
- Reference related issues in the description and call out new environment requirements or migrations.
- For pull requests, note testing performed (`npm test`, `npm run test:e2e`) and attach cURL or HTTPie examples when endpoint behavior changes.
