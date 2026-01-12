/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

type VueComponentCtor<Props = any> =
  abstract new (...args: any[]) => { $props: Props };

type PropsOf<Ctor extends VueComponentCtor> =
  Ctor extends VueComponentCtor<infer P> ? P : never;

type PropOrDefault<
  T,
  K extends PropertyKey,
  D
> = K extends keyof T ? T[K] : D;

type EnsureProp<
  T,
  K extends PropertyKey,
  D
> = Omit<T, K> & {
  [P in K]: PropOrDefault<T, P, D>;
};