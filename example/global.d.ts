import '@emotion/react'
import type { WorkRailsTheme } from '@workrails/ui'


declare module '@emotion/react' {
  export interface Theme extends WorkRailsTheme {}
}
