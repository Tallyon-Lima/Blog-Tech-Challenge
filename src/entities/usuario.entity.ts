import type { IUsuario } from "./models/usuario.interface.js";

export class Usuario implements IUsuario{
    id?: number
    nome: string
    email: string
    senha: string
    perfil_id: number

    constructor(nome: string, email: string, senha: string, perfil_id: number) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfil_id = perfil_id
    }
}