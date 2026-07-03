import fastify from 'fastify'
import { postRoutes } from '@/http/controllers/post/routes.js'
import { usuarioRoutes } from './http/controllers/usuario/routes.js'
import fastifyJwt from '@fastify/jwt';
import { env } from './env/index.js';
import { validateJwt } from './http/middlewares/jwt.validate.js';

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: '260m' }
});

app.addHook('onRequest', validateJwt);

app.register(postRoutes);
app.register(usuarioRoutes);