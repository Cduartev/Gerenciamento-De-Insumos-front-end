# Produção Industrial — Front-end

Front-end em **Vue 3** + **Vuetify 4** + **TypeScript** para o sistema de gerenciamento de insumos e produção industrial.

## Pré-requisitos

- **Node.js** 18+ instalado
- **pnpm** instalado (`npm install -g pnpm`)
- **Back-end** rodando na porta `8080` (Spring Boot)

## Como rodar

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar o servidor de desenvolvimento
pnpm dev
```

O front-end será iniciado em **http://localhost:3000**.

> **Nota:** O Vite está configurado com proxy para redirecionar chamadas `/api` para `http://localhost:8080`, então o back-end precisa estar rodando para as funcionalidades funcionarem.

## Estrutura do Projeto

```
src/
├── components/
│   ├── layouts/          # Layout principal (MainLayout)
│   ├── raw-material/     # CRUD de matérias-primas
│   ├── product/          # CRUD de produtos (com composição)
│   └── production-plan/  # Tela de sugestão de plano de produção
├── services/             # Camada de serviços (chamadas à API em inglês, endpoints em português)
├── constants/            # Constantes (unitOfMeasure.ts)
├── utils/                # Utilitários (extractApiErrorMessage.ts)
├── router/               # Configuração de rotas em inglês
├── plugins/              # Plugins (Vuetify, Pinia, vue-i18n)
├── styles/               # Estilos globais
└── types.ts              # Interfaces TypeScript
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera o build de produção |
| `pnpm preview` | Visualiza o build de produção |
| `pnpm lint` | Executa o linter |

## Tecnologias

- Vue 3 (Composition API + `<script setup>`)
- Vuetify 4
- TypeScript
- Pinia (gerenciamento de estado)
- Vue Router
- Axios (requisições HTTP)
- Vite
