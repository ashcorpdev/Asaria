import { AuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage'
import { logger } from '../../../utils/Logger'

export async function createChatClient(
  authProvider: AuthProvider
): Promise<ChatClient | null> {
  if (process.env.TWITCH_STREAMER_CHANNEL === undefined) return null
  logger.info('Creating chat bot instance...')
  const chatClient = new ChatClient({
    authProvider,
    channels: [process.env.TWITCH_STREAMER_CHANNEL]
  })
  await chatClient.connect().then(() => {
    logger.info('Connected to chat')
    createEventListeners(chatClient)
  })
  return chatClient
}

function createEventListeners(chatClient: ChatClient): void {
  logger.info('Starting event listeners for Twitch chat.')
  chatClient.onMessage(
    (
      channel: string,
      user: string,
      message: string,
      msg: TwitchPrivateMessage
    ) => {}
  )
  logger.info('Event listener created.')
}
