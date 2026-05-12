# PRD — Bíblia 360° MVP
**Versão:** 1.0  
**Status:** Em Definição  
**Plataforma:** Web App (Next.js) — Deploy Netlify  
**Banco de Dados:** PostgreSQL (servidor próprio) via Prisma ORM  
**Data:** Maio/2026

---

## Índice

1. [Visão do Produto](#1-visão-do-produto)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estrutura do Projeto](#3-estrutura-do-projeto)
4. [Banco de Dados — Schema Prisma](#4-banco-de-dados--schema-prisma)
5. [Regras de Planos & Controle de Acesso](#5-regras-de-planos--controle-de-acesso)
6. [Autenticação & Fluxo de Acesso](#6-autenticação--fluxo-de-acesso)
7. [Módulo: Biblioteca de PDFs](#7-módulo-biblioteca-de-pdfs)
8. [Módulo: Devocional — Emoções da Bíblia](#8-módulo-devocional--emoções-da-bíblia)
9. [Módulo: Guia da Fé](#9-módulo-guia-da-fé)
10. [Módulo: Conteúdo Bônus (D7+)](#10-módulo-conteúdo-bônus-d7)
11. [Mapa de Rotas](#11-mapa-de-rotas)
12. [Design System](#12-design-system)
13. [Variáveis de Ambiente](#13-variáveis-de-ambiente)
14. [Regras de Negócio Consolidadas](#14-regras-de-negócio-consolidadas)
15. [Roadmap de Entregas](#15-roadmap-de-entregas)
16. [Fora do Escopo do MVP](#16-fora-do-escopo-do-mvp)

---

## 1. Visão do Produto

O **Bíblia 360°** é uma aplicação web premium de educação bíblica estruturada, desenvolvida como extensão digital do *Quiz Bíblia 360° — O Código do Destrave*. Entrega o conteúdo do produto em formato interativo, com acesso controlado por credenciais e planos diferenciados.

### Proposta de Valor

Transformar os Mapas Bíblicos, Resumos, Devocional, Guia da Fé e materiais de apoio em uma experiência digital sofisticada, espiritual e educacional — acessível pelo navegador, com design premium dark-first que transmite autoridade e cuidado.

### Objetivos do MVP

| Objetivo | Métrica | Meta |
|---|---|---|
| Segurança de acesso | % usuários com senha alterada no 1º acesso | > 95% |
| Ativação | % que acessam ≥ 2 seções na 1ª semana | > 60% |
| Retenção D7 | % usuários ativos no 7º dia | > 40% |
| Engajamento PDFs | Média de PDFs abertos por sessão | > 1.5 |
| Engajamento Devocional | % que abrem na 1ª semana | > 50% |
| Engajamento Guia da Fé | % que abrem na 1ª semana | > 45% |

---

## 2. Stack Tecnológico

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR/SSG, deploy fácil na Netlify |
| Linguagem | **TypeScript** | Tipagem forte para ORM e API routes |
| ORM | **Prisma** | Suporte nativo a PostgreSQL, migrations, type-safety |
| Banco de Dados | **PostgreSQL** (servidor próprio) | Dados de usuário, sessões, conteúdo |
| Autenticação | **NextAuth.js v5** (Auth.js) | JWT + Prisma adapter + Credentials provider |
| Estilização | **Tailwind CSS** | Utility-first, fácil implementar o design system |
| Componentes | **shadcn/ui** | Acessíveis, customizáveis, baseados em Radix UI |
| Leitor de PDF | **react-pdf** (`@react-pdf-viewer/core`) | Renderização de PDF no browser |
| Animações | **Framer Motion** | Transições de tela e micro-interações |
| Deploy | **Netlify** | CI/CD automático via Git |
| Fontes | Google Fonts: Playfair Display + DM Sans | Identidade visual do produto |

### Dependências Principais

```bash
# Core
npm install next@14 react react-dom typescript

# ORM & DB
npm install prisma @prisma/client
npx prisma init

# Auth
npm install next-auth@beta @auth/prisma-adapter

# UI
npm install tailwindcss @tailwindcss/typography
npx shadcn-ui@latest init

# PDF Viewer
npm install @react-pdf-viewer/core @react-pdf-viewer/default-layout pdfjs-dist

# Animações
npm install framer-motion

# Utilities
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

---

## 3. Estrutura do Projeto

```
biblia360/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                  # T1 — Tela de Login
│   │   └── reset-password/
│   │       └── page.tsx                  # Recuperação de senha
│   ├── (app)/
│   │   ├── layout.tsx                    # Layout com sidebar/nav autenticado
│   │   ├── home/
│   │   │   └── page.tsx                  # T3 — Home / Dashboard
│   │   ├── biblioteca/
│   │   │   ├── page.tsx                  # T4 — Biblioteca de PDFs
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # T5 — Leitor de PDF
│   │   ├── devocional/
│   │   │   ├── page.tsx                  # T6 — Hub Devocional
│   │   │   └── [id]/
│   │   │       └── page.tsx              # T7 — Detalhe do Devocional
│   │   ├── guia-da-fe/
│   │   │   ├── page.tsx                  # T8 — Hub Guia da Fé
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # T9 — Detalhe do Tema
│   │   ├── bonus/
│   │   │   └── page.tsx                  # T10 — Conteúdo Bônus (D7+ / plano avançado)
│   │   └── perfil/
│   │       └── page.tsx                  # Perfil & troca de senha
│   ├── change-password/
│   │   └── page.tsx                      # T2 — Troca de senha obrigatória (1º acesso)
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts              # NextAuth handler
│       ├── user/
│       │   ├── change-password/
│       │   │   └── route.ts
│       │   └── reset-password/
│       │       └── route.ts
│       └── pdf/
│           └── [slug]/
│               └── route.ts              # Serve PDF com auth check (stream protegido)
├── components/
│   ├── ui/                               # shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── ChangePasswordForm.tsx
│   ├── biblioteca/
│   │   ├── PdfCard.tsx                   # Card da biblioteca
│   │   ├── PdfCardLocked.tsx             # Card bloqueado (plano básico / D7)
│   │   └── PdfViewer.tsx                 # Wrapper do react-pdf-viewer
│   ├── devocional/
│   │   ├── EmocaoCard.tsx
│   │   └── EmocaoDetail.tsx
│   ├── guia-da-fe/
│   │   ├── TemaCard.tsx
│   │   ├── TemaDetail.tsx
│   │   └── OracaoModal.tsx               # Modo imersivo de oração
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── Header.tsx
│   └── shared/
│       ├── LockOverlay.tsx               # Overlay de conteúdo bloqueado
│       ├── CountdownBadge.tsx            # "Disponível em X dias"
│       └── SkeletonCard.tsx
├── lib/
│   ├── prisma.ts                         # Prisma client singleton
│   ├── auth.ts                           # NextAuth config
│   ├── plan-access.ts                    # Helpers de verificação de plano
│   └── pdf-access.ts                     # Lógica de acesso aos PDFs
├── prisma/
│   ├── schema.prisma                     # Schema do banco
│   └── seed.ts                           # Seed: PDFs, temas do Guia da Fé, cards do Devocional
├── public/
│   └── pdfs/                             # PDFs do produto (pasta local)
│       ├── 01-Antigo_Testamento_Mapa_Bíblico.pdf
│       ├── 02-Novo_Testamento_Mapa_Biblico.pdf
│       ├── 09-Resumo_Biblico_Antigo_Testamento.pdf
│       ├── 10-Resumo_Biblico_Novo_Testamento.pdf
│       ├── 03-Divisao_Biblica_Mapa_Biblico.pdf        # bônus
│       ├── 04-Tabela_Biblica_Mapa_Biblico.pdf         # bônus
│       └── 05-Planner_devocional_Mapa_Bíblico.pdf    # bônus
├── types/
│   └── index.ts                          # Tipos globais TypeScript
├── middleware.ts                         # Proteção de rotas autenticadas
├── next.config.js
├── tailwind.config.ts
├── netlify.toml                          # Configuração de deploy Netlify
└── .env                                  # Variáveis de ambiente (não versionar)
```

> **Nota sobre os PDFs:** Os arquivos PDF devem ser colocados em `public/pdfs/`. O acesso a eles é protegido por middleware — a URL direta `/pdfs/arquivo.pdf` não é servida publicamente. O conteúdo é entregue via API route autenticada (`/api/pdf/[slug]`) que valida sessão e plano antes de fazer o stream do arquivo.

---

## 4. Banco de Dados — Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ────────────────────────────────────────────────

enum UserPlan {
  BASIC     // Plano básico — acesso restrito
  ADVANCED  // Plano avançado — acesso total
}

enum PdfCategory {
  BIBLIOTECA  // Cards principais da biblioteca
  BONUS       // Conteúdo bônus (D7+ e plano avançado)
}

// ─── USER ────────────────────────────────────────────────

model User {
  id               String    @id @default(cuid())
  email            String    @unique
  name             String
  passwordHash     String
  plan             UserPlan  @default(BASIC)
  firstAccess      Boolean   @default(true)   // true = ainda não trocou a senha
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  lastLoginAt      DateTime?
  bonusUnlockedAt  DateTime?                   // preenchido quando D7 é atingido

  // Relations
  sessions         Session[]
  pdfViews         PdfView[]
  favorites        Favorite[]
  accounts         Account[]

  @@map("users")
}

// ─── NEXTAUTH TABLES ─────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ─── PDF ─────────────────────────────────────────────────

model Pdf {
  id          String      @id @default(cuid())
  slug        String      @unique              // ex: "mapa-antigo-testamento"
  title       String                           // Nome exibido no card
  filename    String                           // Nome do arquivo em public/pdfs/
  category    PdfCategory
  order       Int                              // Ordem de exibição
  pageCount   Int?
  description String?
  coverColor  String?                          // Cor temática do card (hex)
  isBonus     Boolean     @default(false)
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())

  // Relations
  views    PdfView[]
  favorites Favorite[]

  @@map("pdfs")
}

model PdfView {
  id        String   @id @default(cuid())
  userId    String
  pdfId     String
  viewedAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  pdf  Pdf  @relation(fields: [pdfId], references: [id], onDelete: Cascade)

  @@unique([userId, pdfId])
  @@map("pdf_views")
}

// ─── DEVOCIONAL ──────────────────────────────────────────

model DevocionalCard {
  id            String   @id @default(cuid())
  slug          String   @unique
  emocao        String                    // ex: "Medo", "Alegria"
  corTematica   String                    // hex ex: "#8B5CF6"
  personagem    String                    // ex: "Moisés"
  descricao     String   @db.Text         // Biografia/contexto do personagem
  aEmocao       String   @db.Text         // Como o personagem vivenciou a emoção
  versiculoTexto String  @db.Text
  versiculoRef  String                    // ex: "Êxodo 14:13 (NVI)"
  principaisFeitos Json                   // Array de strings
  imagemUrl     String?
  order         Int
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  @@map("devocional_cards")
}

// ─── GUIA DA FÉ ──────────────────────────────────────────

model GuiaTema {
  id          String        @id @default(cuid())
  slug        String        @unique
  nome        String                         // ex: "Medo", "Provisão"
  categoria   String                         // ex: "Emoções", "Família", "Provisão"
  icone       String                         // emoji ou nome de ícone
  descricao   String        @db.Text
  reflexao    String        @db.Text
  oracao      String        @db.Text
  order       Int
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())

  // Relations
  versiculos  GuiaVersiculo[]
  favorites   Favorite[]

  @@map("guia_temas")
}

model GuiaVersiculo {
  id          String   @id @default(cuid())
  temaId      String
  referencia  String                         // ex: "Filipenses 4:6"
  texto       String   @db.Text
  order       Int

  tema GuiaTema @relation(fields: [temaId], references: [id], onDelete: Cascade)

  @@map("guia_versiculos")
}

// ─── FAVORITOS ───────────────────────────────────────────

model Favorite {
  id         String   @id @default(cuid())
  userId     String
  pdfId      String?
  temaId     String?
  createdAt  DateTime @default(now())

  user User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  pdf  Pdf?      @relation(fields: [pdfId], references: [id], onDelete: Cascade)
  tema GuiaTema? @relation(fields: [temaId], references: [id], onDelete: Cascade)

  @@map("favorites")
}
```

### Migrations

```bash
# Gerar migration inicial
npx prisma migrate dev --name init

# Aplicar em produção
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate

# Executar seed
npx prisma db seed
```

---

## 5. Regras de Planos & Controle de Acesso

### Definição dos Planos

| Funcionalidade | Plano BASIC | Plano ADVANCED |
|---|:---:|:---:|
| Resumo Bíblico Antigo Testamento | ✅ | ✅ |
| Resumo Bíblico Novo Testamento | ✅ | ✅ |
| Mapa Bíblico Antigo Testamento | ❌ (card oculto) | ✅ |
| Mapa Bíblico Novo Testamento | ❌ (card oculto) | ✅ |
| Menu "Bônus" na navegação | ❌ (oculto) | ✅ (D7+) |
| PDFs Bônus (após D7) | ❌ | ✅ |
| Devocional — Emoções da Bíblia | ✅ | ✅ |
| Guia da Fé | ✅ | ✅ |

### Mapeamento PDF → Plano

```typescript
// lib/plan-access.ts

export type PlanType = 'BASIC' | 'ADVANCED'

export interface PdfConfig {
  slug: string
  title: string          // Nome exibido no card
  filename: string       // Arquivo em public/pdfs/
  isBonus: boolean
  requiredPlan: PlanType
  order: number
  coverColor: string
}

export const PDF_CATALOG: PdfConfig[] = [
  // ── BIBLIOTECA PRINCIPAL ──────────────────────────────
  {
    slug: 'resumo-antigo-testamento',
    title: 'Resumo Bíblico Antigo Testamento',
    filename: '09-Resumo_Biblico_Antigo_Testamento.pdf',
    isBonus: false,
    requiredPlan: 'BASIC',   // visível para BASIC e ADVANCED
    order: 1,
    coverColor: '#7C5C2E',
  },
  {
    slug: 'resumo-novo-testamento',
    title: 'Resumo Bíblico Novo Testamento',
    filename: '10-Resumo_Biblico_Novo_Testamento.pdf',
    isBonus: false,
    requiredPlan: 'BASIC',   // visível para BASIC e ADVANCED
    order: 2,
    coverColor: '#2E5C7C',
  },
  {
    slug: 'mapa-antigo-testamento',
    title: 'Mapa Bíblico Antigo Testamento',
    filename: '01-Antigo_Testamento_Mapa_Bíblico.pdf',
    isBonus: false,
    requiredPlan: 'ADVANCED', // BASIC não vê este card
    order: 3,
    coverColor: '#5C2E7C',
  },
  {
    slug: 'mapa-novo-testamento',
    title: 'Mapa Bíblico Novo Testamento',
    filename: '02-Novo_Testamento_Mapa_Biblico.pdf',
    isBonus: false,
    requiredPlan: 'ADVANCED', // BASIC não vê este card
    order: 4,
    coverColor: '#2E7C5C',
  },

  // ── BÔNUS (D7+ e plano ADVANCED) ─────────────────────
  {
    slug: 'divisao-biblica',
    title: 'Divisão Bíblica',
    filename: '03-Divisao_Biblica_Mapa_Biblico.pdf',
    isBonus: true,
    requiredPlan: 'ADVANCED',
    order: 5,
    coverColor: '#7C3E2E',
  },
  {
    slug: 'tabela-biblica',
    title: 'Tabela Bíblica',
    filename: '04-Tabela_Biblica_Mapa_Biblico.pdf',
    isBonus: true,
    requiredPlan: 'ADVANCED',
    order: 6,
    coverColor: '#3E2E7C',
  },
  {
    slug: 'planner-devocional',
    title: 'Planner Devocional',
    filename: '05-Planner_devocional_Mapa_Bíblico.pdf',
    isBonus: true,
    requiredPlan: 'ADVANCED',
    order: 7,
    coverColor: '#7C6B2E',
  },
]

// ── Helpers ──────────────────────────────────────────────

/**
 * Retorna se o usuário pode acessar um PDF específico.
 * Combina verificação de plano + regra D7 para bônus.
 */
export function canAccessPdf(
  pdf: PdfConfig,
  userPlan: PlanType,
  userCreatedAt: Date
): { allowed: boolean; reason?: 'wrong_plan' | 'bonus_locked' } {
  // Verificação de plano
  if (pdf.requiredPlan === 'ADVANCED' && userPlan === 'BASIC') {
    return { allowed: false, reason: 'wrong_plan' }
  }

  // Verificação D7 para bônus
  if (pdf.isBonus) {
    const daysSinceCreation = getDaysSince(userCreatedAt)
    if (daysSinceCreation < 7) {
      return { allowed: false, reason: 'bonus_locked' }
    }
  }

  return { allowed: true }
}

/**
 * Retorna PDFs visíveis para o usuário (filtra por plano).
 * Plano BASIC não vê cards de plano ADVANCED.
 */
export function getVisiblePdfs(userPlan: PlanType): PdfConfig[] {
  if (userPlan === 'BASIC') {
    return PDF_CATALOG.filter(
      (pdf) => pdf.requiredPlan === 'BASIC' && !pdf.isBonus
    )
  }
  return PDF_CATALOG // ADVANCED vê tudo
}

/**
 * Retorna PDFs bônus visíveis (apenas ADVANCED).
 */
export function getBonusPdfs(): PdfConfig[] {
  return PDF_CATALOG.filter((pdf) => pdf.isBonus)
}

export function getDaysSince(date: Date): number {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function isBonusUnlocked(userCreatedAt: Date): boolean {
  return getDaysSince(userCreatedAt) >= 7
}
```

### Middleware de Proteção

```typescript
// middleware.ts

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Rotas públicas
  const publicRoutes = ['/login', '/reset-password']
  if (publicRoutes.includes(pathname)) {
    if (session) return NextResponse.redirect(new URL('/home', req.url))
    return NextResponse.next()
  }

  // Sem sessão → redireciona para login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Primeiro acesso → força troca de senha
  if (session.user.firstAccess && pathname !== '/change-password') {
    return NextResponse.redirect(new URL('/change-password', req.url))
  }

  // Usuário já trocou senha tentando acessar /change-password
  if (!session.user.firstAccess && pathname === '/change-password') {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // Plano BASIC tentando acessar /bonus → bloqueia
  if (pathname.startsWith('/bonus') && session.user.plan === 'BASIC') {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 6. Autenticação & Fluxo de Acesso

### Configuração NextAuth

```typescript
// lib/auth.ts

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 dias
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!passwordMatch) return null

        // Atualiza lastLoginAt
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          firstAccess: user.firstAccess,
          createdAt: user.createdAt,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.plan = user.plan
        token.firstAccess = user.firstAccess
        token.createdAt = user.createdAt
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.plan = token.plan as string
      session.user.firstAccess = token.firstAccess as boolean
      session.user.createdAt = token.createdAt as Date
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
```

### Telas de Autenticação

#### T1 — Tela de Login (`/login`)

**Requisitos:**
- Logo e nome do produto centralizados, design dark com halo gold
- Campo de e-mail com validação de formato em tempo real
- Campo de senha com toggle de visibilidade
- Botão CTA primário "Entrar" — cor Gold, border-radius 10px
- Link "Esqueci minha senha" → `/reset-password`
- Estados de erro inline: "E-mail ou senha incorretos"
- Loading state no botão durante autenticação
- Não há tela de cadastro — usuários são criados pelo admin via seed ou painel

#### T2 — Troca de Senha Obrigatória (`/change-password`)

**Requisitos:**
- Exibida SOMENTE no primeiro acesso (`user.firstAccess === true`)
- Não pode ser ignorada — middleware bloqueia qualquer outra rota
- Campo "Nova senha" com indicador de força em tempo real
- Campo "Confirmar nova senha" com validação de match
- Requisitos visíveis: mínimo 8 caracteres, 1 maiúscula, 1 número
- Ao confirmar: `firstAccess = false` salvo no banco → redireciona para `/home`

```typescript
// app/api/user/change-password/route.ts

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { newPassword } = await req.json()

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'Senha inválida' }, { status: 400 })
  }

  const hash = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash: hash,
      firstAccess: false,
    },
  })

  return NextResponse.json({ success: true })
}
```

---

## 7. Módulo: Biblioteca de PDFs

### T4 — Biblioteca (`/biblioteca`)

**Requisitos:**
- Grid de cards responsivo (2 colunas mobile / 3–4 colunas desktop)
- Cards da biblioteca principal exibidos conforme plano do usuário:
  - **Plano BASIC:** exibe apenas "Resumo Bíblico AT" e "Resumo Bíblico NT"
  - **Plano ADVANCED:** exibe todos os 4 cards principais
- Cards bônus: aparecem somente no menu/seção Bônus (não na biblioteca principal)
- Card com: cor temática de fundo, título, ícone, número de páginas (se disponível)
- Indicador visual "Já visualizado" (checkmark dourado) para PDFs já abertos
- Skeleton loader durante carregamento

**Componente PdfCard:**
```typescript
// components/biblioteca/PdfCard.tsx
interface PdfCardProps {
  title: string
  slug: string
  coverColor: string
  pageCount?: number
  isViewed: boolean
  onClick: () => void
}
```

### T5 — Leitor de PDF (`/biblioteca/[slug]`)

**Requisitos:**

**Controles obrigatórios:**
- Botão "Expandir" — alterna entre modo normal e fullscreen (oculta sidebar/nav)
- Botão "Modo Paisagem" — rotaciona a viewport (útil para Mapas Bíblicos panorâmicos); implementar via CSS transform + lock de orientação quando disponível
- Contador de página: "Página 3 de 12"
- Barra de progresso de leitura (linha gold no topo)
- Pinch-to-zoom (mobile) e Ctrl+scroll (desktop): min 50%, max 400%
- Navegação por páginas: botões "← Anterior" / "Próximo →" e scroll contínuo entre páginas

**Segurança:**
- PDF nunca é servido como URL direta pública
- Acesso via API route autenticada que valida plano + D7 antes do stream

```typescript
// app/api/pdf/[slug]/route.ts

import { auth } from '@/lib/auth'
import { canAccessPdf, PDF_CATALOG } from '@/lib/plan-access'
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const pdfConfig = PDF_CATALOG.find((p) => p.slug === params.slug)
  if (!pdfConfig) return new NextResponse('Not Found', { status: 404 })

  const access = canAccessPdf(
    pdfConfig,
    session.user.plan as 'BASIC' | 'ADVANCED',
    new Date(session.user.createdAt)
  )

  if (!access.allowed) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const filePath = path.join(process.cwd(), 'public', 'pdfs', pdfConfig.filename)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('PDF not found', { status: 404 })
  }

  const fileBuffer = fs.readFileSync(filePath)

  // Registra visualização no banco
  const { prisma } = await import('@/lib/prisma')
  const dbPdf = await prisma.pdf.findUnique({ where: { slug: params.slug } })
  if (dbPdf) {
    await prisma.pdfView.upsert({
      where: { userId_pdfId: { userId: session.user.id, pdfId: dbPdf.id } },
      update: { viewedAt: new Date() },
      create: { userId: session.user.id, pdfId: dbPdf.id },
    })
  }

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, no-store',
    },
  })
}
```

---

## 8. Módulo: Devocional — Emoções da Bíblia

### T6 — Hub Devocional (`/devocional`)

**Requisitos:**
- Disponível para todos os planos (BASIC e ADVANCED)
- Header com título e subtítulo introdutório
- Filtros horizontais scrolláveis por emoção (Alegria, Medo, Tristeza, Fé, etc.)
- Busca por personagem ou emoção
- Card do dia destacado no topo com badge "Devocional de Hoje"
- Grade de cards com: nome da emoção (destaque), personagem, cor temática
- Animação de entrada escalonada (stagger)

### T7 — Detalhe do Devocional (`/devocional/[id]`)

**Requisitos:**
- Nome da emoção em Playfair Display grande com cor temática
- Nome do personagem em destaque
- Card do versículo com ícone de chave (🔑) e referência bíblica
- Seção "Personagem": biografia contextualizada
- Seção "A Emoção": como o personagem vivenciou
- Seção "Principais Feitos": lista numerada com destaques em bold
- Botão "Compartilhar versículo" (Web Share API)
- Navegação: "← Anterior" e "Próximo →"

### Estrutura de Dados do Card

```typescript
// Exemplo de seed — prisma/seed.ts (parcial)

const devocionalCards = [
  {
    slug: 'medo-moises',
    emocao: 'Medo',
    corTematica: '#8B5CF6',
    personagem: 'Moisés',
    descricao: 'Moisés é uma figura central no Antigo Testamento, conhecido por liderar os israelitas durante o Êxodo do Egito e por receber os Dez Mandamentos no Monte Sinai.',
    aEmocao: 'Moisés expressa seu medo e insegurança em várias ocasiões ao longo de sua jornada, especialmente ao confrontar o faraó do Egito e guiar os israelitas através do deserto.',
    versiculoTexto: 'Moisés respondeu ao povo: Não tenham medo! Fiquem firmes e vejam o livramento que o Senhor trará hoje. Vocês nunca mais verão os egípcios que hoje veem. O Senhor lutará por vocês; tão-somente acalmem-se.',
    versiculoRef: 'Êxodo 14:13 (NVI)',
    principaisFeitos: [
      'Liderança durante o Êxodo — guiou os israelitas na saída do Egito, atravessando o Mar Vermelho',
      'Recebimento dos Dez Mandamentos no Monte Sinai',
      'Intercessão e liderança espiritual entre Deus e o povo de Israel',
    ],
    order: 1,
  },
  {
    slug: 'alegria-davi',
    emocao: 'Alegria',
    corTematica: '#F59E0B',
    personagem: 'Davi',
    descricao: 'Davi foi o segundo rei de Israel, conhecido por ser "um homem segundo o coração de Deus". Famoso por suas conquistas militares, habilidades musicais e poéticas.',
    aEmocao: 'Davi expressa sua alegria de maneira muito evidente no Livro dos Salmos. Um exemplo notável é quando ele traz a Arca da Aliança para Jerusalém, dançando e celebrando com grande alegria.',
    versiculoTexto: 'E Davi, vestindo um manto sacerdotal de linho, foi dançando com todas as suas forças perante o Senhor, enquanto ele e todos os israelitas levavam a arca do Senhor ao som de gritos de alegria e de trombetas.',
    versiculoRef: '2 Samuel 6:14–15 (NVI)',
    principaisFeitos: [
      'Dança diante da Arca da Aliança (2 Samuel 6:14-15)',
      'Escrita dos Salmos de louvor e adoração',
      'Vitórias militares atribuídas a Deus (1 Samuel 17)',
      'Unificação de Israel (2 Samuel 5:6–10)',
    ],
    order: 2,
  },
  // ... demais cards
]
```

---

## 9. Módulo: Guia da Fé

### T8 — Hub Guia da Fé (`/guia-da-fe`)

**Requisitos:**
- Disponível para todos os planos (BASIC e ADVANCED)
- Barra de busca: "O que você está sentindo hoje?"
- Cards organizados por categorias: Emoções & Sentimentos, Vida & Fé, Família, Provisão, Cura & Saúde, Propósito
- Cada card: ícone, nome do tema, número de versículos
- Destaques editoriais: "Temas Mais Acessados" e "Para Momentos Difíceis"

### T9 — Detalhe do Tema (`/guia-da-fe/[slug]`)

**Requisitos:**
- Nome do tema em Playfair Display + ícone + descrição curta
- Seção "Versículos para este Momento": 3–7 versículos em cards expansíveis com referência + botão copiar/compartilhar
- Seção "Reflexão": parágrafo contextual
- Seção "Oração Guiada": botão "Orar agora" → abre Modo Oração

**Modo Oração (Modal Imersivo):**
- Overlay fullscreen escurecido (z-index alto)
- Texto da oração centralizado, sem header, sem nav
- Transição suave entre parágrafos (auto-scroll ou botão "continuar")
- Botão "Amém / Concluir" ao final
- Fecha com `Esc` ou clique no X

### Temas Previstos no Seed

| Tema | Categoria |
|---|---|
| Medo | Emoções & Sentimentos |
| Ansiedade | Emoções & Sentimentos |
| Tristeza | Emoções & Sentimentos |
| Alegria | Emoções & Sentimentos |
| Gratidão | Emoções & Sentimentos |
| Esperança | Emoções & Sentimentos |
| Perdão | Vida & Fé |
| Fé em Provações | Vida & Fé |
| Propósito e Vocação | Vida & Fé |
| Cura e Saúde | Cura & Saúde |
| Proteção | Cura & Saúde |
| Casamento | Família |
| Filhos | Família |
| Reconciliação | Família |
| Provisão Divina | Provisão |
| Trabalho e Carreira | Provisão |

---

## 10. Módulo: Conteúdo Bônus (D7+)

### Regra de Desbloqueio

```
Acesso liberado quando:
  user.plan === 'ADVANCED'
  AND
  getDaysSince(user.createdAt) >= 7
```

### T10 — Página de Bônus (`/bonus`)

**Requisitos:**
- Menu "Bônus" **completamente oculto** da navegação para plano BASIC
- Middleware bloqueia acesso direto à rota `/bonus` para plano BASIC (redireciona para `/home`)
- Para plano ADVANCED com menos de 7 dias:
  - Página exibida mas PDFs aparecem com cadeado e contador regressivo
  - "Este conteúdo será liberado em **X dias**"
- Para plano ADVANCED com D7+ atingido:
  - PDFs desbloqueados com animação de sparkle
  - Badge "Novo" em cada card até o primeiro acesso

### PDFs Bônus

| Slug | Título no Card | Arquivo |
|---|---|---|
| `divisao-biblica` | Divisão Bíblica | `03-Divisao_Biblica_Mapa_Biblico.pdf` |
| `tabela-biblica` | Tabela Bíblica | `04-Tabela_Biblica_Mapa_Biblico.pdf` |
| `planner-devocional` | Planner Devocional | `05-Planner_devocional_Mapa_Bíblico.pdf` |

### Notificação no Desbloqueio

- Verificar status D7 no momento do login
- Quando D7 é atingido pela primeira vez: exibir toast/banner na Home — "🎁 Seu conteúdo bônus foi desbloqueado!"
- Salvar `bonusUnlockedAt` no banco na primeira vez que o D7 é detectado

```typescript
// lib/plan-access.ts — verificação no login

export async function checkAndUnlockBonus(userId: string, createdAt: Date) {
  if (!isBonusUnlocked(createdAt)) return false

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.bonusUnlockedAt) return false // já foi marcado

  await prisma.user.update({
    where: { id: userId },
    data: { bonusUnlockedAt: new Date() },
  })

  return true // primeira vez que desbloqueia — exibir notificação
}
```

---

## 11. Mapa de Rotas

| Rota | Componente | Proteção | Plano |
|---|---|---|---|
| `/login` | LoginPage | Público | — |
| `/reset-password` | ResetPasswordPage | Público | — |
| `/change-password` | ChangePasswordPage | Logado + firstAccess=true | — |
| `/home` | HomePage | Logado | BASIC + ADVANCED |
| `/biblioteca` | BibliotecaPage | Logado | BASIC (2 cards) / ADVANCED (4 cards) |
| `/biblioteca/[slug]` | PdfViewerPage | Logado + canAccess | Por plano |
| `/devocional` | DevocionalPage | Logado | BASIC + ADVANCED |
| `/devocional/[id]` | DevocionalDetailPage | Logado | BASIC + ADVANCED |
| `/guia-da-fe` | GuiaFePage | Logado | BASIC + ADVANCED |
| `/guia-da-fe/[slug]` | GuiaTemaPage | Logado | BASIC + ADVANCED |
| `/bonus` | BonusPage | Logado + ADVANCED | ADVANCED only |
| `/perfil` | PerfilPage | Logado | BASIC + ADVANCED |
| `/api/pdf/[slug]` | API Route | Logado + canAccess | Por plano |
| `/api/user/change-password` | API Route | Logado | — |
| `/api/auth/[...nextauth]` | NextAuth | — | — |

---

## 12. Design System

### Tokens de Cor (Tailwind Config)

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4a850',
          light: '#e0b86a',
          dim: 'rgba(212, 168, 80, 0.15)',
          faint: 'rgba(212, 168, 80, 0.08)',
          border: 'rgba(212, 168, 80, 0.25)',
        },
        cream: {
          DEFAULT: '#f5e8c8',
          75: 'rgba(245, 232, 200, 0.75)',
          65: 'rgba(245, 232, 200, 0.65)',
          55: 'rgba(245, 232, 200, 0.55)',
          35: 'rgba(245, 232, 200, 0.35)',
        },
        bg: {
          DEFAULT: '#0f0b05',
          surface: '#1a1006',
          surface2: '#221508',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '10px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
```

