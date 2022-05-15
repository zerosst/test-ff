declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-china-area-data' {
  export const provinceAndCityData: any
  export const CodeToText: any
  export const TextToCode: any
}
declare module 'vkbeautify'
declare module 'vue-cropper'
declare module 'highlight.js'
