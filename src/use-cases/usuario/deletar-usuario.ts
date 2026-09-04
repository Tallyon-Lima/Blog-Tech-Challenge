import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { isPerfilAdmin } from "@/entities/models/perfil.enum.js";

export class DeletarUsuarioUseCase {
    constructor(private usuarioRepository: UsuarioRepository) {}

    async handler(
        id: number,
        solicitanteId?: number,
        solicitantePerfilId?: number
    ): Promise<string> {
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

        const usuarioExistente = await this.usuarioRepository.buscarPorId(id);
        if (!usuarioExistente) {
            return "nao_encontrado";
        }

        await this.usuarioRepository.deletar(id);
        return "deletado";
    }
}