import { Module } from 'vuex'
import messageStateTypes from './types'
import RootStateTypes from '../../types'
import { createSocket, wsUrl } from '@/utils/websocket'
import moment from 'moment'
import Service from './api'

// create a new Store Modules.
const messageModule: Module<messageStateTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    messageNum: 0
  },
  mutations: {
    UPDATE_MESSAGE: (state: messageStateTypes, payload) => {
      state.messageNum = payload.num
    }
  },
  actions: {
    setMessageNum({ commit }, payload: any) {
      Service.personalList().then((res) => {
        commit('UPDATE_MESSAGE', { num: res.data })
      })
    },
    updateMessageNum({ commit }) {
      let UUID = moment(new Date()).format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000000000).toString()
      createSocket(`${wsUrl}websocket/${UUID}/${sessionStorage.getItem('bizUid')}`)
    }
  },
  getters: {
    getMessageNum(state: messageStateTypes) {
      return state.messageNum
    }
  }
}
export default messageModule
