import type { FastifyInstance } from "fastify";
import { criar } from "./criar.js";
import { signin } from "./signin.js";
import { listar } from "./listar.js";
import { deletar } from "./deletar.js";
import { editar } from "./editar.js";
import { buscarPorId } from "./buscar-por-id.js";

export async function usuarioRoutes(app: FastifyInstance){
    app.post('/usuarios', criar);
    app.post("/usuarios/signin", signin);
    app.get('/usuarios', listar);
    app.delete('/usuarios/:id', deletar);
    app.put('/usuarios/editar/:id', editar);
    app.get('/usuarios/:id', buscarPorId)
}