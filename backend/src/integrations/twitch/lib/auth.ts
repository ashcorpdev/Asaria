/*
Twitch Authentication Handler

All authentication with Twitch is passed through this module. It can then be accessed where appropriate in order to have one single-source of authentication.

*/

import { RefreshingAuthProvider } from '@twurple/auth'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export function createAuthProvider(): RefreshingAuthProvider | null {
  if (process.env.CLIENT_ID === undefined) return null
  if (process.env.CLIENT_SECRET === undefined) return null
  const tokenData = JSON.parse(
    readFileSync(join(process.cwd(), 'tokens.json'), 'utf-8')
  )
  const authProvider = new RefreshingAuthProvider(
    {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      onRefresh: (newTokenData) =>
        writeFileSync(
          join(process.cwd(), 'tokens.json'),
          JSON.stringify(newTokenData, null, 4),
          'utf-8'
        )
    },
    tokenData
  )
  return authProvider
}
