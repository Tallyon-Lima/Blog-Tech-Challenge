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

    it('deve criar um usuário com sucesso', async () => {
        const usuarioMock = {
            id: 1,
            nome: 'João',
            email: 'joao@email.com',
            perfil_id: 1
        };

        vi.mocked(hash).mockResolvedValue();

        vi.mocked(CriarUsuarioUseCase).mockImplementation(
            function () {
                return {
                    handler: vi.fn().mockResolvedValue(usuarioMock)
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

        await criar(request, mockReply as any);

        expect(hash).toHaveBeenCalledWith('123456', 10);
        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(usuarioMock);
    });

    it('deve lançar erro quando ocorrer exceção', async () => {
        vi.mocked(hash).mockResolvedValue();

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