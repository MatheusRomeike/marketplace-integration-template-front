# Frontend Architecture

Integration Template is an Angular frontend for managing integration data between internal systems and external marketplaces. The current implementation focuses on tenant/company context, marketplace integrations, company groups, companies, authentication, and the application shell.

## Application Shape

- Framework: Angular 20 standalone application.
- Bootstrap: `src/main.ts` bootstraps `App` with `appConfig`.
- Root component: `src/app/app.ts` renders only the root `router-outlet`.
- Global providers: `src/app/app.config.ts` configures router, Keycloak, HTTP interceptors, locale data, and `AppInjector`.
- Styling/assets: global vendor styles and scripts are configured in `angular.json`, including Bootstrap-like template assets, Tabler/Boxicons, DataTables, SweetAlert2, Toasty, PerfectScrollbar, Waves, ApexCharts, and jQuery.

## Folder Structure

```text
src/app
  core
    components       Application shell and base classes
    configs          Keycloak, navigation, session resolver
    interceptors     HTTP-level cross-cutting handling
    models           Core DTOs
    services         Base API service and shell/navigation services
  features
    companies        Company models, pages, and API service
    company-groups   Company group models, pages, and API service
    home             Home and authentication pages
    integrations     Marketplace integration models, pages, constants, and API service
  shared
    components       Reusable UI controls and display components
    constants        Shared constants such as auth/provider values
    directives       Shared UI behavior directives
    factories        Wrappers around imperative libraries
    guards           Route guards
    models           Shared frontend models
    pipes            Presentation formatting
    services         Session, state, notification, and user services
    utils            UI/data helpers
```

## Module and Route Boundaries

The project uses standalone components instead of Angular NgModules.

Routes are centralized in `src/app/app.routes.ts`:

- Public routes:
  - `/` login page.
  - `/forbidden` access denied page.
  - `/not-enabled` disabled or unregistered user page.
- Authenticated shell:
  - `MasterPageComponent` wraps protected routes.
  - `canActivateChild` applies Keycloak role checks to all child routes.
  - `sessionResolver` loads the Keycloak user profile into local storage before entering the shell when possible.
- Feature routes:
  - `/home` uses direct component routing.
  - `/integracoes`, `/grupos-empresas`, and `/empresas` lazy-load standalone page components with `loadComponent`.

There is no per-feature routing file today. All feature route registration is in the root routes file.

## Core Shell

`MasterPageComponent` defines the authenticated layout:

- `SidebarComponent` renders navigation and company selection.
- `NavbarComponent` renders user navigation and global search.
- Child routes render inside the shell content container.

The shell relies on vendor template JavaScript for menu behavior, collapsed layout state, scrolling, and DOM class management. `LayoutService` also directly manipulates global DOM classes for menu state.

## Feature Organization

Each current business feature follows a mostly consistent structure:

```text
features/<feature>
  models
  pages
    <feature>-list
    <feature>-form
  services
```

Current implemented features:

- `company-groups`: list, create, edit, delete company groups.
- `companies`: list, create, edit, delete companies, assign users, regenerate API keys.
- `integrations`: list, create/edit integration credentials, OAuth callback, provider metadata.
- `home`: authenticated landing page and authentication-related pages.

Expected future marketplace domains such as products/catalog, orders, stock, and integration configuration should follow this same feature-first structure.

## Separation of Concerns

Current responsibilities are split as follows:

- Page components own orchestration: route params, loading flags, form creation, validation flow, subscriptions, delete confirmations, navigation, table initialization, and mapping UI state.
- Feature services own HTTP endpoint methods and extend `BaseService`.
- Shared services own cross-feature state and platform concerns: tenant context, session storage, notifications, and user company lookup.
- Shared components own reusable UI controls such as page headers, sidebars, selects, avatars, empty states, submit buttons, and logos.
- Core components own the app shell and base classes.

The implementation is pragmatic but page components are relatively heavy. Complex feature logic often lives in components rather than facade/state services.

## Data Flow

Typical list flow:

1. User enters a protected route under `MasterPageComponent`.
2. Guard checks authentication and required Keycloak roles.
3. Page component loads data in `ngOnInit`.
4. Feature service calls backend through `BaseService`.
5. `BaseService` builds the URL from `environment.serverPath` plus the feature base URL.
6. `BaseService` appends tenant headers from `StateService`.
7. Component stores results in public arrays and toggles `isLoading`.
8. Template renders loading, empty, or table/card states.

Typical form flow:

1. Page component creates a Reactive Form in the constructor.
2. Route params determine create vs edit mode.
3. Edit mode loads existing data and patches the form.
4. Submit validates with `form.invalid` and `markAllAsTouched`.
5. Component creates a command/payload and calls the feature service.
6. Success notifications are shown through `NotifyService`.
7. Router navigates back to the feature list.

Tenant/company context flow:

1. `CompanySelectComponent` loads available companies through `UserService`.
2. Selected tenant is stored in `LocalStorageService` session and emitted through `StateService.tenant$`.
3. `BaseService.authHeader()` adds `X-Company-Id` and `X-Group-Company-Id` when context is available.
4. Some pages, such as integration forms, require selected company context before proceeding.

## API Boundaries

Backend calls are currently organized per feature service:

- `CompaniesService` -> `api/companies`
- `CompanyGroupsService` -> `api/company-groups`
- `IntegrationsService` -> `api/integrations`
- `UserService` -> `api/users`

Services generally expose explicit methods such as `list`, `getById`, `create`, `update`, `remove`, or domain-specific operations like `regenerateApiKey`, `getMetadata`, `getAuthorizeUrl`, and `authorize`.

## Known Inconsistencies

- Some components use constructor injection, while others use `inject()`.
- Some components extend `BaseComponent`; `CompanyGroupsListComponent` does not, even though it has loading behavior.
- `styleUrl` and `styleUrls` are both used.
- CRUD service method names are inconsistent: `getAll/save` in companies, `list/create/update` in company groups, `getByCompany/create/update` in integrations.
- `BaseService` handles HTTP errors and there is also an HTTP `errorInterceptor`; responsibilities overlap.
- Some code uses direct DOM/global libraries (`window`, `document`, jQuery DataTables, global `Swal`, global `Toasty`, template helpers), which makes components less purely Angular.
- `IntegrationsFormComponent.onSubmit()` always calls `create`, even when an `id` exists, despite having an `update` service method.
- The wildcard route redirects to `error`, but no `error` route is registered in the current routes file.
