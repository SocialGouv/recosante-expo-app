import API from './api';

interface MailServiceProps {
  to?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: any[];
}
export namespace MailService {
  export async function sendMail({
    to,
    subject,
    text,
    html,
    attachments = [],
  }: MailServiceProps) {
    return await API.post({
      path: '/mail',
      body: {
        to,
        subject,
        text,
        html,
        attachments,
      },
    }).catch((err) => {
      console.error('send mail error', err);
    });
  }
}
