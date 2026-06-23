import type { Post } from "@/entities/post.entity.js";
import type { PostRepository } from "@/repositories/post.repository.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";


export class CriarPostUseCase{

    constructor(private postRepository: PostRepository, private usuarioRepository: UsuarioRepository){}

    async handler(post: Post){
        const autor = await this.usuarioRepository.buscarPorId(post.autor);
        if(autor?.perfil_id == 2){
            return this.postRepository.criar(post);
        }
        return null;
    }
}