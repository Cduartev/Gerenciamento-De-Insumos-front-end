# Teste Prático Full Stack - P&D (Front-end)

Aplicação Front-end desenvolvida em **Vue 3**, **Vuetify 4** e **TypeScript** para o desafio técnico de Gerenciamento de Insumos e Produção.

##  o que foi implementado?

Ao longo do desenvolvimento, a arquitetura foi aprimorada com foco em **Clean Code** e melhor experiência do usuário (UX):

- ** Internacionalização (i18n)**
  - O sistema conta com suporte nativo a dois idiomas: **Português (PT)** e **Inglês (EN)**.
  - Alternância de idioma em tempo real via Header.
  - Integração do `vue-i18n` com a engine de internacionalização interna do Vuetify (traduzindo nativamente paginações, alertas e componentes como `v-data-table`).

- ** Sistema de Notificações Interno (Pinia)**
  - Foi desenvolvido um sistema de alerta global (`notificationStore.ts`) acessível pelo sino de notificações no topo da tela.
  - **Alerta de Estoque Baixo:** Sempre que a aplicação é iniciada, o estoque de matérias-primas é checado. Insumos com quantidade menor que 50 disparam um alerta.
  - **Produção Bloqueada:** Integrado ao interceptador de respostas da API. Quando o Back-end recusa uma ordem de produção por falta de matéria-prima, um alerta vermelho é adicionado na central de notificações.

- **Clean Code e Refatoração**
  - Todo o código foi revisado, garantindo a remoção total residuais, "código morto" ou pastas vazias.
  - As interfaces (`types.ts`) e chamadas de serviço foram estreitamente mapeadas para bater nomes rigorosamente com os DTOs em inglês da API, prevenindo falhas de cast de dados.
  - Lógica de extração de erros de API abstraída e modularizada (`extractApiErrorMessage.ts`) isolando regras de negócio em arquivos de serviço.

##  Pré-requisitos

- **Node.js** 18+ instalado
- **pnpm** instalado (`npm install -g pnpm`)
- **Back-end** rodando separadamente na porta `8080` (Spring Boot / Java)

##  Como rodar

```bash
# 1. Instalar as dependências
pnpm install

# 2. Iniciar o servidor de desenvolvimento
pnpm run dev
```

Acesse o front-end em **http://localhost:3000**.

> **Nota:** O Vite está configurado com proxy para redirecionar chamadas da `/api` para `http://localhost:8080`, unificando a origem das requisições e contornando problemas de CORS durante o desenvolvimento.

##  Estrutura do Projeto

```text
src/
├── components/
│   ├── layouts/          # Estrutura Base (MainLayout)
│   ├── product/          # Telas e CRUD de Produtos + Produção
│   ├── production-plan/  # Tela de cálculo autônomo do Plano Ótimo (Sugestão)
│   └── raw-material/     # Telas e CRUD de Matérias-Primas
├── constants/            # Tabelas de domínio estáticas (ex: units of measure)
├── plugins/              # Inicialização do Vuetify, Pinia e i18n
├── router/               # Vue Router configurado
├── services/             # Axios e comunicação HTTP dividida por domínio
├── stores/               # Gerenciamento de Estado Global (Pinia)
├── styles/               # Configuração avançada SCSS / Tailwind / Vuetify Variables
├── utils/                # Interceptadores e helpers (ex: extractApiErrorMessage)
└── types.ts              # Definições de Tipos TypeScript (Refletindo os DTOs)
```

##  Técnologias Utilizadas

- **Vue 3** (Composition API + `<script setup>`)
- **Vuetify 4** (Componentes de UI Material Design)
- **TypeScript** (Segurança de Tipagem)
- **Pinia** (State Management)
- **Vue-i18n** (Internacionalização)
- **Axios** (Cliente HTTP)
- **Vite** (Build Tool)
