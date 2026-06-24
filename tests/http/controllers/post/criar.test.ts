import { describe, it, expect, vi, beforeEach } from 'vitest';
import { criar } from '@/http/controllers/post/criar.js';
import { CriarPostUseCase } from '@/use-cases/post/criar-post.js';

vi.mock('@/repositories/post.repository.js', () => ({
    PostRepository: vi.fn()
}));

vi.mock('@/repositories/usuario.repository.js', () => ({
    UsuarioRepository: vi.fn()
}));

vi.mock('@/use-cases/post/criar-post.js', () => ({
    CriarPostUseCase: vi.fn()
}));

describe('Criar Post Controller', () => {
    const mockReply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve criar um post com sucesso', async () => {
        const postMock = {
            id: 1,
            titulo: 'Meu Post',
            conteudo: 'Conteúdo teste',
            disciplina: 'Matemática',
            autor: 1
        };

        vi.mocked(CriarPostUseCase).mockImplementation(
            function () {
                return {
                    handler: vi.fn().mockResolvedValue(postMock)
                };
            } as any
        );

        const request = {
            body: {
                titulo: 'Meu Post',
                conteudo: 'Conteúdo teste',
                disciplina: 'Matemática',
                autor: 1
            }
        } as any;

        await criar(request, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith(postMock);
    });

    it('deve retornar 403 quando usuário não possuir permissão', async () => {
        vi.mocked(CriarPostUseCase).mockImplementation(
            function () {
                return {
                    handler: vi.fn().mockResolvedValue(null)
                };
            } as any
        );

        const request = {
            body: {
                titulo: 'Meu Post',
                conteudo: 'Conteúdo teste',
                disciplina: 'Matemática',
                autor: 1
            }
        } as any;

        await criar(request, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(403);
        expect(mockReply.send).toHaveBeenCalledWith({
            mensagem: 'Você não tem permissão'
        });
    });

    it('deve lançar erro quando ocorrer exceção', async () => {
        vi.mocked(CriarPostUseCase).mockImplementation(
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
                titulo: 'Meu Post',
                conteudo: 'Conteúdo teste',
                disciplina: 'Matemática',
                autor: 1
            }
        } as any;

        await expect(
            criar(request, mockReply as any)
        ).rejects.toThrow('Error creating post');
    });

    it('deve falhar quando body for inválido', async () => {
        const request = {
            body: {
                titulo: 'Meu Post',
                conteudo: 'Conteúdo teste',
                disciplina: 'Matemática'
            }
        } as any;

        await expect(
            criar(request, mockReply as any)
        ).rejects.toThrow();
    });
});