import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error.js";

export class SigninUseCase {
    constructor(private usuarioRepository: UsuarioRepository) {}

    async handler(username: string) {
        const user = await this.usuarioRepository.findByUsername(username);
    
        if (!user) {
            throw new InvalidCredentialsError();
        }

        return user;
    }
}