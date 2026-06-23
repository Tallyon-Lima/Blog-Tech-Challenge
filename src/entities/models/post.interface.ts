export interface IPost {
    id?: number
    titulo: string
    conteudo: string
    disciplina: string
    data_criacao?: Date
    data_atualizacao?: Date
    autor: number
}