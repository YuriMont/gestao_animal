# PRD — Gestão Animal Web App (`apps/web`)

**Produto:** Interface web para gestão de rebanhos e fazendas  
**Audiência:** Produtores rurais, veterinários, gestores de fazenda  
**Status:** Em desenvolvimento ativo  
**Última atualização:** 2026-04-17

---

## 1. Visão geral

O `apps/web` é o frontend SPA (Single Page Application) do sistema de Gestão Animal. Permite que usuários autenticados gerenciem animais, saúde, reprodução, produção, finanças e alertas de uma organização pecuária. Cada organização tem dados completamente isolados (multi-tenant via JWT).

---

## 2. Usuários e papéis

| Papel      | Descrição                                                    |
| ---------- | ------------------------------------------------------------ |
| `MANAGER`  | Acesso total — configurações, CRUD em todos os módulos       |
| `VET`      | Acesso a saúde e reprodução; leitura nos demais              |
| `OPERATOR` | Registro de animais, produção e alertas; sem acesso financeiro|

O frontend recebe o papel via JWT e deve usá-lo para esconder ou desabilitar ações não permitidas.

---

## 3. Módulos funcionais

### 3.1 Dashboard (`/`)

**Objetivo:** Visão executiva do estado atual da fazenda.

**Conteúdo:**
- KPIs em cards: total de animais, receita do mês, alertas ativos, animais em tratamento
- Tabela com os últimos animais cadastrados
- Resumo financeiro (entradas vs saídas)

**Fonte de dados:** múltiplos endpoints — `/v1/animals`, `/v1/financial/summary`, `/v1/alerts`

---

### 3.2 Animais (`/animals`)

**Objetivo:** CRUD completo do rebanho com busca e paginação.

**Funcionalidades:**
- Listagem paginada com filtros por nome/tag
- Cadastro de novo animal via modal (formulário)
- Edição de animal existente via modal
- Exclusão com confirmação
- Campos: nome, tag (identificador único na org), espécie, raça, sexo, data de nascimento, status, peso, notas

**Regras de negócio:**
- Tag deve ser única por organização
- Status possíveis: `ACTIVE`, `SOLD`, `DECEASED`, `QUARANTINE`
- Sexo: `MALE`, `FEMALE`

---

### 3.3 Saúde (`/health`)

**Objetivo:** Registro e consulta de eventos de saúde dos animais.

**Funcionalidades:**
- Registros de saúde (diagnósticos, observações)
- Vacinas aplicadas por animal
- Tratamentos em andamento e histórico

---

### 3.4 Reprodução (`/reproduction`)

**Objetivo:** Controle do ciclo reprodutivo do rebanho.

**Funcionalidades:**
- Registro de cio (estrus)
- Acompanhamento de prenhez (pregnancies)
- Registro de partos (births)

---

### 3.5 Produção (`/production`)

**Objetivo:** Acompanhamento da produtividade individual e do rebanho.

**Funcionalidades:**
- Registro de peso por animal (histórico de ganho de peso)
- Registro de produção de leite (para espécies bovinas/caprinas)

---

### 3.6 Financeiro (`/financial`)

**Objetivo:** Controle de entradas e saídas financeiras da operação.

**Funcionalidades:**
- Listagem de registros financeiros
- Categorização por tipo (receita / despesa)
- Resumo por período

**Restrição:** Visível apenas para `MANAGER`.

---

### 3.7 Alertas (`/alerts`)

**Objetivo:** Sistema proativo de notificações e regras de alerta.

**Funcionalidades:**
- Configuração de regras de alerta (ex: animal sem vacinação há X dias)
- Listagem de notificações ativas
- Marcar alertas como resolvidos

---

### 3.8 Autenticação (`/login`)

**Objetivo:** Acesso seguro ao sistema.

