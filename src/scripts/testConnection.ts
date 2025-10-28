/**
 * ============================================================================
 * SCRIPT: Teste de Conexão MongoDB
 * ============================================================================
 *
 * Testa a conexão com o MongoDB e exibe informações detalhadas
 *
 * EXECUTAR:
 * npx tsx scripts/testConnection.ts
 *
 * ============================================================================
 */

import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?appName=Cluster0";

const DB_NAME = "PortalDaEquipe";

async function testConnection() {
  console.log("🧪 Testando conexão com MongoDB...\n");
  console.log("📍 URI:", MONGODB_URI.replace(/\/\/(.+):(.+)@/, "//*****:*****@"));
  console.log("📦 Database:", DB_NAME);
  console.log("\n⏳ Conectando...\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    // Tentar conectar
    await client.connect();
    console.log("✅ Conectado com sucesso!\n");

    // Testar ping
    const admin = client.db("admin");
    const pingResult = await admin.command({ ping: 1 });
    console.log("🏓 Ping:", pingResult.ok === 1 ? "OK" : "FALHOU");

    // Listar databases
    const databasesList = await admin.admin().listDatabases();
    console.log("\n📚 Databases disponíveis:");
    databasesList.databases.forEach((db: any) => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Verificar se PortalDaEquipe existe
    const portalExists = databasesList.databases.some(
      (db: any) => db.name === DB_NAME
    );

    if (portalExists) {
      console.log(`\n✅ Database "${DB_NAME}" encontrado!`);

      // Listar collections
      const db = client.db(DB_NAME);
      const collections = await db.listCollections().toArray();
      
      console.log(`\n📦 Collections em "${DB_NAME}":`);
      if (collections.length === 0) {
        console.log("   ⚠️  Nenhuma collection encontrada. Execute initMongoDB.ts primeiro!");
      } else {
        for (const coll of collections) {
          const count = await db.collection(coll.name).countDocuments();
          console.log(`   - ${coll.name}: ${count} documentos`);
        }
      }
    } else {
      console.log(`\n⚠️  Database "${DB_NAME}" NÃO encontrado!`);
      console.log("   Execute: npx tsx scripts/initMongoDB.ts");
    }

    console.log("\n✨ Teste de conexão concluído!\n");
    console.log("🎯 Próximos passos:");
    
    if (!portalExists) {
      console.log("   1. Execute: npx tsx scripts/initMongoDB.ts");
      console.log("   2. Execute: npx tsx scripts/seedData.ts");
    } else if (collections.length === 0) {
      console.log("   1. Execute: npx tsx scripts/initMongoDB.ts");
      console.log("   2. Execute: npx tsx scripts/seedData.ts");
    } else {
      const db = client.db(DB_NAME);
      const userCount = await db.collection("users").countDocuments();
      if (userCount === 0) {
        console.log("   Execute: npx tsx scripts/seedData.ts");
      } else {
        console.log("   ✅ Tudo pronto! Faça login com:");
        console.log("      Email: admin@tradestars.com");
        console.log("      Senha: tradestars2025");
      }
    }

    console.log("");

  } catch (error: any) {
    console.error("\n❌ ERRO AO CONECTAR:\n");
    
    if (error.message.includes("ENOTFOUND")) {
      console.error("🌐 Problema de DNS/Internet:");
      console.error("   - Verifique sua conexão com a internet");
      console.error("   - Confirme se o cluster está online no MongoDB Atlas");
    } else if (error.message.includes("Authentication failed")) {
      console.error("🔐 Problema de autenticação:");
      console.error("   - Verifique o usuário e senha no MongoDB Atlas");
      console.error("   - Confirme que as credenciais estão corretas");
    } else if (error.message.includes("IP")) {
      console.error("🚫 Problema de IP:");
      console.error("   - Adicione seu IP na whitelist do MongoDB Atlas");
      console.error("   - Ou configure 0.0.0.0/0 para permitir todos os IPs");
    } else {
      console.error("Erro:", error.message);
    }
    
    console.error("\n💡 Dicas:");
    console.error("   1. Acesse https://cloud.mongodb.com");
    console.error("   2. Verifique se o cluster 'Cluster0' está ativo");
    console.error("   3. Vá em 'Database Access' e confirme o usuário 'di01'");
    console.error("   4. Vá em 'Network Access' e adicione seu IP\n");
    
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔌 Conexão fechada.\n");
  }
}

testConnection();
