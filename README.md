# Marketplace Integration Template (Frontend)

[🇺🇸 English](#english) | [🇧🇷 Português](#português)

---

## English

A production-grade **Angular 20 frontend template** for building modern integration platforms and management dashboards.

The project was designed as a reusable frontend foundation for systems that need multi-tenant isolation, reactive forms, provider management, and a clean separation between feature logic, core infrastructure, and shared UI components.

> This repository is a sanitized template. It does not include proprietary business rules, customer data, credentials or company-specific implementation details.

---

### Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Layout](#project-layout)
- [Core Design Patterns](#core-design-patterns)
- [Technology Stack](#technology-stack)
- [UI Components](#ui-components)
- [Security & Authentication](#security--authentication)
- [Adding a New Feature](#adding-a-new-feature)
- [Configuration](#configuration)
- [Local Development](#local-development)
- [Theme Setup](#theme-setup)
- [Project Documentation](#project-documentation)
- [License](#license)

---

### Overview

**Marketplace Integration Template** is a multi-tenant Angular application designed to act as the management interface for integration hubs.

It provides a solid foundation for:

- Managing marketplace configurations
- Product and catalog visualization
- Order tracking and operational logs
- Tenant and company management
- Multi-provider authentication flows (OAuth)

### Key capabilities

| Capability | Implementation |
|---|---|
| Multi-tenant context | `StateService` providing current tenant stream |
| Standalone Components | Modern Angular architecture without NgModules |
| Reactive Forms | Strongly typed forms for all feature operations |
| Reusable UI | Shared components for headers, empty states, and layout |
| Authentication | Keycloak integration with role-based access control |
| API Integration | Base service abstraction for consistent HTTP/Tenant handling |

---

### Architecture

The project follows a feature-based architecture, grouping code by domain responsibility while keeping core infrastructure and shared UI separate.

```txt
Core ──► Features ◄── Shared
```

**Main rule:** Feature components should never depend on other features. Shared utilities and Core infrastructure are available to all features.

---

### Project Layout

```txt
marketplace-integration-template/
├── docs/                     # Detailed technical documentation
│   ├── architecture.md       # Architecture reference
│   ├── patterns.md           # UI/UX patterns catalog
│   ├── conventions.md        # Coding and naming conventions
│   └── quick-rules.md        # Essential development rules
├── src/
│   ├── app/
│   │   ├── core/             # Layout, interceptors, guards, and base services
│   │   ├── features/         # Domain-specific pages and logic (products, orders, etc)
│   │   ├── shared/           # Reusable UI components, pipes, and models
│   │   └── app.routes.ts     # Main routing configuration
│   ├── assets/               # Static assets and theme placeholders
│   └── index.html            # Main entry point
```

---

### Core Design Patterns

#### Feature-Based Services

Each feature has its own service extending `BaseService` to handle API interactions consistently.

#### Component Orchestration

Page components are responsible for orchestration (loading flags, submitting forms), while presentation logic lives in shared components.

#### State Management

Page-local state is kept in component fields. Global context like the active tenant is managed via `StateService`.

#### Subscription Cleanup

Uses `BaseComponent` to automatically manage and clean up observable subscriptions.

---

### Technology Stack

| Component | Technology |
|---|---|
| Framework | Angular 20 |
| Styling | SCSS + Bootstrap 5 |
| UI Components | Ng-Bootstrap + Ng-Select |
| Icons | Boxicons |
| Authentication | Keycloak Angular |
| Date Management | Moment.js |
| Charts | ApexCharts |

---

### UI Components

The template includes several high-level reusable components:

- **PageHeaderComponent**: Handles titles, breadcrumbs, and primary actions.
- **FormSidebarComponent**: Standardizes form submissions and metadata display.
- **EmptyStateComponent**: Consistent "no data" visualization.
- **AvatarComponent**: Standardized identity display.

---

### Security & Authentication

- **Keycloak**: Integrated for JWT-based authentication.
- **Roles**: Access control based on Keycloak resource roles.
- **Tenant Isolation**: Mandatory `X-Company-Id` header injected by interceptors.

---

### Theme Setup

This template is designed to work with a **Bootstrap-compatible admin theme** (like Sneat). 

> [!IMPORTANT]
> The proprietary theme assets are NOT included in this repository.
> 1. Acquire a license for your preferred theme.
> 2. Copy the CSS/JS files to `src/assets/styles/vendor/` and `src/assets/js/`.
> 3. Update `src/styles.scss` and `angular.json` accordingly.

---

### Local Development

#### Prerequisites

- Node.js (Latest LTS)
- Angular CLI

#### Installation

```bash
npm install
```

#### Running the project

```bash
npm start
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

---

### License

This project is intended as a production-grade frontend template. 

Adapt and distribute under the terms appropriate for your organization.

---

## Português

Um **template frontend Angular 20 production-grade** para construção de plataformas de integração modernas e dashboards de gerenciamento.

O projeto foi desenhado como uma base reutilizável para sistemas que precisam de isolamento multi-tenant, formulários reativos, gerenciamento de provedores e uma separação clara entre lógica de funcionalidades (features), infraestrutura central e componentes de UI compartilhados.

> Este repositório é um template sanitizado. Ele não inclui regras de negócio proprietárias, dados de clientes, credenciais ou detalhes específicos de empresa.

---

### Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Padrões Principais](#padrões-principais)
- [Stack Técnica](#stack-técnica)
- [Componentes de UI](#componentes-de-ui)
- [Segurança e Autenticação](#segurança-e-autenticação)
- [Adicionando uma Nova Feature](#adicionando-uma-nova-feature)
- [Configuração](#configuração)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Configuração do Tema](#configuração-do-tema)
- [Documentação do Projeto](#documentação-do-projeto)
- [Licença](#licença)

---

### Visão Geral

**Marketplace Integration Template** é uma aplicação Angular multi-tenant criada para atuar como a interface de gerenciamento de hubs de integração.

Fornece uma base sólida para:

- Gerenciamento de configurações de marketplaces
- Visualização de produtos e catálogos
- Acompanhamento de pedidos e logs operacionais
- Gerenciamento de empresas e tenants
- Fluxos de autenticação multi-provedor (OAuth)

### Capacidades principais

| Capacidade | Implementação |
|---|---|
| Contexto Multi-tenant | `StateService` provendo o stream do tenant atual |
| Standalone Components | Arquitetura Angular moderna sem NgModules |
| Formulários Reativos | Forms fortemente tipados para todas as operações |
| UI Reutilizável | Componentes compartilhados para headers, empty states e layout |
| Autenticação | Integração com Keycloak e controle de acesso por roles |
| Integração com API | Abstração de BaseService para tratamento consistente de HTTP/Tenant |

---

### Arquitetura

O projeto segue uma arquitetura baseada em features, agrupando o código por responsabilidade de domínio, mantendo a infraestrutura central e UI compartilhada separadas.

```txt
Core ──► Features ◄── Shared
```

**Regra principal:** Componentes de uma feature nunca devem depender de outras features. Utilitários compartilhados e a infraestrutura do Core estão disponíveis para todas as features.

---

### Estrutura do Projeto

```txt
marketplace-integration-template/
├── docs/                     # Documentação técnica detalhada
│   ├── architecture.md       # Referência de arquitetura
│   ├── patterns.md           # Catálogo de padrões de UI/UX
│   ├── conventions.md        # Convenções de código e nomenclatura
│   └── quick-rules.md        # Resumo de regras essenciais
├── src/
│   ├── app/
│   │   ├── core/             # Layout, interceptores, guards e serviços base
│   │   ├── features/         # Páginas e lógica por domínio (produtos, pedidos, etc)
│   │   ├── shared/           # Componentes de UI reutilizáveis, pipes e modelos
│   │   └── app.routes.ts     # Configuração principal de rotas
│   ├── assets/               # Assets estáticos e placeholders de tema
│   └── index.html            # Ponto de entrada principal
```

---

### Padrões Principais

#### Serviços baseados em Feature

Cada feature possui seu próprio serviço que estende `BaseService` para lidar com chamadas de API de forma padronizada.

#### Orquestração de Componentes

Componentes de página são responsáveis pela orquestração (loading, submissão de forms), enquanto a lógica de apresentação fica em componentes compartilhados.

#### Gerenciamento de Estado

O estado local das páginas é mantido nos campos do componente. O contexto global, como o tenant ativo, é gerenciado via `StateService`.

#### Limpeza de Subscriptions

Utiliza o `BaseComponent` para gerenciar e limpar automaticamente as inscrições em Observables.

---

### Stack Técnica

| Componente | Tecnologia |
|---|---|
| Framework | Angular 20 |
| Estilização | SCSS + Bootstrap 5 |
| Componentes UI | Ng-Bootstrap + Ng-Select |
| Ícones | Boxicons |
| Autenticação | Keycloak Angular |
| Datas | Moment.js |
| Gráficos | ApexCharts |

---

### Componentes de UI

O template inclui diversos componentes reutilizáveis de alto nível:

- **PageHeaderComponent**: Gerencia títulos, breadcrumbs e ações primárias.
- **FormSidebarComponent**: Padroniza submissões de formulários e exibição de metadados.
- **EmptyStateComponent**: Visualização consistente para estados sem dados.
- **AvatarComponent**: Exibição padronizada de identidade.

---

### Configuração do Tema

Este template foi desenhado para funcionar com um **tema admin compatível com Bootstrap** (como o Sneat).

> [!IMPORTANT]
> Os assets proprietários do tema NÃO estão inclusos neste repositório.
> 1. Adquira uma licença para o tema de sua preferência.
> 2. Copie os arquivos CSS/JS para `src/assets/styles/vendor/` e `src/assets/js/`.
> 3. Atualize o `src/styles.scss` e o `angular.json` conforme necessário.

---

### Desenvolvimento Local

#### Pré-requisitos

- Node.js (Última LTS)
- Angular CLI

#### Instalação

```bash
npm install
```

#### Rodando o projeto

```bash
npm start
```

---

### Documentação do Projeto

A documentação detalhada é mantida na pasta `docs/`.

| Arquivo | Conteúdo |
|---|---|
| `docs/architecture.md` | Arquitetura geral e estrutura do projeto |
| `docs/patterns.md` | Padrões de UI e abordagem de gerenciamento de estado |
| `docs/conventions.md` | Padrões de código e convenções de nomenclatura |
| `docs/quick-rules.md` | Resumo das regras de implementação obrigatórias |

---

### Licença

Este projeto é pensado como um template frontend production-grade.

Adapte e distribua conforme os termos apropriados para sua organização.
