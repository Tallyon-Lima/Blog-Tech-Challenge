import type { UsuarioRepository } from "@/repositories/usuario.repository.js";

export class ListarUsuariosUseCase{
    constructor(private usuarioRepository: UsuarioRepository){}
    
        async handler(page: number, limit: number){
            return this.usuarioRepository.listar(page, limit);
        }
}