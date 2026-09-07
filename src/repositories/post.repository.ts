import type { Post } from "@/entities/post.entity.js";
import { db } from "@/lib/pg/db.js";


export class PostRepository {
    public async criar({ titulo, conteudo, autor, disciplina }: Post): Promise<Post | undefined> {
        const result = await db.clientInstance?.query(
            'INSERT INTO post (titulo, conteudo, autor, disciplina, data_criacao, data_atualizacao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [titulo, conteudo, Number(autor), disciplina, 'NOW()', 'NOW()']
        );
        return result?.rows[0];
    }

    public async listar(
        paginaAtual: number,
        itensPagina: number,
        pesquisa?: string
    ): Promise<Post[] | undefined> {

        let sql = `
            SELECT 
                post.id,
                post.titulo,
                post.conteudo,
                post.disciplina,
                post.data_criacao,
                post.data_atualizacao,
                usuarios.nome AS autor
            FROM post 
            LEFT JOIN usuarios
                ON usuarios.id = post.autor
        `;

        const params: any[] = [];

        if (pesquisa) {
            sql += `
                WHERE (
                    post.titulo ILIKE $1
                    OR post.conteudo ILIKE $1
                    OR post.disciplina ILIKE $1
                )
            `;

            params.push(`%${pesquisa}%`);
        }

        const offset = (paginaAtual - 1) * itensPagina;

        params.push(itensPagina);
        params.push(offset);

        sql += `
            ORDER BY post.data_criacao ASC
            LIMIT $${params.length - 1}
            OFFSET $${params.length}
        `;

        const result = await db.clientInstance?.query(sql, params);

        return result?.rows;
    }

    public async buscarPorId(id: number): Promise<Post | undefined> {
        const result = await db.clientInstance?.query(
            `SELECT * FROM post WHERE id = ${id}`
        );
        return result?.rows[0];
    }

    public async editar(post: Post): Promise<Post | undefined> {
        const result = await db.clientInstance?.query(
            `UPDATE post
         SET
            titulo = $1,
            conteudo = $2,
            disciplina = $3,
            data_atualizacao = $4,
            autor = $5
         WHERE id = $6
         RETURNING *`,
            [
                post.titulo,
                post.conteudo,
                post.disciplina,
                'NOW()',
                post.autor,
                post.id
            ]
        );

        return result?.rows[0];
    }


    public async deletar(id: number): Promise<String | undefined> {
        await db.clientInstance?.query(
            `DELETE FROM post WHERE id = ${id}`
        );
        return 'deletado';
    }
}