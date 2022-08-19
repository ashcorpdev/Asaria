// Required for initializing the module.

import { RefreshingAuthProvider } from '@twurple/auth/lib'
import { ChatClient } from '@twurple/chat/lib'
import { PubSubClient } from '@twurple/pubsub/lib'
import { join } from 'path'

export let chatClient: ChatClient
export let pubsubClient: PubSubClient
let provider: RefreshingAuthProvider | null

export async function init(): Promise<void> {
  const libDir = join(__dirname, 'lib/')
  console.log('Initialising Twitch Integration')
  const { createAuthProvider } = await import(join(libDir, 'auth'))
  console.log('Creating auth provider for Twitch')
  const { createChatClient } = await import(join(libDir, 'chat_bot'))
  const { createPubSubClient } = await import(join(libDir, 'pubsub'))
  provider = createAuthProvider()
  chatClient = await createChatClient(provider)
  pubsubClient = await createPubSubClient(provider)
}
