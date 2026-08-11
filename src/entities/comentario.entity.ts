import type { IComentario } from "./models/comentario.interface.js";

export class Comentario implements IComentario {
    id?: number;
    conteudo: string;
    post_id: number;
    autor_id: number;
    data_criacao?: Date;
    data_atualizacao?: Date;

    constructor(
        conteudo: string,
        post_id: number,
        autor_id: number,
        data_criacao?: Date,
        data_atualizacao?: Date
    ) {
        this.conteudo = conteudo;
        this.post_id = post_id;
        this.autor_id = autor_id;
        if (data_criacao !== undefined) {
            this.data_criacao = data_criacao;
        }
        if (data_atualizacao !== undefined) {
            this.data_atualizacao = data_atualizacao;
        }
    }
}
