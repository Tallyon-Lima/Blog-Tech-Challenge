
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { BuscarUsuarioUseCase } from "@/use-cases/usuario/buscar-usuario.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function buscarPorId(request: FastifyRequest, reply: FastifyReply) {
    try {
        const registerQuerySchema = z.object({
            id: z.coerce.number(),
        });
        
        const usuarioRepository = new UsuarioRepository();
        const buscarPostUseCase = new BuscarUsuarioUseCase(usuarioRepository);

        let { id } = registerQuerySchema.parse(request.params);
        const usuario = await buscarPostUseCase.handler(id);

        if(usuario){
            return reply.status(200).send(usuario);
        }

        return reply.status(204).send({
            "mensagem": "Usuário não encontrado"
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error get Usuário')
    }
}