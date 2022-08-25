import { AuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage'
import {
  createUserInDatabase,
  isUserInDatabase,
  getUserPoints,
  addPointsToUser
} from '../../../db/Database'
import { logger } from '../../../utils/Logger'
import { systemReady } from '../../../index'

export async function createChatClient(
  authProvider: AuthProvider
): Promise<ChatClient | null> {
  if (process.env.TWITCH_STREAMER_CHANNEL === undefined) return null
  logger.debug('Creating new chat bot instance...')
  const chatClient = new ChatClient({
    authProvider,
    channels: [process.env.TWITCH_STREAMER_CHANNEL]
  })
  await chatClient.connect().then(async () => {
    logger.info('Succesfully connected to Twitch chat.')
  })
  await createEventListeners(chatClient)
  return chatClient
}

async function createEventListeners(chatClient: ChatClient): Promise<void> {
  logger.debug('Starting event listeners for Twitch chat.')

  chatClient.onMessage(
    (
      channel: string,
      user: string,
      message: string,
      msg: TwitchPrivateMessage
    ) => {
      if (systemReady) {
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
            addUserToAlliance(
              chatClient,
              channel,
              user,
              fullCommandString
            ).catch((error) => logger.error(error))
            break
          case '!points':
            getPointsFromDB(chatClient, channel, user).catch((error) =>
              logger.error(error)
            )
            break
          case '!addpoints':
            if (
              user === 'ashen' &&
              process.env.NODE_ENV !== undefined &&
              process.env.NODE_ENV === 'development'
            ) {
              const userToAddPointsTo = fullCommandString[1]
              const pointsToAdd = parseInt(fullCommandString[2])
              if (
                userToAddPointsTo === undefined ||
                pointsToAdd === undefined
              ) {
                chatClient
                  .say(channel, `[DEBUG] @${user}, failed to add user points!`)
                  .catch((error) => logger.error(error))
              } else {
                addPointsToUser(userToAddPointsTo, pointsToAdd)
                  .then(() => {
                    chatClient
                      .say(
                        channel,
                        `[DEBUG] @${user}, added ${pointsToAdd} points to ${userToAddPointsTo}'s points total.`
                      )
                      .catch((error) => logger.error(error))
                  })
                  .catch((error) => logger.error(error))
              }
            }
            break
          default:
            break
        }
      }
    }
  )

  chatClient.onDisconnect((manually: boolean, reason?: Error | undefined) => {
    if (!manually) {
      logger.warn('Twitch chat client has disconnected.')
      logger.debug(reason)
      logger.warn(
        'Attempting to reconnect to Twitch chat. If this fails, you should restart.'
      )
      if (process.env.TWITCH_STREAMER_CHANNEL !== undefined) {
        // Chat client has disconnected - try and reconnect to ensure a stable connection, otherwise crash.
        chatClient.reconnect().catch((reason) => {
          logger.error(
            'Failed to connect back to Twitch chat! Restart required...'
          )
          logger.debug(reason)
          process.exit()
        })
      }
    }
  })

  logger.debug('Event listeners created.')
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

async function getPointsFromDB(
  chatClient: ChatClient,
  channel: string,
  user: string
): Promise<void> {
  let points: number = 0
  const userInDB = await isUserInDatabase(user)
  if (userInDB) {
    // Get the users' points
    const result = await getUserPoints(user)
    if (result !== null) {
      points = result
    }
  } else {
    // Create the user in the database and return 0 points.
    await createUserInDatabase(user, undefined)
    points = 0
  }

  await chatClient.say(channel, `@${user} - you have ${points} points!`)
}

async function addUserToAlliance(
  chatClient: ChatClient,
  channel: string,
  user: string,
  args: string[]
): Promise<boolean> {
  switch (args[1]) {
    case 'eternalflame':
      return await processAddUserCommand(
        chatClient,
        channel,
        user,
        'Eternal Flame'
      )
    case 'wintersembrace':
      return await processAddUserCommand(
        chatClient,
        channel,
        user,
        "Winter's Embrace"
      )
    case 'etherealbloom':
      return await processAddUserCommand(
        chatClient,
        channel,
        user,
        'Ethereal Bloom'
      )
    case 'shadowgrove':
      return await processAddUserCommand(
        chatClient,
        channel,
        user,
        'Shadow Grove'
      )
    default:
      return false
  }
}

async function processAddUserCommand(
  chatClient: ChatClient,
  channel: string,
  user: string,
  allianceName: string
): Promise<boolean> {
  const result = await createUserInDatabase(user, allianceName)
  if (result) {
    chatClient
      .say(channel, `@${user}, you joined ${allianceName}!`)
      .catch((error) => logger.error(error))
    return true
  }
  chatClient
    .say(
      channel,
      `Sorry, I wasn't able to add you to ${allianceName}, @${user}!`
    )
    .catch((error) => logger.error(error))
  return false
}
