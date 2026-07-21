import type LuxonAdapter from '@date-io/luxon'
import 'vuetify'

declare module 'vuetify' {
  namespace DateModule {
    interface Adapter extends LuxonAdapter {}
  }
}
