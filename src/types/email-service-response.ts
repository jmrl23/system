import type { SentMessageInfo } from 'nodemailer'

export interface EmailServiceResponse {
  error: string | null
  info: SentMessageInfo | { response: string } | null
}
