import * as env from 'env-var'

export const NODE_ENV = env.get('NODE_ENV').default('development').asEnum(['development', 'production', 'test'])

export const NONCE = env.get('NONCE').required().asString()

export const TRUST_PROXY = env.get('TRUST_PROXY').default('loopback').asString()

export const SESSION_SECRET = env.get('SESSION_SECRET').required().asString()

export const DATABASE_URL = env.get('DATABASE_URL').required().asUrlString()

export const SMTP_TRANSPORT_URL = env.get('SMTP_TRANSPORT_URL').required().asUrlString()

export const GOOGLE_CLIENT_ID = env.get('GOOGLE_CLIENT_ID').required().asString()

export const GOOGLE_CLIENT_SECRET = env.get('GOOGLE_CLIENT_SECRET').required().asString()

export const GOOGLE_REFRESH_TOKEN = env.get('GOOGLE_REFRESH_TOKEN').required().asString()

export const PASSPORT_GOOGLE_CALLBACK_URL = env.get('PASSPORT_GOOGLE_CALLBACK_URL').required().asUrlString()

export const SERVICE_EMAIL = env.get('SERVICE_EMAIL').required().asEnum(['on', 'off'])
