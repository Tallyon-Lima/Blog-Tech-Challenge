import { PostRepository } from "@/repositories/post.repository.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { DeletarPostUseCase } from "@/use-cases/post/deletar-post.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function deletar(request: FastifyRequest, reply: FastifyReply) {
    try {
        const registerQuerySchema = z.object({
            id: z.coerce.number(),
        });

        const resgiterBodySchema = z.object({
            autor: z.coerce.number()
        });

        const postRepository = new PostRepository();
        const usuarioRepository = new UsuarioRepository();
        const deletarPostUseCase = new DeletarPostUseCase(postRepository, usuarioRepository);

        const { autor } = resgiterBodySchema.parse(request.body);
        let { id } = registerQuerySchema.parse(request.params);

        const post = await deletarPostUseCase.handler(autor, id);

        if (post == 'sem_permissao') {
            return reply.status(403).send({
                "mensagem": "Usuário sem permissão"
            })
        } else if (post == "deletado") {
            return reply.status(204).send(post);
        }
        return reply.status(200).send({
            "mensagem": "Post não encontrado"
        });

    } catch (error) {
        console.error(error);
        throw new Error('Error get post')
    }
}