import { AuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage'
import { createUserInDatabase } from '../../../db/Database'
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
      const fullCommandString: string[] = message.split(' ')
      const primaryCommand: string = fullCommandString[0]
      switch (primaryCommand) {
        case '!teams':
          sendTeamsList(chatClient, channel, user)
          break
        case '!teamlist':
          sendTeamsList(chatClient, channel, user)
          break
        case '!join':
          addUserToTeam(chatClient, channel, user, fullCommandString).catch(
            (error) => logger.error(error)
          )
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
      if (process.env.TWITCH_STREAMER_CHANNEL !== undefined) {
        chatClient.join(process.env.TWITCH_STREAMER_CHANNEL).catch((reason) => {
          logger.error(
            'Failed to connect back to Twitch chat! Restart required...'
          )
          logger.error(reason)
          sys.exit()
        })
      }
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
    .say(
      channel,
      `@${user}, The available teams are: Eternal Flame (eternalflame), Winter's Embrace (wintersembrace), Ethereal Bloom (etherealbloom) and Shadow Grove (shadowgrove)! To join a team, type !join <team_name> - eg. !join eternalflame`
    )
    .catch((reason) => {
      logger.error('Failed to send chat message.')
      logger.error(reason)
    })
}

async function addUserToTeam(
  chatClient: ChatClient,
  channel: string,
  user: string,
  args: string[]
): Promise<boolean> {
  switch (args[1]) {
    case 'eternalflame':
      return await createUserInDatabase(user, 'Eternal Flame')
    case 'wintersembrace':
      return await createUserInDatabase(user, "Winter's Embrace")
    case 'etherealbloom':
      return await createUserInDatabase(user, 'Ethereal Bloom')
    case 'shadowgrove':
      return await createUserInDatabase(user, 'Shadow Grove')
    default:
      return false
  }
}
