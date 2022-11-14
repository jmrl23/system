import type { SendMailOptions } from 'nodemailer'
import { createTransport } from 'nodemailer'
import {
  SERVICE_EMAIL,
  SMTP_TRANSPORT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN
} from '../configurations'

const transportURL = new URL(SMTP_TRANSPORT_URL)

export const transporter = createTransport({
  host: transportURL.hostname,
  port: parseInt(transportURL.port, 10),
  secure: transportURL.port === '465',
  service: 'gmail',
  auth: {
    type: 'oauth2',
    user: decodeURIComponent(transportURL.username),
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN
  }
})

export async function sendMail(options: SendMailOptions): Promise<unknown> {
  if (SERVICE_EMAIL === 'off')
    return { error: null, response: 'Email service is disabled' }
  try {
    const response = await transporter.sendMail(options)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) return { error: error.message }
  }
}
