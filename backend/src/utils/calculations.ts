import {
  PubSubBitsMessage,
  PubSubSubscriptionMessage
} from '@twurple/pubsub/lib'
import { StreamelementsWebsocketEvent } from '../integrations/streamelements/lib/interfaces'

export function calculatePoints(
  eventData:
    | StreamelementsWebsocketEvent
    | PubSubSubscriptionMessage
    | PubSubBitsMessage
): void {
  console.log(eventData)
}
