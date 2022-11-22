import * as e from 'env-var'

export const NODE_ENV = e
  .get('NODE_ENV')
  .default('development')
  .asEnum(['development', 'production', 'test'])

export const PORT = e.get('PORT').default(3000).asPortNumber()

export const DISABLE_ERD = e.get('DISABLE_ERD').required().asBool()

export const IS_MAINTENANCE = e.get('IS_MAINTENANCE').default('false').asBool()

export const API_AUTH_KEY = e.get('API_AUTH_KEY').required().asString()

export const NONCE = e.get('NONCE').required().asString()

export const TRUST_PROXY = e.get('TRUST_PROXY').default('loopback').asString()

export const SESSION_SECRET = e.get('SESSION_SECRET').required().asString()

export const DATABASE_URL = e.get('DATABASE_URL').required().asUrlString()

export const SMTP_TRANSPORT_URL = e
  .get('SMTP_TRANSPORT_URL')
  .required()
  .asUrlString()

export const GOOGLE_CLIENT_ID = e.get('GOOGLE_CLIENT_ID').required().asString()

export const GOOGLE_CLIENT_SECRET = e
  .get('GOOGLE_CLIENT_SECRET')
  .required()
  .asString()

export const GOOGLE_REFRESH_TOKEN = e
  .get('GOOGLE_REFRESH_TOKEN')
  .required()
  .asString()

export const PASSPORT_GOOGLE_CALLBACK_URL = e
  .get('PASSPORT_GOOGLE_CALLBACK_URL')
  .required()
  .asUrlString()

export const ORGANIZATION_EMAIL_DOMAIN = e
  .get('ORGANIZATION_EMAIL_DOMAIN')
  .required()
  .asString()

export const SERVICE_EMAIL = e
  .get('SERVICE_EMAIL')
  .required()
  .asEnum(['on', 'off'])
