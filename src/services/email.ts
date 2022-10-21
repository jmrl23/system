import type { SendMailOptions } from 'nodemailer'
import type { EmailServiceResponse } from '../types'
import { createTransport } from 'nodemailer'
import { SERVICE_EMAIL, SMTP_TRANSPORT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } from '../configurations'

const transportURL = new URL(SMTP_TRANSPORT_URL)

const transporter = createTransport({
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

async function sendMail(options: SendMailOptions): Promise<EmailServiceResponse> {
  if (SERVICE_EMAIL === 'off') {
    return {
      error: null,
      info: { response: 'Email service is disabled' }
    }
  }
  try {
    const info = await transporter.sendMail(options)
    return { error: null, info }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message, info: null }
  }
}

export { sendMail }