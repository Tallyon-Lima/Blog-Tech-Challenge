import { describe, it, expect, vi, beforeEach } from 'vitest';
import { criar } from '@/http/controllers/usuario/criar.js';
import { CriarUsuarioUseCase } from '@/use-cases/usuario/criar-usuario.js';
import { hash } from 'bcryptjs';

vi.mock('@/repositories/usuario.repository.js', () => ({
    UsuarioRepository: vi.fn()
}));

vi.mock('@/use-cases/usuario/criar-usuario.js', () => ({
    CriarUsuarioUseCase: vi.fn()
}));

vi.mock('bcryptjs', () => ({
    hash: vi.fn()
}));

describe('Criar Usuario Controller', () => {
    const mockReply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve criar um usuário com sucesso quando o solicitante for admin', async () => {
        const usuarioMock = {
            id: 1,
            nome: 'João',
            email: 'joao@email.com',
            perfil_id: 1
        };

        vi.mocked(hash).mockResolvedValue('hash123' as any);

        vi.mocked(CriarUsuarioUseCase).mockImplementation(
            function () {
                return {
                    handler: vi.fn().mockResolvedValue(usuarioMock)
                };
            } as any
        );

        const request = {
            user: {
                id: 99,
                email: 'admin@email.com',
                perfil_id: 3
            },
            body: {
                nome: 'João',
                email: 'joao@email.com',
                senha: '123456',
                perfil_id: 1
            }
        } as any;

        await criar(request, mockReply as any);

        expect(hash).toHaveBeenCalledWith('123456', 10);
        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(usuarioMock);
    });

    it('deve criar um usuário com CPF quando fornecido', async () => {
        const usuarioMock = {
            id: 2,
            nome: 'Maria',
            email: 'maria@email.com',
            perfil_id: 1,
            cpf: '123.456.789-00'
        };

        const handlerMock = vi.fn().mockResolvedValue(usuarioMock);
        vi.mocked(hash).mockResolvedValue('hash123' as any);

        vi.mocked(CriarUsuarioUseCase).mockImplementation(
            function () {
                return {
                    handler: handlerMock
                };
            } as any
        );

        const request = {
            user: {
                id: 99,
                email: 'admin@email.com',
                perfil_id: 3
            },
            body: {
                nome: 'Maria',
                email: 'maria@email.com',
                senha: '123456',
                perfil_id: 1,
                cpf: '123.456.789-00'
            }
        } as any;

        await criar(request, mockReply as any);

        expect(handlerMock).toHaveBeenCalledWith(
            expect.objectContaining({
                cpf: '123.456.789-00'
            }),
            99,
            3
        );
        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(usuarioMock);
    });

    it('deve retornar status 403 quando o solicitante não tiver permissão', async () => {
        vi.mocked(hash).mockResolvedValue('hash123' as any);

        vi.mocked(CriarUsuarioUseCase).mockImplementation(
            function () {
                return {
                    handler: vi.fn().mockResolvedValue("sem_permissao")
                };
            } as any
        );

        const request = {
            user: {
                id: 2,
                email: 'aluno@email.com',
                perfil_id: 1
            },
            body: {
                nome: 'Novo Aluno',
                email: 'novoaluno@email.com',
                senha: '123456',
                perfil_id: 1
            }
        } as any;

        await criar(request, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(403);
        expect(mockReply.send).toHaveBeenCalledWith({
            mensagem: "Apenas administradores podem criar usuários"
        });
    });

    it('deve lançar erro quando ocorrer exceção', async () => {
        vi.mocked(hash).mockResolvedValue('hash123' as any);

        vi.mocked(CriarUsuarioUseCase).mockImplementation(
            function () {
                return {
                    handler: vi.fn().mockRejectedValue(
                        new Error('Erro interno')
                    )
                };
            } as any
        );

        const request = {
            body: {
                nome: 'João',
                email: 'joao@email.com',
                senha: '123456',
                perfil_id: 1
            }
        } as any;

        await expect(
            criar(request, mockReply as any)
        ).rejects.toThrow('Error creating usuario');
    });

    it('deve lançar erro quando ocorrer erro ao gerar hash da senha', async () => {
        vi.mocked(hash).mockRejectedValue(
            new Error('Erro ao gerar hash')
        );

        const request = {
            body: {
                nome: 'João',
                email: 'joao@email.com',
                senha: '123456',
                perfil_id: 1
            }
        } as any;

        await expect(
            criar(request, mockReply as any)
        ).rejects.toThrow('Error creating usuario');
    });

    it('deve falhar quando body for inválido', async () => {
        const request = {
            body: {
                nome: 'João',
                email: 'joao@email.com',
                senha: '123456'
            }
        } as any;

        await expect(
            criar(request, mockReply as any)
        ).rejects.toThrow();
    });
});