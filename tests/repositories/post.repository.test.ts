import { beforeEach, describe, expect, it, vi } from "vitest";
import { PostRepository } from "@/repositories/post.repository.js";
import { db } from "@/lib/pg/db.js";

vi.mock("@/lib/pg/db.js", () => ({
  db: {
    clientInstance: {
      query: vi.fn(),
    },
  },
}));

describe("PostRepository", () => {
  let repository: PostRepository;
  const queryMock = vi.mocked(db.clientInstance!.query);

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PostRepository();
  });

  it("deve criar um post", async () => {
    const post = {
      id: 1,
      titulo: "Título",
      conteudo: "Conteúdo",
      autor: 1,
      disciplina: "Backend",
    };

    queryMock.mockResolvedValue({
      rows: [post],
    } as any);

    const result = await repository.criar(post as any);

    expect(queryMock).toHaveBeenCalledWith(
      "INSERT INTO post (titulo, conteudo, autor, disciplina, data_criacao, data_atualizacao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      ["Título", "Conteúdo", 1, "Backend", "NOW()", "NOW()"]
    );

    expect(result).toEqual(post);
  });

  it("deve listar posts sem pesquisa", async () => {
    const posts = [{ id: 1 }, { id: 2 }];

    queryMock.mockResolvedValue({
      rows: posts,
    } as any);

    const result = await repository.listar(1);

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("SELECT"),
      []
    );

    expect(result).toEqual(posts);
  });

  it("deve listar posts com pesquisa", async () => {
    const posts = [{ id: 1 }];

    queryMock.mockResolvedValue({
      rows: posts,
    } as any);

    const result = await repository.listar(2, "Node");

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("ILIKE"),
      ["%Node%"]
    );

    expect(result).toEqual(posts);
  });

  it("deve buscar um post por id", async () => {
    const post = { id: 10 };

    queryMock.mockResolvedValue({
      rows: [post],
    } as any);

    const result = await repository.buscarPorId(10);

    expect(queryMock).toHaveBeenCalledWith(
      "SELECT * FROM post WHERE id = 10"
    );

    expect(result).toEqual(post);
  });

  it("deve editar um post", async () => {
    const post = {
      id: 1,
      titulo: "Novo",
      conteudo: "Conteúdo",
      disciplina: "Java",
      autor: 2,
    };

    queryMock.mockResolvedValue({
      rows: [post],
    } as any);

    const result = await repository.editar(post as any);

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE post"),
      [
        "Novo",
        "Conteúdo",
        "Java",
        "NOW()",
        2,
        1,
      ]
    );

    expect(result).toEqual(post);
  });

  it("deve deletar um post", async () => {
    queryMock.mockResolvedValue({} as any);

    const result = await repository.deletar(5);

    expect(queryMock).toHaveBeenCalledWith(
      "DELETE FROM post WHERE id = 5"
    );

    expect(result).toBe("deletado");
  });

  it("deve retornar undefined quando criar não retornar registros", async () => {
    queryMock.mockResolvedValue({
      rows: [],
    } as any);

    const result = await repository.criar({
      titulo: "Teste",
      conteudo: "Conteúdo",
      autor: 1,
      disciplina: "Backend",
    } as any);

    expect(result).toBeUndefined();
  });

  it("deve retornar undefined quando buscarPorId não encontrar registro", async () => {
    queryMock.mockResolvedValue({
      rows: [],
    } as any);

    const result = await repository.buscarPorId(100);

    expect(result).toBeUndefined();
  });

  it("deve retornar lista vazia quando não houver posts", async () => {
    queryMock.mockResolvedValue({
      rows: [],
    } as any);

    const result = await repository.listar(1);

    expect(result).toEqual([]);
  });
});