async function bootstrap() {
  await import('./core/config')
  await import('./core/app')
  await import('../src/main')
}
bootstrap()