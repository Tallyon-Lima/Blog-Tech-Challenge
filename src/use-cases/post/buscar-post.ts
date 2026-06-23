import type { PostRepository } from "@/repositories/post.repository.js";

export class BuscarPostUseCase{
    constructor(private postRepository: PostRepository){}

    async handler(id: number){
        return this.postRepository.buscarPorId(id);
    }
}