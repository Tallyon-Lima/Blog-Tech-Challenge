import type { PostRepository } from "@/repositories/post.repository.js";

export class FiltroPostUseCase {
    constructor(private postRepository: PostRepository) { }

    async handler(paginaAtual: number, itensPagina: number, pesquisa: string) {
        return this.postRepository.listar(paginaAtual, itensPagina, pesquisa)
    }
}