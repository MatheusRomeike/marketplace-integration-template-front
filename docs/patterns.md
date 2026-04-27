# Frontend Patterns

## Component Patterns

Components are standalone and declare their dependencies in the `imports` array. Feature pages are usually page-level containers rather than small presentational components.

Common page component traits:

- Implement `OnInit` for initial data loading.
- Hold public template state directly on the component.
- Use `isLoading` flags for async state.
- Call services directly from the component.
- Show success/error/confirmation messages through `NotifyService`.
- Navigate with `Router` after successful create/update/delete operations.
- Use Angular control flow syntax such as `@if` and `@for` in templates.

Container/presentational split:

- Page components are containers and own most behavior.
- Shared components are presentational or reusable controls.
- `CompanyGroupSelectComponent` is a reusable form control using `ControlValueAccessor`.
- `CompanySelectComponent` is a shared shell control with side effects because it changes tenant context and reloads the page.

Use `BaseComponent` when a component needs shared loading state, subscription cleanup, or access to `StateService`. It provides:

- `isLoading`
- `subscriptions`
- `stateService`
- `observableContext()`
- `ngOnDestroy()` subscription cleanup

When a component subscribes manually and the subscription may outlive a single request, add it to `this.subscriptions`.

## Page Header and Form Layout

Feature pages commonly use:

- `PageHeaderComponent` for title, subtitle, breadcrumbs, back action, and primary action.
- `FormSidebarComponent` for form submit/cancel actions, tips, and metadata.
- `LoadingCardDirective` through `*appLoadingCard="isLoading"` for full-card loading states.
- Bootstrap/template card layout for form sections and list surfaces.
- Tabler/Boxicons classes for icons.

List pages commonly include:

- Page header with a create action.
- Loading state.
- Empty state through `EmptyStateComponent`.
- Table or card list.
- Search input wired to `DataTableFactory` when DataTables are used.
- Delete confirmation through `NotifyService.confirmation`.

Form pages commonly include:

- Reactive Forms.
- Create/edit mode determined from route `id`.
- Breadcrumb labels based on mode.
- `form.markAllAsTouched()` before returning on invalid submit.
- `isLoading` toggled during load and submit.
- Success notification followed by navigation back to the list.

## Service and API Patterns

Feature API services extend `BaseService` and are provided in root:

```ts
@Injectable({ providedIn: 'root' })
export class ExampleService extends BaseService {
  constructor() {
    super('api/example');
  }
}
```

Use `BaseService` protected methods for normal backend calls:

- `get<T>(url)`
- `post<T>(url, body)`
- `put<T>(url, body)`
- `delete<T>(url)`

`BaseService` behavior:

- Uses `environment.serverPath` as the backend root.
- Builds URLs as `serverPath + baseUrl + url`.
- Sends `Content-Type: application/json`.
- Adds `X-Company-Id` from `StateService.contextAtual` when selected.
- Adds `X-Group-Company-Id` from `StateService.grupoEmpresaAtual` when selected.
- Logs out on 401.
- Extracts backend errors from `errors`, `Errors`, `message`, or `Message`.
- Shows each error through `NotifyService.error`.
- Throws an array of `ErrorMessage` objects.

The Keycloak bearer token is added globally by `includeBearerTokenInterceptor` only for URLs matching `environment.serverPath`.

The `errorInterceptor` currently handles the special 403 `User.NotRegistered` case by redirecting to `/not-enabled`.

Product APIs are scoped by the active company context. Product create and update screens must not expose or send `companyGroupId`; the backend derives the product company group from the selected tenant/company sent through the existing `BaseService` headers.

## State Management Patterns

There is no NgRx or global store library. State is managed with services, RxJS, local storage, and component fields.

Current shared state:

- `StateService.tenant$`: `BehaviorSubject<Tenant | null>` for selected company/tenant context.
- `LocalStorageService`: persists authenticated user session in local storage.
- `LocalStorageService.authenticatedUser$`: emits session registration events.
- `LayoutService.titulo$`: emits title/back-route state for navbar behavior.

Component-local state is preferred for page data:

- Lists are stored in arrays such as `companies`, `companyGroups`, or `integrations`.
- Form state is stored in `FormGroup`.
- Loading state is stored in `isLoading` or feature-specific flags such as `isUsersLoading`.
- UI toggles are stored as booleans such as `showIntegrationAdmins`.

