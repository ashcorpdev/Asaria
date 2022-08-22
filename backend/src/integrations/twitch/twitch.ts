// Required for initializing the module.

import { RefreshingAuthProvider } from '@twurple/auth/lib'
import { ChatClient } from '@twurple/chat/lib'
import { PubSubClient } from '@twurple/pubsub/lib'
import { join } from 'path'
import { logger } from '../../utils/Logger'

export let chatClient: ChatClient
export let pubsubClient: PubSubClient
let provider: RefreshingAuthProvider | null

export async function init(): Promise<void> {
  const libDir = join(__dirname, 'lib/')
  logger.info('Initialising Twitch Integration')
  const { createAuthProvider } = await import(join(libDir, 'Auth'))
  logger.info('Creating auth provider for Twitch')
  const { createChatClient } = await import(join(libDir, 'ChatBot'))
  const { createPubSubClient } = await import(join(libDir, 'PubSub'))
  provider = createAuthProvider()
  chatClient = await createChatClient(provider)
  pubsubClient = await createPubSubClient(provider)
}
