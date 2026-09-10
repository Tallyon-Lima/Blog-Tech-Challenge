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

  it("deve criar um usuário sem cpf", async () => {
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
      `INSERT INTO usuarios (nome, email, senha, perfil_id, cpf)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
      [
        "João",
        "joao@email.com",
        "123456",
        1,
        null,
      ]
    );

    expect(result).toEqual(usuario);
  });

  it("deve criar um usuário com cpf", async () => {
    const usuario = {
      nome: "Carlos",
      email: "carlos@email.com",
      senha: "123456",
      perfil_id: 1,
      cpf: "123.456.789-00",
    };

    queryMock.mockResolvedValue({
      rows: [usuario],
    } as any);

    const result = await repository.criar(usuario as any);

    expect(queryMock).toHaveBeenCalledWith(
      `INSERT INTO usuarios (nome, email, senha, perfil_id, cpf)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
      [
        "Carlos",
        "carlos@email.com",
        "123456",
        1,
        "123.456.789-00",
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

  it("deve buscar usuário por cpf", async () => {
    const usuario = {
      id: 1,
      nome: "Carlos",
      email: "carlos@email.com",
      cpf: "123.456.789-00",
    };

    queryMock.mockResolvedValue({
      rows: [usuario],
    } as any);

    const result = await repository.findByCpf("123.456.789-00");

    expect(queryMock).toHaveBeenCalledWith(
      `SELECT * FROM usuarios
             WHERE cpf = $1`,
      ["123.456.789-00"]
    );

    expect(result).toEqual(usuario);
  });

  it("deve retornar undefined quando não encontrar usuário por cpf", async () => {
    queryMock.mockResolvedValue({
      rows: [],
    } as any);

    const result = await repository.findByCpf("000.000.000-00");

    expect(result).toBeUndefined();
  });

  it("deve listar todos os usuários", async () => {
    const usuarios = [{ id: 1 }, { id: 2 }];

    queryMock.mockResolvedValue({
      rows: usuarios,
    } as any);

    const result = await repository.listar();

    expect(queryMock).toHaveBeenCalledWith(
      `SELECT * FROM usuarios`
    );

    expect(result).toEqual(usuarios);
  });

  it("deve editar um usuário", async () => {
    const usuario = {
      id: 1,
      nome: "João Editado",
      email: "joao.editado@email.com",
      senha: "nova-senha",
      perfil_id: 1,
      cpf: "123.456.789-00",
    };

    queryMock.mockResolvedValue({
      rows: [usuario],
    } as any);

    const result = await repository.editar(usuario as any);

    expect(queryMock).toHaveBeenCalledWith(
      `UPDATE usuarios
         SET
            nome = $1,
            email = $2,
            senha = $3,
            perfil_id = $4,
            cpf = $5
         WHERE id = $6
         RETURNING *`,
      [
        "João Editado",
        "joao.editado@email.com",
        "nova-senha",
        1,
        "123.456.789-00",
        1,
      ]
    );

    expect(result).toEqual(usuario);
  });

  it("deve editar um usuário sem cpf", async () => {
    const usuario = {
      id: 2,
      nome: "Maria",
      email: "maria@email.com",
      senha: "senha",
      perfil_id: 2,
    };

    queryMock.mockResolvedValue({
      rows: [usuario],
    } as any);

    await repository.editar(usuario as any);

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE usuarios"),
      [
        "Maria",
        "maria@email.com",
        "senha",
        2,
        null,
        2,
      ]
    );
  });

  it("deve deletar um usuário", async () => {
    queryMock.mockResolvedValue({} as any);

    const result = await repository.deletar(7);

    expect(queryMock).toHaveBeenCalledWith(
      "DELETE FROM usuarios WHERE id = 7"
    );

    expect(result).toBe("usuário de id 7 deletado com sucesso.");
  });
});