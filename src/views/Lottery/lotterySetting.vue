<template>
  <div>
    <div class="buttonGroupScreen">
      <div class="title"><span>切換前端畫面</span></div>
      <div :class="[ frontScreen === 0? 'buttonActive':'button' ]" @click.prevent="tellFrontCommand('changeScreen','0')">主畫面</div>
      <div :class="[ frontScreen === 1? 'buttonActive':'button' ]" @click.prevent="tellFrontCommand('changeScreen','1')">抽獎</div>
      <div :class="[ frontScreen === 2? 'buttonActive':'button' ]" @click.prevent="tellFrontCommand('changeScreen','2')">黑畫面</div>
    </div>
    <div class="buttonGroupScreen">
      <div class="title"><span>功能</span></div>
      <div :class="[ functionScreen === 0? 'buttonActive':'button' ]" @click.prevent="functionScreen = 0">人員</div>
      <div :class="[ functionScreen === 1? 'buttonActive':'button' ]" @click.prevent="functionScreen = 1">獎項</div>
      <div :class="[ functionScreen === 2? 'buttonActive':'button' ]" @click.prevent="functionScreen = 2">中獎名單</div>
      <div class="title"><span>==========</span></div>
    </div>
    <div>
      <settingCandidate v-show="functionScreen === 0" @done="sendCandidate">
      </settingCandidate>
      <settingAward v-show="functionScreen === 1" @done="sendAward">
      </settingAward>
    </div>
  </div>
</template>

<script>
import settingCandidate from './components/settingCandidate'
import settingAward from './components/settingAward'

export default {
  name: 'lotterySetting',
  data () {
    return {
      // 設定這邊的變數名稱是複數型態
      // 獎項清單
      awards: ['提供者/獎項名稱', '獎品', 1], /* ['提供者or獎項名稱', '獎品', 1] */
      // 中獎者名單
      winners: [],
      showRolling: false,
      // 前端畫面
      frontScreen: 0,
      functionScreen: 0,
      // webSocket
      webSocket: null,
      webSocketReconnect: null
    }
  },
  components: {
    settingCandidate,
    settingAward
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.webSocket.close() // 离开路由之后断开websocket连接
  },
  mounted () {
    if (localStorage.awards) {
      this.awards = JSON.parse(localStorage.awards)
    }
    if (localStorage.winners) {
      this.winners = JSON.parse(localStorage.winners)
    }
  },
  methods: {
    tellFrontCommand: function (action, data) {
      let sendData = {
        action: action,
        data: data,
        target: 'front'
      }
      this.websocketsend(JSON.stringify(sendData))
    },
    commandAndAction: function (msg) {
      let command = JSON.parse(msg)
      console.log(command)
      let action = command.action
      let data = command.data
      switch (action) {
        // 更新獎項
        case 'changeAward':
          this.award = data
          break
          // 開始搖獎
        case 'start':
          this.showRolling = true
          break
          // check 前端 重新搖獎
        case 'reset':
          console.log('finish 搖獎')
          break
          // check 前端 切換畫面
        case 'frontScreen':
          this.frontScreen = parseInt(JSON.parse(data))
          break
          // 狀態訊息
        case 'verbose':
          console.log(data)
          break
      }
    },
    sendCandidate: function (result) {
      let data = {
        action: 'changeCandidate',
        data: result,
        target: 'front'
      }
      this.websocketsend(JSON.stringify(data))
    },
    sendAward: function (result) {
      let data = {
        action: 'changeAward',
        data: result,
        target: 'front'
      }
      this.websocketsend(JSON.stringify(data))
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
        data: 'backend',
        target: 'backend'
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
<style lang="scss" scoped>
.buttonGroupScreen {
  .title {
    color: white;
    font-size: 5vw;
  }
  .buttonActive {
    color: white;
    background-color: red;
    font-size: 5vw;
    display: inline;
    padding-left: 5vw;
    padding-right: 5vw;
    border: 1px white solid;
  }
  .button {
    color: white;
    font-size: 5vw;
    display: inline;
    padding-left: 5vw;
    padding-right: 5vw;
    border: 1px white solid;
  }
}
.winner { color: white}
.rolling { color: red}
</style>
