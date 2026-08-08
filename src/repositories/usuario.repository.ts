import type { IUsuario } from "@/entities/models/usuario.interface.js";
import type { Usuario } from "@/entities/usuario.entity.js";
import { db } from "@/lib/pg/db.js";

export class UsuarioRepository{

    public async criar({nome, email ,senha, perfil_id}: Usuario): Promise<Usuario | undefined> {
        const result = await db.clientInstance?.query(
            `INSERT INTO usuarios (nome, email, senha, perfil_id)
            VALUES ($1, $2, $3, $4)`,
            [nome, email, senha, Number(perfil_id)]
        );
        return result?.rows[0];
    }

    public async buscarPorId(id: number): Promise<Usuario | undefined> {
        const result = await db.clientInstance?.query(
            `SELECT * FROM usuarios WHERE id = ${id}`
        );
        return result?.rows[0]; 
    }

    public async findByUsername(email: string): Promise<IUsuario | undefined> {
        const result = await db.clientInstance?.query(
            `SELECT * FROM usuarios
             WHERE email = $1`,
            [email]
        );

        return result?.rows[0];
    }

    public async listar(): Promise<Usuario[] | undefined> {
        const result = await db.clientInstance?.query(
            `SELECT * FROM usuarios`
        );
        return result?.rows;
    }

    public async deletar(id: number): Promise<String> {
        await db.clientInstance?.query(
            `DELETE FROM usuarios WHERE id = ${id}`
        );
        return `usuário de id ${id} deletado com sucesso.`;
    }

    public async editar(usuario: Usuario): Promise<Usuario> {
        const result = await db.clientInstance?.query(
            `UPDATE usuarios
         SET
            nome = $1,
            email = $2,
            senha = $3,
            perfil_id = $4
         WHERE id = $5
         RETURNING *`,
            [
                usuario.nome,
                usuario.email,
                usuario.senha,
                usuario.perfil_id,
                usuario.id
            ]
        );

        return result?.rows[0];
    }
}