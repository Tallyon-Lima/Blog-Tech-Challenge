import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { ListarUsuariosUseCase } from "@/use-cases/usuario/listar-usuario.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";


export async function listar(request: FastifyRequest, reply: FastifyReply) {
    try {
       
        const postRepository = new UsuarioRepository();
        const listarUsuariosUseCase = new ListarUsuariosUseCase(postRepository);

        const listaUsuarios = await listarUsuariosUseCase.handler();

        return reply.status(200).send(listaUsuarios);
    } catch (error) {
        console.error(error);
        throw new Error('Error get Usuario')
    }
}