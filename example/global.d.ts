import '@tools/wr-catalog-base'
import '@emotion/react'
import { WorkRailsTheme } from '@workrails/ui'
import type jsforce from 'jsforce'

declare module '@workrails/catalog-base' {
  export interface CartFormValues {}

  export interface CartItemData {}

  export interface CartTotal {}
}
declare module '@emotion/react' {
  export interface Theme extends WorkRailsTheme {}
}

declare global {
  interface Window {
    wrBox?: {
      userId: string
      catalogId?: string
      accessToken?: string
      opportunityId?: string
      quoteId?: string
      authToken?: string
    }

    logo?: string

    DocEditor?: {
      instances?: {
        [key: string]: any
      }
    }

    sfConnection: jsforce.Connection
    jsforce: typeof jsforce
  }
}
