import { createApp } from 'vue'
// import { isPermission } from '@/directive/permission'
// import { AuthConsumer } from '@/utils/buttonAuth'
// import { formatMoney } from '@/utils/helper'
import { key, store } from './store/index'
import router from './router/index'
import App from './App.vue'
import '@/styles/index.scss' // global css
import '@/permission' // permission control 全局路由守卫
import 'dayjs/locale/zh-cn'
import Hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

// import '@/mock'
// const auth = sessionStorage.getItem('bizAuth')
// if (auth) {
//   // 在挂载路由之前，先进行异步路由处理
//   store.dispatch('permissionModule/getPermissonRoutes')
// }
store.dispatch('permissionModule/getRoutes')
// 链式注册插件
// 1、挂载vuex
// 2、挂载路由
const app = createApp(App).use(store, key).use(router)
// 挂载全局方法 isPermission
// app.config.globalProperties.$isPermission = isPermission
app.config.globalProperties.$AuthConsumer = AuthConsumer
app.config.globalProperties.$FormatMoney = formatMoney
//注册全局自定义指令
app.directive('money', {
  mounted(el, binding) {
    let els = el.tagName.toLocaleUpperCase() === 'INPUT' ? el : el.querySelector('input') ? el.querySelector('input') : null
    console.log(binding.value)
    els.value = formatMoney(binding.value)
    els.addEventListener('focus', function () {
      els.value = formatMoney(els.value, '0')
    })
    els.addEventListener('blur', function () {
      els.value = formatMoney(els.value)
    })
  },
  updated(el, binding) {
    let els = el.tagName.toLocaleUpperCase() === 'INPUT' ? el : el.querySelector('input') ? el.querySelector('input') : null
    if (binding.oldValue == undefined || binding.oldValue == '') {
      els.value = formatMoney(binding.value)
    }
  }
})
app.directive('highlight', {
  beforeMount(el, binding, vnode) {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach((block: any) => {
      Hljs.highlightBlock(block)
    })
  }
})
//挂载公共组件
const modulesFiles: any = import.meta.globEager('./components/public/*/*.vue')
const publicComponent = Object.keys(modulesFiles).filter((item: any) => true)
publicComponent.forEach((item: any) => {
  const componentConfig = modulesFiles[item]
  const moduleName = componentConfig.default.name
  app.component(moduleName, componentConfig.default || componentConfig)
})
// 现在所有的导航都是异步的，等路由ready以后再进行挂载组件；
router.isReady().then(() => app.mount('#app'))

// 在导航期间每次发生未捕获的错误时都会调用该处理程序
// eslint-disable-next-line no-console
router.onError((err) => {
  console.error(err)
})
