import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { CriarUsuarioUseCase } from "@/use-cases/usuario/criar-usuario.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { hash } from "bcryptjs";

export async function criar(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        nome: z.string(),
        email: z.string(),
        senha: z.string(),
        perfil_id: z.coerce.number(),
        cpf: z.string().optional(),
        usuario_solicitante: z.coerce.number().optional()
    });

    const { nome, email, senha, perfil_id, cpf, usuario_solicitante } = registerBodySchema.parse(request.body);

    try {
        const usuarioRepository = new UsuarioRepository();
        const criarUsuarioUseCase = new CriarUsuarioUseCase(usuarioRepository);

        let solicitanteId = (request.user as any)?.id ?? usuario_solicitante;
        let solicitantePerfilId = (request.user as any)?.perfil_id;

        if (!solicitanteId && (request.user as any)?.email) {
            const userLogged = await usuarioRepository.findByUsername((request.user as any).email);
            if (userLogged) {
                solicitanteId = userLogged.id;
                solicitantePerfilId = userLogged.perfil_id;
            }
        }

        const senhaHash = await hash(senha, 10);

        const usuario = await criarUsuarioUseCase.handler(
            {
                nome,
                email,
                senha: senhaHash,
                perfil_id,
                cpf
            },
            solicitanteId,
            solicitantePerfilId
        );

        if (usuario === "sem_permissao") {
            return reply.status(403).send({
                mensagem: "Apenas administradores podem criar usuários"
            });
        }

        const usuarioRetorno = usuario ?? (await usuarioRepository.findByUsername(email));

        return reply.status(201).send(usuarioRetorno);
    } catch (error) {
        console.error(error);
        throw new Error('Error creating usuario');
    }
}