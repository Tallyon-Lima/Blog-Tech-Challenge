import fastify from 'fastify'
import { postRoutes } from '@/http/controllers/post/routes.js'
import { usuarioRoutes } from './http/controllers/usuario/routes.js'

export const app = fastify();

app.register(postRoutes);
app.register(usuarioRoutes);