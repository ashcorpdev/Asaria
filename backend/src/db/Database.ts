import { join } from 'path'
import sqlite3 = require('sqlite3')
import { getTwitchId } from '../integrations/twitch/lib/Api'
import { sys } from 'typescript'
import { logger } from '../utils/Logger'
import { Database, open } from 'sqlite'
import { systemReady } from '../index'
logger.info('Database directory: ', __dirname)

const dbPath = join(process.cwd(), 'asaria.sqlite')
let db: Database<sqlite3.Database, sqlite3.Statement>
open({
  filename: dbPath,
  driver: sqlite3.Database
})
  .then(async (database) => {
    db = database
    await validateTableData()
  })
  .catch((reason) => {
    logger.error('Failed to open Database!')
    sys.exit()
  })

async function validateTableData(): Promise<void> {
  logger.info('Validating table data...')
  const allianceQuery =
    'CREATE TABLE if NOT EXISTS alliances(alliance_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, display_name CHAR(25) NOT NULL UNIQUE, points INTEGER(6));'
  const userQuery =
    'CREATE TABLE if NOT EXISTS users(user_id CHAR(15) NOT NULL PRIMARY KEY UNIQUE, alliance_id INTEGER, points INTEGER(5), FOREIGN KEY (alliance_id) REFERENCES alliances (alliance_id));'
  const eventQuery =
    'CREATE TABLE if NOT EXISTS events(event_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, start_date DATE, end_date DATE, display_name CHAR(50))'

  await createDatabaseTable('alliances', allianceQuery)
  await createDatabaseTable('users', userQuery)
  await createDatabaseTable('events', eventQuery)
  await createAlliancesData()
}

async function createDatabaseTable(
  tableName: string,
  query: string
): Promise<void> {
  await db
    .exec(query)
    .then((res) => logger.info(`Validated ${tableName} data!`))
    .catch((error) => {
      logger.error(`Failed to create ${tableName} table!`)
      logger.error(error)
      sys.exit()
    })
}

function createAlliancesData(): void {
  const queries = [
    "INSERT OR IGNORE INTO alliances (display_name, points) VALUES ('Winter''s Embrace', 0);",
    "INSERT OR IGNORE INTO alliances (display_name, points) VALUES ('Eternal Flame', 0);",
    "INSERT OR IGNORE INTO alliances (display_name, points) VALUES ('Ethereal Bloom', 0);",
    "INSERT OR IGNORE INTO alliances (display_name, points) VALUES ('Shadow Grove', 0);"
  ]
  queries.forEach((query) => {
    logger.info(`Running alliance data creation query...`)
    db.exec(query)
      .then((res) => {})
      .catch((error) => {
        logger.error('Failed to insert data for alliance')
        logger.error(error)
        sys.exit()
      })
  })

  logger.info('Alliance data creation queries successful.')
}

export async function createUserInDatabase(
  user: string,
  allianceName: string | undefined
): Promise<boolean> {
  let success = false
  if (systemReady) {
    const alliance: number | undefined = await getAllianceIdByName(allianceName)
    const allianceId = alliance?.toString()
    if (alliance !== null) {
      logger.warn(`${user} will not have an alliance assigned to them!`)
    } else {
      logger.debug(`Alliance valid - retrieving Twitch user ID for ${user}`)
    }
    const twitchId = await getTwitchId(user)
    if (twitchId !== null) {
      // Does the user already exist in the DB? Do they have an alliance assigned to them?
      await db
        .get(
          `SELECT user_id, alliance_id FROM users WHERE user_id = ${twitchId}`
        )
        .then(async (res) => {
          let insertUserQuery: string
          let updateUserQuery: string
          if (allianceId === undefined) {
            insertUserQuery = `INSERT INTO users (user_id, points) VALUES (${twitchId}, 0)`
            updateUserQuery = ''
          } else {
            insertUserQuery = `INSERT INTO users (user_id, alliance_id, points) VALUES (${twitchId}, ${allianceId}, 0)`
            updateUserQuery = `UPDATE users SET alliance_id = ${allianceId} WHERE user_id = ${twitchId}`
          }

          if (res.user_id == null) {
            // User doesn't exist in the DB.
            await db
              .exec(insertUserQuery)
              .then((res) => logger.info(`Added ${user} to database!`))
              .catch((error) => {
                logger.warn(`Failed to add user ${user} to the database.`)
                logger.warn(error)
                success = false
              })
          } else {
            if (res.alliance_id == null && allianceId !== undefined) {
              // User exists, but has no alliance set.
              await db
                .exec(updateUserQuery)
                .then((res) => {
                  logger.info(`Added ${user} to alliance successfully!`)
                  success = true
                })
                .catch((error) => {
                  logger.warn(`Failed to add ${user} to alliance!`)
                  logger.warn(error)

                  success = false
                })
            } else {
              logger.warn(
                `${user} is already a part of an alliance - cannot join another one!`
              )
              success = false
            }
          }
        })
    }
  }
  return success
}

export async function isUserInDatabase(user: string): Promise<boolean> {
  const userId = await getTwitchId(user)
  if (userId !== null) {
    const result = await db
      .get(`SELECT user_id FROM users WHERE user_id = "${userId}"`)
      .then((res: { user_id: number }) => {
        if (res.user_id == null) {
          return false
        }
        return true
      })
      .catch((error) => {
        logger.error('Failed to lookup user in the database!')
        logger.error(error)
        return false
      })
    return result
  }
  return false
}

export async function getUserPoints(user: string): Promise<0 | number | null> {
  const userId = await getTwitchId(user)
  if (userId !== null) {
    const result = await db
      .get(`SELECT points FROM users WHERE user_id = "${userId}"`)
      .then(async (res: { points: number }) => {
        logger.debug(`Retrieved points for ${user}: ${res.points} points`)
        if (res.points == null) {
          // If the users' points is null for some reason, set them to 0.
          await db.exec(
            `UPDATE users SET points = 0 WHERE user_id = "${userId}"`
          )
          return 0
        } else {
          return res.points
        }
      })
      .catch((error) => {
        logger.error(`Failed to get points for ${user}`)
        logger.error(error)
        return null
      })
    return result
  }
  return null
}

async function getAllianceIdByName(
  allianceName: string | undefined
): Promise<number | undefined> {
  if (systemReady) {
    if (allianceName !== undefined) {
      logger.debug(`Attempting to retrieve alliance ID for ${allianceName}`)
      const result = await db
        .get(
          `SELECT alliance_id FROM alliances WHERE display_name = "${allianceName}"`
        )
        .then((res: { alliance_id: number }) => {
          if (res.alliance_id == null) {
            return undefined
          }
          return res.alliance_id
        })
        .catch((error) => {
          logger.error('Failed to create table!')
          logger.error(error)
          return undefined
        })
      return result
    }
  }
  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getAllianceNameById(allianceId: number): Promise<string | null> {
  let allianceName: string
  if (systemReady) {
    await db
      .get(
        `SELECT display_name FROM alliances WHERE alliance_id = "${allianceId}"`
      )
      .then((res) => {
        logger.info(res.alliance_id)
        allianceId = res.alliance_id
        return allianceName
      })
      .catch((error) => {
        logger.error('Failed to create table!')
        logger.error(error)
        return null
      })
  }
  return null
}
