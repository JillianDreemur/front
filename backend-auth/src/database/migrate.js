import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    console.log('🔄 Iniciando migração do banco de dados...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('VENDEDOR', 'CLIENTE')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabela users criada');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    console.log('✅ Índice criado');

    const result = await pool.query('SELECT COUNT(*) FROM users');
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword1 = await bcrypt.default.hash('senha123', 10);
      const hashedPassword2 = await bcrypt.default.hash('senha123', 10);

      await pool.query(
        `INSERT INTO users (email, name, password, role) 
         VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
        [
          'vendedor@email.com',
          'João Vendedor',
          hashedPassword1,
          'VENDEDOR',
          'cliente@email.com',
          'Maria Cliente',
          hashedPassword2,
          'CLIENTE',
        ]
      );

      console.log('✅ Usuários padrão criados');
      console.log('   - vendedor@email.com / senha123 (VENDEDOR)');
      console.log('   - cliente@email.com / senha123 (CLIENTE)');
    } else {
      console.log(`ℹ️  Já existem ${count} usuário(s) no banco`);
    }

    console.log('✅ Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

migrate();

