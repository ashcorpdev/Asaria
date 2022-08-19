import { AuthProvider } from '@twurple/auth'
import { PubSubClient, PubSubSubscriptionMessage } from '@twurple/pubsub'

export async function createPubSubClient(
  authProvider: AuthProvider
): Promise<PubSubClient> {
  console.log('Creating pubsub client instance...')

  const pubsubClient = new PubSubClient()
  const userId = await pubsubClient.registerUserListener(authProvider).then()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const listener = await pubsubClient.onSubscription(
    userId,
    (message: PubSubSubscriptionMessage) => {
      console.log(`${message.userDisplayName} just subscribed!`)
    }
  )

  console.log('Pubsub Client listening')

  return pubsubClient
}
