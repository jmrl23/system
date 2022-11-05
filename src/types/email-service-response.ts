import type { SentMessageInfo } from 'nodemailer'

interface EmailServiceResponse {
  error: string | null
  info: SentMessageInfo | { response: string } | null
}

export type { EmailServiceResponse }
