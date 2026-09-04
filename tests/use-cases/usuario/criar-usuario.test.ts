import { beforeEach, describe, expect, it, vi } from "vitest";
import { CriarUsuarioUseCase } from "@/use-cases/usuario/criar-usuario.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { PerfilUsuario } from "@/entities/models/perfil.enum.js";

vi.mock("bcryptjs", () => ({
  hash: vi.fn().mockResolvedValue("senha-hash"),
}));

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

  it("deve permitir que um admin crie um usuário via solicitantePerfilId", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno@teste.com",
      senha: "senha-antiga",
      perfil_id: PerfilUsuario.ALUNO,
      cpf: "12345678900",
    };

    vi.mocked(repository.criar).mockResolvedValue({
      id: 10,
      ...novoUsuario,
      senha: "senha-hash",
    } as any);

    const result = await useCase.handler(
      novoUsuario as any,
      99,
      PerfilUsuario.ADMIN
    );

    expect(repository.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "Novo Aluno",
        email: "aluno@teste.com",
        perfil_id: PerfilUsuario.ALUNO,
        cpf: "12345678900",
        senha: "senha-hash",
      })
    );

    expect(result).toEqual({
      id: 10,
      ...novoUsuario,
      senha: "senha-hash",
    });
  });

  it("deve gerar a senha usando o sobrenome e os 3 últimos dígitos do CPF", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno.cpf@teste.com",
      senha: "senha-antiga",
      perfil_id: PerfilUsuario.ALUNO,
      cpf: "12345678900",
    };

    vi.mocked(repository.criar).mockResolvedValue({
      id: 12,
      ...novoUsuario,
      senha: "senha-hash",
    } as any);

    await useCase.handler(
      novoUsuario as any,
      99,
      PerfilUsuario.ADMIN
    );

    // Como o caractere especial é aleatório,
    // verificamos o formato da senha enviada para o hash.
    const bcrypt = await import("bcryptjs");

    expect(bcrypt.hash).toHaveBeenCalledWith(
      expect.stringMatching(/^aluno[@#$%&*!]900$/),
      10
    );

    expect(repository.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        senha: "senha-hash",
      })
    );
  });

  it("deve remover acentos do sobrenome ao gerar a senha", async () => {
    const novoUsuario = {
      nome: "Vinícius Júnior",
      email: "vinicius.junior@teste.com",
      senha: "senha-antiga",
      perfil_id: PerfilUsuario.ALUNO,
      cpf: "159357824351",
    };

    vi.mocked(repository.criar).mockResolvedValue({
      id: 13,
      ...novoUsuario,
      senha: "senha-hash",
    } as any);

    await useCase.handler(
      novoUsuario as any,
      99,
      PerfilUsuario.ADMIN
    );

    const bcrypt = await import("bcryptjs");

    expect(bcrypt.hash).toHaveBeenCalledWith(
      expect.stringMatching(/^junior[@#$%&*!]351$/),
      10
    );
  });

  it("deve usar o único nome quando o usuário não possui sobrenome", async () => {
    const novoUsuario = {
      nome: "Tallyon",
      email: "tallyon@teste.com",
      senha: "senha-antiga",
      perfil_id: PerfilUsuario.ALUNO,
      cpf: "12345678910",
    };

    vi.mocked(repository.criar).mockResolvedValue({
      id: 14,
      ...novoUsuario,
      senha: "senha-hash",
    } as any);

    await useCase.handler(
      novoUsuario as any,
      99,
      PerfilUsuario.ADMIN
    );

    const bcrypt = await import("bcryptjs");

    expect(bcrypt.hash).toHaveBeenCalledWith(
      expect.stringMatching(/^tallyon[@#$%&*!]910$/),
      10
    );
  });

  it("deve permitir que um admin seja identificado pelo solicitanteId", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno@teste.com",
      senha: "senha-antiga",
      perfil_id: PerfilUsuario.ALUNO,
      cpf: "12345678900",
    };

    vi.mocked(repository.buscarPorId).mockResolvedValue({
      id: 99,
      nome: "Admin",
      email: "admin@teste.com",
      senha: "hash",
      perfil_id: PerfilUsuario.ADMIN,
    } as any);

    vi.mocked(repository.criar).mockResolvedValue({
      id: 11,
      ...novoUsuario,
      senha: "senha-hash",
    } as any);

    const result = await useCase.handler(
      novoUsuario as any,
      99
    );

    expect(repository.buscarPorId).toHaveBeenCalledWith(99);

    expect(repository.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        senha: "senha-hash",
      })
    );

    expect(result).toEqual({
      id: 11,
      ...novoUsuario,
      senha: "senha-hash",
    });
  });

  it("deve negar permissão se o solicitante for aluno ou professor", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno@teste.com",
      senha: "senha-antiga",
      perfil_id: PerfilUsuario.ALUNO,
      cpf: "12345678900",
    };

    const resultAluno = await useCase.handler(
      novoUsuario as any,
      1,
      PerfilUsuario.ALUNO
    );

    expect(resultAluno).toBe("sem_permissao");
    expect(repository.criar).not.toHaveBeenCalled();

    const resultProf = await useCase.handler(
      novoUsuario as any,
      2,
      PerfilUsuario.PROFESSOR
    );

    expect(resultProf).toBe("sem_permissao");
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it("deve negar permissão se o solicitante não for encontrado", async () => {
    const novoUsuario = {
      nome: "Novo Aluno",
      email: "aluno@teste.com",
      senha: "senha-antiga",
      perfil_id: PerfilUsuario.ALUNO,
      cpf: "12345678900",
    };

    vi.mocked(repository.buscarPorId).mockResolvedValue(undefined);

    const result = await useCase.handler(
      novoUsuario as any,
      123
    );

    expect(result).toBe("sem_permissao");
    expect(repository.criar).not.toHaveBeenCalled();
  });
});