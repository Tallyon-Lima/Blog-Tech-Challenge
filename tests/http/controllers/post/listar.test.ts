import { beforeEach, describe, expect, it, vi } from "vitest";
import { listar } from "@/http/controllers/post/listar.js";

const handlerMock = vi.fn();

vi.mock("@/repositories/post.repository.js", () => ({
  PostRepository: class {},
}));

vi.mock("@/use-cases/post/listar-post.js", () => {
  class MockListarPostUseCase {
    handler = handlerMock;
  }

  return {
    ListarPostUseCase: MockListarPostUseCase,
  };
});

describe("Controller - listar post", () => {
  let request: any;
  let reply: any;

  beforeEach(() => {
    vi.clearAllMocks();

    request = {
      query: {
        paginaAtual: 1,
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

    await listar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(listaPost);
  });

  it("deve definir paginaAtual como 1 quando o valor for menor que 1", async () => {
    request.query.paginaAtual = 0;

    handlerMock.mockResolvedValue([]);

    await listar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith([]);
  });

  it("deve manter paginaAtual quando o valor for maior que 0", async () => {
    request.query.paginaAtual = 5;

    handlerMock.mockResolvedValue([]);

    await listar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(5);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith([]);
  });

  it("deve lançar erro quando o use case lançar exceção", async () => {
    handlerMock.mockRejectedValue(new Error("Erro"));

    await expect(listar(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });

  it("deve lançar erro quando paginaAtual for inválida", async () => {
    request.query.paginaAtual = {};

    await expect(listar(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });
});