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

        public async findByUsername(username: string): Promise<IUsuario | undefined> {
        const result = await db.clientInstance?.query(
            `SELECT * FROM usuario
             WHERE username = $1`,
            [username]
        );

        return result?.rows[0];
    }
}