import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { EditarUsuarioUseCase } from "@/use-cases/usuario/editar-usuario.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export async function editar(request: FastifyRequest, reply: FastifyReply) {
    const resgiterBodySchema = z.object({
        nome: z.string(),
        email: z.string(),
        senha: z.string(),
        perfil_id: z.coerce.number()
    });

    const registerQuerySchema = z.object({
        id: z.coerce.number(),
    });

    const { nome, email, senha, perfil_id } = resgiterBodySchema.parse(request.body);
    let { id } = registerQuerySchema.parse(request.params);

    try {
        const usuarioRepository = new UsuarioRepository();
        const editarUsuarioUseCase = new EditarUsuarioUseCase(usuarioRepository);

        const usuario = await editarUsuarioUseCase.handler({
            nome,
            email,
            senha,
            perfil_id,
            id
        });

        if (usuario == "sem_permissao") {
            return reply.status(403).send({
                "mensagem": "Você não tem permissão"
            });
        }
        return reply.status(200).send(usuario);

    } catch (error) {
        console.error(error);

        throw new Error('Erro ao editar usuário');
    }
}