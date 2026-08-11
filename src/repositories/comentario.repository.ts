import type { Comentario } from "@/entities/comentario.entity.js";
import { db } from "@/lib/pg/db.js";

export class ComentarioRepository {
    public async criar({ conteudo, post_id, autor_id }: Comentario): Promise<Comentario | undefined> {
        const result = await db.clientInstance?.query(
            'INSERT INTO comentarios (conteudo, post_id, autor_id, data_criacao, data_atualizacao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [conteudo, Number(post_id), Number(autor_id), 'NOW()', 'NOW()']
        );
        return result?.rows[0];
    }

    public async listarPorPost(post_id: number): Promise<Comentario[] | undefined> {
        const sql = `
            SELECT 
                comentarios.id,
                comentarios.conteudo,
                comentarios.post_id,
                comentarios.data_criacao,
                comentarios.data_atualizacao,
                usuarios.nome as autor
            FROM comentarios 
            LEFT JOIN usuarios ON usuarios.id = comentarios.autor_id
            WHERE comentarios.post_id = $1
            ORDER BY comentarios.data_criacao DESC
        `;

        const result = await db.clientInstance?.query(sql, [post_id]);
        return result?.rows;
    }

    public async buscarPorId(id: number): Promise<Comentario | undefined> {
        const result = await db.clientInstance?.query(
            `SELECT * FROM comentarios WHERE id = $1`,
            [id]
        );
        return result?.rows[0];
    }

    public async editar(comentario: Comentario): Promise<Comentario | undefined> {
        const result = await db.clientInstance?.query(
            `UPDATE comentarios
             SET
                conteudo = $1,
                data_atualizacao = $2
             WHERE id = $3
             RETURNING *`,
            [
                comentario.conteudo,
                'NOW()',
                comentario.id
            ]
        );

        return result?.rows[0];
    }

    public async deletar(id: number): Promise<String | undefined> {
        await db.clientInstance?.query(
            `DELETE FROM comentarios WHERE id = $1`,
            [id]
        );
        return 'deletado';
    }
}
