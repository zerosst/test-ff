let Socket = ''
let setIntervalWesocketPush: NodeJS.Timeout | null = null
let socketurl = ''
let time = 30000
/**
 * 建立websocket连接
 * @param {string} url ws地址
 */
export const createSocket = (url: string) => {
  socketurl = url
  Socket && Socket.close()
  if (!Socket) {
    console.log('建立websocket连接')
    Socket = new WebSocket(socketurl)
    Socket.onopen = onopenWS
    Socket.onmessage = onmessageWS
    Socket.onerror = onerrorWS
    Socket.onclose = oncloseWS
  } else {
    console.log('websocket已连接')
  }
}

/**打开WS之后发送心跳 */
const onopenWS = () => {
  sendPing()
}

/**连接失败重连 */
const onerrorWS = () => {
  Socket.close()
  clearInterval(setIntervalWesocketPush)
  console.log('连接失败重连中')
  if (Socket.readyState !== 3) {
    Socket = null
    createSocket(socketurl)
  }
}

/**WS数据接收统一处理 */
const onmessageWS = (e: { data: any }) => {
  window.dispatchEvent(
    new CustomEvent('onmessageWS', {
      detail: {
        data: e.data
      }
    })
  )
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = (message: any) => {
  setTimeout(() => {
    if (Socket.readyState === 0) {
      connecting(message)
    } else {
      Socket.send(JSON.stringify(message))
    }
  }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = (message: any) => {
  if (Socket !== null && Socket.readyState === 3) {
    Socket.close()
    createSocket(socketurl)
  } else if (Socket.readyState === 1) {
    Socket.send(JSON.stringify(message))
  } else if (Socket.readyState === 0) {
    connecting(message)
  }
}

/**断开重连 */
const oncloseWS = () => {
  clearInterval(setIntervalWesocketPush)
  console.log('websocket已断开....正在尝试重连')
  if (Socket.readyState !== 2) {
    Socket = null
    if (time < 120000) {
      time += 10000
      setTimeout(() => {
        createSocket(socketurl)
      }, time)
    }
  }
}
/**发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
export const sendPing = (time = 60000, ping = 'ping') => {
  clearInterval(setIntervalWesocketPush)
  Socket.send(ping)
  setIntervalWesocketPush = setInterval(() => {
    Socket.send(ping)
  }, time)
}

// export const wsUrl = 'ws://106.3.22.214:8081/' //uat
export const wsUrl = 'wss://hrext.cec-scf.com.cn:8086/' //生产
// export const wsUrl = 'ws://106.3.24.15:8081/' //生产
