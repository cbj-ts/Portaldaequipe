/**
 * ============================================================================
 * API ROUTE: Login
 * ============================================================================
 * 
 * Endpoint para autenticação de usuários
 * 
 * POST /api/auth/login
 * Body: { email: string, senha: string }
 * 
 * ============================================================================
 */

import { validateCredentials } from '../../services/userService';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return new Response(
        JSON.stringify({ error: 'Email e senha são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await validateCredentials(email, senha);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Credenciais inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Em produção, gerar JWT token aqui
    return new Response(
      JSON.stringify(user),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro no login:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
