<template>
  <div class="navbar">
    <el-header height="50px">
      <hamburger id="Hamburger" :is-active="opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb class="breadcrumb-container" />
      <div class="right-menu">
        <!-- <search></search> -->
        <!-- <lang-switch></lang-switch> -->
        <div id="Message">
          <el-badge :value="messageNum" :max="99" class="message-badge" type="danger">
            <el-button @click="goMessage" class="message">
              <i-ep-bell-filled />
            </el-button>
          </el-badge>
          <!-- <el-dropdown> -->
          <!-- <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a">mike 回复了你的邮件</el-dropdown-item>
                <el-dropdown-item command="b">您有5个新任务</el-dropdown-item>
                <el-dropdown-item command="c">您已经和Jone成为了好友</el-dropdown-item>
                <el-dropdown-item command="d">项目验收通知</el-dropdown-item>
                <el-dropdown-item command="e" divided>新会议通知</el-dropdown-item>
              </el-dropdown-menu>
          </template>-->
          <!-- </el-dropdown> -->
        </div>
        <el-button id="fullScreen" class="full-screen">
          <el-tooltip :content="langConfig.header.fullScreen" effect="dark" placement="left">
            <i-ep-full-screen v-show="fullScreen == false" @click="toShowFullScreen()" />
          </el-tooltip>
          <el-tooltip :content="langConfig.header.exitFullScreen" effect="dark" placement="left">
            <i-ep-bottom-left v-show="fullScreen == true" @click="toExitFullScreen()"></i-ep-bottom-left>
          </el-tooltip>
        </el-button>
        <el-dropdown class="avatar-container" trigger="hover">
          <div class="avatar-wrapper">
            <div class="nickname">{{ nickname }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown">
              <router-link to="/">
                <el-dropdown-item>{{ langConfig.header.user.homePage }}</el-dropdown-item>
              </router-link>
              <router-link to="/sys/personmessage">
                <el-dropdown-item divided>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span style="display: block" @click="logout">{{ langConfig.header.user.logout }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-dialog append-to-body v-model="visible" title="下载通知" width="30%">
      <span v-html="content"></span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Hamburger from '@/components/Hamburger/Hamburger.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Search from '@/components/Search/index.vue'
import LangSwitch from '@/components/LangSwitch/index.vue'
import { toFullScreen, exitFullScreen } from '@/utils/screen'
import { useStore } from '@/store/index'
import { langConfig } from '@/utils/constant/config'
import { clear } from '@/utils/helper'

export default defineComponent({
  name: 'Navbar',
  components: {
    Hamburger,
    Breadcrumb,
    Search,
    LangSwitch
  },
  props: {
    primary: {
      default: '#fff',
      type: String
    }
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const opened = computed(() => store.getters['appModule/getSidebarState'])
    const fullScreen = ref(false)
    const messageNum = computed(() => store.getters['messageModule/getMessageNum'])
    const nickname = computed(() => sessionStorage.getItem('bizNickName') ?? '游客')
    const state = reactive({
      visible: false,
      content: ''
    })
    // methods
    const toggleSideBar = () => {
      store.dispatch('appModule/toggleSideBar')
    }

    const toShowFullScreen = () => {
      toFullScreen()
      fullScreen.value = true
    }

    const toExitFullScreen = () => {
      exitFullScreen()
      fullScreen.value = false
    }
    const logout = () => {
      clear()
      router.replace('/login')
    }

    const goMessage = () => {
      router.replace('/sys/message')
    }

    // 接收消息
    const getsocketData = (e: any) => {
      // 创建接收消息函数
      // personalList()
      const data = e && JSON.parse(e.detail.data)
      console.log(data)
      if (data.msgTitle === '下载通知') {
        state.visible = true
        state.content = data.msgContent
      }
    }

    //查询未读消息
    const personalList = () => {
      store.dispatch('messageModule/setMessageNum')
    }

    onMounted(() => {
      store.dispatch('messageModule/updateMessageNum')
      window.addEventListener('onmessageWS', getsocketData)
      // personalList()
    })

    return {
      messageNum,
      goMessage,
      toShowFullScreen,
      toExitFullScreen,
      toFullScreen,
      exitFullScreen,
      fullScreen,
      nickname,
      avatar,
      toggleSideBar,
      opened,
      langConfig,
      logout,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.28);
  z-index: 1;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .nickname {
    float: right;
    padding: 0px 25px 0px 25px;
    line-height: 40px;
    outline: none;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .message-badge {
      .is-fixed {
        top: 12px !important;
        right: 28px !important;
      }

      .message {
        border: none;
        padding: 5px 20px;

        i {
          background-color: transparent;
          border: none;
          color: #2c3e50;
          font-size: 25px;
        }
      }
    }

    .full-screen {
      background-color: transparent;
      border: none;
      padding: 5px 20px;

      i {
        background-color: transparent;
        border: none;
        color: #2c3e50;
        font-size: 28px;
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        cursor: pointer;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
