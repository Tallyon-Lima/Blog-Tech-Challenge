import { ComentarioRepository } from "@/repositories/comentario.repository.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { EditarComentarioUseCase } from "@/use-cases/comentario/editar-comentario.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function editar(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        conteudo: z.string(),
        usuario_solicitante: z.coerce.number(),
        post_id: z.coerce.number(),
        autor_id: z.coerce.number() // needed to build the entity, or just pass what is needed
    });

    const registerQuerySchema = z.object({
        id: z.coerce.number(),
    });

    const { conteudo, usuario_solicitante, post_id, autor_id } = registerBodySchema.parse(request.body);
    const { id } = registerQuerySchema.parse(request.params);

    try {
        const comentarioRepository = new ComentarioRepository();
        const usuarioRepository = new UsuarioRepository();
        const editarComentarioUseCase = new EditarComentarioUseCase(comentarioRepository, usuarioRepository);

        const comentarioAtualizado = await editarComentarioUseCase.handler({
            id,
            conteudo,
            post_id,
            autor_id
        }, usuario_solicitante);

        if (comentarioAtualizado == null) {
            return reply.status(403).send({
                "mensagem": "Você não tem permissão para editar este comentário"
            });
        }

        return reply.status(200).send(comentarioAtualizado);
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao editar comentário');
    }
}
