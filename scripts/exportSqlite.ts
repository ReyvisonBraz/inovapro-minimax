/**
 * Script de Exportação SQLite para JSON
 *
 * Executar ANTES de migrar para PostgreSQL
 * Este script exporta todos os dados do SQLite para JSON
 *
 * Uso: npx tsx scripts/exportSqlite.ts
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'finance.db');
const OUTPUT_DIR = path.join(__dirname, '..', 'backups', 'sqlite-export');

console.log('='.repeat(50));
console.log('EXPORTAR DADOS DO SQLITE PARA JSON');
console.log('='.repeat(50));
console.log();

const db = new Database(DB_PATH);

try {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const tables = [
    'users',
    'transactions',
    'customers',
    'client_payments',
    'service_orders',
    'inventory_items',
    'categories',
    'settings',
    'audit_logs',
    'service_order_statuses',
    'brands',
    'models',
    'equipment_types',
    'receipts'
  ];

  for (const table of tables) {
    try {
      const data = db.prepare(`SELECT * FROM ${table}`).all();
      const outputPath = path.join(OUTPUT_DIR, `${table}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`[OK] ${table}: ${data.length} registros -> ${outputPath}`);
    } catch (err) {
      console.log(`[SKIP] ${table}: ${err.message}`);
    }
  }

  console.log();
  console.log('='.repeat(50));
  console.log('EXPORTÇÃO CONCLUÍDA');
  console.log('='.repeat(50));
  console.log(`Dados salvos em: ${OUTPUT_DIR}`);
  console.log();
  console.log('PRÓXIMO PASSO: Migrar para PostgreSQL usando os JSONs');

} catch (error) {
  console.error('ERRO:', error);
  process.exit(1);
} finally {
  db.close();
}
