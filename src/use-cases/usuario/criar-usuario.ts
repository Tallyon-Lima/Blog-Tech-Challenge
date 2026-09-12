import type { Usuario } from "@/entities/usuario.entity.js";
import type { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { isPerfilAdmin } from "@/entities/models/perfil.enum.js";
import { hash } from "bcryptjs";
import { NodemailerEmailProvider } from "@/lib/nodemailer/NodemailerEmailProvider .js";
import { EnviarEmailAcessoUseCase } from "../email/enviar-acesso-email.js";

export class CriarUsuarioUseCase {
    constructor(private usuarioRepository: UsuarioRepository) { }

    async handler(
        usuario: Usuario,
        solicitanteId?: number,
        solicitantePerfilId?: number
    ): Promise<Usuario | undefined | "sem_permissao"> {
        let isAdmin = false;

        if (solicitantePerfilId != null && isPerfilAdmin(solicitantePerfilId)) {
            isAdmin = true;
        } else if (solicitanteId != null) {
            const solicitante = await this.usuarioRepository.buscarPorId(solicitanteId);
            if (solicitante && isPerfilAdmin(solicitante.perfil_id)) {
                isAdmin = true;
            }
        }

        if (!isAdmin) {
            return "sem_permissao";
        }

        // Gera a senha com o sobrenome + últimos 3 dígitos do CPF
        if (!usuario.cpf) {
            throw new Error("CPF é obrigatório para criar o usuário");
        }

        const nomes = usuario.nome.trim().split(/\s+/);
        const nomeSenha = nomes[nomes.length - 1]
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
        const ultimosTresDigitos = usuario.cpf.slice(-3);
        const caracteresEspeciais = ["@", "#", "$", "%", "&", "*", "!",];
        const caractereEspecial =
            caracteresEspeciais[
            Math.floor(Math.random() * caracteresEspeciais.length)
            ];
        // const senha = `${nomeSenha}${caractereEspecial}${ultimosTresDigitos}`;
        const senha = `${nomeSenha}@${ultimosTresDigitos}`;

        usuario.senha = await hash(senha, 10);

        const usuarioRetorno = await this.usuarioRepository.criar(usuario);
        console.log(usuarioRetorno?.nome)
        if (usuarioRetorno?.nome && usuarioRetorno?.email) {
            const emailProvider = new NodemailerEmailProvider();
            const enviarEmailAcessoUseCase =
                new EnviarEmailAcessoUseCase(emailProvider);

            await enviarEmailAcessoUseCase.handler({
                nome: usuarioRetorno.nome,
                email: usuarioRetorno.email,
                senha,
            });
        
        }

        return usuarioRetorno;
    }
}