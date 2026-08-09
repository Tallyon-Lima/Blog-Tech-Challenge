import { UsuarioRepository } from "@/repositories/usuario.repository.js"

export class DeletarUsuarioUseCase {

    constructor(private usuarioRepository: UsuarioRepository) {}

    async handler(id: number) {
        const autor = await this.usuarioRepository.buscarPorId(id);
        // if (autor?.id == usuarioAtual?.id) { // regra p deletar somente o próprio usuário
        //     return this.usuarioRepository.deletar(id);
        // } else {
        //     return "sem_permissao";
        // }
        
        return this.usuarioRepository.deletar(id);
    }
}