import { PostRepository } from "@/repositories/post.repository.js";
import { ListarPostUseCase } from "@/use-cases/post/listar-post.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";


export async function listar(request: FastifyRequest, reply: FastifyReply) {
    try {
        const registerQuerySchema = z.object({
            paginaAtual: z.coerce.number(),
        });

        let { paginaAtual } = registerQuerySchema.parse(request.query);

        paginaAtual = paginaAtual > 0 ? paginaAtual : 1;

        const postRepository = new PostRepository();
        const listarPostUseCase = new ListarPostUseCase(postRepository);

        const listaPost = await listarPostUseCase.handler(paginaAtual);

        return reply.status(200).send(listaPost);
    } catch (error) {
        console.error(error);
        throw new Error('Error get post')
    }
}