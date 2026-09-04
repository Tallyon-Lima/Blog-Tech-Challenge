import type { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export class NodemailerEmailProvider {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
    }

    async send({ to, subject, html }: SendEmailParams) {
        try {
            await this.transporter.sendMail({
                from: `"Blog Tech" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
            });
        } catch (error: any) {
            throw new Error(`Erro ao enviar e-mail: ${error.message}`);
        }
    }
}