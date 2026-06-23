import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { CriarUsuarioUseCase } from "@/use-cases/usuario/criar-usuario.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";


export async function criar(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        nome: z.string(),
        email: z.string(),
        senha: z.string(),
        perfil_id: z.coerce.number()
    });

    const {nome, email, senha, perfil_id } = registerBodySchema.parse(request.body);

    try{
        const usuarioRepository = new UsuarioRepository();
        const criarUsuarioUseCase = new CriarUsuarioUseCase(usuarioRepository);

        const usuario = await criarUsuarioUseCase.handler({
            nome, email, senha, perfil_id
        });

        return reply.status(201).send(usuario)
    }catch(error){
        console.error(error);
        throw new Error('Error creating usuario');
    }
}