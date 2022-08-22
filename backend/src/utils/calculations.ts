import {
  PubSubBitsMessage,
  PubSubSubscriptionMessage
} from '@twurple/pubsub/lib'
import { StreamelementsWebsocketEvent } from '../integrations/streamelements/lib/Interfaces'
import { logger } from '../utils/Logger'

export function calculatePoints(
  eventData:
    | StreamelementsWebsocketEvent
    | PubSubSubscriptionMessage
    | PubSubBitsMessage
): void {
  logger.info(eventData)
}
