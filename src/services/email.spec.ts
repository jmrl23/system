import type { SendMailOptions } from 'nodemailer'
import { config } from 'dotenv'
import { join } from 'path'

describe('service: email', () => {
  const options: SendMailOptions = {
    to: 'test@email.com',
    from: 'Test',
    subject: 'development',
    text: 'Hello, World!'
  }

  beforeAll(async () => {
    config({
      path: join(__dirname, '../../sandbox/.env'),
      encoding: 'utf-8'
    })
    config({
      path: join(__dirname, '../../sandbox/.env.local'),
      encoding: 'utf-8'
    })
  })

  it('send an email', async () => {
    const { sendMail } = await import('./email')
    const data = await sendMail(options)
    expect(data.error).toBe(null)
  })
})
