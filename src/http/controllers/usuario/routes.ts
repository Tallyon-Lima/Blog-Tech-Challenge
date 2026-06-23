import type { FastifyInstance } from "fastify";
import { criar } from "./criar.js";


export async function usuarioRoutes(app: FastifyInstance){
    app.post('/usuarios', criar)
}