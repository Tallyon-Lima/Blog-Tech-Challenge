import type { FastifyInstance } from 'fastify'
import { criar } from './criar.js'
import { listar } from './listar.js'
import { buscarPorId } from './buscar-por-id.js';
import { editar } from './editar.js';
import { deletar } from './deletar.js';
import { filtro } from './filtro.js';


export async function postRoutes(app: FastifyInstance ) {
    app.post('/posts', criar);
    app.get('/posts', listar);
    app.get('/posts/:id', buscarPorId);
    app.put('/posts/:id', editar);
    app.delete('/posts/:id', deletar);
    app.get('/posts/search', filtro);
}