import type { FastifyInstance } from 'fastify'
import { create } from './create.js'


export async function postRoutes(app: FastifyInstance ) {
    app.post('/posts', create)
}