import type { FastifyInstance } from 'fastify'
import { criar } from './criar.js'
import { editar } from './editar.js'
import { deletar } from './deletar.js'
import { listar } from './listar.js'

export async function comentarioRoutes(app: FastifyInstance ) {
    app.post('/comentarios', criar);
    app.get('/posts/:post_id/comentarios', listar);
    app.put('/comentarios/:id', editar);
    app.delete('/comentarios/:id', deletar);
}
