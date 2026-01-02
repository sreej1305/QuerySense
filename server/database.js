import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS query_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query_text TEXT,
      database_type TEXT,
      workload_category TEXT,
      estimated_execution_time TEXT,
      estimated_rows_scanned INTEGER,
      detected_issues TEXT,
      optimization_suggestions TEXT,
      index_suggestions TEXT,
      optimized_query TEXT,
      explanation TEXT,
      performance_comparison TEXT,
      created_date TEXT
    )
  `);

    return db;
}
