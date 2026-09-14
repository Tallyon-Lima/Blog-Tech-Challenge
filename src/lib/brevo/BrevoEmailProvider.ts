import { BrevoClient } from "@getbrevo/brevo";

interface SendMailDTO {
  to: string;
  name: string;
  subject: string;
  html: string;
}

export class BrevoEmailProvider {
  private brevo: BrevoClient;

  constructor() {
    this.brevo = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY as string,
    });
  }

  async send({ to, name, subject, html }: SendMailDTO): Promise<void> {
    await this.brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      sender: {
        name: "Blog Tech",
        email: "tallyon26@gmail.com",
      },
      to: [
        {
          email: to,
          name,
        },
      ],
    });
  }
}