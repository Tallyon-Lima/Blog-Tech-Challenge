import type { Usuario } from "@/entities/usuario.entity.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";

export class CriarUsuarioUseCase{

    constructor(private usuarioRepository: UsuarioRepository){}
    
    async handler(usuario: Usuario){
        return this.usuarioRepository.criar(usuario);
    }
}