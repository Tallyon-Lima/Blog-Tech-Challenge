import type { FastifyInstance } from "fastify";
import { criar } from "./criar.js";
import { signin } from "./signin.js";


export async function usuarioRoutes(app: FastifyInstance){
    app.post('/usuarios', criar);
    app.post("/user/signin", signin);
}