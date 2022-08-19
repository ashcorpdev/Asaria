/*

Application Entrypoint

*/
import { readdirSync, lstatSync } from 'fs'
import { join } from 'path'
import dotenv = require('dotenv')

dotenv.config()

async function inititaliseAsaria(): Promise<void> {
  console.log('Initialising War of the Wisps Application.')
  await connectToDatabase()
  await loadIntegrationModules()
}

async function connectToDatabase(): Promise<void> {
  // Identify whether database exists or create it if it doesn't.
  await import(join(__dirname, '/db/db'))
}

async function loadIntegrationModules(): Promise<void> {
  console.log('Loading integration modules.')
  // Filter through all the directories within integrations and find the module files to import.
  const baseDir = join(__dirname, '/integrations')
  const files = readdirSync(baseDir)
  for (let i = 0; i < files.length; i++) {
    console.log('Looking for integrations...')
    const filename: string = join(baseDir, files[i])
    console.log('Identified: ', filename)
    const stat = lstatSync(filename)
    if (stat.isDirectory()) {
      console.log('Loading module file...')
      // Locates the module file (should have the same name as the directory) and imports it dynamically.
      const integration = (await import(`${filename}\\${files[i]}`)) as {
        init: () => any
      }
      await integration.init()
    }
  }
}

inititaliseAsaria().catch((reason) => {
  console.log(reason)
})
