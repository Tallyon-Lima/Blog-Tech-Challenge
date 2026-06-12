import type { Post } from "@/entities/post.entity.js";
import { db } from "@/lib/pg/db.js";


export class PostRepository {
    public async create({titulo, descricao}: Post): Promise<Post | undefined>{
        const result = await db.clientInstance?.query(
            'INSERT INTO post (titulo, descricao, data_criacao, data_atualizacao) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, descricao, 'NOW()', 'NOW()']
        )
        return result?.rows[0]
    }
}