For new feature state, prefer component-local state unless the state must be shared across shell/components/routes. Use a root service with RxJS only for shared state such as tenant, session, layout, or cross-feature filters.

## Routing and Guard Patterns

Routes are declared in `src/app/app.routes.ts`.

Current route conventions:

- Use Portuguese URL segments for business pages.
- Use `loadComponent` for feature pages under authenticated routes.
- Use nested `children` for list/new/edit routes.
- Use `:id` for edit routes.
- Keep public auth/error routes outside the `MasterPageComponent` shell.
- Protect shell children with `canActivateChild: [canActivateAuthRole]`.
- Resolve session data on the shell with `sessionResolver`.

Role lookup order in `canActivateAuthRole`:

1. `route.data['roles']`, when explicitly defined.
2. `getRolesByUrl(state.url)` from `NAVIGATION_CONFIG`.
3. Allow access when no roles are configured.

Navigation and access control are connected through `NAVIGATION_CONFIG`. If a new route should be permission-protected and visible in the menu/search, add it to the navigation config with roles.

## Permissions and Security Patterns

Authentication and authorization use Keycloak through `keycloak-angular` and `keycloak-js`.

Key details:

- Frontend Keycloak client id comes from `environment.keycloak.clientId`.
- Resource role checks use API client id `Integration-Template-api`.
- Role constants live in `shared/constants/auth.constants.ts`.
- Menu visibility is filtered by `NavigationService`.
- Route access is enforced by `canActivateAuthRole`.
- Unauthorized users are routed to `/forbidden`.
- Unregistered users can be redirected to `/not-enabled` based on backend 403 error code.

UI-level permission filtering is not a security boundary. Backend APIs must still enforce authorization.

## UI Library and Imperative Integration Patterns

The UI uses Angular templates with a vendor admin theme and several global JavaScript libraries.

Current patterns:

- Bootstrap markup and the configured admin theme are the design system baseline for layout, cards, buttons, forms, tables, tabs, spacing, and utility classes.
- Use Bootstrap-compatible utility classes and card/table/form classes.
- Use `ngbNav` with Bootstrap classes such as `nav-pills`, `nav-tabs`, and `nav-fill` for tabbed screens instead of custom tab structures.
- Set `[destroyOnHide]="false"` on tabs that contain Reactive Forms controls so values and validation state are preserved.
- Use Tabler icon classes such as `ti ti-plug`.
- Use Boxicons classes in some shared components.
- Use `ng-select` for rich select controls.
- Use DataTables through `DataTableFactory` for searchable/sortable tables.
- Use SweetAlert2 through global `Swal` wrapped by `NotifyService`.
- Use Toasty through global `Toasty` wrapped by `NotifyService`.
- Use PerfectScrollbar and template menu helpers in shell components.

When adding new UI, prefer existing shared components and theme classes before introducing another component library.

## Form Patterns

Reactive Forms are the default pattern.

Current form conventions:

- Create `FormGroup` in the constructor.
- Use `Validators.required`, `Validators.email`, `Validators.minLength`, and dynamic validators as needed.
- Use custom `ControlValueAccessor` components for reusable form controls.
- Use `getRawValue()` when disabled fields must be included.
- Patch loaded data with `form.patchValue`.
- Use dynamic nested `FormGroup` for provider-specific integration fields.

Template-driven forms are not used for feature forms. `FormsModule` is used only where library controls such as `ng-select` need `ngModel`.

## Error and Notification Patterns

Use `NotifyService` for user-visible feedback:

- `success` after successful create/update/delete or authorization.
- `warning` for validation or user-action requirements not captured by form validators.
- `error` for explicit page-level failures.
- `confirmation` before destructive or context-changing actions.

Most API error messages are handled by `BaseService`; page components usually only reset loading state in `error` handlers.

## Improvements to Apply Gradually

- Standardize service method names for CRUD operations.
- Standardize on either constructor injection or `inject()` for new code.
- Standardize on `styleUrl` or `styleUrls`.
- Keep API error normalization in one place to avoid duplicated HTTP error responsibilities.
- Move complex feature orchestration from large page components into dedicated feature services only when reuse or complexity justifies it.
- Avoid adding new direct global DOM dependencies; wrap unavoidable imperative libraries behind small shared services/factories.
