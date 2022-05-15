/* eslint-disable no-restricted-syntax */
import { Module } from 'vuex'
import router, { constantRoutes, asyncRoutes } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import permissionStateTypes from './types'
import RootStateTypes from '../../types'
import Service from './api'

const roles = sessionStorage.getItem('role') || ''
// create a new Store Modules.
const permissionModule: Module<permissionStateTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    roles, // 用户包含的角色,
    permissions: [], // 用户指定局部操作权限
    accessRoutes: [], // 可访问路由集合
    routes: constantRoutes, // 所有路由集合
    authedRoutes: []
  },
  mutations: {
    setRoles: (state: permissionStateTypes, { roleName }) => {
      state.roles = roleName
    },
    setAccessRoutes: (state: permissionStateTypes, routes) => {
      state.accessRoutes = routes
    },
    setRoutes: (state: permissionStateTypes, routes) => {
      state.routes = constantRoutes.concat(routes)
    },
    setAuthedRoutes: (state: permissionStateTypes, authedRoutes: string[]) => {
      state.authedRoutes = authedRoutes
      sessionStorage.setItem('authedRoutes', JSON.stringify(authedRoutes))
    },
    setPermissions: (state: permissionStateTypes, permissions: string[]) => {
      state.permissions = permissions
    }
  },
  actions: {
    // 异步接口请求，动态添加路由
    getPermissonRoutes({ commit }, payload: any) {
      // 后端根据角色，查询授权菜单
      Service.postAuthPermission().then((res) => {
        const authedRoutes = Array.isArray(res.data) ? res.data : []
        commit('setAuthedRoutes', authedRoutes)
        // 过滤只显示授权菜单
        const accessedRoutes: RouteRecordRaw[] = []
        for (const i of authedRoutes) {
          for (const item of asyncRoutes) {
            if (item.path === i.path) {
              accessedRoutes.push(item)
            }
          }
        }
        // console.log(authedRoutes)
        //左侧路由导航
        // commit('setAccessRoutes', authedRoutes)
        // 动态添加路由  vue-router4.x 暂时没有addRoutes
        router.isReady().then(() => {
          accessedRoutes.forEach((route: RouteRecordRaw) => {
            const routeName: any = route.name
            if (!router.hasRoute(routeName)) {
              router.addRoute(route)
            }
          })
          router.options.routes = constantRoutes.concat(accessedRoutes)
          commit('setAccessRoutes', authedRoutes)
        })
      })
    },
    getPermissions({ commit }) {
      // 后端根据角色名称，查询授权菜单
      Service.postPermissions({}).then((res) => {
        const { permissions } = res.data
        console.log(permissions)
        commit('setPermissions', permissions)
      })
    },

    getRoutes({ commit }) {
      // api request
      // 动态添加路由  vue-router4.x 暂时没有addRoutes
      if (sessionStorage.getItem('authedRoutes')) {
        const authedRoutes = JSON.parse(sessionStorage.getItem('authedRoutes') as string)
        const accessedRoutes: RouteRecordRaw[] = []
        for (const path of authedRoutes) {
          for (const item of asyncRoutes) {
            if (item.path === path.path) {
              accessedRoutes.push(item)
            }
          }
        }
        //路由权限
        accessedRoutes.forEach((route: RouteRecordRaw) => {
          const routeName: any = route.name
          if (!router.hasRoute(routeName)) {
            router.addRoute(route)
          }
        })
      } else {
        asyncRoutes.forEach((route: RouteRecordRaw) => {
          const routeName: any = route.name
          if (!router.hasRoute(routeName)) {
            router.addRoute(route)
          }
        })
      }
      commit('setRoutes', asyncRoutes)
    },
    // 授权角色
    getPermissonRoles({ commit }, payload: any) {
      // api request
      sessionStorage.setItem('role', payload.roleName)
      commit('setRoles', payload)
    }
  },
  getters: {
    getAccessRoutes(state: permissionStateTypes) {
      return state.routes
    },
    authedRoutes(state: permissionStateTypes) {
      return state.authedRoutes
    },
    getRoles(state: permissionStateTypes) {
      return state.roles
    },
    getPermission(state: permissionStateTypes) {
      return state.permissions
    }
  }
}
export default permissionModule
