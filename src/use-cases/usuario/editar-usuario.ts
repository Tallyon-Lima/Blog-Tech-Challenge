import type { Usuario } from "@/entities/usuario.entity.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";

export class EditarUsuarioUseCase {

    constructor(private usuarioRepository: UsuarioRepository) {}

    public async handler(usuario: Usuario) {
        // const autor = await this.usuarioRepository.buscarPorId(usuario.perfil_id); //add validação se é o próprio user
        // if (autor?.perfil_id == 2){
        //     return this.usuarioRepository.editar(usuario);
        // }
        // return null;

        this.usuarioRepository.editar(usuario);

        return `sucesso ao editar o usuário de id ${usuario.id}`;
    }
}