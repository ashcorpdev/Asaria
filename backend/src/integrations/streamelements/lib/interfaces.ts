export interface SEWebsocketEvent {
  _id: string
  channel: string
  type: string
  provider: string
  flagged: boolean
  data: SEWebsocketEventData
}

export interface SEWebsocketEventData {
  tipId: string
  username: string
  providerId: string
  displayName: string
  amount: number
  stream: number
  tier: string
  currency: string
  quantity: number
  items: string[]
  avatar: string
}
