import type { PostRepository } from "@/repositories/post.repository.js";

export class ListarPostUseCase{
    constructor(private postRepository: PostRepository){}
    
        async handler(paginaAtual: number, itensPagina: number, filtro?: string){
            return this.postRepository.listar(paginaAtual, itensPagina, filtro)
        }
}