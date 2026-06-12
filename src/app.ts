import fastify from 'fastify'
import { postRoutes } from '@/http/controllers/post/routes.js'

export const app = fastify()

app.register(postRoutes)