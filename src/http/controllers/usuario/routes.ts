import type { FastifyInstance } from "fastify";
import { criar } from "./criar.js";
import { signin } from "./signin.js";
import { listar } from "./listar.js";


export async function usuarioRoutes(app: FastifyInstance){
    app.post('/usuarios', criar);
    app.post("/usuarios/signin", signin);
    app.get('/usuarios', listar);
}