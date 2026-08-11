import type { ComentarioRepository } from "@/repositories/comentario.repository.js";

export class ListarComentariosUseCase {
    constructor(private comentarioRepository: ComentarioRepository) {}

    async handler(post_id: number) {
        return this.comentarioRepository.listarPorPost(post_id);
    }
}
