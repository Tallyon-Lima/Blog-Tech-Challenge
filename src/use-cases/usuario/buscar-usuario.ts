import type { UsuarioRepository } from "@/repositories/usuario.repository.js";


export class BuscarUsuarioUseCase{
    constructor(private usuarioRepository: UsuarioRepository){}

    async handler(id: number){
        return this.usuarioRepository.buscarPorId(id);
    }
}