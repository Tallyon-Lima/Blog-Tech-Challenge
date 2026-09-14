import { Resend } from "resend";

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export class ResendEmailProvider {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async send({ to, subject, html }: SendEmailParams) {
        const { error } = await this.resend.emails.send({
            from: "Blog Tech <onboarding@resend.dev>", // ou seu domínio verificado
            to,
            subject,
            html,
        });

        if (error) {
            throw new Error(`Erro ao enviar e-mail: ${error.message}`);
        }
    }
}