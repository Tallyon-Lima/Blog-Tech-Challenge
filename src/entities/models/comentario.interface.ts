export interface IComentario {
    id?: number;
    conteudo: string;
    post_id: number;
    autor_id: number;
    data_criacao?: Date;
    data_atualizacao?: Date;
}
