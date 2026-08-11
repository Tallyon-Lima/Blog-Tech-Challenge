import type { Comentario } from "@/entities/comentario.entity.js";
import type { ComentarioRepository } from "@/repositories/comentario.repository.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";

export class CriarComentarioUseCase {
    constructor(
        private comentarioRepository: ComentarioRepository,
        private usuarioRepository: UsuarioRepository
    ) {}

    async handler(comentario: Comentario) {
        const autor = await this.usuarioRepository.buscarPorId(comentario.autor_id);
        
        // Qualquer usuário logado/válido (Aluno ou Professor) pode criar comentários.
        if (autor) {
            return this.comentarioRepository.criar(comentario);
        }
        
        return null;
    }
}
