// Required for initializing the module.

import {
  ClientCredentialsAuthProvider,
  RefreshingAuthProvider
} from '@twurple/auth/lib'
import { ApiClient } from '@twurple/api/lib'
import { ChatClient } from '@twurple/chat/lib'
import { PubSubClient } from '@twurple/pubsub/lib'
import { join } from 'path'
import { logger } from '../../utils/Logger'

export let chatClient: ChatClient
export let pubsubClient: PubSubClient
export let apiClient: ApiClient
let provider: RefreshingAuthProvider | null
let clientProvider: ClientCredentialsAuthProvider | null

export async function init(): Promise<void> {
  const libDir = join(__dirname, 'lib/')
  logger.info('Initialising Twitch Integration')
  const { createRefreshingAuthProvider, createClientCredentialsAuthProvider } =
    await import(join(libDir, 'Auth'))
  logger.info('Creating auth provider...')
  const { createChatClient } = await import(join(libDir, 'ChatBot'))
  logger.info('Creating Chat client...')
  const { createPubSubClient } = await import(join(libDir, 'PubSub'))
  logger.info('Creating PubSub client...')
  const { createApiClient } = await import(join(libDir, 'Api'))
  logger.info('Creating Api client...')
  provider = await createRefreshingAuthProvider()
  clientProvider = await createClientCredentialsAuthProvider()
  chatClient = await createChatClient(provider)
  pubsubClient = await createPubSubClient(provider)
  apiClient = await createApiClient(clientProvider)
}
