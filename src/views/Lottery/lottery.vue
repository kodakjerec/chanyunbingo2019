<template>
  <div>
    <div>
      <div class="award">
        <span>{{award[0]}}</span>
      </div>
      <div class="award">
        <span>{{award[1]}}</span>
      </div>
      <div class="award">
        <span>{{award[2]}}</span>
      </div>
    <div>
      <span class="rolling" v-show="showRolling">假設這是搖獎動畫</span>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'lottery',
  data () {
    return {
      // 人員名單
      frontCandidates: [],
      // 獎項(單一)
      frontAwards: ['提供者/獎項名稱', '獎品', 1], /* ['提供者or獎項名稱', '獎品', 1] */
      // 本次中獎者清單
      frontWinners: [],
      showRolling: false,
      // 目前畫面
      showScreen: 0,
      // webSocket
      webSocket: null,
      webSocketReconnect: null
    }
  },
  created () {
    window.addEventListener('keyup', this.handleKeyDown)
    this.initWebSocket()
  },
  destroyed () {
    window.removeEventListener('keyup', this.handleKeyDown)
    this.webSocket.close() // 离开路由之后断开websocket连接
  },
  mounted () {
    if (localStorage.frontCandidates) {
      this.frontCandidates = JSON.parse(localStorage.frontCandidates)
    }
    if (localStorage.frontAwards) {
      this.frontAwards = JSON.parse(localStorage.frontAwards)
    }
    if (localStorage.frontWinners) {
      this.frontWinners = JSON.parse(localStorage.frontWinners)
    }
  },
  methods: {
    commandAndAction: function (msg) {
      let command = JSON.parse(msg)
      console.log(command)
      let action = command.action
      let data = command.data

      let sendData = {}

      switch (action) {
        // 更新人員
        case 'changeCandidate':
          this.frontCandidates = data
          localStorage.frontCandidates = JSON.stringify(this.frontCandidates)
          sendData = {
            action: 'verbose',
            data: action + ' finish',
            target: 'backend'
          }
          this.websocketsend(JSON.stringify(sendData))
          break
          // 更新獎項
        case 'changeAward':
          this.frontAwards = data
          localStorage.frontAwards = JSON.stringify(this.frontAwards)
          sendData = {
            action: 'verbose',
            data: action + ' finish',
            target: 'backend'
          }
          this.websocketsend(JSON.stringify(sendData))
          break
          // 開始搖獎
        case 'start':
          this.showRolling = true
          break
          // 重新搖獎
        case 'reset':
          this.showRolling = true
          sendData = {
            action: 'reset',
            data: '',
            target: 'backend'
          }
          this.websocketsend(JSON.stringify(sendData))
          break
          // 切換畫面
        case 'changeScreen':
          this.showScreen = parseInt(JSON.parse(data))
          sendData = {
            action: 'frontScreen',
            data: this.showScreen,
            target: 'backend'
          }
          this.websocketsend(JSON.stringify(sendData))
          break
          // 狀態訊息
        case 'verbose':
          console.log(data)
          break
      }
    },
    // 鍵盤偵測
    handleKeyDown: function (event) {
      // console.log(event)
      switch (event.keyCode) {
        case 32: // space
          this.showRolling = false
          break
      }
    },
    initWebSocket () { // 初始化weosocket
      const wsuri = 'ws://192.168.1.104:3000/ws/user'
      this.webSocket = new WebSocket(wsuri)
      this.webSocket.onmessage = this.websocketonmessage
      this.webSocket.onopen = this.websocketonopen
      this.webSocket.onerror = this.websocketonerror
      this.webSocket.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      let actions = {
        action: 'login',
        data: 'front',
        target: 'front'
      }
      this.websocketsend(JSON.stringify(actions))
      this.webSocketReconnect = null
    },
    websocketonerror () { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) { // 数据接收
      this.commandAndAction(e.data)
    },
    websocketsend (Data) { // 数据发送
      this.webSocket.send(Data)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
      if (this.webSocketReconnect !== null) { this.webSocketReconnect = setTimeout(this.initWebSocket(), 1000) }
    }
  }
}
</script>
<style scoped>
.award { color: white}
.winner { color: white}
.rolling { color: red}
</style>
