# PLAN: Bíblia 360° MVP

## Overview
Desenvolvimento do MVP do aplicativo web **Bíblia 360°**, uma plataforma de educação bíblica premium com acesso restrito via login, diferentes níveis de permissão (BASIC e ADVANCED) e conteúdo estruturado. O plano baseia-se diretamente nas especificações e regras de negócio documentadas no PRD anexo.

## Project Type
**WEB** (Next.js, TypeScript, React)

## Success Criteria
- [ ] Sistema de login rodando perfeitamente sem erros.
- [ ] Redirecionamento forçado para `/change-password` no primeiro acesso operando como esperado.
- [ ] Lógica de planos (BASIC e ADVANCED) restringe a visualização e acesso a PDFs e páginas.
- [ ] Lógica D7 para desbloqueio de conteúdo bônus funciona e o registro de `bonusUnlockedAt` é salvo corretamente.
- [ ] PDFs não são acessíveis via URLs diretas (protegidos via API Authenticated route).
- [ ] Design premium dark-first implementado corretamente, sem templates genéricos e sem uso de cores roxas/violetas (de acordo com as regras dos agentes especialistas).

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database & ORM:** PostgreSQL + Prisma
- **Auth:** NextAuth.js v5 (Auth.js)
- **UI & Styling:** Tailwind CSS, shadcn/ui, Framer Motion
- **PDF Viewer:** react-pdf (`@react-pdf-viewer/core`)
- **Deploy:** Netlify

## File Structure
A organização em diretórios seguirá estritamente a proposta delineada no PRD (`app/(auth)`, `app/(app)`, `components/ui`, `components/shared`, `lib/`, `prisma/`, etc).

---

## Task Breakdown

### P0: Foundation

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| `task-1` | **Setup Inicial do Projeto** | `frontend-specialist` | `app-builder`, `clean-code` | P0 | None | **IN:** PRD Stack -> **OUT:** Projeto Next.js configurado, Tailwind + shadcn/ui injetado -> **VERIFY:** `npm run build` passa com sucesso. |
| `task-2` | **Setup Prisma e Banco de Dados** | `database-architect` | `database-design` | P0 | `task-1` | **IN:** Schema.prisma do PRD -> **OUT:** Schema criado, seed script com conteúdo inicial -> **VERIFY:** `npx prisma db seed` roda e insere dados. |

### P1: Core (Backend & Auth)

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| `task-3` | **Autenticação & Middleware** | `security-auditor` | `api-patterns` | P1 | `task-2` | **IN:** PRD NextAuth + Regras Login -> **OUT:** Middleware protetor, Rotas T1/T2, NextAuth handler -> **VERIFY:** Tentativa acesso `/home` sem sessão redireciona p/ `/login`. |
| `task-4` | **Regras de Acesso e API PDF** | `backend-specialist` | `api-patterns` | P1 | `task-3` | **IN:** Regras D7 e Planos -> **OUT:** `/api/pdf/[slug]`, lib/plan-access.ts -> **VERIFY:** Usuário BASIC recebe 403 ao tentar acessar PDF restrito. |

### P2: UI/UX (Frontend)

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| `task-5` | **Biblioteca e Leitor de PDF (T3, T4, T5)** | `frontend-specialist` | `frontend-design` | P2 | `task-4` | **IN:** Design System PRD -> **OUT:** UI com Leitor de PDF e proteção de views -> **VERIFY:** Contador de páginas + zoom do PDF funcioam perfeitamente. |
| `task-6` | **Módulo Devocional (T6, T7)** | `frontend-specialist` | `frontend-design` | P2 | `task-4` | **IN:** Seed do Devocional -> **OUT:** UI de Grade de Cards, Detalhe da Emoção, Share -> **VERIFY:** Dados dos cards são listados e botões não quebram o layout. |
| `task-7` | **Módulo Guia da Fé (T8, T9)** | `frontend-specialist` | `frontend-design` | P2 | `task-4` | **IN:** Seed Guia da Fé -> **OUT:** Busca, Categorias, OracaoModal Imersivo -> **VERIFY:** OracaoModal exibe por cima do conteúdo sem interrupções e fecha via `Esc`. |
| `task-8` | **Módulo Bônus (T10)** | `frontend-specialist` | `frontend-design` | P2 | `task-4` | **IN:** Lógica D7 -> **OUT:** Página `/bonus` com animações e UI de cadeado/sparkle -> **VERIFY:** CountdownBadge exibe dias restantes corretamente. |

### P3: Polish

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| `task-9` | **Perfil e Troca de Senha** | `frontend-specialist` | `clean-code` | P3 | `task-8` | **IN:** PRD T2/Perfil -> **OUT:** UI Perfil e fluxo de alteração -> **VERIFY:** Formulário submete nova senha criptografada. |
| `task-10` | **Revisões Finais de UX & Animações** | `frontend-specialist` | `frontend-design` | P3 | `task-9` | **IN:** Padrão ouro UI -> **OUT:** Refinamento framer-motion, padding/margins check -> **VERIFY:** Nenhuma quebra visual no responsivo mobile. |

---

## Phase X: Verification

- [ ] Socratic Gate respeitado (Nenhuma decisão arquitetural maior feita de forma impulsiva).
- [ ] Execução: `npm run lint` && `npx tsc --noEmit`
- [ ] Segurança: `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] UX Audit: `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [ ] E2E/Lighthouse: Validar Core Web Vitals localmente usando Chrome DevTools (LightHouse run).
- [ ] Build Test: `npm run build`
- [ ] Cores: Certificar-se que a regra contra "Templates Padrão" e uso de roxo foi respeitada.

> **NOTA DE EXECUÇÃO:** Para iniciar as fases (P0 - P3), execute o comando `/create` ou peça para iniciar a `task-1`.
