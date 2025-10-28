/**
 * ============================================================================
 * LOGIN PAGE - Autenticação MongoDB
 * ============================================================================
 * 
 * Tela de login integrada com MongoDB
 * 
 * ============================================================================
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Loader2, Rocket } from 'lucide-react';
import LogoTradeHub from '../imports/LogoTradeHub';
import Vector from '../imports/Vector';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, senha);
      
      if (!success) {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@tradestars.com');
    setSenha('tradestars2025');
    setError('');
    setLoading(true);

    try {
      const success = await login('admin@tradestars.com', 'tradestars2025');
      
      if (!success) {
        setError('Erro ao fazer login com credenciais demo');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:to-[#1d1d1d] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#000aff] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#ac2aff] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#ff00ed] rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl bg-white/80 dark:bg-[#0a0a0a]/80">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#000aff] to-[#ac2aff] shadow-lg">
              <div className="w-12 h-12" style={{ '--fill-0': 'white' } as React.CSSProperties}>
                <Vector />
              </div>
            </div>
            
            <div className="w-48 h-6">
              <LogoTradeHub />
            </div>
            
            <div className="text-center space-y-2">
              <h1>Portal da Equipe</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Entre com suas credenciais
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@tradehub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#000aff] hover:bg-[#0008dd] text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <small className="bg-white dark:bg-[#0a0a0a] px-4 text-gray-500">
                ou
              </small>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-[#ac2aff] text-[#ac2aff] hover:bg-[#ac2aff]/10"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Rocket className="w-5 h-5 mr-2" />
            Entrar com Conta Demo
          </Button>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <small className="text-gray-500 dark:text-gray-400 block text-center">
              Credenciais Demo:<br />
              <strong className="text-gray-700 dark:text-gray-300">admin@tradestars.com</strong> / 
              <strong className="text-gray-700 dark:text-gray-300"> tradestars2025</strong>
            </small>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
