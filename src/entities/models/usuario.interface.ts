export interface IUsuario {
    id?: number | undefined
    nome: string
    email: string
    senha: string
    perfil_id: number
    cpf?: string | undefined
}