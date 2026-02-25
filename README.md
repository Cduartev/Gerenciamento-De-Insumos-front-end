# Gerenciamento de Insumos & Otimização de Produção (Front-end)

> **Teste Prático Full Stack — P&D**

** Objetivo:** Construir uma aplicação para gerenciamento de insumos e otimização de produção industrial.
** Cenário:** Uma fábrica precisa controlar seu estoque de matérias-primas e decidir o que produzir para ter o **maior lucro possível** com o material disponível.

## Requisitos do Desafio Atendidos

-  **Entidades e CRUDs:** Gestão completa de Matérias-Primas (Código, Nome, Qtd) e Produtos (Código, Nome, Valor, Composição).
-  **Cálculo de Produção:** Tela interativa que comunica com a API para analisar o estoque atual e sugerir o **Maior Valor Total de Venda** de forma matemática e exata (resolvendo conflitos de disputa de insumos e priorizando maior retorno financeiro).
-  **Stack Obrigatória:** Desenvolvido em **Vue.js** (Vue 3 + Vuetify).
-  **Qualidade de Código:** Refatorado seguindo conceitos de **Clean Code**, arquitetura limpa, nomenclatura em inglês e estrutura madura.
-  **Diferenciais Implementados:** Internacionalização Nativa (i18n) completa na UI e validações, e Testes Unitários e tratamento de exceções no Back-end.

---

##  Extras e Diferenciais (Além do Pedido)

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
