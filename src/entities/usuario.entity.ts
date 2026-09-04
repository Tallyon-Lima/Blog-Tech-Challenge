import type { IUsuario } from "./models/usuario.interface.js";

export class Usuario implements IUsuario {
    id?: number | undefined
    nome: string
    email: string
    senha: string
    perfil_id: number
    cpf?: string | undefined

    constructor(nome: string, email: string, senha: string, perfil_id: number, cpf?: string | undefined) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfil_id = perfil_id;
        this.cpf = cpf;
    }
}