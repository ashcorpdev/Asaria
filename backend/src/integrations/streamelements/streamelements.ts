import { logger } from '../../utils/Logger'
// Due to Streamelements using an outdated version of the Socket.io server, there are no type definitions (so explicit any is required).
import io = require('socket.io-client')
import { SEWebsocketEvent } from './lib/Interfaces'
import { getTwitchId } from '../twitch/lib/Api'

let socket

// Required for initializing the module.
export function init(): void {
  logger.info('Initialising Streamelements Integration')
  createWebsocketClient().catch((error) => {
    logger.error(`Failed to create Websocket client for Streamelements.`)
    logger.error(error)
  })
}

export async function createWebsocketClient(): Promise<void> {
  if (process.env.SE_JWT_TOKEN === undefined) {
    logger.warn(
      `JWT Token is missing - cannot integrate with Streamelements. Tip functionality will be disabled!`
    )
  } else {
    logger.debug('Creating new socket connection to Streamelements...')
    socket = io('https://realtime.streamelements.com', {
      transports: ['websocket'],
      timeout: 60000
    })
    createWebsocketListeners(socket)
  }
}

function createWebsocketListeners(socket: any): void {
  socket.on('connection', (socketInstance: any) => {
    logger.debug(`New connection opened to Streamelements`)
    logger.debug(socketInstance)
  })
  socket.on('connect', () => {
    logger.info('Established a connection to Streamelements.')
    if (process.env.SE_JWT_TOKEN !== undefined) {
      logger.debug('Sending authentication request to Streamelements server...')
      socket.emit('authenticate', {
        method: 'jwt',
        token: process.env.SE_JWT_TOKEN
      })
    }
  })
  socket.on('disconnect', (res: any) => {
    logger.warn(
      'Streamelements socket has disconnected. Attempting to re-connect to the socket. If this fails, you need to restart the application.'
    )
    logger.warn(res)
    createWebsocketClient().catch((error) => {
      logger.error(
        'Failed to re-create the connection. Application is exiting...'
      )
      logger.debug(error)
      process.exit()
    })
  })
  socket.on('connect_error', (err: any) => {
    logger.error('Failed to connect to the Streamelements socket properly.')
    logger.debug(err)
    logger.warn(
      `Application can continue, but tip functionality will be disabled.`
    )
  })
  socket.on('authenticated', (res: any) => {
    logger.info('Streamelements succesfully authenticated.')
  })
  socket.on('unauthorized', (err: any) => {
    logger.error(`System was unable to authenticate against Streamelements`)
    logger.error(err)
  })
  socket.on('event', (eventData: SEWebsocketEvent) => {
    logger.debug('New Streamelements event received.')
    logger.debug(eventData)
    processStreamelementsEvent(eventData).catch((error) => logger.error(error))
  })
}

async function processStreamelementsEvent(
  eventData: SEWebsocketEvent
): Promise<void> {
  if (eventData.type === 'tip') {
    const userId = await getTwitchId(eventData.data.username)
    if (userId == null) return
    const tipAmount = eventData.data.amount
    logger.debug(
      `Received new tip from ${eventData.data.displayName} (${userId}): ${tipAmount}${eventData.data.currency}`
    )
  }
}
