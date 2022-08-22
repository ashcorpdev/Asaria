import { AuthProvider } from '@twurple/auth'
import { PubSubClient, PubSubSubscriptionMessage } from '@twurple/pubsub'
import { logger } from '../../../utils/Logger'

export async function createPubSubClient(
  authProvider: AuthProvider
): Promise<PubSubClient> {
  logger.info('Creating pubsub client instance...')

  const pubsubClient = new PubSubClient()
  const userId = await pubsubClient.registerUserListener(authProvider).then()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const listener = await pubsubClient.onSubscription(
    userId,
    (message: PubSubSubscriptionMessage) => {
      logger.info(`${message.userDisplayName} just subscribed!`)
    }
  )

  logger.info('Pubsub Client listening')

  return pubsubClient
}
