import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { ComponentCustomProperties } from 'vue'

interface NotifyOptions {
  type?: 'success' | 'error' | 'info'
  text?: string
  title?: string
  duration?: number
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $loading: {
      show: () => void
      hide: () => void
    }
    $notify: (NotifyOptions) => void
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}
