interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export class EmailJSEmailProvider {
    async send({ to, subject, html }: SendEmailParams) {
        const data = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY, // Opcional, mas recomendado para chamadas de backend
            template_params: {
                to_email: to,
                subject: subject,
                html_message: html // Variável que conterá o corpo HTML no EmailJS
            }
        };

        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`EmailJS Error: ${response.status} - ${errorText}`);
            }

            console.log("E-mail enviado com sucesso via EmailJS!");
        } catch (error: any) {
            console.error("Falha ao enviar e-mail via EmailJS:", error);
            throw new Error(`Erro ao enviar e-mail: ${error.message}`);
        }
    }
}
