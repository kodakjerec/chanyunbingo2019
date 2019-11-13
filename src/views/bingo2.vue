<template>
    <div>
        <div v-for="i in 10" :key="i" class="board">
            <template v-for="j in 10">
                <div :key="j" :class="checkClicked(i,j)">
                    <span>{{10*(i-1)+j}}</span>
                </div>
            </template>
        </div>
        <p></p>
        <div class="box-card">
            <div class="box-head">
                <span>歷史紀錄</span>
            </div>
            <div class="box-body">
                <div v-for="i in 10" :key="i" class="box-body-row">
                    <div v-for="j in 10" :key="j" class="box-body-column">
                        <div class="box-body-columnHead">
                            <span>{{10*(i-1)+j}}</span>
                        </div>
                        <div class="box-body-item">
                            <span v-if="history[10*(i-1)+j-1] !== undefined">{{history[10*(i-1)+j-1]}}</span>
                            <span v-else class="blackWord">{{'_'}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button" @click.prevent="reset">
            <span>重新開始</span>
        </div>
        <!-- <gift
          v-if="showGift"
          @finished="isFinished"
          :trigger="trigger"
          :config="config"
          :history="history">
        </gift> -->
        <div class="rollBar">
          <slot-machine v-if="showGift" :history="history" />
        </div>
    </div>
</template>

<script>
import slotMachine from './components/slotMachine'

export default {
  name: 'bingo2',
  components: {
    slotMachine
  },
  data () {
    return {
      basicable: [],
      history: [],
      playTime: 1,
      lastKnownKeyDownIndex: 0,
      // 吃角子老虎用
      showGift: false,
      trigger: null,
      config: {
        run3D: false,
        rotateY: -25,
        duration: 2000,
        rollback: 0.1,
        fontSize: 100,
        height: 100,
        width: 80,
        position: 'absolute',
        left: 912,
        top: 400,
        gifts: Array.from(new Array(10), (val, index) => { return { type: 'text', name: index } })
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
    this.showGift = true
  },
  watch: {
    // 歷史紀錄儲存至localStorage
    history (newValue) {
      localStorage.history = JSON.stringify(newValue)
    }
  },
  methods: {
    // 吃角子老虎開始
    turn: function () {
      this.trigger = new Date()
    },
    // 吃角子老虎結束
    isFinished: function (value) {
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
    // 鍵盤偵測
    handleKeyDown: function (event) {
      console.log(event)
      switch (event.keyCode) {
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

      switch (this.lastKnownKeyDownIndex) {
        case 0:
          window.scrollTo(0, 0)
          break
        case 1:
          window.scrollTo(0, 770)
          break
        default:
          window.scrollTo(0, 1000)
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
        width: 5.5em;
        height: 4.6em;
        left: -7px;
        top: -7px;
        border: 1px white solid;
        span {
            position: relative;
            color:white;
            font-size: 55px;
            left: -4px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -o-user-select: none;
            user-select: none;
        }
    }

    .buttonClicked {
        background-color: #F24B4B;
    }
}
.box-card {
    position: relative;
    .box-head {
        background-color: #F2AF5C;
        border-radius: 10px 10px 0px 0px;
        span{
            font-size: 40px;
        }
    }
    .box-body{
        .box-body-row {
            border: 1px white solid;
        }
        .box-body-column {
            display: inline-block;
            height: 4.3em;
            width: 6.16em;
        }
        .box-body-columnHead {
            color: white;
            width: inherit;
            font-size: 20px;
            border-bottom: 1px white solid;
            border-right: 1px white solid;
        }
        .box-body-item {
            width: inherit;
            color:white;
            font-size: 40px;
            border-right: 1px white solid;

            .blackWord {
                color:black;
            }
        }
    }
}
.button {
    height: 3em;
    background-color: #733030;
    margin-top: 1em;
    border-radius: 10px;
    color: #F2AF5C;
    span{
        font-size: 40px;
    }
    &:hover{
        background-color: #F2785C
    }
}
.rollBar {
  // position: absolute;
  // left: 905px;
  // top: 10px;
  // width: 5.8em;
  height: 40em;
  border-radius: 10px;
  background-color: #a5a8aa;
}
</style>
