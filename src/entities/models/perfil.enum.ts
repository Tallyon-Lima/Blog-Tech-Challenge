export enum PerfilUsuario {
    ALUNO = 1,
    PROFESSOR = 2,
    ADMIN = 3
}

export function isPerfilAdmin(perfilId?: number | null, perfilNome?: string | null): boolean {
    if (perfilId == null && !perfilNome) return false;
    if (Number(perfilId) === PerfilUsuario.ADMIN) return true;
    if (perfilNome && perfilNome.toLowerCase().includes('admin')) return true;
    return false;
}
