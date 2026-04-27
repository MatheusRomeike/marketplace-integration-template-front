# AGENTS.md

## Required Reading

Always follow the documentation in `/docs` before changing frontend code:

- `/docs/architecture.md`
- `/docs/patterns.md`
- `/docs/conventions.md`
- `/docs/quick-rules.md`

These files describe the current Angular implementation and are the source of truth for project consistency.

## Product Context

This frontend belongs to Integration Template, a system for integrating internal business systems with external marketplaces and platforms.

When creating or changing UI, preserve this product model:

- Products/catalog are managed as marketplace-facing data.
- Orders represent operational marketplace transactions.
- Inventory/stock views are tenant/company-scoped operational data.
- Integrations configure external provider connectivity and credentials.
- Permissions and user roles come from Keycloak resource roles.
- Backend APIs coordinate external integration behavior and must remain the authority for security and business rules.

## Architecture Rules

- Use Angular standalone components.
- Keep feature code under `src/app/features/<feature>`.
- Keep shared reusable UI and utilities under `src/app/shared`.
- Keep app shell, configs, interceptors, and base infrastructure under `src/app/core`.
- Do not put feature-specific API calls in `shared` or `core`.
- Register protected feature routes in `src/app/app.routes.ts` under `MasterPageComponent`.
- Use `loadComponent` for routed feature pages.
- Follow the existing feature folder shape: `models`, `pages`, `services`, and optional `constants`.

## UI and Component Rules

- Use `PageHeaderComponent` for page titles, subtitles, breadcrumbs, and primary actions.
- Use `FormSidebarComponent` for standard form submit/cancel actions, tips, and metadata.
- Use `EmptyStateComponent` for empty list states.
- Use `AvatarComponent` for identity displays.
- Use Reactive Forms for feature forms.
- Prefer reusable `ControlValueAccessor` components for repeated select/input behavior.
- Use existing Bootstrap-compatible theme classes and existing icon class patterns.
- Keep page components responsible for page orchestration, route params, loading flags, and submit/delete handlers.
- Keep reusable presentational behavior in `shared/components`.
- Extend `BaseComponent` when using `isLoading`, tenant context, or subscription cleanup.
- Add long-lived subscriptions to `this.subscriptions`.

## API and State Rules

- Create one feature service per backend feature.
- Feature services must extend `BaseService`.
- Use `BaseService` HTTP helpers so backend URL construction, tenant headers, and standard error handling stay consistent.
- Do not build backend URLs in components.
- Prefer CRUD service names `list`, `getById`, `create`, `update`, and `remove`.
- Use explicit domain names for non-CRUD operations.
- Store page-local state in component fields.
- Use `StateService.tenant$` for selected company/tenant context.
- Require tenant context before calling tenant-scoped APIs.
- Do not add a new global state library unless explicitly requested and documented.

## Routing and Permissions Rules

- Use Portuguese business route segments to match the current app.
- Add menu/search entries to `NAVIGATION_CONFIG`.
- Use `KEYCLOAK_ROLES` constants for role names.
- Do not inline role strings in components.
- Use navigation config roles or route `data.roles` for frontend access control.
- Treat UI-level permission checks as usability only; backend APIs must enforce security.

## Feature Creation Guidelines

When creating a new feature such as products, orders, inventory, or marketplace configuration:

1. Create `src/app/features/<feature>/models`.
2. Create `src/app/features/<feature>/services/<feature>.service.ts`.
3. Create routed page components under `src/app/features/<feature>/pages`.
4. Add list, create, and edit routes when applicable.
5. Add navigation and role metadata in `NAVIGATION_CONFIG`.
6. Use `PageHeaderComponent`, loading states, empty states, and existing theme classes.
7. Use Reactive Forms for edit/create screens.
8. Keep API calls inside the feature service.
9. Use `NotifyService` for confirmations and user feedback.
10. Update `/docs` if the new feature introduces a real new pattern.

## Constraints

- Do not invent patterns that are not present in the codebase.
- Prefer documenting and following current implementation over idealized architecture.
- Avoid new direct `window`, `document`, or jQuery usage in feature components.
- Wrap unavoidable imperative library usage behind shared services or factories.
- Do not duplicate standard API error notifications already handled by `BaseService`.
- Preserve existing user changes and unrelated work.
