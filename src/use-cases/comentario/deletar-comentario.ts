import type { ComentarioRepository } from "@/repositories/comentario.repository.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";

export class DeletarComentarioUseCase {
    constructor(
        private comentarioRepository: ComentarioRepository,
        private usuarioRepository: UsuarioRepository
    ) {}

    async handler(id: number, usuarioSolicitanteId: number) {
        const usuario = await this.usuarioRepository.buscarPorId(usuarioSolicitanteId);
        
        if (!usuario) return null;

        const comentarioExistente = await this.comentarioRepository.buscarPorId(id);
        
        if (!comentarioExistente) return null;

        // Se for professor (perfil 2), deleta direto.
        if (Number(usuario.perfil_id) === 2) {
            return this.comentarioRepository.deletar(id);
        }
        
        // Se for aluno (perfil 1), só pode deletar se for dono do comentário.
        if (Number(usuario.perfil_id) === 1 && Number(comentarioExistente.autor_id) === Number(usuarioSolicitanteId)) {
            return this.comentarioRepository.deletar(id);
        }

        return null;
    }
}
