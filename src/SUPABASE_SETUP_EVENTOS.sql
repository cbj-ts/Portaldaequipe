-- ============================================================================
-- SETUP DA TABELA DE EVENTOS NO SUPABASE
-- ============================================================================
-- 
-- Execute este script no SQL Editor do Supabase para criar a tabela 'eventos'
-- 
-- ACESSO: Supabase Dashboard > SQL Editor > New Query > Cole este código > Run
--
-- ============================================================================

-- Criar a tabela eventos
CREATE TABLE IF NOT EXISTS eventos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_eventos_date ON eventos(date);
CREATE INDEX IF NOT EXISTS idx_eventos_category ON eventos(category);

-- Habilitar RLS (Row Level Security) - OPCIONAL
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos
CREATE POLICY "Permitir leitura para todos" 
ON eventos 
FOR SELECT 
USING (true);

-- Política para permitir inserção para todos (ajuste conforme necessário)
CREATE POLICY "Permitir inserção para todos" 
ON eventos 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir atualização para todos (ajuste conforme necessário)
CREATE POLICY "Permitir atualização para todos" 
ON eventos 
FOR UPDATE 
USING (true);

-- Política para permitir exclusão para todos (ajuste conforme necessário)
CREATE POLICY "Permitir exclusão para todos" 
ON eventos 
FOR DELETE 
USING (true);

-- Inserir alguns eventos de exemplo (OPCIONAL)
INSERT INTO eventos (title, date, time, category, description, location) VALUES
  ('Reunião Geral', '2025-01-25', '10:00', 'reuniao', 'Reunião mensal de alinhamento', 'Sala de Reuniões 1'),
  ('Treinamento Compliance', '2025-01-26', '14:00', 'treinamento', 'Treinamento obrigatório', 'Auditório'),
  ('Aniversário João', '2025-01-27', NULL, 'aniversario', 'Aniversário do colaborador João', NULL),
  ('Happy Hour', '2025-01-28', '18:00', 'evento', 'Confraternização mensal', 'Bar Parceiro');

-- Verificar se a tabela foi criada
SELECT * FROM eventos;
