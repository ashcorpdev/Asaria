import { AuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage'
import { sys } from 'typescript'
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
  await chatClient.connect().then(async () => {
    logger.info('Connected to chat')
  })
  await createEventListeners(chatClient)
  return chatClient
}

async function createEventListeners(chatClient: ChatClient): Promise<void> {
  logger.info('Starting event listeners for Twitch chat.')

  chatClient.onMessage(
    (
      channel: string,
      user: string,
      message: string,
      msg: TwitchPrivateMessage
    ) => {
      switch (message) {
        case '!teams':
          sendTeamsList(chatClient, channel, user)
          break
        case '!teamlist':
          sendTeamsList(chatClient, channel, user)
          break
        default:
          break
      }
    }
  )

  chatClient.onDisconnect((manually: boolean, reason?: Error | undefined) => {
    if (!manually) {
      logger.warn('Twitch chat client has disconnected.')
      logger.warn(reason)
      logger.warn('Attempting to reconnect to Twitch chat...')
      chatClient.connect().catch((reason) => {
        logger.error(
          'Failed to connect back to Twitch chat! Restart required...'
        )
        sys.exit()
      })
    }
  })

  logger.info('Event listeners created.')
}

function sendTeamsList(
  chatClient: ChatClient,
  channel: string,
  user: string
): void {
  chatClient
    .say(channel, `@${user}, The available teams are: `)
    .catch((reason) => {
      logger.error('Failed to send chat message.')
      logger.error(reason)
    })
}
