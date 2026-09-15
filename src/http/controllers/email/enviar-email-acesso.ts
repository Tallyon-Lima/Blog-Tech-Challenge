import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { EnviarEmailAcessoUseCase } from "@/use-cases/email/enviar-acesso-email.js";
import { EmailJSEmailProvider } from "@/lib/emailjs/EmailJSEmailProvider.js";


export async function enviarEmailAcesso(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const enviarEmailAcessoBodySchema = z.object({
        nome: z.string(),
        email: z.string().email(),
        senha: z.string(),
    });

    const { nome, email, senha } =
        enviarEmailAcessoBodySchema.parse(request.body);

    try {
        const emailProvider = new EmailJSEmailProvider();

        const enviarEmailAcessoUseCase =
            new EnviarEmailAcessoUseCase(emailProvider);

        await enviarEmailAcessoUseCase.handler({
            nome,
            email,
            senha,
        });


        return reply.status(200).send({
            message: "E-mail enviado com sucesso",
        });

    } catch (error) {
        console.error(error);

        throw new Error("Erro ao enviar o email");
    }
}