### Hierarquia Tipográfica

| Elemento | Fonte | Peso | Tamanho |
|---|---|---|---|
| H1, H2 (títulos) | Playfair Display | 600–700 | 22–26px |
| H3, H4 (subtítulos) | Playfair Display | 500 | 15–18px |
| Corpo de texto | DM Sans | 400–500 | 14–15px |
| Labels / Badges | DM Sans | 500–600 | 11–12px |

### Hierarquia de Opacidade

```
100% → Títulos principais (impacto total)
 75% → Texto corpo / principal
 65% → Subtítulos
 55% → Metadados, dicas
 35% → Texto muito tênue, privacy
Gold  → Ênfase, CTAs, interações
```

### Componentes Base

**Botão Primário:**
```css
bg-gold text-bg rounded-btn px-6 py-3.5 font-semibold
hover:bg-gold-light hover:-translate-y-px
transition-all duration-200
```

**Botão Secundário:**
```css
bg-transparent border border-gold text-gold rounded-btn px-6 py-3.5
hover:bg-gold/15
transition-all duration-200
```

**Card:**
```css
bg-bg-surface border border-gold/18 rounded-card p-4
hover:border-gold/40
transition-border duration-200
```

**Input:**
```css
bg-cream/5 border border-gold/25 rounded-lg px-4 py-3
focus:border-gold/60 focus:outline-none
text-cream placeholder-cream/35
transition-colors duration-200
```

