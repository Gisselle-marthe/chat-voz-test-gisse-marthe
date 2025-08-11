/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue"
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module "*.svg" {
  const content: string
  export default content
}

declare module "*.png" {
  const content: string
  export default content
}

declare module "*.jpg" {
  const content: string
  export default content
}
