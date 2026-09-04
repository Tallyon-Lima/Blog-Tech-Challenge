import { describe, it, expect, vi, beforeEach } from "vitest";
import { criar } from "@/http/controllers/usuario/criar.js";
import { CriarUsuarioUseCase } from "@/use-cases/usuario/criar-usuario.js";
import { UsuarioRepository } from "@/repositories/usuario.repository.js";

vi.mock("@/repositories/usuario.repository.js", () => ({
    UsuarioRepository: vi.fn()
}));

vi.mock("@/use-cases/usuario/criar-usuario.js", () => ({
    CriarUsuarioUseCase: vi.fn()
}));

describe("Criar Usuario Controller", () => {
    const mockReply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
    };

    let repositoryMock: any;
    let handlerMock: any;

    beforeEach(() => {
        vi.clearAllMocks();

        repositoryMock = {
            findByUsername: vi.fn(),
            criar: vi.fn()
        };

        handlerMock = vi.fn();

        vi.mocked(UsuarioRepository).mockImplementation(
            function () {
                return repositoryMock;
            } as any
        );

        vi.mocked(CriarUsuarioUseCase).mockImplementation(
            function () {
                return {
                    handler: handlerMock
                };
            } as any
        );
    });

    it("deve criar um usuário com sucesso quando o solicitante for admin", async () => {
        const usuarioMock = {
            id: 1,
            nome: "João",
            email: "joao@email.com",
            perfil_id: 1
        };

        handlerMock.mockResolvedValue(usuarioMock);

        const request = {
            user: {
                id: 99,
                email: "admin@email.com",
                perfil_id: 3
            },
            body: {
                nome: "João",
                email: "joao@email.com",
                perfil_id: 1
            }
        } as any;

        await criar(request, mockReply as any);

        expect(handlerMock).toHaveBeenCalledWith(
            {
                nome: "João",
                email: "joao@email.com",
                senha: "",
                perfil_id: 1,
                cpf: undefined
            },
            99,
            3
        );

        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(usuarioMock);
    });

    it("deve criar um usuário com CPF quando fornecido", async () => {
        const usuarioMock = {
            id: 2,
            nome: "Maria",
            email: "maria@email.com",
            perfil_id: 1,
            cpf: "123.456.789-00"
        };

        handlerMock.mockResolvedValue(usuarioMock);

        const request = {
            user: {
                id: 99,
                email: "admin@email.com",
                perfil_id: 3
            },
            body: {
                nome: "Maria",
                email: "maria@email.com",
                perfil_id: 1,
                cpf: "123.456.789-00"
            }
        } as any;

        await criar(request, mockReply as any);

        expect(handlerMock).toHaveBeenCalledWith(
            {
                nome: "Maria",
                email: "maria@email.com",
                senha: "",
                perfil_id: 1,
                cpf: "123.456.789-00"
            },
            99,
            3
        );

        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(usuarioMock);
    });

    it("deve usar o usuario_solicitante quando não houver id no usuário logado", async () => {
        const usuarioMock = {
            id: 3,
            nome: "Pedro",
            email: "pedro@email.com",
            perfil_id: 1
        };

        handlerMock.mockResolvedValue(usuarioMock);

        const request = {
            user: {
                email: "admin@email.com",
                perfil_id: 3
            },
            body: {
                nome: "Pedro",
                email: "pedro@email.com",
                perfil_id: 1,
                usuario_solicitante: 99
            }
        } as any;

        await criar(request, mockReply as any);

        expect(handlerMock).toHaveBeenCalledWith(
            {
                nome: "Pedro",
                email: "pedro@email.com",
                senha: "",
                perfil_id: 1,
                cpf: undefined
            },
            99,
            3
        );

        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(usuarioMock);
    });

    it("deve buscar o usuário logado pelo email quando não houver solicitanteId", async () => {
        const usuarioLogado = {
            id: 99,
            nome: "Administrador",
            email: "admin@email.com",
            perfil_id: 3
        };

        const usuarioCriado = {
            id: 4,
            nome: "Carlos",
            email: "carlos@email.com",
            perfil_id: 1
        };

        repositoryMock.findByUsername.mockResolvedValue(usuarioLogado);
        handlerMock.mockResolvedValue(usuarioCriado);

        const request = {
            user: {
                email: "admin@email.com"
            },
            body: {
                nome: "Carlos",
                email: "carlos@email.com",
                perfil_id: 1
            }
        } as any;

        await criar(request, mockReply as any);

        expect(repositoryMock.findByUsername).toHaveBeenCalledWith(
            "admin@email.com"
        );

        expect(handlerMock).toHaveBeenCalledWith(
            {
                nome: "Carlos",
                email: "carlos@email.com",
                senha: "",
                perfil_id: 1,
                cpf: undefined
            },
            99,
            3
        );

        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(usuarioCriado);
    });

    it("deve retornar status 403 quando o solicitante não tiver permissão", async () => {
        handlerMock.mockResolvedValue("sem_permissao");

        const request = {
            user: {
                id: 2,
                email: "aluno@email.com",
                perfil_id: 1
            },
            body: {
                nome: "Novo Aluno",
                email: "novoaluno@email.com",
                perfil_id: 1
            }
        } as any;

        await criar(request, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(403);

        expect(mockReply.send).toHaveBeenCalledWith({
            mensagem: "Apenas administradores podem criar usuários"
        });
    });

    it("deve buscar o usuário pelo email quando o use case não retornar o usuário", async () => {
        const usuarioMock = {
            id: 5,
            nome: "Lucas",
            email: "lucas@email.com",
            perfil_id: 1
        };

        handlerMock.mockResolvedValue(undefined);

        repositoryMock.findByUsername.mockResolvedValue(usuarioMock);

        const request = {
            user: {
                id: 99,
                email: "admin@email.com",
                perfil_id: 3
            },
            body: {
                nome: "Lucas",
                email: "lucas@email.com",
                perfil_id: 1
            }
        } as any;

        await criar(request, mockReply as any);

        expect(repositoryMock.findByUsername).toHaveBeenCalledWith(
            "lucas@email.com"
        );

        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(usuarioMock);
    });

    it("deve lançar erro quando ocorrer uma exceção", async () => {
        handlerMock.mockRejectedValue(new Error("Erro interno"));

        const request = {
            user: {
                id: 99,
                email: "admin@email.com",
                perfil_id: 3
            },
            body: {
                nome: "João",
                email: "joao@email.com",
                perfil_id: 1
            }
        } as any;

        await expect(
            criar(request, mockReply as any)
        ).rejects.toThrow("Error creating usuario");
    });

    it("deve falhar quando o body for inválido", async () => {
        const request = {
            user: {
                id: 99,
                email: "admin@email.com",
                perfil_id: 3
            },
            body: {
                nome: "João",
                email: "joao@email.com"
            }
        } as any;

        await expect(
            criar(request, mockReply as any)
        ).rejects.toThrow();
    });
});