### Princípios de Design

- **Dark-first:** nunca usar preto/branco puros — usar `#0f0b05` e cream
- **Espaçamento:** padding mínimo 20px nas páginas, 16px nos cards
- **Transições:** `transition-all duration-200 ease-out` como padrão
- **Sem poluição visual:** máximo 3 elementos de ênfase por tela
- **Modo Oração:** experiência totalmente imersiva, zero distrações

---

## 13. Variáveis de Ambiente

```bash
# .env (não versionar — adicionar ao .gitignore)

# Banco de Dados PostgreSQL (servidor próprio)
DATABASE_URL="postgresql://usuario:senha@host:5432/biblia360?schema=public"

# NextAuth
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"
NEXTAUTH_URL="https://seudominio.com"   # produção
# NEXTAUTH_URL="http://localhost:3000"  # desenvolvimento

# Opcional: e-mail para reset de senha
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@seudominio.com"
```

### netlify.toml

```toml
# netlify.toml

[build]
  command = "npx prisma generate && npx prisma migrate deploy && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

> **Importante:** Configurar as variáveis de ambiente no painel da Netlify em *Site Settings > Environment Variables* para os valores de produção.

---

## 14. Regras de Negócio Consolidadas

| ID | Regra | Comportamento | Prioridade |
|---|---|---|---|
| RN01 | Primeiro acesso obriga troca de senha | `firstAccess=true` → redireciona para `/change-password` antes de qualquer conteúdo. Middleware impede bypass. | P1 |
| RN02 | Cadastro somente via admin | Não há tela de registro no app. Usuários criados via seed ou script admin com senha temporária. | P1 |
| RN03 | Bônus liberado após D7 | `getDaysSince(user.createdAt) >= 7` validado no servidor. `bonusUnlockedAt` salvo no banco. | P1 |
| RN04 | Plano BASIC — cards ocultos | Mapas Bíblicos AT e NT **não aparecem** na interface do plano BASIC (não apenas bloqueados, mas ausentes). | P1 |
| RN05 | Plano BASIC — sem menu Bônus | Menu "Bônus" **completamente oculto** para plano BASIC. Rota `/bonus` retorna redirect. | P1 |
| RN06 | PDFs não baixáveis | API route serve PDF com `Content-Disposition: inline`. Headers `Cache-Control: private, no-store`. Sem link de download. | P1 |
| RN07 | Bônus visível mas bloqueado (ADVANCED < D7) | Cards bônus aparecem com cadeado e contador. Plano BASIC não os vê. | P1 |
| RN08 | Sessão persistente 30 dias | JWT com `maxAge: 30 * 24 * 60 * 60`. Refresh automático. | P2 |
| RN09 | Rate limiting no login | Máx. 5 tentativas por IP em 10 minutos. Implementar com middleware ou solução externa. | P2 |
| RN10 | Notificação de desbloqueio do bônus | Toast/banner na Home na primeira vez que D7 é atingido (verificado no login). | P2 |
| RN11 | Registro de visualização | `PdfView` upserted toda vez que o usuário abre um PDF — usado para badge "Já visualizado". | P2 |

---

## 15. Roadmap de Entregas

### Sprint 1 — Semanas 1–2: Fundação
- [ ] Setup Next.js 14 + TypeScript + Tailwind + shadcn/ui
- [ ] Configuração Prisma + PostgreSQL + migrations iniciais
- [ ] Schema completo do banco + seed básico
- [ ] NextAuth com Credentials provider
- [ ] Tela de Login (T1) com design system
- [ ] Tela de Troca de Senha Obrigatória (T2)
- [ ] Middleware de proteção de rotas
- [ ] Layout autenticado (sidebar/nav)
- [ ] netlify.toml configurado

### Sprint 2 — Semanas 3–4: Biblioteca & PDF Viewer
- [ ] Home / Dashboard (T3) com cards por plano
- [ ] Biblioteca de PDFs (T4) com lógica de plano (BASIC vs ADVANCED)
- [ ] API route `/api/pdf/[slug]` com auth + validação de plano
- [ ] Leitor de PDF (T5): modo normal, fullscreen, modo paisagem
- [ ] Pinch-to-zoom, navegação de páginas, progress bar
- [ ] Registro de `PdfView` no banco
- [ ] Badge "Já visualizado" nos cards

### Sprint 3 — Semanas 5–6: Devocional
- [ ] Seed completo dos cards do Devocional
- [ ] Hub Devocional (T6): grid, filtros, busca, card do dia
- [ ] Detalhe do Devocional (T7): versículo, personagem, emoção, feitos
- [ ] Compartilhamento de versículo (Web Share API)
- [ ] Animações de entrada (Framer Motion)

### Sprint 4 — Semanas 7–8: Guia da Fé
- [ ] Seed completo dos temas e versículos do Guia da Fé
- [ ] Hub Guia da Fé (T8): busca, categorias, destaques editoriais
- [ ] Detalhe do Tema (T9): versículos, reflexão, oração
- [ ] Modo Oração imersivo (OracaoModal)
- [ ] Favoritos (salvo localmente ou no banco)

### Sprint 5 — Semanas 9–10: Bônus & Polish
- [ ] Página Bônus (T10) com lógica D7 + cadeado + contador regressivo
- [ ] Desbloqueio animado no D7 (sparkle + fade)
- [ ] Toast de notificação de desbloqueio na Home
- [ ] Tela de Perfil + troca de senha voluntária
- [ ] Página de recuperação de senha (`/reset-password`)
- [ ] Ajustes de performance: lazy loading, skeleton loaders

### Sprint 6 — Semanas 11–12: QA & Deploy
- [ ] Testes de plano (BASIC vs ADVANCED) em todos os módulos
- [ ] Testes de regra D7 (simular data de criação)
- [ ] Validação de segurança: PDFs não acessíveis sem autenticação
- [ ] Responsividade mobile completa
- [ ] Deploy em Netlify (staging + produção)
- [ ] Configuração de variáveis de ambiente na Netlify
- [ ] Smoke tests em produção

---

## 16. Fora do Escopo do MVP

Os itens abaixo foram identificados mas **não serão desenvolvidos** no MVP:

- Anotações pessoais dentro dos PDFs
- Planos de leitura bíblica automáticos
- Comunidade / fórum dentro do app
- Gamificação / badges de progresso
- Conteúdo em áudio ou podcast integrado
- Login social (Google / Apple ID)
- Painel admin dentro do app (gestão de usuários)
- App mobile nativo (iOS/Android) — o MVP é web responsivo
- Multilingua (i18n)
- Analytics avançado (heatmaps, session recording)

---

## Apêndice: Criação de Usuário Admin (Script)

Como não há tela de cadastro, usar este script para criar usuários:

```typescript
// scripts/create-user.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUser({
  email,
  name,
  tempPassword,
  plan,
}: {
  email: string
  name: string
  tempPassword: string
  plan: 'BASIC' | 'ADVANCED'
}) {
  const hash = await bcrypt.hash(tempPassword, 12)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hash,
      plan,
      firstAccess: true, // forçar troca de senha no 1º acesso
    },
  })

  console.log(`✅ Usuário criado: ${user.email} (plano: ${user.plan})`)
  console.log(`   Senha temporária: ${tempPassword}`)
  console.log(`   ID: ${user.id}`)
}

// Exemplo de uso:
createUser({
  email: 'maria@email.com',
  name: 'Maria Silva',
  tempPassword: 'Temp@2024',
  plan: 'ADVANCED',
}).finally(() => prisma.$disconnect())
```

```bash
# Executar:
npx ts-node scripts/create-user.ts
```

---

*PRD v1.0 — Bíblia 360° MVP · Confidencial · Todos os direitos reservados*
