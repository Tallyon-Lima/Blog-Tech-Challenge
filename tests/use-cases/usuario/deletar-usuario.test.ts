import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeletarUsuarioUseCase } from "@/use-cases/usuario/deletar-usuario.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { PerfilUsuario } from "@/entities/models/perfil.enum.js";

vi.mock("@/repositories/usuario.repository.js", () => ({
  UsuarioRepository: class {
    buscarPorId = vi.fn();
    deletar = vi.fn();
  },
}));

describe("DeletarUsuarioUseCase", () => {
  let repository: UsuarioRepository;
  let useCase: DeletarUsuarioUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new UsuarioRepository();
    useCase = new DeletarUsuarioUseCase(repository);
  });

  it("deve permitir que um admin delete um usuário existente (via perfil_id direto)", async () => {
    vi.mocked(repository.buscarPorId).mockResolvedValue({
      id: 5,
      nome: "Aluno para deletar",
      email: "aluno@teste.com",
      perfil_id: PerfilUsuario.ALUNO,
    } as any);

    vi.mocked(repository.deletar).mockResolvedValue("usuário de id 5 deletado com sucesso.");

    const result = await useCase.handler(5, 99, PerfilUsuario.ADMIN);

    expect(repository.buscarPorId).toHaveBeenCalledWith(5);
    expect(repository.deletar).toHaveBeenCalledWith(5);
    expect(result).toBe("deletado");
  });

  it("deve permitir que um admin delete um usuário buscando solicitante no repositório", async () => {
    vi.mocked(repository.buscarPorId).mockImplementation(async (id: number) => {
      if (id === 99) {
        return {
          id: 99,
          nome: "Admin",
          email: "admin@teste.com",
          perfil_id: PerfilUsuario.ADMIN,
        } as any;
      }
      if (id === 5) {
        return {
          id: 5,
          nome: "Aluno",
          email: "aluno@teste.com",
          perfil_id: PerfilUsuario.ALUNO,
        } as any;
      }
      return undefined;
    });

    vi.mocked(repository.deletar).mockResolvedValue("usuário de id 5 deletado com sucesso.");

    const result = await useCase.handler(5, 99);

    expect(repository.deletar).toHaveBeenCalledWith(5);
    expect(result).toBe("deletado");
  });

  it("deve retornar sem_permissao se o solicitante não for admin", async () => {
    const resultAluno = await useCase.handler(5, 1, PerfilUsuario.ALUNO);
    expect(resultAluno).toBe("sem_permissao");
    expect(repository.deletar).not.toHaveBeenCalled();

    const resultProf = await useCase.handler(5, 2, PerfilUsuario.PROFESSOR);
    expect(resultProf).toBe("sem_permissao");
    expect(repository.deletar).not.toHaveBeenCalled();
  });

  it("deve retornar nao_encontrado se o usuário a ser deletado não existir", async () => {
    vi.mocked(repository.buscarPorId).mockResolvedValue(undefined);

    const result = await useCase.handler(999, 99, PerfilUsuario.ADMIN);

    expect(result).toBe("nao_encontrado");
    expect(repository.deletar).not.toHaveBeenCalled();
  });
});
