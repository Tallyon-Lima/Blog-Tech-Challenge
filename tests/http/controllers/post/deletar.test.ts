import { beforeEach, describe, expect, it, vi } from "vitest";
import { deletar } from "@/http/controllers/post/deletar.js";

const handlerMock = vi.fn();

vi.mock("@/repositories/post.repository.js", () => ({
  PostRepository: class {},
}));

vi.mock("@/repositories/usuario.repository.js", () => ({
  UsuarioRepository: class {},
}));

vi.mock("@/use-cases/post/deletar-post.js", () => {
  class MockDeletarPostUseCase {
    handler = handlerMock;
  }

  return {
    DeletarPostUseCase: MockDeletarPostUseCase,
  };
});

describe("Controller - deletar post", () => {
  let request: any;
  let reply: any;

  beforeEach(() => {
    vi.clearAllMocks();

    request = {
      body: {
        autor: 1,
      },
      params: {
        id: 10,
      },
    };

    reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it("deve retornar 403 quando usuário não possui permissão", async () => {
    handlerMock.mockResolvedValue("sem_permissao");

    await deletar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1, 10);
    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith({
      mensagem: "Usuário sem permissão",
    });
  });

  it("deve retornar 204 quando o post for deletado", async () => {
    handlerMock.mockResolvedValue("deletado");

    await deletar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1, 10);
    expect(reply.status).toHaveBeenCalledWith(204);
    expect(reply.send).toHaveBeenCalledWith("deletado");
  });

  it("deve retornar 200 quando o post não for encontrado", async () => {
    handlerMock.mockResolvedValue(undefined);

    await deletar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(1, 10);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      mensagem: "Post não encontrado",
    });
  });

  it("deve lançar erro quando o use case lançar exceção", async () => {
    handlerMock.mockRejectedValue(new Error("Erro"));

    await expect(deletar(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });

  it("deve lançar erro quando o id for inválido", async () => {
    request.params.id = {};

    await expect(deletar(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });

  it("deve lançar erro quando o autor for inválido", async () => {
    request.body.autor = {};

    await expect(deletar(request, reply)).rejects.toThrow(
      "Error get post"
    );
  });
});