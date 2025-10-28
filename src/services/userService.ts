/**
 * ============================================================================
 * SERVICE: User Service
 * ============================================================================
 * 
 * Serviço para gerenciar usuários no MongoDB
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';
import { getDatabase } from '../lib/mongodb';
import type { User, CreateUserDTO, UpdateUserDTO, UserProfile } from '../models/User';
import bcrypt from 'bcryptjs';

const COLLECTION = 'users';

/**
 * Criar novo usuário
 */
export async function createUser(data: CreateUserDTO): Promise<User> {
  const db = await getDatabase();
  
  // Hash da senha
  const senhaHash = await bcrypt.hash(data.senha, 10);
  
  const user: Omit<User, '_id'> = {
    ...data,
    senha: senhaHash,
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };
  
  const result = await db.collection<User>(COLLECTION).insertOne(user as User);
  
  return {
    ...user,
    _id: result.insertedId,
  };
}

/**
 * Buscar usuário por ID
 */
export async function getUserById(id: string | ObjectId): Promise<User | null> {
  const db = await getDatabase();
  const userId = typeof id === 'string' ? new ObjectId(id) : id;
  
  return db.collection<User>(COLLECTION).findOne({ _id: userId });
}

/**
 * Buscar usuário por email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  return db.collection<User>(COLLECTION).findOne({ email: email.toLowerCase() });
}

/**
 * Listar todos os usuários ativos
 */
export async function listUsers(filters?: { setor?: string; ativo?: boolean }): Promise<User[]> {
  const db = await getDatabase();
  
  const query: any = {};
  if (filters?.setor) query.setor = filters.setor;
  if (filters?.ativo !== undefined) query.ativo = filters.ativo;
  
  return db.collection<User>(COLLECTION)
    .find(query)
    .sort({ nome: 1 })
    .toArray();
}

/**
 * Atualizar usuário
 */
export async function updateUser(id: string | ObjectId, data: UpdateUserDTO): Promise<boolean> {
  const db = await getDatabase();
  const userId = typeof id === 'string' ? new ObjectId(id) : id;
  
  const result = await db.collection<User>(COLLECTION).updateOne(
    { _id: userId },
    { 
      $set: { 
        ...data, 
        atualizadoEm: new Date() 
      } 
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Atualizar senha do usuário
 */
export async function updatePassword(id: string | ObjectId, novaSenha: string): Promise<boolean> {
  const db = await getDatabase();
  const userId = typeof id === 'string' ? new ObjectId(id) : id;
  
  const senhaHash = await bcrypt.hash(novaSenha, 10);
  
  const result = await db.collection<User>(COLLECTION).updateOne(
    { _id: userId },
    { 
      $set: { 
        senha: senhaHash,
        atualizadoEm: new Date() 
      } 
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Validar credenciais de login
 */
export async function validateCredentials(email: string, senha: string): Promise<UserProfile | null> {
  const user = await getUserByEmail(email);
  
  if (!user || !user.ativo) {
    return null;
  }
  
  const senhaValida = await bcrypt.compare(senha, user.senha || '');
  
  if (!senhaValida) {
    return null;
  }
  
  // Atualizar último acesso
  const db = await getDatabase();
  await db.collection<User>(COLLECTION).updateOne(
    { _id: user._id },
    { $set: { ultimoAcesso: new Date() } }
  );
  
  // Retornar perfil sem senha
  return {
    _id: user._id!,
    nome: user.nome,
    email: user.email,
    foto: user.foto,
    setor: user.setor,
    cargo: user.cargo,
    telefone: user.telefone,
    ramal: user.ramal,
    isLider: user.isLider,
    isAdmin: user.isAdmin,
  };
}

/**
 * Desativar usuário (soft delete)
 */
export async function deactivateUser(id: string | ObjectId): Promise<boolean> {
  return updateUser(id, { ativo: false });
}

/**
 * Buscar usuários por setor
 */
export async function getUsersBySetor(setor: string): Promise<User[]> {
  const db = await getDatabase();
  
  return db.collection<User>(COLLECTION)
    .find({ setor, ativo: true })
    .sort({ nome: 1 })
    .toArray();
}

/**
 * Contar usuários por setor
 */
export async function countUsersBySetor(): Promise<Record<string, number>> {
  const db = await getDatabase();
  
  const result = await db.collection<User>(COLLECTION)
    .aggregate([
      { $match: { ativo: true } },
      { $group: { _id: '$setor', count: { $sum: 1 } } },
    ])
    .toArray();
  
  return result.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as Record<string, number>);
}
