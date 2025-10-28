-- ============================================================================
-- SOLUÇÃO RÁPIDA: Adicionar Coluna Location
-- ============================================================================
-- 
-- Execute APENAS este comando no SQL Editor do Supabase:
--
-- ============================================================================

-- Adicionar a coluna location à tabela eventos existente
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS location TEXT;

-- Verificar se funcionou
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'eventos' 
ORDER BY ordinal_position;