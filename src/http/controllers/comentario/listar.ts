import { ComentarioRepository } from "@/repositories/comentario.repository.js";
import { ListarComentariosUseCase } from "@/use-cases/comentario/listar-comentarios.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function listar(request: FastifyRequest, reply: FastifyReply) {
    const registerQuerySchema = z.object({
        post_id: z.coerce.number(),
    });

    const { post_id } = registerQuerySchema.parse(request.params);

    try {
        const comentarioRepository = new ComentarioRepository();
        const listarComentariosUseCase = new ListarComentariosUseCase(comentarioRepository);

        const comentarios = await listarComentariosUseCase.handler(post_id);

        return reply.status(200).send(comentarios);
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao listar comentários');
    }
}
