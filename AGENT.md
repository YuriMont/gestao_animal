# Agent Context & Guidelines - Gestão Animal

Este arquivo (`@AGENT.md`) atua como a fonte central de verdade para todos os agentes de IA e desenvolvedores que trabalham no projeto "Gestão Animal". O objetivo é reduzir o tempo de contexto, alinhar práticas de codificação e detalhar a arquitetura para evitar inconsistências.

## 📌 Visão Geral do Projeto
**Gestão Animal** é uma plataforma web multi-tenant voltada para o gerenciamento de rebanhos. Ela consolida em uma única interface os controles de saúde animal, ciclo reprodutivo, produção (leite/peso), parte financeira e regras de alerta automático. O sistema é rígido no isolamento de dados entre inquilinos (multi-tenancy) utilizando o conceito de `organizationId`.

## 🛠 Stack Utilizada e Bibliotecas Principais

### Monorepo
*   **Gerenciador:** Yarn 1.22+ Workspaces
*   **Orquestrador:** Turbo (Turborepo) para build e execução de scripts (`turbo.json`).

### Backend (`apps/server`)
*   **Framework API:** Fastify 5
*   **Linguagem:** TypeScript 6.0 + Node.js 20+
*   **Banco de Dados & ORM:** MongoDB gerenciado via Prisma 7
*   **Validação & DTOs:** Zod 4 (integrado com `fastify-type-provider-zod`)
*   **Autenticação:** JWT (JSON Web Tokens) e bcrypt
*   **Documentação da API:** `@scalar/fastify-api-reference` (Swagger UI)

### Frontend (`apps/web`)
*   **Framework UI:** React 19 (SPA) com Vite 8
*   **Roteamento:** TanStack Router (File-based routing)
*   **Data Fetching & Estado Global (Servidor):** TanStack React Query 5
*   **Estado Global (Cliente):** Jotai 2 (usado primordialmente para persistir Auth e preferências locais leves)
*   **Estilização:** Tailwind CSS 4 + shadcn/ui
*   **Geração de Código:** Kubb 4 (cria hooks e types automaticamente a partir do OpenAPI gerado pelo backend)

---

## 🏛 Padrões Arquiteturais e Estrutura de Pastas

> **Nota Importante:** Dentro dos diretórios do frontend (`apps/web`) e do backend (`apps/server`) existem arquivos `.md` específicos que detalham de forma mais aprofundada a arquitetura, o escopo, as convenções e as regras de negócio locais. Recomenda-se consultá-los para obter diretrizes granulares sobre cada ambiente.

### Backend (Clean Architecture por Módulo de Domínio)
O backend não utiliza MVC tradicional. Ele isola as regras de negócio em módulos: `auth`, `core` (animals, organizations, users), `health`, `reproduction`, `production` e `financial`.
Cada módulo obedece à estrutura:
*   `domain/`: Contém as classes TypeScript puras (Entities) e as interfaces dos repositórios (`IXxxRepository`). **Sem dependência de bibliotecas externas.**
*   `infrastructure/`: Contém as implementações dos repositórios (ex: `PrismaXxxRepository`).
*   `application/`: Casos de uso (`use-cases`), que implementam a regra de negócio orquestrando os repositórios.
*   `presentation/`: Pontos de entrada web. Possui `dtos/` (schemas Zod), `controllers/` (handlers do Fastify) e `routes.ts` (definição de rotas + documentação OpenAPI integrada).

### Frontend (SPA Orientada a Funcionalidade e Geração Automática)
*   `src/routes/`: Contém as definições de rotas via TanStack Router.
*   `src/components/`: Componentes visuais base (`shadcn/ui`) ou de uso genérico.
*   `src/gen/`: **[NUNCA EDITAR]** Diretório auto-gerado pelo Kubb. Contém os hooks do React Query mapeados diretamente da API.

---

## 🚦 Fluxo de Desenvolvimento

