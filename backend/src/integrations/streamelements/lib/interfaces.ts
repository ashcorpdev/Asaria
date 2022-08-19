export interface StreamelementsWebsocketEvent {
  schema: string
  title: string
  type: string
  properties: StreamelementsWebsocketEventProperties
  required: string[]
}

export interface StreamelementsWebsocketEventProperties {
  id: ID
  channel: ID
  type: Provider
  provider: Provider
  flagged: Flagged
  data: Data
  createdAt: CreatedAt
  updatedAt: CreatedAt
}

export interface ID {
  type: string
  pattern: string
  example?: string
  description: string
}

export interface CreatedAt {
  type: string
  format: string
  description: string
}

export interface Data {
  type: string
  properties: DataProperties
  required: string[]
}

export interface DataProperties {
  tipID: ID
  username: ID
  providerID: CreatedAt
  displayName: Amount
  amount: Amount
  streak: Amount
  tier: Provider
  currency: ID
  message: Amount
  quantity: Flagged
  items: PropertiesItems
  avatar: CreatedAt
}

export interface Amount {
  type: string
  description: string
}

export interface PropertiesItems {
  type: string
  items: ItemsItems
  description: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ItemsItems {}

export interface Flagged {
  type: string
}

export interface Provider {
  enum: string[]
  description: string
}
