/**
 * ============================================================================
 * SCRIPT: Seed Data - Popular MongoDB com Dados de Exemplo
 * ============================================================================
 *
 * Cria dados de exemplo para testar o portal
 *
 * EXECUTAR:
 * node --loader ts-node/esm scripts/seedData.ts
 *
 * ============================================================================
 */

import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const DB_NAME = "PortalDaEquipe";

async function seedData() {
  console.log("🌱 Iniciando seed de dados...\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // ========== LIMPAR DADOS EXISTENTES (CUIDADO!) ==========
    console.log("🗑️  Limpando dados antigos...");
    await db.collection("users").deleteMany({});
    await db.collection("chamados").deleteMany({});
    await db.collection("eventos").deleteMany({});
    await db.collection("salas").deleteMany({});
    console.log("  ✓ Dados antigos removidos\n");

    // ========== CRIAR USUÁRIOS ==========
    console.log("👥 Criando usuários...");

    const senha = await bcrypt.hash("tradestars2025", 10);

    const usuarios = [
      // TEI
      {
        nome: "Carlos Santos",
        email: "carlos.santos@tradestars.com",
        senha,
        setor: "TEI",
        cargo: "Coordenador",
        foto: "https://i.pravatar.cc/150?img=12",
        dataAdmissao: new Date("2022-03-15"),
        telefone: "(11) 98765-4321",
        ramal: "1001",
        isLider: true,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        nome: "Pedro Oliveira",
        email: "pedro.oliveira@tradestars.com",
        senha,
        setor: "TEI",
        cargo: "Analista",
        foto: "https://i.pravatar.cc/150?img=13",
        dataAdmissao: new Date("2023-06-01"),
        telefone: "(11) 98765-4322",
        ramal: "1002",
        isLider: false,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },

      // RH
      {
        nome: "Ana Paula Costa",
        email: "ana.costa@tradestars.com",
        senha,
        setor: "RH",
        cargo: "Gerente",
        foto: "https://i.pravatar.cc/150?img=5",
        dataAdmissao: new Date("2021-01-10"),
        telefone: "(11) 98765-4323",
        ramal: "2001",
        isLider: true,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        nome: "Juliana Ferreira",
        email: "juliana.ferreira@tradestars.com",
        senha,
        setor: "RH",
        cargo: "Analista",
        foto: "https://i.pravatar.cc/150?img=9",
        dataAdmissao: new Date("2023-02-20"),
        telefone: "(11) 98765-4324",
        ramal: "2002",
        isLider: false,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },

      // Financeiro
      {
        nome: "Ricardo Mendes",
        email: "ricardo.mendes@tradestars.com",
        senha,
        setor: "Financeiro",
        cargo: "Coordenador",
        foto: "https://i.pravatar.cc/150?img=15",
        dataAdmissao: new Date("2020-08-05"),
        telefone: "(11) 98765-4325",
        ramal: "3001",
        isLider: true,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        nome: "Mariana Lima",
        email: "mariana.lima@tradestars.com",
        senha,
        setor: "Financeiro",
        cargo: "Analista",
        foto: "https://i.pravatar.cc/150?img=10",
        dataAdmissao: new Date("2023-04-12"),
        telefone: "(11) 98765-4326",
        ramal: "3002",
        isLider: false,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },

      // Comercial
      {
        nome: "Fernando Silva",
        email: "fernando.silva@tradestars.com",
        senha,
        setor: "Comercial",
        cargo: "Gerente",
        foto: "https://i.pravatar.cc/150?img=8",
        dataAdmissao: new Date("2021-11-20"),
        telefone: "(11) 98765-4327",
        ramal: "4001",
        isLider: true,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        nome: "Beatriz Alves",
        email: "beatriz.alves@tradestars.com",
        senha,
        setor: "Comercial",
        cargo: "Analista",
        foto: "https://i.pravatar.cc/150?img=16",
        dataAdmissao: new Date("2023-09-10"),
        telefone: "(11) 98765-4328",
        ramal: "4002",
        isLider: false,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },

      // Marketing
      {
        nome: "Laura Rodrigues",
        email: "laura.rodrigues@tradestars.com",
        senha,
        setor: "Marketing",
        cargo: "Coordenador",
        foto: "https://i.pravatar.cc/150?img=20",
        dataAdmissao: new Date("2022-05-18"),
        telefone: "(11) 98765-4329",
        ramal: "5001",
        isLider: true,
        isAdmin: false,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },

      // Diretoria / Admin
      {
        nome: "Roberto TradeStars",
        email: "admin@tradestars.com",
        senha,
        setor: "Diretoria",
        cargo: "CEO",
        foto: "https://i.pravatar.cc/150?img=1",
        dataAdmissao: new Date("2020-01-01"),
        telefone: "(11) 98765-4330",
        ramal: "9001",
        isLider: true,
        isAdmin: true,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ];

    const resultUsuarios = await db
      .collection("users")
      .insertMany(usuarios);
    const userIds = Object.values(resultUsuarios.insertedIds);
    console.log(`  ✓ ${userIds.length} usuários criados\n`);

    // ========== CRIAR SALAS ==========
    console.log("🏢 Criando salas de reunião...");

    const salas = [
      {
        nome: "Sala Executiva",
        capacidade: 12,
        andar: "3º Andar",
        localizacao: "Ala Norte",
        recursos: {
          projetor: true,
          tv: true,
          quadroBranco: true,
          videoconferencia: true,
          computador: true,
          cafe: true,
        },
        foto: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
        ativa: true,
        descricao: "Sala premium para reuniões executivas",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        nome: "Sala de Treinamento",
        capacidade: 20,
        andar: "2º Andar",
        localizacao: "Ala Sul",
        recursos: {
          projetor: true,
          tv: false,
          quadroBranco: true,
          videoconferencia: true,
          computador: false,
          cafe: true,
        },
        foto: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400",
        ativa: true,
        descricao: "Espaço amplo para treinamentos e workshops",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        nome: "Sala Focus",
        capacidade: 4,
        andar: "1º Andar",
        localizacao: "Ala Leste",
        recursos: {
          projetor: false,
          tv: true,
          quadroBranco: true,
          videoconferencia: true,
          computador: false,
          cafe: false,
        },
        foto: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
        ativa: true,
        descricao: "Sala pequena para reuniões rápidas",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ];

    const resultSalas = await db
      .collection("salas")
      .insertMany(salas);
    console.log(
      `  ✓ ${Object.keys(resultSalas.insertedIds).length} salas criadas\n`,
    );

    // ========== CRIAR CHAMADOS DE EXEMPLO ==========
    console.log("🎫 Criando chamados de exemplo...");

    const chamados = [
      {
        numero: "TEI-2025-001",
        setor: "TEI",
        solicitanteId: userIds[7],
        solicitanteNome: "Beatriz Alves",
        solicitanteSetor: "Comercial",
        solicitanteEmail: "beatriz.alves@tradestars.com",
        titulo: "Computador não liga",
        descricao:
          "Meu computador não está ligando desde ontem. Já tentei trocar a tomada mas não funcionou.",
        categoria: "Hardware",
        prioridade: "Alta",
        status: "Aberto",
        anexos: [],
        respostas: [],
        dadosEspecificos: {
          local: "Mesa 45 - Comercial",
          equipamento: "Desktop Dell - PAT-2345",
        },
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        numero: "RH-2025-001",
        setor: "RH",
        solicitanteId: userIds[1],
        solicitanteNome: "Pedro Oliveira",
        solicitanteSetor: "TEI",
        solicitanteEmail: "pedro.oliveira@tradestars.com",
        titulo: "Solicitação de Férias",
        descricao:
          "Gostaria de solicitar férias para o mês de março.",
        categoria: "Férias",
        prioridade: "Normal",
        status: "Em Andamento",
        anexos: [],
        respostas: [
          {
            _id: new ObjectId(),
            autorId: userIds[2],
            autorNome: "Ana Paula Costa",
            mensagem:
              "Recebido! Vou verificar a disponibilidade e retorno em breve.",
            anexos: [],
            criadoEm: new Date(),
            isInterno: false,
          },
        ],
        dadosEspecificos: {
          periodo: {
            inicio: new Date("2025-03-10"),
            fim: new Date("2025-03-20"),
          },
        },
        criadoEm: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000,
        ),
        atualizadoEm: new Date(),
      },
      {
        numero: "FIN-2025-001",
        setor: "Financeiro",
        solicitanteId: userIds[8],
        solicitanteNome: "Laura Rodrigues",
        solicitanteSetor: "Marketing",
        solicitanteEmail: "laura.rodrigues@tradestars.com",
        titulo: "Reembolso de despesa",
        descricao:
          "Solicito reembolso de despesa com taxi para reunião externa.",
        categoria: "Reembolso",
        prioridade: "Normal",
        status: "Aberto",
        anexos: [],
        respostas: [],
        dadosEspecificos: {
          valor: 85.5,
          centroCusto: "Marketing",
          fornecedor: "99 Taxi",
        },
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ];

    await db.collection("chamados").insertMany(chamados);
    console.log(`  ✓ ${chamados.length} chamados criados\n`);

    // ========== CRIAR EVENTOS ==========
    console.log("📅 Criando eventos...");

    const agora = new Date();
    const eventos = [
      {
        titulo: "Reunião de Alinhamento - Equipe TEI",
        descricao:
          "Reunião semanal para alinhamento de demandas e prioridades",
        tipo: "Reunião",
        dataInicio: new Date(
          agora.getTime() + 2 * 24 * 60 * 60 * 1000,
        ),
        dataFim: new Date(
          agora.getTime() +
            2 * 24 * 60 * 60 * 1000 +
            60 * 60 * 1000,
        ),
        diaInteiro: false,
        local: "Sala Executiva",
        online: false,
        organizadorId: userIds[0],
        organizadorNome: "Carlos Santos",
        participantes: [
          {
            userId: userIds[1],
            nome: "Pedro Oliveira",
            email: "pedro.oliveira@tradestars.com",
            confirmado: true,
          },
        ],
        setoresConvidados: ["TEI"],
        cor: "#000aff",
        privado: false,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        titulo: "Treinamento - Compliance e LGPD",
        descricao:
          "Treinamento obrigatório sobre normas de compliance e proteção de dados",
        tipo: "Treinamento",
        dataInicio: new Date(
          agora.getTime() + 5 * 24 * 60 * 60 * 1000,
        ),
        dataFim: new Date(
          agora.getTime() +
            5 * 24 * 60 * 60 * 1000 +
            3 * 60 * 60 * 1000,
        ),
        diaInteiro: false,
        local: "Sala de Treinamento",
        online: true,
        linkReuniao: "https://meet.google.com/abc-defg-hij",
        organizadorId: userIds[2],
        organizadorNome: "Ana Paula Costa",
        participantes: [],
        setoresConvidados: [],
        cor: "#ac2aff",
        privado: false,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        titulo: "Aniversário da Empresa",
        descricao: "Celebração de 5 anos da TradeStars!",
        tipo: "Evento Corporativo",
        dataInicio: new Date(
          agora.getTime() + 30 * 24 * 60 * 60 * 1000,
        ),
        dataFim: new Date(
          agora.getTime() + 30 * 24 * 60 * 60 * 1000,
        ),
        diaInteiro: true,
        local: "Auditório Principal",
        online: false,
        organizadorId: userIds[9],
        organizadorNome: "Roberto TradeStars",
        participantes: [],
        setoresConvidados: [],
        cor: "#ff00ed",
        privado: false,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ];

    await db.collection("eventos").insertMany(eventos);
    console.log(`  ✓ ${eventos.length} eventos criados\n`);

    console.log("✨ Seed completo!\n");
    console.log("📋 Resumo dos dados criados:");
    console.log(`   👥 Usuários: ${userIds.length}`);
    console.log(
      `   🏢 Salas: ${Object.keys(resultSalas.insertedIds).length}`,
    );
    console.log(`   🎫 Chamados: ${chamados.length}`);
    console.log(`   📅 Eventos: ${eventos.length}\n`);
    console.log("🔐 Credenciais de teste:");
    console.log("   Email: admin@tradestars.com");
    console.log("   Senha: tradestars2025\n");
    console.log(
      "   Ou qualquer outro email criado com a mesma senha! 🎉\n",
    );
  } catch (error) {
    console.error("❌ Erro ao criar seed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedData();