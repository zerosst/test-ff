<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && opened" class="drawer-bg" @click="handleClickOutside" />

    <!--backtop-->
    <el-backtop target=".app-wrapper" :visibility-height="100"></el-backtop>

    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <!--Navbar-->
      <div :class="{ 'fixed-header': fixedHeader, 'hide-header': hideHeader }">
        <navbar :primary="primary" />
      </div>
      <!--AppMain-->
      <AppMain />
      <!--RightDrawer-->
      <!-- <RightDrawer v-if="showSetting">
        <div class="setting-item">
          <div class="setting-draw-title">主题风格</div>

          <theme-pick @submit="submitForm"></theme-pick>
          <div class="divider"></div>
        </div>
        <div class="setting-item">
          <div class="setting-draw-title">内容区域</div>
          <content-area @change="handleHeaderChange" @fixedHeader="handleFixedHeaderChange" @sidebarLogo="handleSidebarLogoChange"></content-area>
          <div class="divider"></div>
        </div>
      </RightDrawer>-->
      <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" v-model="setVisible"
        center width="500px" title="设置管理员信息">
        <UserAdd @success="success" />
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeRouteLeave } from 'vue-router'
import { useStore } from '@/store/index'
import { useRouter } from 'vue-router'
import { generateColors, writeNewStyle } from '@/utils'
import useResize from '@/hooks/useResize'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import RightDrawer from './components/RightSetting/RightDrawer.vue'
import ThemePick from './components/RightSetting/themePick/index.vue'
import ContentArea from './components/RightSetting/contentArea/index.vue'
import UserAdd from './components/userAdd.vue'
import Service from './api'
import { clear } from '@/utils/helper'


export default defineComponent({
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    RightDrawer,
    ThemePick,
    ContentArea,
    UserAdd
  },
  setup() {

    const router = useRouter()
    const routeInfo = reactive({
      to: {},
      from: {},
    })

    provide('routeInfo', readonly(routeInfo))

    useResize()
    const store = useStore()
    const originalStyle = ref('')
    const colors = reactive({
      primary: '#fff'
    })
    const state = reactive({
      setVisible: false,
      count: 0,
      x: 0,
      y: 0
    })

    onBeforeMount(async () => {
      const checked = sessionStorage.getItem('checked')
      //先让菜单出来底下404菜单不加载
      store.dispatch('permissionModule/getPermissonRoutes')
      if (checked == null || checked == 'false') {
        // let res = await Service.ckeckActive()
        // sessionStorage.setItem('checked', res.data)
        // if (res.data) {
        //   // 在挂载路由之前，先进行异步路由处理
        //   store.dispatch('permissionModule/getPermissonRoutes')
        //   // store.dispatch('permissionModule/getRoutes')
        // } else {
        //   state.setVisible = true
        // }
      } else {
        store.dispatch('permissionModule/getPermissonRoutes')
      }
      onBeforeUnmount(() => {
        clearTimer()
      })

      // 监听鼠标
      document.onmousemove = (event) => {
        let x1 = event.clientX
        let y1 = event.clientY
        if (state.x !== x1 || state.y !== y1) {
          state.count = 0
        }
        state.x = x1
        state.y = y1
      }
      // 监听键盘
      document.onkeydown = () => {
        state.count = 0
      }
      // 监听Scroll
      document.onscroll = () => {
        state.count = 0
      }

      setTimer()
    })

    const success = () => {
      state.setVisible = false
    }

    const logout = () => {
      if (state.count >= 120 * 60) {
        clear()
        router.replace('/login')
      }
    }

    const cookieTimeout = () => {
      // 判断用户120分钟无操作就自动登出
      let outTime = 120
      state.count++
      if (state.count === outTime * 60) {
        ElMessage.warning('用户长时间未操作，请重新登录')
        setTimeout(logout, 10000)
      }
    }

    const setTimer = () => {
      state.count = 0
      if (!window.myTimer) {
        window.myTimer = window.setInterval(cookieTimeout, 1000)
      }
    }

    const clearTimer = () => {
      clearInterval(window.myTimer)
      window.myTimer = null
    }

    const showSetting = computed(() => store.state.settingsModule.showSettings)
    const opened = computed(() => store.getters['appModule/getSidebarState'])
    const hideHeader = computed(() => store.getters['settingsModule/getHideHeaderState'])
    const fixedHeader = computed(() => store.getters['settingsModule/getFixedHeaderState'])

    const device = computed(() => store.getters['appModule/getDeviceState'])
    const withoutAnimation = computed(() => store.getters['appModule/getSidebarAnimation'])
    const originalStylesheetCount = computed(() => document.styleSheets.length || -1)
    const classObj = computed(() => ({
      hideSidebar: !opened.value,
      openSidebar: opened.value,
      withoutAnimation: withoutAnimation.value,
      mobile: device.value === 'mobile'
    }))
    /**
     * @description 监听device && opend
     * */
    watchEffect(() => {
      if (device.value === 'mobile') {
        store.dispatch('appModule/closeSideBar', { withoutAnimation: false })
      }
    })

    const handleClickOutside = () => {
      store.dispatch('appModule/closeSideBar', { withoutAnimation: false })
    }

    /**
     * @description 切换内容显示
     */
    const handleHeaderChange = () => {
      // 改变state
      store.dispatch('settingsModule/toToggleHeader')
    }
    /**
     * @description 是否固定头部
     */

    const handleFixedHeaderChange = () => {
      // 改变state
      store.dispatch('settingsModule/toToggleFixedHeader')
    }
    const handleSidebarLogoChange = () => {
      // 改变state
      store.dispatch('settingsModule/toToggleSidebarLogo')
    }

    /**
     * @description 切换主题
     */
    const submitForm = (primary: string) => {
      colors.primary = primary
      Object.assign(colors, generateColors(primary))
      writeNewStyle(originalStylesheetCount.value, originalStyle.value, colors)
    }
    // getIndexStyle().then((data: any) => {
    //   originalStyle.value = getStyleTemplate(data)
    // })

    onBeforeRouteLeave((to, from) => {
      Object.assign(routeInfo, { to, from })
    })

    return {
      opened,
      device,
      hideHeader,
      fixedHeader,
      handleClickOutside,
      classObj,
      ...toRefs(colors),
      ...toRefs(state),
      success
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
@import "@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: scroll;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.setting-item {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .setting-draw-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .divider {
    width: 100%;
    display: flex;
    clear: both;
    min-width: 100%;
    margin: 10px 0;

    box-sizing: border-box;
    padding: 0px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    list-style: none;
    line-height: 1.5715;
  }
}

.hide-header {
  display: none;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 63px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
