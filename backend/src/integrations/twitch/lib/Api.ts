import { RefreshingAuthProvider } from '@twurple/auth'
import { ApiClient } from '@twurple/api'
import { logger } from '../../../utils/Logger'

let apiClient: ApiClient

export async function createApiClient(
  authProvider: RefreshingAuthProvider
): Promise<ApiClient> {
  logger.debug('Creating api client instance...')

  if (
    process.env.CLIENT_ID !== undefined &&
    process.env.CLIENT_SECRET !== undefined
  ) {
    logger.debug(
      `Client ID: ${process.env.CLIENT_ID}, Client Secret: ${process.env.CLIENT_SECRET}`
    )
  }

  apiClient = new ApiClient({ authProvider })

  logger.debug('Api Client registered.')

  return apiClient
}

export async function getTwitchId(userName: string): Promise<number | null> {
  logger.debug(`Getting Twitch ID for user: ${userName}`)
  // eslint-disable-next-line prettier/prettier
  const user = await apiClient.users
    .getUserByName(userName)
    .catch((error: {}) => {
      logger.error(error)
      if (
        process.env.CLIENT_ID !== undefined &&
        process.env.CLIENT_SECRET !== undefined
      ) {
        logger.debug(
          `Client ID: ${process.env.CLIENT_ID}, Client Secret: ${process.env.CLIENT_SECRET}`
        )
      }
    })

  if (user == null) {
    return null
  }
  logger.debug(user)
  logger.debug(`Got HelixUser object: ${JSON.stringify(user)}`)
  return parseInt(user.id)
}
