import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { SigninUseCase } from "./signin.js";

export function makeSigninUseCase() {
    const usuarioRepository = new UsuarioRepository;

    const signinUseCase = new SigninUseCase(usuarioRepository);

    return signinUseCase;
}