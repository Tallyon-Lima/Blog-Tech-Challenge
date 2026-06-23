import { PostRepository } from "@/repositories/post.repository.js";
import { BuscarPostUseCase } from "@/use-cases/post/buscar-post.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function buscarPorId(request: FastifyRequest, reply: FastifyReply) {
    try {
        const registerQuerySchema = z.object({
            id: z.coerce.number(),
        });
        
        const postRepository = new PostRepository();
        const buscarPostUseCase = new BuscarPostUseCase(postRepository);

        let { id } = registerQuerySchema.parse(request.params);
        const post = await buscarPostUseCase.handler(id);

        if(post){
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