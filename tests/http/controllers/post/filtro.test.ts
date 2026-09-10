import { beforeEach, describe, expect, it, vi } from "vitest";
import { filtro } from "@/http/controllers/post/filtro.js";

const handlerMock = vi.fn();

vi.mock("@/repositories/post.repository.js", () => ({
  PostRepository: class {},
}));

vi.mock("@/use-cases/post/filtro-post.js", () => {
  class MockFiltroPostUseCase {
    handler = handlerMock;
  }

  return {
    FiltroPostUseCase: MockFiltroPostUseCase,
  };
});

describe("Controller - filtro post", () => {
  let request: any;
  let reply: any;

  beforeEach(() => {
    vi.clearAllMocks();

    request = {
      query: {
        paginaAtual: 1,
        itensPagina: 6,
        pesquisa: "teste",
      },
    };

    reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it("deve retornar a lista de posts", async () => {
    const listaPost = [
      {
        id: 1,
        titulo: "Post 1",
      },
      {
        id: 2,
        titulo: "Post 2",
      },
    ];

    handlerMock.mockResolvedValue(listaPost);

    await filtro(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1, 6, "teste");
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(listaPost);
  });

  it("deve definir a página como 1 quando paginaAtual for menor que 1", async () => {
    request.query.paginaAtual = 0;

    handlerMock.mockResolvedValue([]);

    await filtro(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1, 6, "teste");
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith([]);
  });

  it("deve manter a página quando paginaAtual for maior que 0", async () => {
    request.query.paginaAtual = 5;

    handlerMock.mockResolvedValue([]);

    await filtro(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(5, 6, "teste");
  });

  it("deve definir itensPagina como 1 quando for menor que 1", async () => {
    request.query.itensPagina = 0;

    handlerMock.mockResolvedValue([]);

    await filtro(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1, 1, "teste");
  });

  it("deve usar itensPagina padrão (1) quando não informado", async () => {
    delete request.query.itensPagina;

    handlerMock.mockResolvedValue([]);

    await filtro(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1, 1, "teste");
  });

  it("deve lançar erro quando o use case lançar exceção", async () => {
    handlerMock.mockRejectedValue(new Error("Erro"));

    await expect(filtro(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });

  it("deve lançar erro quando paginaAtual for inválida", async () => {
    request.query.paginaAtual = {};

    await expect(filtro(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });

  it("deve lançar erro quando itensPagina for inválida", async () => {
    request.query.itensPagina = {};

    await expect(filtro(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });

  it("deve lançar erro quando pesquisa for inválida", async () => {
    request.query.pesquisa = {};

    await expect(filtro(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });
});