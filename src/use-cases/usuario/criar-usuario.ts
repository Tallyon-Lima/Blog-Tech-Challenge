import type { Usuario } from "@/entities/usuario.entity.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { isPerfilAdmin } from "@/entities/models/perfil.enum.js";

export class CriarUsuarioUseCase {
    constructor(private usuarioRepository: UsuarioRepository) {}

    async handler(
        usuario: Usuario,
        solicitanteId?: number,
        solicitantePerfilId?: number
    ): Promise<Usuario | undefined | "sem_permissao"> {
        let isAdmin = false;

        if (solicitantePerfilId != null && isPerfilAdmin(solicitantePerfilId)) {
            isAdmin = true;
        } else if (solicitanteId != null) {
            const solicitante = await this.usuarioRepository.buscarPorId(solicitanteId);
            if (solicitante && isPerfilAdmin(solicitante.perfil_id)) {
                isAdmin = true;
            }
        }

        if (!isAdmin) {
            return "sem_permissao";
        }

        return this.usuarioRepository.criar(usuario);
    }
}