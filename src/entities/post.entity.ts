import type { IPost } from "./models/post.interface.js"


export class Post implements IPost{
    id?: number
    titulo: string
    conteudo: string
    disciplina: string
    data_criacao?: Date
    data_atualizacao?: Date
    autor: number

    constructor(titulo: string, conteudo: string, disciplina: string , data_criacao: Date, data_atualizacao: Date, autor: number){
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.disciplina = disciplina
        this.data_criacao = data_criacao;
        this.data_atualizacao = data_atualizacao;
        this.autor = autor
    }
}