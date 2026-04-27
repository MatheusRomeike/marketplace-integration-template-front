# Marketplace Integration Template Frontend

[🇺🇸 English](#english) | [🇧🇷 Português](#português)

---

## English

A production-grade **Angular 20 frontend template** for building modern integration platforms and management dashboards.

The project was designed as a reusable frontend foundation for systems that need multi-tenant context, reactive forms, provider management, operational dashboards and a clean separation between feature logic, core infrastructure and shared UI components.

> This repository is a sanitized template. It does not include proprietary business rules, customer data, credentials, company-specific implementation details or third-party premium theme assets.

---

### Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Layout](#project-layout)
- [Core Design Patterns](#core-design-patterns)
- [Technology Stack](#technology-stack)
- [UI Components](#ui-components)
- [Security and Authentication](#security-and-authentication)
- [Theme Setup](#theme-setup)
- [Adding a New Feature](#adding-a-new-feature)
- [Configuration](#configuration)
- [Local Development](#local-development)
- [Project Documentation](#project-documentation)
- [License](#license)

---

### Overview

**Marketplace Integration Template Frontend** is a multi-tenant Angular application designed to act as the management interface for integration hubs.

It provides a foundation for:

- Managing marketplace and provider configurations
- Viewing products and catalog data
- Tracking orders, events and operational logs
- Managing tenants, companies and active context
- Handling OAuth-based provider flows
- Building internal dashboards for integration operations

### Key capabilities

| Capability | Implementation |
|---|---|
| Multi-tenant context | `StateService` providing current tenant stream |
| Modern Angular structure | Standalone components without NgModules |
| Reactive forms | Typed reactive forms for feature operations |
| Reusable UI | Shared components for headers, empty states, layout and identity |
| Authentication | Keycloak integration with role-based access control |
| API integration | `BaseService` abstraction for consistent HTTP and tenant handling |
| Subscription cleanup | `BaseComponent` pattern for observable cleanup |
| Dashboard-ready UI | Tables, filters, charts, status indicators and operational views |

---

### Architecture

The project follows a feature-based architecture, grouping code by domain responsibility while keeping core infrastructure and shared UI separated.

```txt
Core ──► Features ◄── Shared
```

**Main rule:** feature modules and components should not depend directly on other features. Shared utilities and Core infrastructure can be used across the application.

---

### Project Layout

```txt
angular-marketplace-integration-template/
├── docs/
│   ├── architecture.md       # Architecture reference
│   ├── patterns.md           # UI/UX and state patterns
│   ├── conventions.md        # Coding and naming conventions
│   └── quick-rules.md        # Essential development rules
├── src/
│   ├── app/
│   │   ├── core/             # Layout, interceptors, guards and base services
│   │   ├── features/         # Domain-specific pages and logic
│   │   ├── shared/           # Reusable UI components, pipes and models
│   │   └── app.routes.ts     # Main routing configuration
│   ├── assets/               # Static assets and theme placeholders
│   └── index.html            # Main entry point
```

---

### Core Design Patterns

#### Feature-Based Services

Each feature owns its own service and API interaction logic.

Services can extend `BaseService` to keep HTTP behavior consistent across the application, including base URL handling, tenant headers, query parameters and common request patterns.

#### Component Orchestration

Page components orchestrate screen behavior.

They are responsible for:

- loading data
- submitting forms
- opening sidebars or modals
- handling filters
- triggering actions
- coordinating UI state

Presentation logic should be moved to shared components when it becomes reusable.

#### State Management

Page-local state stays inside the component.

Global context, such as the current tenant or selected company, is managed through `StateService` and exposed as streams.

#### Subscription Cleanup

The template uses a `BaseComponent` pattern to centralize observable cleanup and reduce memory leaks in components that subscribe manually.

#### Shared UI Composition

Common UI blocks are extracted into shared components to keep feature screens smaller and more consistent.

Examples:

- page headers
- empty states
- form sidebars
- avatars
- status badges
- reusable filter areas

---

### Technology Stack

| Component | Technology |
|---|---|
| Framework | Angular 20 |
| Language | TypeScript |
| Styling | SCSS + Bootstrap 5 |
| UI Components | Ng-Bootstrap + Ng-Select |
| Icons | Boxicons |
| Authentication | Keycloak Angular |
| Dates | Moment.js |
| Charts | ApexCharts |
| Forms | Angular Reactive Forms |
| Routing | Angular Router |

---

### UI Components

The template includes reusable components for common admin dashboard patterns.

| Component | Purpose |
|---|---|
| `PageHeaderComponent` | Titles, breadcrumbs and primary actions |
| `FormSidebarComponent` | Sidebar-based forms, submissions and metadata display |
| `EmptyStateComponent` | Consistent empty-state visualization |
| `AvatarComponent` | Standardized identity display |

The goal is to keep feature pages focused on behavior while shared components handle repetitive layout and presentation details.

---

### Security and Authentication

The template is designed for authenticated enterprise-style applications.

- **Keycloak** for JWT-based authentication
- **Role-based access control** using Keycloak resource roles
- **Tenant isolation** through an active company or tenant context
- **HTTP interceptors** for authentication and tenant headers
- **Route guards** for protected pages
- **Centralized error handling** through interceptors

Sensitive values such as tokens, secrets, credentials and environment-specific URLs should not be committed to the repository.

---

### Theme Setup

This template is designed to work with a **Bootstrap-compatible admin theme**, such as Sneat or a custom internal design system.

> [!IMPORTANT]
> Proprietary theme assets are **not included** in this repository.
>
> If you use a commercial admin theme:
>
> 1. Acquire a valid license for the theme.
> 2. Copy the required CSS/JS files to your local `src/assets/styles/vendor/` and `src/assets/js/` folders.
> 3. Update `src/styles.scss` and `angular.json` according to your theme setup.
> 4. Do not commit premium assets unless the license explicitly allows redistribution.

This repository is intended to provide the Angular application structure and integration dashboard patterns, not to redistribute third-party commercial templates.

---

### Adding a New Feature

Recommended flow:

```txt
1. Create a folder under src/app/features/<feature-name>/
2. Add page components and routes for the feature
3. Create a feature service extending BaseService when API access is needed
4. Add request and response models
5. Add reactive forms and validators
6. Reuse shared components for layout and empty states
7. Add route guards or role checks when required
8. Update documentation when conventions or behavior change
```

Suggested feature structure:

```txt
src/app/features/products/
├── models/
├── services/
├── pages/
│   ├── product-list/
│   └── product-details/
└── product.routes.ts
```

---

### Configuration

Environment-specific configuration should be kept outside source code whenever possible.

Example environment shape:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://api.example.com',
  keycloak: {
    url: 'https://keycloak.example.com',
    realm: 'example-realm',
    clientId: 'example-client'
  }
};
```

Recommended rules:

- Do not commit real production credentials.
- Keep sensitive values outside the repository.
- Use placeholders in example configuration files.
- Keep tenant and authentication configuration centralized.
- Document required environment variables or deployment settings.

---

### Local Development

#### Prerequisites

- Node.js LTS
- Angular CLI

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm start
```

Run Angular directly:

```bash
ng serve
```

Build:

```bash
npm run build
```

---

### Project Documentation

Detailed documentation is maintained under `docs/`.

| File | Contents |
|---|---|
| `docs/architecture.md` | General architecture and project structure |
| `docs/patterns.md` | UI patterns and state management approach |
| `docs/conventions.md` | Coding standards and naming conventions |
| `docs/quick-rules.md` | Summary of mandatory implementation rules |

Before making changes, read the documentation and keep code, patterns and docs consistent.

---

### License

This repository is **not open-source**.

The code is publicly available for portfolio, educational review and professional evaluation purposes only.

Use, copying, modification, distribution, sublicensing, deployment or derivative works are not permitted without explicit written permission from the author.

See [LICENSE](LICENSE) for details.

---

## Português

Um **template frontend Angular 20 production-grade** para construção de plataformas de integração modernas e dashboards de gerenciamento.

O projeto foi desenhado como uma base frontend reutilizável para sistemas que precisam de contexto multi-tenant, formulários reativos, gerenciamento de providers, dashboards operacionais e uma separação clara entre lógica de features, infraestrutura central e componentes de UI compartilhados.

> Este repositório é um template sanitizado. Ele não inclui regras de negócio proprietárias, dados de clientes, credenciais, detalhes específicos de empresa ou assets premium de temas terceiros.

---

### Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Padrões Principais](#padrões-principais)
- [Stack Técnica](#stack-técnica)
- [Componentes de UI](#componentes-de-ui)
- [Segurança e Autenticação](#segurança-e-autenticação)
- [Configuração do Tema](#configuração-do-tema)
- [Adicionando uma Nova Feature](#adicionando-uma-nova-feature)
- [Configuração](#configuração)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Documentação do Projeto](#documentação-do-projeto)
- [Licença](#licença)

---

### Visão Geral

**Marketplace Integration Template Frontend** é uma aplicação Angular multi-tenant criada para atuar como a interface de gerenciamento de hubs de integração.

Ela fornece uma base para:

- Gerenciamento de configurações de marketplaces e providers
- Visualização de produtos e dados de catálogo
- Acompanhamento de pedidos, eventos e logs operacionais
- Gerenciamento de tenants, empresas e contexto ativo
- Fluxos de providers baseados em OAuth
- Construção de dashboards internos para operações de integração

### Capacidades principais

| Capacidade | Implementação |
|---|---|
| Contexto multi-tenant | `StateService` expondo stream do tenant atual |
| Estrutura Angular moderna | Standalone components sem NgModules |
| Formulários reativos | Reactive forms tipados para operações de features |
| UI reutilizável | Componentes compartilhados para headers, empty states, layout e identidade |
| Autenticação | Integração com Keycloak e controle de acesso por roles |
| Integração com API | Abstração `BaseService` para HTTP e tenant handling consistentes |
| Limpeza de subscriptions | Padrão `BaseComponent` para cleanup de observables |
| UI pronta para dashboard | Tabelas, filtros, gráficos, status e visões operacionais |

---

### Arquitetura

O projeto segue uma arquitetura baseada em features, agrupando código por responsabilidade de domínio e mantendo infraestrutura central e UI compartilhada separadas.

```txt
Core ──► Features ◄── Shared
```

**Regra principal:** features e componentes de features não devem depender diretamente de outras features. Utilitários compartilhados e infraestrutura do Core podem ser usados por toda a aplicação.

---

### Estrutura do Projeto

```txt
angular-marketplace-integration-template/
├── docs/
│   ├── architecture.md       # Referência de arquitetura
│   ├── patterns.md           # Padrões de UI/UX e estado
│   ├── conventions.md        # Convenções de código e nomenclatura
│   └── quick-rules.md        # Regras essenciais de desenvolvimento
├── src/
│   ├── app/
│   │   ├── core/             # Layout, interceptores, guards e serviços base
│   │   ├── features/         # Páginas e lógica por domínio
│   │   ├── shared/           # Componentes de UI reutilizáveis, pipes e models
│   │   └── app.routes.ts     # Configuração principal de rotas
│   ├── assets/               # Assets estáticos e placeholders de tema
│   └── index.html            # Ponto de entrada principal
```

---

### Padrões Principais

#### Serviços Baseados em Feature

Cada feature possui seu próprio serviço e sua própria lógica de integração com API.

Os serviços podem estender `BaseService` para manter o comportamento HTTP consistente na aplicação, incluindo base URL, headers de tenant, query params e padrões comuns de requisição.

#### Orquestração de Componentes

Componentes de página orquestram o comportamento das telas.

Eles são responsáveis por:

- carregar dados
- submeter formulários
- abrir sidebars ou modals
- manipular filtros
- disparar ações
- coordenar estado de UI

A lógica de apresentação deve ser movida para componentes compartilhados quando se tornar reutilizável.

#### Gerenciamento de Estado

Estado local de página permanece no componente.

Contexto global, como tenant atual ou empresa selecionada, é gerenciado pelo `StateService` e exposto como streams.

#### Limpeza de Subscriptions

O template usa um padrão `BaseComponent` para centralizar cleanup de observables e reduzir vazamentos de memória em componentes que fazem subscriptions manuais.

#### Composição de UI Compartilhada

Blocos comuns de UI são extraídos para componentes compartilhados para manter as telas de features menores e mais consistentes.

Exemplos:

- headers de página
- empty states
- sidebars de formulário
- avatares
- badges de status
- áreas reutilizáveis de filtros

---

### Stack Técnica

| Componente | Tecnologia |
|---|---|
| Framework | Angular 20 |
| Linguagem | TypeScript |
| Estilização | SCSS + Bootstrap 5 |
| Componentes UI | Ng-Bootstrap + Ng-Select |
| Ícones | Boxicons |
| Autenticação | Keycloak Angular |
| Datas | Moment.js |
| Gráficos | ApexCharts |
| Forms | Angular Reactive Forms |
| Rotas | Angular Router |

---

### Componentes de UI

O template inclui componentes reutilizáveis para padrões comuns de dashboards administrativos.

| Componente | Finalidade |
|---|---|
| `PageHeaderComponent` | Títulos, breadcrumbs e ações primárias |
| `FormSidebarComponent` | Formulários em sidebar, submissões e exibição de metadados |
| `EmptyStateComponent` | Visualização consistente de estado vazio |
| `AvatarComponent` | Exibição padronizada de identidade |

O objetivo é manter as páginas de feature focadas em comportamento enquanto os componentes compartilhados lidam com layout e apresentação repetitivos.

---

### Segurança e Autenticação

O template foi desenhado para aplicações autenticadas no estilo enterprise.

- **Keycloak** para autenticação baseada em JWT
- **Controle por roles** usando resource roles do Keycloak
- **Isolamento de tenant** através de empresa ou tenant ativo
- **Interceptors HTTP** para autenticação e headers de tenant
- **Route guards** para páginas protegidas
- **Tratamento centralizado de erros** por interceptors

Valores sensíveis como tokens, secrets, credenciais e URLs específicas de ambiente não devem ser commitados no repositório.

---

### Configuração do Tema

Este template foi desenhado para funcionar com um **tema admin compatível com Bootstrap**, como Sneat ou um design system interno/customizado.

> [!IMPORTANT]
> Assets proprietários de tema **não estão inclusos** neste repositório.
>
> Caso use um tema admin comercial:
>
> 1. Adquira uma licença válida do tema.
> 2. Copie os arquivos CSS/JS necessários para as pastas locais `src/assets/styles/vendor/` e `src/assets/js/`.
> 3. Atualize o `src/styles.scss` e o `angular.json` conforme a configuração do tema.
> 4. Não commite assets premium, exceto se a licença permitir redistribuição explicitamente.

Este repositório fornece a estrutura da aplicação Angular e os padrões de dashboard de integração, não a redistribuição de templates comerciais de terceiros.

---

### Adicionando uma Nova Feature

Fluxo recomendado:

```txt
1. Criar uma pasta em src/app/features/<nome-da-feature>/
2. Adicionar componentes de página e rotas da feature
3. Criar um serviço da feature estendendo BaseService quando houver acesso à API
4. Adicionar models de request e response
5. Adicionar reactive forms e validators
6. Reutilizar componentes compartilhados para layout e empty states
7. Adicionar guards de rota ou checagens de role quando necessário
8. Atualizar a documentação quando convenções ou comportamentos mudarem
```

Estrutura sugerida de feature:

```txt
src/app/features/products/
├── models/
├── services/
├── pages/
│   ├── product-list/
│   └── product-details/
└── product.routes.ts
```

---

### Configuração

Configurações por ambiente devem ficar fora do código-fonte sempre que possível.

Exemplo de estrutura de environment:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://api.example.com',
  keycloak: {
    url: 'https://keycloak.example.com',
    realm: 'example-realm',
    clientId: 'example-client'
  }
};
```

Regras recomendadas:

- Não commitar credenciais reais de produção.
- Manter valores sensíveis fora do repositório.
- Usar placeholders em arquivos de configuração de exemplo.
- Centralizar configuração de tenant e autenticação.
- Documentar variáveis de ambiente ou configurações necessárias de deploy.

---

### Desenvolvimento Local

#### Pré-requisitos

- Node.js LTS
- Angular CLI

Instalar dependências:

```bash
npm install
```

Rodar o projeto:

```bash
npm start
```

Rodar diretamente com Angular:

```bash
ng serve
```

Build:

```bash
npm run build
```

---

### Documentação do Projeto

A documentação detalhada fica na pasta `docs/`.

| Arquivo | Conteúdo |
|---|---|
| `docs/architecture.md` | Arquitetura geral e estrutura do projeto |
| `docs/patterns.md` | Padrões de UI e abordagem de gerenciamento de estado |
| `docs/conventions.md` | Padrões de código e convenções de nomenclatura |
| `docs/quick-rules.md` | Resumo das regras de implementação obrigatórias |

Antes de fazer alterações, leia a documentação e mantenha código, padrões e docs consistentes.

---

### Licença

Este repositório **não é open-source**.

O código está disponível publicamente apenas para fins de portfólio, avaliação educacional e avaliação profissional.

O uso, cópia, modificação, distribuição, sublicenciamento, implantação ou criação de trabalhos derivados não são permitidos sem autorização expressa por escrito do autor.

Veja [LICENSE](LICENSE) para mais detalhes.
