<template>
    <div id="top">
        <div v-for="i in 10" :key="i" class="board">
            <template v-for="j in 10">
                <div :key="j" :class="checkClicked(i,j)">
                    <span v-if="10*(i-1)+j !== 100">{{10*(i-1)+j}}</span>
                    <span v-else class="oneHundred">{{ 10*(i-1)+j }}</span>
                </div>
            </template>
        </div>
        <p></p>
        <div id="tbl_history" class="box-card">
            <div class="box-head">歷史紀錄</div>
            <div class="box-body">
                <div v-for="i in 10" :key="i" class="box-body-row">
                    <div v-for="j in 10" :key="j" class="box-body-column">
                        <div class="box-body-columnHead">
                            <span>{{10*(i-1)+j}}</span>
                        </div>
                        <div class="box-body-item">
                            <span v-if="history[10*(i-1)+j-1] !== undefined && history[10*(i-1)+j-1] !== 100">{{history[10*(i-1)+j-1]}}</span>
                            <span v-else-if="history[10*(i-1)+j-1] !== undefined && history[10*(i-1)+j-1] === 100" class="oneHundred">{{history[10*(i-1)+j-1]}}</span>
                            <span v-else-if="history[10*(i-1)+j-1] === undefined" class="blackWord">{{'_'}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="btn_reset" class="button" @click.prevent="reset">
            <span>重新開始</span>
        </div>
        <div class="sliderWording">
          <div class="header">
            <span>轉盤<br/>秒數</span>
          </div>
          <div class="content">
            <Vue-slide-bar
              v-model="slider.value"
              :data="slider.data"
              :range="slider.range"
              :lineHeight="slider.lineHeight"
              :labelStyles="{ color: '#ffffff', backgroundColor: '#ffffff' }"
              :processStyle="{ backgroundColor: '#d8d8d8' }"
              @callbackRange="callbackRange">
            </Vue-slide-bar>
          </div>
        </div>
        <div class="rollBar">
          <slot-machine
            v-if="showGift"
            :history="history"
            :rollingTime="rollingTime"
            @finished="isFinished"
            ref="childRef" />
        </div>
        <toast :is-active="showToast" />
        <div class="title">
          <span>展<br/>雲<br/>108<br/>年<br/>度<br/>尾<br/>牙</span>
        </div>
    </div>
</template>

<script>
import slotMachine from './components/slotMachine'
import VueSlideBar from './components/vue-slider-bar'
import toast from './components/toast'

export default {
  name: 'bingo2',
  components: {
    slotMachine,
    VueSlideBar,
    toast
  },
  data () {
    return {
      basicable: [],
      history: [],
      lastKnownKeyDownIndex: 0, // 鍵盤定位用
      // 吃角子老虎用
      showGift: false,
      showToast: false,
      rollingTime: 5000,
      // slide-bar
      slider: {
        value: 5,
        lineHeight: 5,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        range: [
          { label: '1' },
          { label: '2' },
          { label: '3' },
          { label: '4' },
          { label: '5' },
          { label: '6' },
          { label: '7' },
          { label: '8' },
          { label: '9' },
          { label: '10' }
        ]
      }
    }
  },
  created () {
    window.addEventListener('keyup', this.handleKeyDown)
  },
  destroyed () {
    window.removeEventListener('keyup', this.handleKeyDown)
  },
  mounted () {
    // 歷史紀錄儲存至localStorage
    if (localStorage.history) {
      this.history = JSON.parse(localStorage.history)
    }
    if (localStorage.rollingTime) {
      this.rollingTime = parseInt(localStorage.rollingTime)
    } else {
      localStorage.rollingTime = this.rollingTime
    }
    this.showGift = true
  },
  watch: {
    // 歷史紀錄儲存至localStorage
    history (newValue) {
      localStorage.history = JSON.stringify(newValue)
    },
    rollingTime (newValue) {
      localStorage.rollingTime = this.rollingTime
      this.slider.defaultValue = this.rollingTime / 1000
    },
    // 保持畫面不動的偏方
    showGift () {
      document.body.style.overflow = 'hidden'
    }
  },
  methods: {
    // 吃角子老虎結束
    isFinished: function (value) {
      if (value === 'over') {
        this.showToast = true
        let self = this
        setTimeout(function () { self.showToast = false }, 3000)
        return
      }

      if (this.history.includes(value) === false) {
        this.history.push(value)
      }
    },
    // 檢查按鈕有沒有被按過
    checkClicked: function (i, j) {
      let value = 10 * (i - 1) + j
      if (this.history.includes(value)) {
        return 'buttonClicked'
      }
    },
    // 重新開始
    reset: function () {
      this.history = []
    },
    // 調整完轉盤時間
    callbackRange: function (value) {
      this.rollingTime = parseInt(value.label) * 1000
    },
    // 鍵盤偵測
    handleKeyDown: function (event) {
      console.log(event)
      switch (event.keyCode) {
        case 32: // space
          this.$refs.childRef.start()
          break
        case 37: // ArrowLeft
        case 38: // keyUp

          if (this.lastKnownKeyDownIndex > 0) {
            this.lastKnownKeyDownIndex -= 1
          }
          break
        case 39: // ArrowRight
        case 40: // keyDown
          if (this.lastKnownKeyDownIndex < 2) {
            this.lastKnownKeyDownIndex += 1
          }
          break
      }

      let top = 0
      switch (this.lastKnownKeyDownIndex) {
        case 0:
          window.scrollTo(0, top)
          break
        case 1:
          top = document.getElementById('tbl_history').offsetTop
          window.scrollTo(0, top)
          break
        default:
          top = document.getElementById('btn_reset').offsetTop
          window.scrollTo(0, top)
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.board {
    display: flex;
    div {
        position: relative;
        display: inline-block;
        width: 8.7vw;
        height: 9.7vh;
        left: -8px;
        top: -8px;
        border: 1px white solid;
        span {
            position: relative;
            color:white;
            font-size: 9vmin;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -o-user-select: none;
            user-select: none;

            &.oneHundred {
              font-size: 7.5vmin;
              top: 1vmin;
            }
        }
    }

    .buttonClicked {
        background-color: #F24B4B;
    }
}
.box-card {
    .box-head {
        background-color: #F2AF5C;
        border-radius: 10px 10px 0px 0px;
        width: inherit;
        font-size: 3vmin;
    }
    .box-body{
        .box-body-row {
            border: 1px white solid;
            height: 9.4vh;
        }
        .box-body-column {
            display: inline-block;
            position: relative;
            left: 0vw;
            height: 9.4vh;
            width: 9.7vw;
            border-right: 1px white solid;
        }
        .box-body-columnHead {
            text-align: left;
            color: white;
            font-size: 2vmin;
            span {
              display: inline-block;
              width: 3vw;
              border: 1px white solid;
            }
        }
        .box-body-item {
            position: relative;
            width: inherit;
            color:white;
            font-size: 7vmin;
            top: -1vh;
            span {
              padding-left: 0.5vw;

              &.oneHundred {
                padding-left: 0vw;
              }
            }
            .blackWord {
                position: relative;
                top: -2vh;
                color:black;
            }
        }
    }
}
.button {
    height: 5vh;
    background-color: #733030;
    margin-top: 1vh;
    border-radius: 10px;
    color: #F2AF5C;
    span{
        font-size: 5vmin;
    }
    &:hover{
        background-color: #F2785C
    }
}
.rollBar {
  position: absolute;
  right: 1vw;
  top: 1vh;
  width: 9vw;
  border-radius: 10px;
  background-color:#E8AE51;
  box-shadow: 2px 5px #805833;

  @media screen and (min-width: 1024px) {
    height: 28vh;
  }
  @media screen and (max-width: 1024px) {
    height: 25vh;
  }
}

.title {
  position: absolute;
  right: 1.5vw;
  top: 32vh;
  color: #F24B4B;
  font-size: 5vw;
  @media screen and (min-width: 1024px) {
    line-height: 9.5vh;
  }
  @media screen and (max-width: 1024px) {
    line-height: 9vh;
  }
}
.sliderWording {
  margin-top: 1vh;
  .header {
    float: left;
    text-align: left;
    margin: 1vh;
    span {
      color:white;
      font-size: 2vw;
    }
  }
  .content {
    float:left;
    width: 80%
  }
}
</style>