O ciclo ideal de desenvolvimento de uma nova funcionalidade (Ex: Novo CRUD) deve ser tipicamente *Backend-first*:
1.  **Modelo (Prisma):** Adicione a entidade no `schema.prisma`. **Nunca use `prisma migrate`**. Para refletir as mudanças no MongoDB, execute `cd apps/server && yarn prisma db push`.
2.  **Backend (Lógica):** Crie a estrutura em um novo (ou existente) módulo: `domain`, `infrastructure`, `application` (use-case) e por fim exponha em `presentation` (`dtos`, `controller`, `routes.ts`).
3.  **Verificação:** Confirme se a nova rota está documentada no Swagger UI local (`http://localhost:3333/docs`).
4.  **Frontend (Integração):** Execute `cd apps/web && yarn generate` com o backend rodando. O Kubb vai gerar novos hooks em `src/gen/`.
5.  **Frontend (UI):** Use os hooks (ex: `usePostV1NovaFeature`) nas suas páginas do TanStack Router.

---

## ⌨️ Comandos Importantes

*   `yarn dev`: Inicia todo o monorepo (Frontend + Backend) simultaneamente.
*   `yarn build`: Executa o build de produção via Turbo.
*   `yarn lint` / `yarn format`: Verifica e formata o código utilizando **Biome**.
*   `cd apps/server && yarn prisma db push`: Sincroniza o banco de dados MongoDB com o schema Prisma.
*   `cd apps/web && yarn generate`: Atualiza os hooks de client a partir da API. Requer o backend online!

---

## 🎯 Decisões Técnicas, Convenções e Boas Práticas

### Convenções de Código e Lint
*   O projeto utiliza estritamente o **Biome** (`packages/biome-config`). **Não instale ou utilize ESLint e Prettier**.

### Gerenciamento de Estado e Estilização
*   O uso de Jotai deve ser reduzido ao mínimo (`atomWithStorage` para tokens JWT ou temas). Todo dado originário da API deve ser gerenciado pelo **TanStack React Query** via hooks do Kubb.
*   Estilização é feita via utilitários Tailwind CSS (v4) e componentes shadcn. Evite CSS Modules ou Styled Components a todo custo.

### Multi-tenancy (Cuidado Redobrado!)
*   Todos os modelos críticos possuem a propriedade `organizationId`.
*   O backend injeta via middleware o tenant no `request.tenantId` a partir do JWT.
*   **Regra de Ouro:** Todas as consultas Prisma (`findMany`, `update`, `delete`, etc) criadas em repositories da infraestrutura **DEVEM obrigatoriamente** filtrar o `organizationId` para prevenir vazamento de dados entre fazendas.

### O Que NUNCA Fazer
*   Editar qualquer arquivo dentro de `apps/web/src/gen/` ou o arquivo `apps/web/src/routeTree.gen.ts`.
*   Commitar `.env`.
*   Usar `prisma migrate` (MongoDB exige `prisma db push`).

## 📋 Skills Disponíveis (para Claude Code e Opencode)

Skills em `.agents/skills/` (espelhadas em `.claude/skills/` via symlink). **Devem ser usadas por agentes sempre que o contexto se aplicar.**

| Skill | Foco | Quando Ativar |
|-------|------|---------------|
| `brainstorming` | Exploração de requisitos | Antes de qualquer trabalho criativo (features, componentes, mudanças de comportamento) |
| `caveman` | Comunicação ultra-tersa | Modo econômico de tokens (`/caveman`, "be brief") |
| `executing-plans` | Execução de planos | Quando um plano de implementação escrito precisa ser executado com checkpoints |
| `frontend-design` | UI de alta qualidade | Ao construir páginas, componentes ou qualquer interface frontend |
| `grill-me` | Stress test de planos | Quando o usuário pedir "grill me" ou quiser validar um design |
| `systematic-debugging` | Debug científico | Bugs, test failures, comportamento inesperado — antes de qualquer fix |
| `turborepo` | Build system | Configurar pipelines, cache, CI, dependências entre pacotes |
| `web-design-guidelines` | Revisão de UI | "Review my UI", "check accessibility", "audit design" |
| `writing-plans` | Planos de implementação | Transformar spec em plano detalhado com tasks atômicas |

