import type { NodemailerEmailProvider } from "@/lib/nodemailer/NodemailerEmailProvider .js";

interface EnviarEmailAcessoRequest {
  nome: string;
  email: string;
  senha: string;
}

export class EnviarEmailAcessoUseCase {
  constructor(
    private emailProvider: NodemailerEmailProvider
  ) { }

  async handler({
    nome,
    email,
    senha,
  }: EnviarEmailAcessoRequest) {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Acesso à plataforma</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:32px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

              <!-- Cabeçalho -->
              <tr>
                <td style="background-color:#1e293b; padding:24px 32px;">
                  <h1 style="margin:0; color:#ffffff; font-size:20px;">Blog Tech</h1>
                </td>
              </tr>

              <!-- Corpo -->
              <tr>
                <td style="padding:32px;">
                  <h2 style="margin:0 0 16px; color:#111827; font-size:18px;">Bem-vindo(a), ${nome}! 👋</h2>
                  <p style="margin:0 0 24px; color:#374151; font-size:15px; line-height:1.6;">
                    Seu cadastro na plataforma <strong>Blog Tech</strong> foi realizado com sucesso.
                    Abaixo estão seus dados de acesso:
                  </p>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; margin-bottom:24px;">
                    <tr>
                      <td style="padding:16px 20px;">
                        <p style="margin:0 0 8px; color:#6b7280; font-size:13px; text-transform:uppercase; letter-spacing:0.05em;">E-mail</p>
                        <p style="margin:0 0 16px; color:#111827; font-size:15px; font-weight:bold;">${email}</p>

                        <p style="margin:0 0 8px; color:#6b7280; font-size:13px; text-transform:uppercase; letter-spacing:0.05em;">Senha</p>
                        <p style="margin:0; color:#111827; font-size:15px; font-weight:bold;">${senha}</p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 24px; color:#6b7280; font-size:13px; line-height:1.6;">
                    Por segurança, recomendamos alterar sua senha após o primeiro acesso.
                  </p>

                  <p style="margin:0; color:#374151; font-size:15px; line-height:1.6;">
                    Estamos muito felizes por tê-lo(a) com a gente. Qualquer dúvida, é só responder este e-mail.
                  </p>
                </td>
              </tr>

              <!-- Rodapé -->
              <tr>
                <td style="padding:20px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
                  <p style="margin:0; color:#9ca3af; font-size:12px; text-align:center;">
                    © ${new Date().getFullYear()} Blog Tech. Todos os direitos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await this.emailProvider.send({
      to: email,
      subject: "Acesso à plataforma - Blog Tech",
      html,
    });
  }
}