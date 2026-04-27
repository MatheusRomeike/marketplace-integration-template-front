# Frontend Conventions

## Naming

Use the existing Angular naming style:

- Components: `PascalCase` class names ending in `Component`.
- Services: `PascalCase` class names ending in `Service`.
- Guards: descriptive file names ending in `.guard.ts`.
- Factories: descriptive class names ending in `Factory`.
- Models and DTOs: descriptive names matching backend concepts where possible.
- Select form controls: component names ending in `SelectComponent`.

File naming:

- Component files use kebab-case folder and file names:
  - `companies-list.component.ts`
  - `company-groups-form.component.html`
  - `integrations-callback.component.scss`
- Services use feature names:
  - `companies.service.ts`
  - `company-groups.service.ts`
  - `integrations.service.ts`
- Models are grouped by feature and may use domain suffixes:
  - `.model.ts`
  - `.command.ts`
  - `.query.ts`
  - `.result.ts`

Selectors use the `app-` prefix:

```ts
selector: 'app-companies-list'
```

## Folder Rules

Put new business capabilities under `src/app/features/<feature>`.

Use this structure for feature work:

```text
features/<feature>
  constants      Optional feature constants
  models         Feature models, commands, results, enums
  pages          Routed page components
  services       Feature API service
```

Use `shared` for reusable cross-feature code:

- Reusable UI components.
- Form controls.
- Pipes.
- Directives.
- Constants used by multiple features.
- Shared frontend models.
- Generic services such as notifications, local storage, user context, or state.

Use `core` for application shell and infrastructure:

- Layout/shell components.
- App-level config.
- Interceptors.
- Base classes.
- Navigation config.
- Session resolver.
- Base API service.

Do not put feature-specific API calls in `shared` or `core`.

## Routing

Add protected feature routes under the `MasterPageComponent` route in `app.routes.ts`.

Use the current route shape:

```ts
{
  path: '<feature-url>',
  children: [
    {
      path: '',
      loadComponent: () => import('./features/<feature>/pages/<feature>-list/<feature>-list.component')
        .then(m => m.<Feature>ListComponent)
    },
    {
      path: 'novo',
      loadComponent: () => import('./features/<feature>/pages/<feature>-form/<feature>-form.component')
        .then(m => m.<Feature>FormComponent)
    },
    {
      path: 'editar/:id',
      loadComponent: () => import('./features/<feature>/pages/<feature>-form/<feature>-form.component')
        .then(m => m.<Feature>FormComponent)
    }
  ]
}
```

Use Portuguese business URLs to match the existing app.

When adding menu/search access, update `NAVIGATION_CONFIG` and set appropriate roles.

## Components

Use standalone components and declare imports locally.

For page components:

- Keep route loading, page state, and UI event handlers in the page component.
- Keep all visible screen text in Portuguese, including page titles, section labels, buttons, placeholders, validation messages, empty states, tabs, and table headings.
- Use shared components for repeated UI pieces.
- Use `PageHeaderComponent` for breadcrumbs and primary page actions.
- Use `FormSidebarComponent` for standard form sidebars.
- Use `EmptyStateComponent` for empty lists.
- Use `AvatarComponent` for initials/identity display.
- Use `*appLoadingCard="isLoading"` for full-card page/form loading states instead of duplicating spinner card markup.
- Use public fields for template state.
- Use `isLoading` for page-level loading state.
- Extend `BaseComponent` when using shared loading state, subscriptions, or tenant context.

For reusable form controls:

- Implement `ControlValueAccessor`.
- Provide `NG_VALUE_ACCESSOR`.
- Accept label, placeholder, required, invalid, disabled, and loading states when applicable.
- Keep data-loading logic inside the control only when the data is generic and reusable.

## Services

Feature API services must extend `BaseService` unless there is a concrete reason not to.

Use this shape:

```ts
@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseService {
  constructor() {
    super('api/products');
  }
}
```

Prefer explicit service methods that express backend use cases:

- `list`
- `getById`
- `create`
- `update`
- `remove`
- Domain-specific verbs such as `authorize`, `regenerateApiKey`, or `getMetadata`.

Do not build backend URLs in components. Put endpoint composition in services.

Use `BaseService` helpers so tenant headers and error handling remain consistent.

## Forms

Use Reactive Forms for feature forms.

Conventions:

- Build the form in the constructor.
- Reconsider tabbed sections when a form becomes large enough that users need to scroll through several distinct groups of fields.
- Use validators in the form definition.
- Load edit data in `ngOnInit` after reading route params.
- Use `patchValue` for API result data.
- Use `markAllAsTouched()` before returning from invalid submits.
- Use `getRawValue()` when disabled values must be submitted.
- Show validation messages near the input.
- Keep command/payload mapping explicit in the submit method.

## State

Use component fields for page-local state.

Use shared services only for state that crosses component or route boundaries:

- Authenticated session.
- Selected tenant/company.
- Layout shell state.
- Cross-feature user/company context.

Use `StateService.tenant$` for selected company context. Do not duplicate selected company state in another global service.

When an API call depends on selected tenant, ensure the tenant is selected before calling the service.

## Permissions

Use `KEYCLOAK_ROLES` for role names. Do not inline role strings in components.

For new protected navigation items:

- Add the item to `NAVIGATION_CONFIG`.
- Set `roles` to the required Keycloak resource roles.
- Set `searchable: true` only when it should appear in global search.

For route-specific overrides, set `data.roles`; otherwise the guard uses `NAVIGATION_CONFIG` based on URL.

Never rely only on hidden UI for security. Backend APIs must enforce permissions.

## Styling

Use SCSS component styles.

Bootstrap and the configured admin theme are the frontend design system baseline. Prefer Bootstrap layout and component markup with theme classes before adding custom UI structure.

Follow existing template/theme classes:

- Bootstrap-compatible grid and utility classes.
- `card`, `card-header`, `card-body` for framed content.
- `btn`, `btn-primary`, `btn-label-secondary`, `btn-icon` for buttons.
- `badge`, `bg-label-*` for statuses.
- `table`, `table-hover`, `table-light` for tabular lists.
- `ngbNav` with Bootstrap classes such as `nav`, `nav-pills`, `nav-tabs`, and `nav-fill` for tabbed forms. Use `[destroyOnHide]="false"` when form controls must keep state across tab changes.
- `ti ti-*` and existing Boxicons classes for icons.

Avoid introducing new global CSS patterns unless the existing theme cannot support the UI.

## Code Style

Project TypeScript settings are strict, but `strictNullChecks` is disabled.

Current formatting conventions:

- Single quotes.
- 100 character Prettier print width.
- Semicolons are used.
- Public component state is often explicitly marked `public`.
- Private injected services are marked `private`.

Prefer typed models for service inputs and outputs. Avoid `any` in new code unless wrapping an untyped third-party library or handling dynamic provider metadata.

## Inconsistencies to Avoid in New Code

- Do not add another CRUD naming style; prefer `list`, `getById`, `create`, `update`, `remove`.
- Do not mix create and update behavior accidentally; edit pages must call update when an id exists.
- Do not add new wildcard redirects without a registered target route.
- Do not duplicate error notification logic already handled by `BaseService`.
- Do not add new direct `window`, `document`, or jQuery usage unless it is isolated behind a shared wrapper.
