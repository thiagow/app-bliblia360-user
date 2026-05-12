const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10)

  // Criar Usuário Básico
  const userBasic = await prisma.user.upsert({
    where: { email: 'aluno@biblia360.com' },
    update: {},
    create: {
      email: 'aluno@biblia360.com',
      name: 'Aluno Básico',
      password: hashedPassword,
      plan: 'BASIC',
      firstAccess: true,
    },
  })

  // Criar Usuário Avançado
  const userAdvanced = await prisma.user.upsert({
    where: { email: 'vip@biblia360.com' },
    update: {},
    create: {
      email: 'vip@biblia360.com',
      name: 'Aluno Avançado',
      password: hashedPassword,
      plan: 'ADVANCED',
      firstAccess: true,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 dias atrás para passar o D7
    },
  })

  // Criar Usuário Avançado Novo (Não passou D7)
  const userAdvancedNew = await prisma.user.upsert({
    where: { email: 'novo_vip@biblia360.com' },
    update: {},
    create: {
      email: 'novo_vip@biblia360.com',
      name: 'Aluno Avançado Novo',
      password: hashedPassword,
      plan: 'ADVANCED',
      firstAccess: true,
      createdAt: new Date() // Criado agora, D7 = falso
    },
  })

  console.log('Seed users created:', { userBasic: userBasic.email, userAdvanced: userAdvanced.email, userAdvancedNew: userAdvancedNew.email })

  // Limpar PDFs anteriores para garantir a tela correta
  await prisma.pdfDocument.deleteMany()

  // Criar PDFs reais
  await prisma.pdfDocument.createMany({
    data: [
      {
        title: 'Mapa Bíblico - Antigo Testamento',
        slug: 'mapa-antigo-testamento',
        fileUrl: '01-Antigo_Testamento_Mapa_Bíblico.pdf',
        planAccess: 'BASIC',
        isBonus: false,
        d7Rule: false
      },
      {
        title: 'Mapa Bíblico - Novo Testamento',
        slug: 'mapa-novo-testamento',
        fileUrl: '02-Novo_Testamento_Mapa_Biblico.pdf',
        planAccess: 'BASIC',
        isBonus: false,
        d7Rule: false
      },
      {
        title: 'Resumo Bíblico - Antigo Testamento',
        slug: 'resumo-antigo-testamento',
        fileUrl: '09-Resumo_Biblico_Antigo_Testamento.pdf',
        planAccess: 'BASIC',
        isBonus: false,
        d7Rule: false
      },
      {
        title: 'Resumo Bíblico - Novo Testamento',
        slug: 'resumo-novo-testamento',
        fileUrl: '10-Resumo_Biblico_Novo_Testamento.pdf',
        planAccess: 'BASIC',
        isBonus: false,
        d7Rule: false
      }
    ],
    skipDuplicates: true,
  })

  console.log('Seed PDFs created.')

  // Criar Guia da Fé
  const steps = await prisma.guiaDaFe.findMany()
  if (steps.length === 0) {
    await prisma.guiaDaFe.create({
      data: {
        title: "Dia 1: O Início da Jornada",
        content: "Neste primeiro dia, vamos entender os fundamentos do estudo bíblico 360°.",
        order: 1,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    })
    await prisma.guiaDaFe.create({
      data: {
        title: "Dia 2: Mapeando o Terreno",
        content: "Aprenda a utilizar os mapas bíblicos para contextualizar sua leitura.",
        order: 2
      }
    })
    console.log('Seed Guia da Fé created.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
