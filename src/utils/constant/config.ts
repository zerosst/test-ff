declare type formulaType = {
  [key: string]: any
}
export const formula: formulaType = {
  'shade-1': 'color(primary shade(10%))',
  'light-1': 'color(primary tint(10%))',
  'light-2': 'color(primary tint(20%))',
  'light-3': 'color(primary tint(30%))',
  'light-4': 'color(primary tint(40%))',
  'light-5': 'color(primary tint(50%))',
  'light-6': 'color(primary tint(60%))',
  'light-7': 'color(primary tint(70%))',
  'light-8': 'color(primary tint(80%))',
  'light-9': 'color(primary tint(90%))'
}

export const langConfig = {
  header: {
    switch: '切换主题色',
    download: '下载主题',
    help: '帮助',
    fullScreen: '全屏预览',
    exitFullScreen: '退出全屏',
    user: {
      homePage: '首页',
      personalCenter: '个人中心',
      personalSetting: '个人设置',
      logout: '退出登录'
    }
  },
  form: {
    theme: '主题色',
    headerArea: '顶栏',
    sidebarLogo: '侧边栏 logo',
    headerFixed: '固定顶栏',
    switch: '切换',
    reset: '重置'
  },
  home: {
    internationTip: '切换语言可进行国际化'
  },
  breadcrumb: {
    main: '首页',
    project: '项目'
  }
}

export default { formula, langConfig }
