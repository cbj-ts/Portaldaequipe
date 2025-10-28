/**
 * ============================================================================
 * SCRIPT: Inicialização MongoDB
 * ============================================================================
 *
 * Cria todas as collections e índices necessários no MongoDB
 *
 * EXECUTAR:
 * npm install mongodb bcryptjs
 * npx tsx scripts/initMongoDB.ts
 *
 * ============================================================================
 */

import { MongoClient } from "mongodb";

// Connection String - Portal da Equipe
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?appName=Cluster0";

const DB_NAME = "PortalDaEquipe";

async function initMongoDB() {
  console.log("🚀 Iniciando configuração do MongoDB...\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB Atlas!\n");

    const db = client.db(DB_NAME);

    // ========== CRIAR COLLECTIONS ==========
    console.log("📦 Criando collections...\n");

    const collections = [
      "users",
      "chamados",
      "eventos",
      "salas",
      "reservas",
      "cursos",
      "progressos",
      "newsletters",
      "copys",
      "produtos",
      "checklists",
      "avaliacoes",
      "avaliacaoLogs",
    ];

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`  ✓ Collection "${collectionName}" criada`);
      } catch (error: any) {
        if (error.codeName === "NamespaceExists") {
          console.log(`  ⚠ Collection "${collectionName}" já existe`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n📊 Criando índices...\n");

    // ========== ÍNDICES: users ==========
    console.log("  → users");
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ setor: 1 });
    await db.collection("users").createIndex({ ativo: 1 });
    await db.collection("users").createIndex({ criadoEm: -1 });
    console.log("    ✓ 4 índices criados");

    // ========== ÍNDICES: chamados ==========
    console.log("  → chamados");
    await db.collection("chamados").createIndex({ numero: 1 }, { unique: true });
    await db.collection("chamados").createIndex({ setor: 1, status: 1 });
    await db.collection("chamados").createIndex({ solicitanteId: 1 });
    await db.collection("chamados").createIndex({ atribuidoParaId: 1 });
    await db.collection("chamados").createIndex({ criadoEm: -1 });
    await db.collection("chamados").createIndex({ status: 1, criadoEm: -1 });
    console.log("    ✓ 6 índices criados");

    // ========== ÍNDICES: eventos ==========
    console.log("  → eventos");
    await db.collection("eventos").createIndex({ data: 1 });
    await db.collection("eventos").createIndex({ tipo: 1 });
    await db.collection("eventos").createIndex({ setorResponsavel: 1 });
    await db.collection("eventos").createIndex({ data: 1, tipo: 1 });
    console.log("    ✓ 4 índices criados");

    // ========== ÍNDICES: salas ==========
    console.log("  → salas");
    await db.collection("salas").createIndex({ nome: 1 }, { unique: true });
    await db.collection("salas").createIndex({ ativa: 1 });
    console.log("    ✓ 2 índices criados");

    // ========== ÍNDICES: reservas ==========
    console.log("  → reservas");
    await db.collection("reservas").createIndex({ salaId: 1 });
    await db.collection("reservas").createIndex({ usuarioId: 1 });
    await db.collection("reservas").createIndex({ data: 1 });
    await db.collection("reservas").createIndex({ salaId: 1, data: 1 });
    console.log("    ✓ 4 índices criados");

    // ========== ÍNDICES: cursos ==========
    console.log("  → cursos");
    await db.collection("cursos").createIndex({ slug: 1 }, { unique: true });
    await db.collection("cursos").createIndex({ categoria: 1 });
    await db.collection("cursos").createIndex({ nivel: 1 });
    await db.collection("cursos").createIndex({ publicado: 1 });
    console.log("    ✓ 4 índices criados");

    // ========== ÍNDICES: progressos ==========
    console.log("  → progressos");
    await db
      .collection("progressos")
      .createIndex({ usuarioId: 1, cursoId: 1 }, { unique: true });
    await db.collection("progressos").createIndex({ usuarioId: 1 });
    await db.collection("progressos").createIndex({ cursoId: 1 });
    await db.collection("progressos").createIndex({ concluido: 1 });
    console.log("    ✓ 4 índices criados");

    // ========== ÍNDICES: newsletters ==========
    console.log("  → newsletters");
    await db.collection("newsletters").createIndex({ criadoEm: -1 });
    await db.collection("newsletters").createIndex({ publicado: 1 });
    console.log("    ✓ 2 índices criados");

    // ========== ÍNDICES: copys ==========
    console.log("  → copys");
    await db.collection("copys").createIndex({ categoria: 1 });
    await db.collection("copys").createIndex({ criadoEm: -1 });
    console.log("    ✓ 2 índices criados");

    // ========== ÍNDICES: produtos ==========
    console.log("  → produtos");
    await db.collection("produtos").createIndex({ nome: 1 });
    await db.collection("produtos").createIndex({ categoria: 1 });
    await db.collection("produtos").createIndex({ ativo: 1 });
    console.log("    ✓ 3 índices criados");

    // ========== ÍNDICES: checklists ==========
    console.log("  → checklists");
    await db.collection("checklists").createIndex({ tipo: 1 });
    await db.collection("checklists").createIndex({ ativo: 1 });
    await db.collection("checklists").createIndex({ criadoEm: -1 });
    console.log("    ✓ 3 índices criados");

    // ========== ÍNDICES: avaliacoes ==========
    console.log("  → avaliacoes");
    await db.collection("avaliacoes").createIndex({ avaliadorId: 1, status: 1 });
    await db.collection("avaliacoes").createIndex({ avaliadoId: 1, status: 1 });
    await db.collection("avaliacoes").createIndex({ tipo: 1, status: 1 });
    await db.collection("avaliacoes").createIndex({ criadoEm: -1 });
    console.log("    ✓ 4 índices criados");

    // ========== ÍNDICES: avaliacaoLogs ==========
    console.log("  → avaliacaoLogs");
    await db.collection("avaliacaoLogs").createIndex({ avaliacaoId: 1, criadoEm: -1 });
    await db.collection("avaliacaoLogs").createIndex({ avaliadorId: 1 });
    await db.collection("avaliacaoLogs").createIndex({ avaliadoId: 1 });
    console.log("    ✓ 3 índices criados");

    console.log("\n✨ MongoDB configurado com sucesso!\n");
    console.log("📋 Resumo:");
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   Collections: ${collections.length}`);
    console.log("   Índices: 45 índices criados");
    console.log("   Status: Pronto para uso! 🎉\n");
  } catch (error) {
    console.error("❌ Erro ao configurar MongoDB:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔌 Conexão fechada.\n");
  }
}

// Executar
initMongoDB();
