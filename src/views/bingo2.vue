<template>
    <div>
        <div v-for="i in 10" :key="i" class="board">
            <template v-for="j in 10">
                <div :key="j" @click.prevent="clicked(i,j)" :class="checkClicked(i,j)">
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
                <div v-for="i in 10" :key="i">
                    <div v-for="j in 10" :key="j" class="box-body-row">
                        <span class="box-body-columnHead">{{10*(i-1)+j}}</span>
                        <span class="box-body-item">{{history[10*(i-1)+j-1]}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="button" @click.prevent="reset">
            <span>重新開始</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'bingo2',
  data () {
    return {
      history: []
    }
  },
  mounted () {
    // 歷史紀錄儲存至localStorage
    if (localStorage.history) {
      this.history = JSON.parse(localStorage.history)
    }
  },
  watch: {
    // 歷史紀錄儲存至localStorage
    history (newValue) {
      localStorage.history = JSON.stringify(newValue)
    }
  },
  methods: {
    // 點下按鈕
    clicked: function (i, j) {
      let value = 10 * (i - 1) + j
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
    }
  }
}
</script>
<style lang="scss" scoped>
.board {
    div {
        display: inline-block;
        width: 6em;
        height: 4.6em;
        border: 1px white solid;
        span {
            color:white;
            font-size: 60px;
        }
    }

    .buttonClicked {
        background-color: red
    }
}
.box-card {
    .box-head {
        background-color: yellow;
    }
    .box-body{
        .box-body-row {
            display: inline-block;
            height: 4.6em;
            width: 6em;
            border: 1px white solid;
        }
        .box-body-columnHead{

        }
    }
}
.button{
    border: 1px gray solid;
    height: 3em;
    background-color: gray;
    margin-top: 1em;
    border-radius: 10px;
    span{
        color: black;
        font-size: 40px;
    }
    &:hover{
        background-color: lightslategray
    }
}
</style>
