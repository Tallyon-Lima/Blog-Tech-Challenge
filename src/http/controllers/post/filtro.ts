import { PostRepository } from "@/repositories/post.repository.js";
import { FiltroPostUseCase } from "@/use-cases/post/filtro-post.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";


export async function filtro(request: FastifyRequest, reply: FastifyReply) {
    try {
        const registerQuerySchema = z.object({
            paginaAtual: z.coerce.number(),
            pesquisa: z.string()
        });

        let { paginaAtual, pesquisa } = registerQuerySchema.parse(request.query);

        paginaAtual = paginaAtual > 0 ? paginaAtual : 1;

        const postRepository = new PostRepository();
        const filtroPostUseCase = new FiltroPostUseCase(postRepository);


        const listaPost = await filtroPostUseCase.handler(paginaAtual, pesquisa);

        return reply.status(200).send(listaPost);
    } catch (error) {
        console.error(error);
        throw new Error('Error get post')
    }
}