import type { Comentario } from "@/entities/comentario.entity.js";
import type { ComentarioRepository } from "@/repositories/comentario.repository.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";

export class EditarComentarioUseCase {
    constructor(
        private comentarioRepository: ComentarioRepository,
        private usuarioRepository: UsuarioRepository
    ) {}

    async handler(comentarioInput: Comentario, usuarioSolicitanteId: number) {
        const usuario = await this.usuarioRepository.buscarPorId(usuarioSolicitanteId);
        
        if (!usuario || !comentarioInput.id) return null;

        const comentarioExistente = await this.comentarioRepository.buscarPorId(comentarioInput.id);
        
        if (!comentarioExistente) return null;

        // Se for professor (perfil 2), edita direto.
        if (Number(usuario.perfil_id) === 2) {
            return this.comentarioRepository.editar(comentarioInput);
        }
        
        // Se for aluno (perfil 1), só pode editar se for dono do comentário.
        if (Number(usuario.perfil_id) === 1 && Number(comentarioExistente.autor_id) === Number(usuarioSolicitanteId)) {
            return this.comentarioRepository.editar(comentarioInput);
        }

        return null;
    }
}
