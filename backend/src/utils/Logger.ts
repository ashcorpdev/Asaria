import pino from 'pino'

export const logger = pino({
  name: process.env.APP_NAME,
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing
  level: 'info'
})
