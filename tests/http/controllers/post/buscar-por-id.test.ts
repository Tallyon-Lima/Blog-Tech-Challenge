import { beforeEach, describe, expect, it, vi } from "vitest";
import { buscarPorId } from "@/http/controllers/post/buscar-por-id.js";

const handlerMock = vi.fn();

vi.mock("@/repositories/post.repository.js", () => ({
  PostRepository: class {},
}));

vi.mock("@/use-cases/post/buscar-post.js", () => {
  class MockBuscarPostUseCase {
    handler = handlerMock;
  }

  return {
    BuscarPostUseCase: MockBuscarPostUseCase,
  };
});

describe("Controller - buscar post por id", () => {
  let request: any;
  let reply: any;

  beforeEach(() => {
    vi.clearAllMocks();

    request = {
      params: {
        id: 1,
      },
    };

    reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it("deve retornar o post quando encontrado", async () => {
    const post = {
      id: 1,
      titulo: "Meu Post",
      conteudo: "Conteúdo do post",
    };

    handlerMock.mockResolvedValue(post);

    await buscarPorId(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith(post);
  });

  it("deve retornar mensagem quando o post não for encontrado", async () => {
    handlerMock.mockResolvedValue(null);

    await buscarPorId(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1);
    expect(reply.status).toHaveBeenCalledWith(204);
    expect(reply.send).toHaveBeenCalledWith({
      mensagem: "Post não encontrado",
    });
  });

  it("deve lançar erro quando o use case lançar exceção", async () => {
    handlerMock.mockRejectedValue(new Error("Erro"));

    await expect(buscarPorId(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });

  it("deve lançar erro quando o id for inválido", async () => {
    request.params.id = {};

    await expect(buscarPorId(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });
});