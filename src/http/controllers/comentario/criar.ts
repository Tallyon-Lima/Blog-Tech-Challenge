import { ComentarioRepository } from "@/repositories/comentario.repository.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { CriarComentarioUseCase } from "@/use-cases/comentario/criar-comentario.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function criar(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        conteudo: z.string(),
        post_id: z.coerce.number(),
        autor_id: z.coerce.number()
    });

    const { conteudo, post_id, autor_id } = registerBodySchema.parse(request.body);

    try {
        const comentarioRepository = new ComentarioRepository();
        const usuarioRepository = new UsuarioRepository();
        const criarComentarioUseCase = new CriarComentarioUseCase(comentarioRepository, usuarioRepository);

        const comentario = await criarComentarioUseCase.handler({
            conteudo,
            post_id,
            autor_id
        });

        if (comentario == null) {
            return reply.status(403).send({
                "mensagem": "Você não tem permissão ou o usuário é inválido"
            });
        }

        return reply.status(201).send(comentario);
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao criar comentário');
    }
}
