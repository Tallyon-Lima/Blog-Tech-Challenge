import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { ListarUsuariosUseCase } from "@/use-cases/usuario/listar-usuario.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    busca: z.string().optional(),
    perfil_id: z.coerce.number().int().positive().optional(),
});

export async function listar(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { page, limit, busca, perfil_id } = querySchema.parse(request.query);

        const usuarioRepository = new UsuarioRepository();
        const listarUsuariosUseCase = new ListarUsuariosUseCase(usuarioRepository);

        const listaUsuarios = await listarUsuariosUseCase.handler(
            page,
            limit,
            busca,
            perfil_id
        );

        return reply.status(200).send(listaUsuarios);
    } catch (error) {
        console.error(error);
        throw new Error("Error get Usuario");
    }
}