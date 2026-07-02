import { beforeEach, describe, expect, it, vi } from "vitest";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";
import { db } from "@/lib/pg/db.js";

vi.mock("@/lib/pg/db.js", () => ({
  db: {
    clientInstance: {
      query: vi.fn(),
    },
  },
}));

describe("UsuarioRepository", () => {
  let repository: UsuarioRepository;
  const queryMock = vi.mocked(db.clientInstance!.query);

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new UsuarioRepository();
  });

  it("deve criar um usuário", async () => {
    const usuario = {
      nome: "João",
      email: "joao@email.com",
      senha: "123456",
      perfil_id: 1,
    };

    queryMock.mockResolvedValue({
      rows: [usuario],
    } as any);

    const result = await repository.criar(usuario as any);

    expect(queryMock).toHaveBeenCalledWith(
      `INSERT INTO usuarios (nome, email, senha, perfil_id)
            VALUES ($1, $2, $3, $4)`,
      [
        "João",
        "joao@email.com",
        "123456",
        1,
      ]
    );

    expect(result).toEqual(usuario);
  });

  it("deve retornar undefined ao criar quando não houver retorno", async () => {
    queryMock.mockResolvedValue({
      rows: [],
    } as any);

    const result = await repository.criar({
      nome: "João",
      email: "joao@email.com",
      senha: "123456",
      perfil_id: 1,
    } as any);

    expect(result).toBeUndefined();
  });

  it("deve buscar usuário por id", async () => {
    const usuario = {
      id: 1,
      nome: "João",
      email: "joao@email.com",
    };

    queryMock.mockResolvedValue({
      rows: [usuario],
    } as any);

    const result = await repository.buscarPorId(1);

    expect(queryMock).toHaveBeenCalledWith(
      "SELECT * FROM usuarios WHERE id = 1"
    );

    expect(result).toEqual(usuario);
  });

  it("deve retornar undefined quando não encontrar usuário por id", async () => {
    queryMock.mockResolvedValue({
      rows: [],
    } as any);

    const result = await repository.buscarPorId(99);

    expect(result).toBeUndefined();
  });

  it("deve buscar usuário por email", async () => {
    const usuario = {
      id: 1,
      nome: "João",
      email: "joao@email.com",
      senha: "123456",
    };

    queryMock.mockResolvedValue({
      rows: [usuario],
    } as any);

    const result = await repository.findByUsername("joao@email.com");

    expect(queryMock).toHaveBeenCalledWith(
      `SELECT * FROM usuarios
             WHERE email = $1`,
      ["joao@email.com"]
    );

    expect(result).toEqual(usuario);
  });

  it("deve retornar undefined quando não encontrar usuário por email", async () => {
    queryMock.mockResolvedValue({
      rows: [],
    } as any);

    const result = await repository.findByUsername("naoexiste@email.com");

    expect(queryMock).toHaveBeenCalledWith(
      `SELECT * FROM usuarios
             WHERE email = $1`,
      ["naoexiste@email.com"]
    );

    expect(result).toBeUndefined();
  });
});