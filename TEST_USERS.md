# Usuários de Teste - Bíblia 360° MVP

Estes são os usuários de teste cadastrados automaticamente no banco de dados para validar os diferentes níveis de acesso da plataforma:

**Senha padrão para todos os testes:** `123456`

---

## 1. 🎓 Aluno Básico
- **E-mail:** `aluno@biblia360.com`
- **Plano:** `BASIC`
- **Objetivo do Teste:** Validar que o usuário acessa apenas conteúdos básicos (ex: "Mapa Bíblico de Gênesis") e não consegue acessar PDFs Avançados ou Bônus D7.

## 2. 👑 Aluno Avançado (Passou de 7 dias)
- **E-mail:** `vip@biblia360.com`
- **Plano:** `ADVANCED`
- **Objetivo do Teste:** Validar que o usuário tem acesso total. Como ele foi cadastrado com data retroativa de 10 dias, a **Regra D7** já deve liberar os PDFs de Bônus (ex: "O Código Oculto") para ele.

## 3. ⏳ Aluno Avançado Novo (Ainda na Regra D7)
- **E-mail:** `novo_vip@biblia360.com`
- **Plano:** `ADVANCED`
- **Objetivo do Teste:** Validar o bloqueio D7. Como ele foi cadastrado com a data de hoje, ele terá acesso aos conteúdos VIP normais, mas os conteúdos marcados como "Bônus" estarão bloqueados, exibindo a mensagem para aguardar 7 dias.

---

> **Observação:** O sistema está configurado com `firstAccess: true` para esses usuários. Isso significa que no primeiro login bem-sucedido, eles serão forçados a passar pela tela de "Alterar Senha".
