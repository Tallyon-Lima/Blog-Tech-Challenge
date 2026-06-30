import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error.js";
import { makeSigninUseCase } from "@/use-cases/usuario/make-signin.js";
import { compare } from "bcryptjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function signin(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        username: z.string(),
        password: z.string()
    });

    const { username, password } = registerBodySchema.parse(request.body);

    const signinUseCase = makeSigninUseCase();
 
    const user = await signinUseCase.handler(username);

    const doesPasswordMatch = await compare(password, user.senha);

    if (!doesPasswordMatch) {
        throw new InvalidCredentialsError();
    }

    const token = await reply.jwtSign({ username });

    return reply.status(200).send({ token });
}