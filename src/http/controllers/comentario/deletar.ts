import { ComentarioRepository } from "@/repositories/comentario.repository.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { DeletarComentarioUseCase } from "@/use-cases/comentario/deletar-comentario.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function deletar(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        usuario_solicitante: z.coerce.number(),
    });

    const registerQuerySchema = z.object({
        id: z.coerce.number(),
    });

    // We can get the usuario_solicitante from the body just like edit.
    const { usuario_solicitante } = registerBodySchema.parse(request.body);
    const { id } = registerQuerySchema.parse(request.params);

    try {
        const comentarioRepository = new ComentarioRepository();
        const usuarioRepository = new UsuarioRepository();
        const deletarComentarioUseCase = new DeletarComentarioUseCase(comentarioRepository, usuarioRepository);

        const result = await deletarComentarioUseCase.handler(id, usuario_solicitante);

        if (result == null) {
            return reply.status(403).send({
                "mensagem": "Você não tem permissão para excluir este comentário"
            });
        }

        return reply.status(200).send({
            mensagem: "Comentário excluído com sucesso"
        });
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao excluir comentário');
    }
}
