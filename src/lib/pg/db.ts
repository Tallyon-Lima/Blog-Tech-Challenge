import { Pool, type PoolClient } from 'pg';
import { env } from '@/env/index.js';


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
            

        } catch (err) {
            console.error('Error connecting to the database: ', err)
            throw new Error('Error connecting to the database: ' + err)
        }
    }

    get clientInstance() {
        return this.client
    }
}

export const db = new DB();