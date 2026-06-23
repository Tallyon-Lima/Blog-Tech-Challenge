import { PostRepository } from "@/repositories/post.repository.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { CriarPostUseCase } from "@/use-cases/post/criar-post.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function criar(request: FastifyRequest, reply: FastifyReply) {
    const resgiterBodySchema = z.object({
        titulo: z.string(),
        conteudo: z.string(),
        disciplina: z.string(),
        autor: z.coerce.number()
    });
    
    const {titulo, conteudo, autor, disciplina} = resgiterBodySchema.parse(request.body);

    try {
        const postRepository = new PostRepository();
        const usuarioRepository = new UsuarioRepository();
        const createPostUseCase = new CriarPostUseCase(postRepository, usuarioRepository);

        const post = await createPostUseCase.handler({
            titulo,
            conteudo,
            autor,
            disciplina
        });

        if (post == null){
            return reply.status(403).send({
                "mensagem": "Você não tem permissão"
            });
        }

        return reply.status(201).send(post);
        
    } catch (error) {
        console.error(error);

        throw new Error('Error creating post');
    }
}