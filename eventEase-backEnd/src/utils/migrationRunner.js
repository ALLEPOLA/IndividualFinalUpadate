const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class MigrationRunner {
  constructor() {
    this.migrationsPath = path.join(__dirname, '..', '..', 'migrations');
  }

  // Create database connection without specifying database
  async createConnection() {
    return await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  // Ensure database exists
  async ensureDatabase() {
    let connection;
    try {
      connection = await this.createConnection();
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
      console.log(`✅ Database '${process.env.DB_NAME}' ensured`);
    } catch (error) {
      console.error('❌ Error creating database:', error.message);
      throw error;
    } finally {
      if (connection) await connection.end();
    }
  }

  // Get all migration files sorted by name
  getMigrationFiles() {
    try {
      const files = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();
      return files;
    } catch (error) {
      console.error('Error reading migrations directory:', error.message);
      return [];
    }
  }

  // Execute a single migration file
  async executeMigration(connection, filename) {
    const filePath = path.join(this.migrationsPath, filename);

    try {
      const sql = fs.readFileSync(filePath, 'utf8');

      // Split SQL into individual statements (handling multiple statements)
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }

      console.log(`✅ Migration executed: ${filename}`);
      return true;
    } catch (error) {
      console.error(`❌ Migration failed: ${filename}`, error.message);
      throw error;
    }
  }

  // Check if migrations table exists, create if not
  async ensureMigrationsTable(connection) {
    try {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await connection.execute(createTableSQL);
    } catch (error) {
      console.error('Error creating migrations table:', error.message);
      throw error;
    }
  }

  // Check if a migration has already been executed
  async isMigrationExecuted(connection, filename) {
    try {
      const [rows] = await connection.execute(
        'SELECT id FROM migrations WHERE filename = ?',
        [filename]
      );
      return rows.length > 0;
    } catch (error) {
      // If table doesn't exist yet, return false
      return false;
    }
  }

  // Mark migration as executed
  async markMigrationExecuted(connection, filename) {
    try {
      await connection.execute(
        'INSERT INTO migrations (filename) VALUES (?)',
        [filename]
      );
    } catch (error) {
      console.error(`Error marking migration as executed: ${filename}`, error.message);
      throw error;
    }
  }

  // Run all pending migrations
  async runMigrations() {
    console.log('🔄 Checking for pending migrations...');

    try {
      // Ensure database exists
      await this.ensureDatabase();

      // Create connection to the specific database
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      });

      // Ensure migrations table exists
      await this.ensureMigrationsTable(connection);

      const migrationFiles = this.getMigrationFiles();
      let executedCount = 0;

      for (const filename of migrationFiles) {
        if (await this.isMigrationExecuted(connection, filename)) {
          console.log(`⏭️  Migration already executed: ${filename}`);
          continue;
        }

        console.log(`🚀 Executing migration: ${filename}`);
        await this.executeMigration(connection, filename);
        await this.markMigrationExecuted(connection, filename);
        executedCount++;
      }

      await connection.end();

      if (executedCount === 0) {
        console.log('✅ All migrations are up to date');
      } else {
        console.log(`✅ Successfully executed ${executedCount} migration(s)`);
      }

    } catch (error) {
      console.error('❌ Migration process failed:', error.message);
      throw error;
    }
  }
}

module.exports = MigrationRunner;