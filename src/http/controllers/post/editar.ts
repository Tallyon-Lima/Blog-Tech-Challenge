import { PostRepository } from "@/repositories/post.repository.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { EditarPostUseCase } from "@/use-cases/post/editar-post.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function editar(request: FastifyRequest, reply: FastifyReply) {
    const resgiterBodySchema = z.object({
        titulo: z.string(),
        conteudo: z.string(),
        disciplina: z.string(),
        autor: z.coerce.number()
    });

    const registerQuerySchema = z.object({
        id: z.coerce.number(),
    });

    const { titulo, conteudo, autor, disciplina } = resgiterBodySchema.parse(request.body);
    let { id } = registerQuerySchema.parse(request.params);

    try {
        const postRepository = new PostRepository();
        const usuarioRepository = new UsuarioRepository();
        const editarPostUseCase = new EditarPostUseCase(postRepository, usuarioRepository);

        const post = await editarPostUseCase.handler({
            id,
            titulo,
            conteudo,
            autor,
            disciplina
        });

        if (post == null) {
            return reply.status(403).send({
                "mensagem": "Você não tem permissão"
            });
        }

        return reply.status(200).send(post);

    } catch (error) {
        console.error(error);

        throw new Error('Error creating post');
    }
}