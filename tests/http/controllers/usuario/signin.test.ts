import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signin } from '@/http/controllers/usuario/signin.js';
import { makeSigninUseCase } from '@/use-cases/usuario/make-signin.js';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error.js';
import { compare } from 'bcryptjs';

vi.mock('@/use-cases/usuario/make-signin.js', () => ({
    makeSigninUseCase: vi.fn()
}));

vi.mock('bcryptjs', () => ({
    compare: vi.fn()
}));

describe('Signin Controller', () => {
    const mockReply = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
        jwtSign: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve realizar login com sucesso', async () => {
        const usuarioMock = {
            id: 1,
            email: 'teste@email.com',
            senha: 'senhaHash'
        };

        vi.mocked(makeSigninUseCase).mockReturnValue({
            handler: vi.fn().mockResolvedValue(usuarioMock)
        } as any);

        vi.mocked(compare as any).mockResolvedValue(true);

        mockReply.jwtSign.mockResolvedValue('token-jwt');

        const request = {
            body: {
                email: 'teste@email.com',
                senha: '123456'
            }
        } as any;

        await signin(request, mockReply as any);

        expect(compare).toHaveBeenCalledWith('123456', 'senhaHash');
        expect(mockReply.jwtSign).toHaveBeenCalledWith({
            email: 'teste@email.com'
        });
        expect(mockReply.status).toHaveBeenCalledWith(200);
        expect(mockReply.send).toHaveBeenCalledWith({
            token: 'token-jwt'
        });
    });

    it('deve lançar InvalidCredentialsError quando a senha estiver incorreta', async () => {
        const usuarioMock = {
            id: 1,
            email: 'teste@email.com',
            senha: 'senhaHash'
        };

        vi.mocked(makeSigninUseCase).mockReturnValue({
            handler: vi.fn().mockResolvedValue(usuarioMock)
        } as any);

        vi.mocked(compare as any).mockResolvedValue(false);

        const request = {
            body: {
                email: 'teste@email.com',
                senha: 'senhaErrada'
            }
        } as any;

        await expect(
            signin(request, mockReply as any)
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('deve lançar erro quando o use case falhar', async () => {
        vi.mocked(makeSigninUseCase).mockReturnValue({
            handler: vi.fn().mockRejectedValue(new Error('Erro interno'))
        } as any);

        const request = {
            body: {
                email: 'teste@email.com',
                senha: '123456'
            }
        } as any;

        await expect(
            signin(request, mockReply as any)
        ).rejects.toThrow('Erro interno');
    });

    it('deve falhar quando o body for inválido', async () => {
        const request = {
            body: {
                email: 'teste@email.com'
            }
        } as any;

        await expect(
            signin(request, mockReply as any)
        ).rejects.toThrow();
    });
});