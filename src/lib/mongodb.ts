/**
 * ============================================================================
 * MONGODB - Configuração e Conexão
 * ============================================================================
 * 
 * Cliente MongoDB singleton para o portal TradeStars.
 * 
 * IMPORTANTE:
 * - Substitua CLUSTER_NAME pelo seu cluster real do MongoDB Atlas
 * - Ou configure a variável MONGODB_URI no .env
 * 
 * SEGURANÇA:
 * - Credenciais devem estar em variáveis de ambiente
 * - Connection pooling automático
 * - Reconexão automática em caso de falha
 * 
 * ============================================================================
 */

import { MongoClient, Db } from 'mongodb';

// Connection String - Portal da Equipe
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://di01:0hSNqpUXuR9jAtED@cluster0.suk3y4n.mongodb.net/?appName=Cluster0';

const MONGODB_DB = process.env.MONGODB_DB || 'PortalDaEquipe';

if (!MONGODB_URI) {
  throw new Error('⚠️ Por favor, defina a variável MONGODB_URI no arquivo .env');
}

/**
 * Opções de conexão otimizadas para produção
 */
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // Em desenvolvimento, usar variável global para evitar múltiplas conexões
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Em produção, melhor criar nova instância
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

/**
 * Obter conexão com o banco de dados
 */
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(MONGODB_DB);
}

/**
 * Obter cliente MongoDB diretamente
 */
export async function getClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Fechar conexão (útil para testes)
 */
export async function closeConnection(): Promise<void> {
  const client = await clientPromise;
  await client.close();
}

/**
 * Verificar status da conexão
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB conectado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error);
    return false;
  }
}

export default clientPromise;