## 🧠 Context7 (Padrões e Documentação de Referência)

Os agentes envolvidos neste projeto **possuem e devem utilizar ativamente a skill `Context7`**. Esta habilidade atua como um injetor de contexto atualizado e de alto nível para garantir que as decisões de código acompanhem as melhores práticas e a documentação oficial da stack (Fastify 5, Prisma 7, React 19, Tailwind v4, etc).

### Como Utilizar e Quando Ativar
*   **Busca de Padrões:** Sempre que um agente se deparar com um problema não trivial ou precisar de exemplos de como implementar um padrão na arquitetura estabelecida, deve usar o Context7 para encontrar as diretrizes oficiais em vez de deduzir.
*   **Onboarding:** Novos agentes devem invocar mentalmente ou ativamente os preceitos do Context7 para entender rapidamente as limitações e novos recursos da stack, especialmente em versões mais recentes (ex: Server Components em React vs SPA, novos hooks do React 19).
*   **Incentivo:** Como desenvolvedor/agente, **não "chute" implementações**. Confie na skill Context7 para confirmar a assinatura de um método no Prisma 7 ou a forma correta de registrar plugins no Fastify 5.

---

## 🪨 Caveman Mode (Padrão de Eficiência para Agentes)

O modo "Caveman" (Homem das Cavernas) é uma skill de comunicação ultra-comprimida configurada neste projeto (ver `.agents/skills/caveman/SKILL.md`) que **deve ser priorizada sempre que possível por agentes de IA**.
Isso resulta em ~75% de economia de tokens sem perda de precisão técnica.

### Como Utilizar e Quando Ativar
*   **Ativação:** Utilize comandos como `/caveman`, "caveman mode", "talk like caveman" ou defina a intenção de ser o mais breve possível.
*   **Padrão Mental:** Agentes devem utilizar o Caveman por padrão ao realizar tarefas rotineiras de análise profunda, verificação de diretórios e debug de fluxos extensos.
*   **Níveis:** `lite` (profissional mas limpo), `full` (fragmentos e termos curtos - **Padrão recomendado**), `ultra` (siglas máximas e setas causais `A -> B`).

### Workflows Recomendados para Agentes
1.  **Refatoração:** `[Arquivo/Linha] [Ação] [Motivo].`
2.  **Troubleshooting:** `[Log/Erro] -> [Causa Raiz] -> [Ação de Correção]. Fix:`
3.  **Code Review:** Em vez de explicar longamente, aponte diretamente a falha: `Leak de memória no useEffect. Faltou cleanup function. Refatorar.`

### Vantagens do Uso
*   Redução drástica no custo de contexto para longas conversas de troubleshooting.
*   Velocidade de inferência maximizada em interações com modelos.
*   Foco em código e soluções diretas, mitigando alucinações geradas por "fluff" verbal.

### Exemplo Prático de Utilização
**Em vez de:** *"Parece que o problema está acontecendo porque você esqueceu de incluir o `organizationId` na sua consulta do Prisma, o que está causando o vazamento de dados entre os tenants. Para resolver isso, você deve atualizar o repository."*
**Usando Caveman (full):** *"Bug no repository. `organizationId` ausente no `findMany`. Vazamento de tenant. Fix: adicionar `{ where: { organizationId: tenantId } }`."*

### Boas Práticas do Caveman (Desativação)
Agentes devem **pausar automaticamente** o modo Caveman sempre que precisarem:
1.  Avisar sobre riscos de segurança ou exclusões destrutivas irreversiveis (`DROP TABLE`, `deleteMany` sem `where`).
2.  Quando a compressão técnica puder gerar ambiguidade na sequência de comandos de um deploy ou migração complexa.
3.  Quando o usuário explicitamente pedir detalhes ou "normal mode".
*Volte ao Caveman logo após resolver a ambiguidade.*
*(Este arquivo deve ser atualizado periodicamente conforme novas decisões de arquitetura e padrões forem consolidados pela equipe ou pelo Agente IA.)*
