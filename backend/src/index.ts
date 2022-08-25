/*

Application Entrypoint

*/
import dotenv = require('dotenv')
import { readdirSync, lstatSync } from 'fs'
import { join } from 'path'
import { logger } from './utils/Logger'
dotenv.config()

export let systemReady = false

async function initialiseSystem(): Promise<void> {
  logger.info('Initialising War of the Wisps Application.')
  await connectToDatabase()
  await loadIntegrationModules()
}

async function connectToDatabase(): Promise<void> {
  await import(join(__dirname, '/db/Database'))
}

async function loadIntegrationModules(): Promise<void> {
  logger.info('Loading integration modules...')
  // Filter through all the directories within integrations and find the module files to import.
  const baseDir = join(__dirname, '/integrations')
  const files = readdirSync(baseDir)
  for (let i = 0; i < files.length; i++) {
    logger.debug('Looking for integrations to load.')
    const filename: string = join(baseDir, files[i])
    logger.debug(`Identified a new integration: ${filename}`)
    const stat = lstatSync(filename)
    if (stat.isDirectory()) {
      logger.debug('Loading module file...')
      // Locates the module file (should have the same name as the directory) and imports it dynamically.
      const integration = (await import(`${filename}\\${files[i]}`)) as {
        init: () => any
      }
      await integration.init()
    }
  }
  logger.debug('Integrations modules have finished loading.')
}

initialiseSystem()
  .then(() => {
    systemReady = true
    logger.info('System is prepared and ready for operation.')
  })
  .catch((reason) => {
    logger.info(reason)
  })
