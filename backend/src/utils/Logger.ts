import pino from 'pino'

const appName =
  process.env.APP_NAME === undefined ? 'Asaria' : process.env.LOG_LEVEL

const logLevel =
  process.env.LOG_LEVEL === undefined ? 'debug' : process.env.LOG_LEVEL

export const logger = pino({
  name: appName,
  level: logLevel
})

if (logLevel !== undefined) {
  logger.debug(`Logger is logging. Log level set to: ${logLevel}`)
}
