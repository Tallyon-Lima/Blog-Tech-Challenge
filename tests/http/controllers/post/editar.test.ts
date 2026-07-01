import { describe, it, expect, vi, beforeEach } from 'vitest';
import { editar } from '@/http/controllers/post/editar.js';
import { EditarPostUseCase } from '@/use-cases/post/editar-post.js';

vi.mock('@/repositories/post.repository.js', () => ({
    PostRepository: vi.fn()
}));

vi.mock('@/repositories/usuario.repository.js', () => ({
    UsuarioRepository: vi.fn()
}));

vi.mock('@/use-cases/post/editar-post.js', () => ({
    EditarPostUseCase: vi.fn()
}));

describe('Editar Post Controller', () => {
    const mockReply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve editar um post com sucesso', async () => {
        const postMock = {
            id: 1,
            titulo: 'Post Editado',
            conteudo: 'Conteúdo Editado',
            disciplina: 'Matemática',
            autor: 1
        };

        vi.mocked(EditarPostUseCase).mockImplementation(
            function () {
                return {
                    handler: vi.fn().mockResolvedValue(postMock)
                };
            } as any
        );

        const request = {
            body: {
                titulo: 'Post Editado',
                conteudo: 'Conteúdo Editado',
                disciplina: 'Matemática',
                autor: 1
            },
            params: {
                id: 1
            }
        } as any;

        await editar(request, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith(postMock);
    });

    it('deve retornar 403 quando usuário não possuir permissão', async () => {
        vi.mocked(EditarPostUseCase).mockImplementation(
            function () {
                return {
                    handler: vi.fn().mockResolvedValue(null)
                };
            } as any
        );

        const request = {
            body: {
                titulo: 'Post Editado',
                conteudo: 'Conteúdo Editado',
                disciplina: 'Matemática',
                autor: 1
            },
            params: {
                id: 1
            }
        } as any;

        await editar(request, mockReply as any);

        expect(mockReply.status).toHaveBeenCalledWith(403);
        expect(mockReply.send).toHaveBeenCalledWith({
            mensagem: 'Você não tem permissão'
        });
    });

    it('deve lançar erro quando ocorrer exceção', async () => {
        vi.mocked(EditarPostUseCase).mockImplementation(
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
                titulo: 'Post Editado',
                conteudo: 'Conteúdo Editado',
                disciplina: 'Matemática',
                autor: 1
            },
            params: {
                id: 1
            }
        } as any;

        await expect(
            editar(request, mockReply as any)
        ).rejects.toThrow('Error creating post');
    });

    it('deve falhar quando body for inválido', async () => {
        const request = {
            body: {
                titulo: 'Post Editado',
                conteudo: 'Conteúdo Editado',
                disciplina: 'Matemática'
                // autor ausente
            },
            params: {
                id: 1
            }
        } as any;

        await expect(
            editar(request, mockReply as any)
        ).rejects.toThrow();
    });

    it('deve falhar quando id for inválido', async () => {
        const request = {
            body: {
                titulo: 'Post Editado',
                conteudo: 'Conteúdo Editado',
                disciplina: 'Matemática',
                autor: 1
            },
            params: {}
        } as any;

        await expect(
            editar(request, mockReply as any)
        ).rejects.toThrow();
    });
});