import { PostRepository } from "@/repositories/post.repository.js";
import { CreatePostUseCase } from "@/use-cases/create-post.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const resgiterBodySchema = z.object({
        titulo: z.string(),
        descricao: z.string()
    });
    
    const {titulo, descricao} = resgiterBodySchema.parse(request.body);

    try {
        const postRepository = new PostRepository();
        const createPostUseCase = new CreatePostUseCase(postRepository);

        const post = await createPostUseCase.handler({
            titulo,
            descricao
        });

        return reply.status(201).send(post);
        
    } catch (error) {
        console.error(error);

        throw new Error('Error creating person');
    }
}