import { beforeEach, describe, expect, it, vi } from "vitest";
import { criar } from "@/http/controllers/usuario/criar.js";
import { ZodError } from "zod";

const handlerMock = vi.fn();

vi.mock("@/repositories/usuario.repository.js", () => ({
  UsuarioRepository: class {},
}));

vi.mock("@/use-cases/usuario/criar-usuario.js", () => {
  class MockCriarUsuarioUseCase {
    handler = handlerMock;
  }

  return {
    CriarUsuarioUseCase: MockCriarUsuarioUseCase,
  };
});

describe("Controller - criar usuário", () => {
  let request: any;
  let reply: any;

  beforeEach(() => {
    vi.clearAllMocks();

    request = {
      body: {
        nome: "Danilo",
        email: "danilo@email.com",
        senha: "123456",
        perfil_id: 1,
      },
    };

    reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it("deve criar um usuário com sucesso", async () => {
    const usuario = {
      id: 1,
      nome: "Danilo",
      email: "danilo@email.com",
      perfil_id: 1,
    };

    handlerMock.mockResolvedValue(usuario);

    await criar(request, reply);

    expect(handlerMock).toHaveBeenCalledWith({
      nome: "Danilo",
      email: "danilo@email.com",
      senha: "123456",
      perfil_id: 1,
    });

    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith(usuario);
  });

  it("deve lançar erro quando o use case lançar exceção", async () => {
    handlerMock.mockRejectedValue(new Error("Erro"));

    await expect(criar(request, reply)).rejects.toThrow(
      "Error creating usuario"
    );
  });

  it("deve lançar ZodError quando nome for inválido", async () => {
    request.body.nome = 123;

    await expect(criar(request, reply)).rejects.toBeInstanceOf(ZodError);
  });

  it("deve lançar ZodError quando email for inválido", async () => {
    request.body.email = 123;

    await expect(criar(request, reply)).rejects.toBeInstanceOf(ZodError);
  });

  it("deve lançar ZodError quando senha for inválida", async () => {
    request.body.senha = 123;

    await expect(criar(request, reply)).rejects.toBeInstanceOf(ZodError);
  });

  it("deve lançar ZodError quando perfil_id for inválido", async () => {
    request.body.perfil_id = {};

    await expect(criar(request, reply)).rejects.toBeInstanceOf(ZodError);
  });
});