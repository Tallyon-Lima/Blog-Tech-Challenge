import type { PostRepository } from "@/repositories/post.repository.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";

export class DeletarPostUseCase{
    constructor(private postRepository: PostRepository, private usuarioRepository: UsuarioRepository){}

    async handler(autor_id: number, post_id: number){
        const autor = await this.usuarioRepository.buscarPorId(autor_id);
        const post = await this.postRepository.buscarPorId(post_id)
        if(autor?.perfil_id == 2){
            if(post){
                return this.postRepository.deletar(post_id);
            }
            return 'nao_encontrado'
        }else{
            return "sem_permissao"
        }
    }
}