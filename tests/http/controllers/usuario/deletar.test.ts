import { beforeEach, describe, expect, it, vi } from "vitest";
import { deletar } from "@/http/controllers/usuario/deletar.js";

const handlerMock = vi.fn();

vi.mock("@/repositories/usuario.repository.js", () => ({
  UsuarioRepository: class {
    findByUsername = vi.fn();
    buscarPorId = vi.fn();
  },
}));

vi.mock("@/use-cases/usuario/deletar-usuario.js", () => {
  class MockDeletarUsuarioUseCase {
    handler = handlerMock;
  }

  return {
    DeletarUsuarioUseCase: MockDeletarUsuarioUseCase,
  };
});

describe("Controller - deletar usuario", () => {
  let reply: any;

  beforeEach(() => {
    vi.clearAllMocks();

    reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it("deve retornar 204 quando o usuário for deletado por um admin", async () => {
    handlerMock.mockResolvedValue("deletado");

    const request = {
      user: {
        id: 99,
        email: "admin@email.com",
        perfil_id: 3,
      },
      params: {
        id: 10,
      },
    } as any;

    await deletar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(10, 99, 3);
    expect(reply.status).toHaveBeenCalledWith(204);
    expect(reply.send).toHaveBeenCalled();
  });

  it("deve retornar 403 quando usuário solicitante não possui permissão de admin", async () => {
    handlerMock.mockResolvedValue("sem_permissao");

    const request = {
      user: {
        id: 1,
        email: "aluno@email.com",
        perfil_id: 1,
      },
      params: {
        id: 10,
      },
    } as any;

    await deletar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(10, 1, 1);
    expect(reply.status).toHaveBeenCalledWith(403);
    expect(reply.send).toHaveBeenCalledWith({
      mensagem: "Usuário sem permissão",
    });
  });

  it("deve retornar 404 quando o usuário a ser deletado não for encontrado", async () => {
    handlerMock.mockResolvedValue("nao_encontrado");

    const request = {
      user: {
        id: 99,
        email: "admin@email.com",
        perfil_id: 3,
      },
      params: {
        id: 999,
      },
    } as any;

    await deletar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(999, 99, 3);
    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      mensagem: "Usuário não encontrado",
    });
  });

  it("deve aceitar usuario_solicitante no body como fallback", async () => {
    handlerMock.mockResolvedValue("deletado");

    const request = {
      params: {
        id: 5,
      },
      body: {
        usuario_solicitante: 99,
      },
    } as any;

    await deletar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith(5, 99, undefined);
    expect(reply.status).toHaveBeenCalledWith(204);
  });

  it("deve lançar erro quando o use case lançar exceção", async () => {
    handlerMock.mockRejectedValue(new Error("Erro de banco"));

    const request = {
      user: { id: 99, perfil_id: 3 },
      params: { id: 10 },
    } as any;

    await expect(deletar(request, reply)).rejects.toThrow("Erro ao deletar usuário");
  });

  it("deve lançar erro quando o id do parâmetro for inválido", async () => {
    const request = {
      user: { id: 99, perfil_id: 3 },
      params: { id: "invalido" },
    } as any;

    await expect(deletar(request, reply)).rejects.toThrow("Erro ao deletar usuário");
  });
});
