/**
 * Script de Importação JSON para PostgreSQL
 *
 * Executar APÓS migrar o schema com Prisma
 * Este script importa os dados dos JSONs para PostgreSQL
 *
 * Uso: npx tsx scripts/importPostgres.ts
 *
 * NOTA: Ajuste a connection string conforme necessário
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '..', 'backups', 'sqlite-export');

console.log('='.repeat(50));
console.log('IMPORTAR DADOS DO JSON PARA POSTGRESQL');
console.log('='.repeat(50));
console.log();
console.log('NOTA: Este script é um template.');
console.log('      Implemente a lógica de importação conforme necessário.');
console.log();
console.log(`Dados de entrada: ${INPUT_DIR}`);

if (!fs.existsSync(INPUT_DIR)) {
  console.error('ERRO: Diretório de dados não encontrado. Execute exportSqlite.ts primeiro.');
  process.exit(1);
}

console.log();
console.log('PASSOS:');
console.log('1. Configure DATABASE_URL no .env para PostgreSQL');
console.log('2. Execute: npx prisma migrate dev --name add_postgres');
console.log('3. Implemente a lógica de importação para cada tabela');
console.log('4. Verifique os dados no PostgreSQL');
console.log();
console.log('TABELAS A IMPORTAR:');
const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(INPUT_DIR, file), 'utf-8'));
  console.log(`  - ${file.replace('.json', '')}: ${data.length} registros`);
}

console.log();
console.log('='.repeat(50));
console.log('SCRIPT PRONTO - EXECUTE MANUALMENTE QUANDO NECESSÁRIO');
console.log('='.repeat(50));
