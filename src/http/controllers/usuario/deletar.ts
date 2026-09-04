import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { DeletarUsuarioUseCase } from "@/use-cases/usuario/deletar-usuario.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export async function deletar(request: FastifyRequest, reply: FastifyReply) {
    try {
        const registerQuerySchema = z.object({
            id: z.coerce.number()
        });

        const registerBodySchema = z.object({
            usuario_solicitante: z.coerce.number().optional()
        }).optional();

        let { id } = registerQuerySchema.parse(request.params);
        const parsedBody = request.body ? registerBodySchema?.parse(request.body) : undefined;

        const usuarioRepository = new UsuarioRepository();
        const deletarUsuarioUseCase = new DeletarUsuarioUseCase(usuarioRepository);

        let solicitanteId = (request.user as any)?.id ?? parsedBody?.usuario_solicitante;
        let solicitantePerfilId = (request.user as any)?.perfil_id;

        if (!solicitanteId && (request.user as any)?.email) {
            const userLogged = await usuarioRepository.findByUsername((request.user as any).email);
            if (userLogged) {
                solicitanteId = userLogged.id;
                solicitantePerfilId = userLogged.perfil_id;
            }
        }

        const retorno = await deletarUsuarioUseCase.handler(id, solicitanteId, solicitantePerfilId);

        if (retorno === "sem_permissao") {
            return reply.status(403).send({
                "mensagem": "Usuário sem permissão"
            });
        } 

        if (retorno === "nao_encontrado") {
            return reply.status(404).send({
                "mensagem": "Usuário não encontrado"
            });
        }

        return reply.status(204).send();

    } catch (error) {
        console.error(error);
        throw new Error('Erro ao deletar usuário');
    }
}