<template>
  <div>
    <div class="main">
      <div class="title">
          展雲109年度尾牙
      </div>
      <div v-for="i in 5" :key="i" class="board">
        <template v-for="j in 10">
          <div :key="j" :class="checkClicked(i,j)">
            <span v-if="((i-1)*10+j) < 50">{{ numbers[(i-1)*10+j].number }}</span>
            <template v-else>
              <img class="img" :src="require('@/assets/Chanyun-logo-new-2.png')"/>
            </template>
          </div>
        </template>
      </div>

      <div class="fixedBallDarktheme" v-show="fixedBallShow"></div>
      <div class="fixedBall" v-show="fixedBallShow" v-if="numbers[fixedValue]"
        :style="{'--fixedBallStyle_left':fixedBallStyle_left
        , '--fixedBallStyle_top':fixedBallStyle_top
        , '--fixedBallStyle_width':fixedBallStyle_width
        , '--fixedBallStyle_height':fixedBallStyle_height
        , '--fixedBallStyle_fontSize':fixedBallStyle_fontSize}">{{numbers[fixedValue].number}}</div>
    </div>
    <div id="tbl_history">
      <history-page :history="history" />
    </div>
    <div id="tbl_addon" class="addon">
      <div class="slider">
        播放速度<input v-model="speedUpAnimate" placeholder="標準值1000, 愈小愈快">毫秒, 愈小愈快
      </div>
      <div id="btn_reset" class="button" @click.prevent="resetAll">
        <span>重新開始</span>
      </div>
    </div>
  </div>
</template>

<script>
import historyPage from './components/history'

