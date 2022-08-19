import { join, resolve } from 'path'
import sqlite3 = require('sqlite3')
import { sys } from 'typescript'
console.log('Database directory: ', __dirname)
const db = new sqlite3.Database(
  join(__dirname, '../db/asaria.sqlite'),
  (err: Error | null) => onConnectedToDB(err)
) // Automatically opens the DB.

function onConnectedToDB(err: Error | null): void {
  console.log('Loading database at ', resolve(__dirname, '../db/asaria.sqlite'))
  if (err instanceof Error) {
    console.log('Failed to open database! Err: \n', err)
    sys.exit()
  } else {
    validateTableData()
  }
}

function validateTableData(): void {
  console.log('Validating table data in database...')
  db.serialize(() => {
    const allianceQuery =
      'CREATE TABLE if NOT EXISTS alliances(alliance_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, display_name CHAR(25) NOT NULL UNIQUE, points INTEGER(6));'
    const userQuery =
      'CREATE TABLE if NOT EXISTS users(user_id CHAR(15) NOT NULL PRIMARY KEY UNIQUE, alliance_id INTEGER, points INTEGER(5), FOREIGN KEY (alliance_id) REFERENCES alliances (alliance_id));'
    const eventQuery =
      'CREATE TABLE if NOT EXISTS events(event_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, start_date DATE, end_date DATE, display_name CHAR(50))'

    createDatabaseTable(allianceQuery)
    createDatabaseTable(userQuery)
    createDatabaseTable(eventQuery)
    createAlliancesData()
  })
}

function createDatabaseTable(query: string): void {
  db.run(query, (res: sqlite3.RunResult, err: Error | null) => {
    if (err instanceof Error) {
      console.log('Failed to create table!')
      sys.exit()
    } else {
      console.log('Validated table data!')
    }
  })
}

function createAlliancesData(): void {
  const queries = [
    "INSERT INTO alliances (display_name, points) VALUES ('Winter''s Embrace', 0);",
    "INSERT INTO alliances (display_name, points) VALUES ('Eternal Flame', 0);",
    "INSERT INTO alliances (display_name, points) VALUES ('Ethereal Bloom', 0);",
    "INSERT INTO alliances (display_name, points) VALUES ('Shadow Grove', 0);"
  ]
  queries.forEach((query) => {
    console.log('Running query: ', query)
    db.run(query, (res: sqlite3.RunResult, err: Error | null) => {
      if (err instanceof Error) {
        console.log('Failed to insert data for alliance!')
        sys.exit()
      } else {
        console.log('Validated alliance data!')
      }
    })
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAllianceIdByDisplayName(allianceName: string): number | null {
  let allianceId: number
  db.serialize(() => {
    db.get(
      `SELECT alliance_id FROM alliances WHERE display_name = "${allianceName}"`,
      (err: Error | null, res: any) => {
        if (err instanceof Error) {
          console.log('Failed to create table!')
          return
        }
        console.log(res.alliance_id)
        allianceId = res.alliance_id
        return allianceId
      }
    )
  })
  return null
}
