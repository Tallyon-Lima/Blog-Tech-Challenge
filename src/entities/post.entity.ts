import type { IPost } from "./models/post.interface.js"


export class Post implements IPost{
    id?: number
    titulo: string
    descricao: string
    data_criacao?: Date
    data_atualizacao?: Date

    constructor(titulo: string, descricao: string, data_criacao: Date, data_atualizacao: Date){
        this.titulo = titulo;
        this.descricao = descricao;
        this.data_criacao = data_criacao;
        this.data_atualizacao = data_atualizacao
    }
}