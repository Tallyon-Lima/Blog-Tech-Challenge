import type { UsuarioRepository } from "@/repositories/usuario.repository.js";

export class ListarUsuariosUseCase{
    constructor(private usuarioRepository: UsuarioRepository){}
    
        async handler(){
            return this.usuarioRepository.listar()
        }
}