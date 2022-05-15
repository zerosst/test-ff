import { Module } from 'vuex'
import dictStateTypes from './types'
import RootStateTypes from '../../types'
import Service from './api'

const state: any = {}
const mutations = {
  getDicData(state: { [x: string]: any }, data: { dicCodes: string | number; res: any }) {
    state[data.dicCodes] = data.res
  }
}
const actions = {
  async getDicData(context: { commit: (arg0: string, arg1: { dicCodes: any; res: any }) => void }, dicCodes: string | any[]) {
    for (let i = 0; i < dicCodes.length; i++) {
      if (state[dicCodes[i]] == undefined) {
        const res = await Service.getDicts({ dicCode: dicCodes[i], pageNum: 1, pageSize: 100 })
        const data = res.data.records
        context.commit('getDicData', { dicCodes: dicCodes[i], res: data })
      }
    }
  }
}
const getters = {
  getDict(state: any) {
    return state
  }
}
// create a new Store Modules.
const appModule: Module<dictStateTypes, RootStateTypes> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
export default appModule
