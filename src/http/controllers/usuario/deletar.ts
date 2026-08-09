import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { DeletarUsuarioUseCase } from "@/use-cases/usuario/deletar-usuario.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export async function deletar(request: FastifyRequest, reply: FastifyReply) {
    try {
        const registerQuerySchema = z.object({
            id: z.coerce.number()
        });

        let { id } = registerQuerySchema.parse(request.params);

        const usuarioRepository = new UsuarioRepository();
        const deletarUsuarioUseCase = new DeletarUsuarioUseCase(usuarioRepository);
        const retorno = await deletarUsuarioUseCase.handler(id);

        if (retorno === "sem_permissao") {
            return reply.status(403).send({
                "mensagem": "Usuário sem permissão"
            });
        } 
        return reply.status(204).send();

    } catch (error) {
        console.error(error);
        throw new Error('Erro ao deletar usuário');
    }
}