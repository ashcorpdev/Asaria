import pino from 'pino'

export const logger = pino({
  name: 'Asaria',
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing
  level: 'debug'
})
