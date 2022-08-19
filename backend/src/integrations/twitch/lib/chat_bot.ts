import { AuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'

export async function createChatClient(
  authProvider: AuthProvider
): Promise<ChatClient | null> {
  if (process.env.TWITCH_STREAMER_CHANNEL === undefined) return null
  console.log('Creating chat bot instance...')
  const chatClient = new ChatClient({
    authProvider,
    channels: [process.env.TWITCH_STREAMER_CHANNEL]
  })
  await chatClient.connect().then(() => {
    console.log('Connected to chat')
  })
  return chatClient
}
