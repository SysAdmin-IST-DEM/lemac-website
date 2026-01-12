import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Skip auth/logging interceptors, etc. */
    skipInterceptor?: boolean
  }
  interface InternalAxiosRequestConfig {
    skipInterceptor?: boolean
  }
}

export {}