export default {
  name: 'bigno2021',
  components: {
    historyPage
  },
  data () {
    return {
      numbers: [],
      history: [],
      getNumber: {
        number: '',
        isShow: '',
        checked: false
      },
      // 動畫相關
      isRolling: false, // 是否正在動畫
      oldValue: null,
      newValue: null, // 正在亮燈的值
      startAt: null, // 迴圈開始值
      fixedValue: null, // 中獎值
      fixedBallStyle_left: '10vw',
      fixedBallStyle_top: '10vh',
      fixedBallStyle_width: '10vw',
      fixedBallStyle_height: '10vh',
      fixedBallStyle_fontSize: '8vw',
      fixedBallShow: false,
      paintTimes: 0, // 已經圖繪幾次
      speedUpAnimate: 1000, // 動畫加速, 100=標準值, 愈小愈快
      // 畫面相關
      lastKnownKeyDownIndex: 0 // 鍵盤定位用
    }
  },
  created () {
    document.body.style.overflow = 'hidden'

    window.addEventListener('keyup', this.handleKeyUp)

    // 歷史紀錄儲存至localStorage
    if (localStorage.numbers) {
      this.numbers = JSON.parse(localStorage.numbers)
      this.history = JSON.parse(localStorage.history)
    } else {
      this.getNumber = {
        number: '下一個才開始',
        isShow: 0,
        checked: true
      }
      this.numbers.push(this.getNumber)
      for (let i = 1; i <= 50; i++) {
        let numberString = ''
        if (i < 10) {
          numberString = '0' + i.toString()
        } else {
          numberString = i.toString()
        }
        this.getNumber = {
          number: numberString,
          isShow: 0,
          checked: false
        }
        this.numbers.push(this.getNumber)
      }
    }

    // 最後一碼:50, 不開啟
    this.numbers[50].checked = true
  },
  destroyed () {
    window.removeEventListener('keyup', this.handleKeyUp)
  },
  methods: {
    // 回傳按鈕的CSS
    checkClicked: function (i, j) {
      let item = this.numbers[10 * (i - 1) + j]
      // 是否已經中獎
      if (item.checked) {
        return 'button-checked'
      } else {
        // 要不要亮燈
        switch (item.isShow) {
          case '0':
            return 'button-deactive'
          case '1':
            return 'button-active'
        }
      }
    },
    // 按下space開始抽獎
    handleKeyUp: function (event) {
      if (this.isRolling) { return }

      switch (event.keyCode) {
        case 32: // space
          if (this.lastKnownKeyDownIndex === 0) {
            this.beforeAnimate()
          }
          break
        case 37: // ArrowLeft
        case 38: // keyUp
          if (this.lastKnownKeyDownIndex > 0) {
            this.lastKnownKeyDownIndex -= 1
          }
          break
        case 39: // ArrowRight
        case 40: // keyDown
          if (this.lastKnownKeyDownIndex <= 3) {
            this.lastKnownKeyDownIndex += 1
          }
          break
      }

      // 移動畫面位置
      let top = 0
      switch (this.lastKnownKeyDownIndex) {
        case 0:
          window.scrollTo(0, top)
          break
        case 1:
          top = document.getElementById('tbl_history').offsetTop
          window.scrollTo(0, top)
          break
        case 2:
          top = document.getElementById('tbl_history').offsetTop * 2
          window.scrollTo(0, top)
          break
        case 3:
          top = document.getElementById('tbl_addon').offsetTop
          window.scrollTo(0, top)
          break
      }
    },
    // 取得亂數值
    beforeAnimate: function () {
      this.fixedValue = null

      // 檢查是否還有剩餘號碼還沒開出
      let allNumbersOpen = this.numbers.findIndex(item => item.checked === false)
      if (allNumbersOpen < 0) {
        alert('All open')
        return
      }

      this.isRolling = true

      // 取得應該得到的數值
      while (this.fixedValue === null) {
        let index = Math.floor(Math.random() * (this.numbers.length - 1)) + 1
        if (this.numbers[index].checked === false) {
          this.fixedValue = index
        }
      }

      // 往前偏移50步算出發點
      // 沒中獎過的才算步數
      let calculateTimes = 50
      let previousIndex = this.fixedValue
      while (calculateTimes > 0) {
        previousIndex -= 1
        if (previousIndex < 1) {
          previousIndex = 50
        }
        if (this.numbers[previousIndex].checked === false) {
          calculateTimes -= 1
        }
      }
      this.startAt = previousIndex
      this.paintTimes = 0
      this.animate()
    },
    // 抽獎動畫
    animate: function () {
      if (this.newValue == null) {
        this.newValue = this.startAt
      } else {
        this.oldValue = this.newValue
        let stillLoop = true
        while (stillLoop) {
          this.newValue = this.newValue + 1
          if (this.newValue > 50) {
            this.newValue = 1
          }
          if (this.numbers[this.newValue].checked === false) {
            stillLoop = false
          }
        }
      }

      let oldItem = this.numbers[this.oldValue]
      let newItem = this.numbers[this.newValue]

      if (oldItem) {
        oldItem.isShow = '0'
      }
      if (newItem) {
        if (newItem.checked === false) {
          newItem.isShow = '1'
        }
      }
      this.paintTimes += 1

      if (this.paintTimes > 50) {
        let myThis = this
        window.setTimeout(function () {
          myThis.paintTimes = 0
          myThis.fixedBallShow = true
          myThis.rollingNumber()
        }, this.speedUpAnimate)

        this.startAt = null
        this.oldValue = null
        this.newValue = null
      } else {
        let timeInterval = 100
        if (this.paintTimes <= 20) {
          // 耗時 0.05 * 20 = 1
          timeInterval = this.speedUpAnimate * 0.05
        } else if (this.paintTimes <= 40) {
          // 耗時 0.1  * 20 = 2
          timeInterval = this.speedUpAnimate * 0.1
        } else if (this.paintTimes <= 44) {
          // 耗時 0.2  * 4 = 0.8
          timeInterval = this.speedUpAnimate * 0.2
        } else if (this.paintTimes <= 47) {
          // 耗時 0.4  * 3 = 1.2
          timeInterval = this.speedUpAnimate * 0.4
        } else {
          // 耗時 0.7  * 3 = 2.1
          timeInterval = this.speedUpAnimate * 0.7
        }
        window.setTimeout(this.animate, timeInterval)
      }
    },
    // 號碼淡入動畫
    rollingNumber: function () {
      this.paintTimes += 1
      this.fixedBallStyle_left = (this.paintTimes * 0.5).toString() + 'vw'
      this.fixedBallStyle_top = (this.paintTimes * 0.01).toString() + 'vh'
      this.fixedBallStyle_width = (10 + this.paintTimes * 0.7).toString() + 'vw'
      this.fixedBallStyle_height = (10 + this.paintTimes * 0.7).toString() + 'vw'
      this.fixedBallStyle_fontSize = (8 + this.paintTimes * 0.6).toString() + 'vw'
      if (this.paintTimes > 50) {
        // 開獎
        window.setTimeout(this.getLotteryNumber, this.speedUpAnimate * 5)
      } else {
        window.setTimeout(this.rollingNumber, this.speedUpAnimate / 60)
      }
    },
    // 紀錄中獎號碼
    getLotteryNumber: function () {
      this.isRolling = false
      this.fixedBallShow = false

      this.numbers[this.fixedValue].checked = true
      this.history.push(this.numbers[this.fixedValue])

      localStorage.numbers = JSON.stringify(this.numbers)
      localStorage.history = JSON.stringify(this.history)
    },
    // 重置所有檔案
    resetAll: function () {
      if (confirm('是否刪除所有抽獎紀錄？')) {
        this.numbers = []
        this.history = []
        localStorage.clear()
        alert('刪除完畢，請重新整理網頁')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main{
  width: 100%;
  height: 100vh;
}
.board {
    display: flex;
    color: white;

    div {
        width: 10vw;
        height: 17.7vh;
        left: 1px;
        top: 1px;
        border: 1px white solid;

        font-size: 8vw;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }

    .button-checked {
      background-color: grey;

      .img {
        background-color: black;
        width: 100%;
        height: 100%;
      }
    }
    .button-active {
      background-color: red;
    }
    .button-deactive{
      background-color: transparent;
    }
}

.fixedBallDarktheme {
  position: absolute;
  left: 0vw;
  top: 0vh;
  width:100vw;
  height:100vh;
  background-color: black;
  opacity: 0.7;
}
.fixedBall {
  position: absolute;
  left: var(--fixedBallStyle_left);
  top: var(--fixedBallStyle_top);
  width: var(--fixedBallStyle_width);
  height: var(--fixedBallStyle_height);
  font-size: var(--fixedBallStyle_fontSize);
  color: white;

  margin-left: 1vw;
  margin-top: 1vw;
  padding-top: 2vw;
  border-radius: 50%;
  background-color: rgb(169, 53, 92);

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.title {
  margin-left: 25vw;
  width: 50vw;
  border-radius: 10px;
  text-align: center;
  color: white;
  background-color: rgb(169, 53, 92);
  font-size: 4.5vw;
}

.addon {
  position: relative;
  top: 100vh;
  font-size: 3vw;

  .slider {
    position: absolute;
    left: 0vw;
    color: white;

    input {
      font-size: 5vw;
      width: 200px;
    }
  }

  .button {
    position: absolute;
    left: 50vw;
    width: 50vw;
    height: 8vh;
    background-color: #733030;
    border-radius: 10px;
    color: #F2AF5C;
    &:hover{
        background-color: #F2785C
    }
  }
}
</style>
