import { Pool, type PoolClient } from 'pg';
import { env } from '@/env/index.js';
import fs from "fs/promises";
import path from "path";


class DB {
    private pool: Pool;
    private client: PoolClient | undefined;
    

    constructor() {
        this.pool = new Pool({
            user: env.DATABASE_USER,
            host: env.DATABASE_HOST,
            database: env.DATABASE_NAME,
            password: env.DATABASE_PASSWORD,
            port: env.DATABASE_PORT,
        });
        this.connect()
    }


    private async connect() {
        try{
            this.client = await this.pool.connect();
            
            await this.initDatabase();

        } catch (err) {
            console.error('Error connecting to the database: ', err)
            throw new Error('Error connecting to the database: ' + err)
        }
    }

    get clientInstance() {
        return this.client
    }


private async initDatabase() {
    if (!this.client) {
        throw new Error("Database client not initialized.");
    }

    // Verifica se a tabela "post" existe
    const result = await this.client.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = 'post'
        );
    `);

    const tableExists = result.rows[0].exists;

    if (tableExists) {
        console.log("Banco já inicializado.");
        return;
    }

    console.log("Inicializando banco de dados...");

    // Lê o arquivo schema.sql
    const schema = await fs.readFile(
        path.resolve("schema.sql"),
        "utf-8"
    );

    // Executa todo o script SQL
    await this.client.query(schema);

    console.log("Banco inicializado com sucesso.");
}
}

export const db = new DB();