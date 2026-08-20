import fastify from 'fastify'
import { postRoutes } from '@/http/controllers/post/routes.js'
import { usuarioRoutes } from './http/controllers/usuario/routes.js'
import { comentarioRoutes } from '@/http/controllers/comentario/routes.js'
import fastifyJwt from '@fastify/jwt';
import { env } from './env/index.js';
import { validateJwt } from './http/middlewares/jwt.validate.js';
import { emailRoutes } from './http/controllers/email/routes.js';

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: '30m' }
});

app.addHook('onRequest', validateJwt);

app.register(postRoutes);
app.register(usuarioRoutes);
app.register(comentarioRoutes);
app.register(emailRoutes);