import type { FastifyInstance } from "fastify";
import { enviarEmailAcesso } from "./enviar-email-acesso.js";

export async function emailRoutes(app: FastifyInstance){
    app.post('/email/enviar-acesso', enviarEmailAcesso);
}