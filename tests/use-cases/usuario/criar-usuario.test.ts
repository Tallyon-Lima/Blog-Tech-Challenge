import { beforeEach, describe, expect, it, vi } from "vitest";
import { CriarUsuarioUseCase } from "@/use-cases/usuario/criar-usuario.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { PerfilUsuario } from "@/entities/models/perfil.enum.js";

vi.mock("@/repositories/usuario.repository.js", () => ({
  UsuarioRepository: class {
    buscarPorId = vi.fn();
    criar = vi.fn();
  },
}));

describe("CriarUsuarioUseCase", () => {
  let repository: UsuarioRepository;
  let useCase: CriarUsuarioUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new UsuarioRepository();
    useCase = new CriarUsuarioUseCase(repository);
  });

  it("deve permitir que um admin crie um usuário (via solicitantePerfilId)", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno@teste.com",
      senha: "hash",
      perfil_id: PerfilUsuario.ALUNO,
    };

    vi.mocked(repository.criar).mockResolvedValue({ id: 10, ...novoUsuario } as any);

    const result = await useCase.handler(
      novoUsuario as any,
      99,
      PerfilUsuario.ADMIN
    );

    expect(repository.criar).toHaveBeenCalledWith(novoUsuario);
    expect(result).toEqual({ id: 10, ...novoUsuario });
  });

  it("deve permitir que um admin crie um usuário buscando o perfil pelo solicitanteId no repositório", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno@teste.com",
      senha: "hash",
      perfil_id: PerfilUsuario.ALUNO,
    };

    vi.mocked(repository.buscarPorId).mockResolvedValue({
      id: 99,
      nome: "Admin",
      email: "admin@teste.com",
      senha: "hash",
      perfil_id: PerfilUsuario.ADMIN,
    } as any);

    vi.mocked(repository.criar).mockResolvedValue({ id: 11, ...novoUsuario } as any);

    const result = await useCase.handler(novoUsuario as any, 99);

    expect(repository.buscarPorId).toHaveBeenCalledWith(99);
    expect(repository.criar).toHaveBeenCalledWith(novoUsuario);
    expect(result).toEqual({ id: 11, ...novoUsuario });
  });

  it("deve negar permissão se o solicitante for aluno ou professor", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno@teste.com",
      senha: "hash",
      perfil_id: PerfilUsuario.ALUNO,
    };

    // Tentativa como Aluno
    const resultAluno = await useCase.handler(
      novoUsuario as any,
      1,
      PerfilUsuario.ALUNO
    );
    expect(resultAluno).toBe("sem_permissao");
    expect(repository.criar).not.toHaveBeenCalled();

    // Tentativa como Professor
    const resultProf = await useCase.handler(
      novoUsuario as any,
      2,
      PerfilUsuario.PROFESSOR
    );
    expect(resultProf).toBe("sem_permissao");
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it("deve negar permissão se o solicitante não for informado ou não for encontrado", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno@teste.com",
      senha: "hash",
      perfil_id: PerfilUsuario.ALUNO,
    };

    vi.mocked(repository.buscarPorId).mockResolvedValue(undefined);

    const result = await useCase.handler(novoUsuario as any, 123);
    expect(result).toBe("sem_permissao");
    expect(repository.criar).not.toHaveBeenCalled();
  });
});
