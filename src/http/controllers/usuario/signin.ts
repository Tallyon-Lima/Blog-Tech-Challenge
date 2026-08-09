import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error.js";
import { makeSigninUseCase } from "@/use-cases/usuario/make-signin.js";
import { compare } from "bcryptjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function signin(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        email: z.string(),
        senha: z.string()
    });

    const { email, senha } = registerBodySchema.parse(request.body);

    const signinUseCase = makeSigninUseCase();
 
    const user = await signinUseCase.handler(email);

    const doesPasswordMatch = await compare(senha, user.senha);

    if (!doesPasswordMatch) {
        throw new InvalidCredentialsError();
    }

    const token = await reply.jwtSign({ email });

    return reply.status(200).send({ token,  user });
}