**Funcionalidades:**
- Tab "Entrar": login com e-mail + senha
- Tab "Criar conta": registro com nome, e-mail, senha e nome da organização
- Após login, redireciona para `/`
- Token JWT armazenado no `localStorage`, expiração de 24h

---

## 4. Fluxos principais

### Fluxo de autenticação

```
Usuário acessa qualquer rota
  └─ AppLayout verifica token no localStorage
       ├─ Sem token → redireciona para /login
       └─ Com token → renderiza conteúdo
            └─ Axios adiciona Bearer token em todas as requisições
                 └─ Resposta 401 → logout automático + redirect /login
```

### Fluxo de CRUD (exemplo: animais)

```
Usuário clica "Novo Animal"
  └─ Abre Dialog com formulário
       └─ Submit → usePostV1Animals.mutate(data)
            ├─ Sucesso → invalida cache (getV1AnimalsQueryKey) → lista atualiza
            └─ Erro → exibe mensagem de erro
```

---

## 5. Decisões de design

### Por que TanStack Router?

File-based routing com code splitting automático, type-safe links e loader/action pattern moderno. Alternativa ao React Router v6 com melhor integração TypeScript.

### Por que Kubb (geração de código)?

Elimina a necessidade de escrever e manter manualmente clientes HTTP e tipos TypeScript. O contrato OpenAPI do backend é a fonte única de verdade. Mudanças na API se propagam para o frontend via `yarn generate`.

### Por que TanStack Query?

Cache inteligente, invalidação granular, estado de loading/error/success out-of-the-box, e devtools. Elimina a necessidade de Redux para estado de servidor.

### Por que Jotai (em vez de Context API)?

`atomWithStorage` sincroniza automaticamente com `localStorage`, eliminando a necessidade de implementar manualmente `getStoredAuth`, `localStorage.setItem` e JSON.parse/stringify. Átomos derivados (`isAuthenticatedAtom`) são reativos sem boilerplate de Provider. Componentes assinam apenas os átomos que usam — sem re-renders desnecessários causados por mudanças não relacionadas no contexto.

### Por que shadcn/ui?

Componentes acessíveis (Radix UI), totalmente customizáveis via Tailwind, sem lock-in de biblioteca (código vive no projeto). Consistência visual sem overhead de CSS-in-JS.

---

## 6. Requisitos não funcionais

| Requisito         | Meta                                                         |
| ----------------- | ------------------------------------------------------------ |
| Performance        | Core Web Vitals green; code splitting por rota via Vite     |
| Acessibilidade     | WCAG 2.1 AA via Radix UI primitives                         |
| Responsividade     | Mobile-first; breakpoints sm/md/lg/xl do Tailwind           |
| Segurança          | Sem dados sensíveis em memória além do token; HTTPS em prod |
| Manutenibilidade   | 100% TypeScript strict; Biome sem warnings; gen/ nunca editado |

---

## 7. Integrações

| Sistema       | Como                                                          |
| ------------- | ------------------------------------------------------------- |
| Backend API   | REST via Axios; schema OpenAPI em `/docs/openapi.json`       |
| Auth          | JWT via `/auth/login`; token no `localStorage`               |
| Kubb/OpenAPI  | `yarn generate` puxa schema e gera `src/gen/` automaticamente |

---

## 8. O que está fora de escopo (por ora)

- Notificações push (apenas alertas in-app)
- Relatórios exportáveis (PDF/Excel)
- App mobile nativo
- Internacionalização (i18n) — UI em português brasileiro
- Modo offline / PWA

---

## 9. Backlog de melhorias conhecidas

- [ ] Controle de acesso no frontend baseado em `role` (esconder/desabilitar por papel)
- [ ] Feedback visual de erro por campo nos formulários (hoje: erro genérico)
- [ ] Testes de componentes com Vitest + Testing Library
- [ ] Página de configurações de organização e usuários
- [ ] Gráficos de evolução de peso e produção leiteira
- [ ] Filtros avançados na listagem de animais (espécie, raça, status, faixa etária)
