import type { IUsuario } from "@/entities/models/usuario.interface.js";
import type { Usuario } from "@/entities/usuario.entity.js";
import { db } from "@/lib/pg/db.js";

export class UsuarioRepository {

    public async criar({ nome, email, senha, perfil_id, cpf }: Usuario): Promise<Usuario | undefined> {
        const result = await db.clientInstance?.query(
            `INSERT INTO usuarios (nome, email, senha, perfil_id, cpf)
            VALUES ($1, $2, $3, $4, $5)`,
            [nome, email, senha, Number(perfil_id), cpf ?? null]
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

    public async findByCpf(cpf: string): Promise<IUsuario | undefined> {
        const result = await db.clientInstance?.query(
            `SELECT * FROM usuarios
             WHERE cpf = $1`,
            [cpf]
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
            perfil_id = $4,
            cpf = $5
         WHERE id = $6
         RETURNING *`,
            [
                usuario.nome,
                usuario.email,
                usuario.senha,
                usuario.perfil_id,
                usuario.cpf ?? null,
                usuario.id
            ]
        );

        return result?.rows[0];
    }
}