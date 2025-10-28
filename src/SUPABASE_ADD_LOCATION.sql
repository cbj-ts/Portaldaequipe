-- ============================================================================
-- ADICIONAR COLUNA LOCATION - PARA TABELA EXISTENTE
-- ============================================================================
-- 
-- Execute este script apenas se a tabela 'eventos' já existir sem a coluna 'location'
-- Se você está criando a tabela do zero, use o SUPABASE_SETUP_EVENTOS.sql
--
-- ============================================================================

-- Adicionar a coluna location à tabela eventos existente
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS location TEXT;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'eventos' 
ORDER BY ordinal_position;

-- Exemplo de atualização de evento existente com local
-- UPDATE eventos SET location = 'Sala de Reuniões 1' WHERE id = 1;