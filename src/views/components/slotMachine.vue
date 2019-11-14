<template>
  <div class='slot'>
    <div class="slot_window">
      <div class='slot__wrap' :style="{ transform: 'translateY(' + pos + 'px)'}">
        <div class='slot__item' v-for='opt in slots' :key="opt">
          <span v-if="opt!==100">{{ opt }}</span>
          <span v-else class="oneHundred">{{ opt }}</span>
        </div>
        <div class='slot__item slot__item--copy' >{{ slots[0] }}</div>
      </div>
    </div>
    <div :class="['button', opts !== null?'active':'']" @click.prevent="start" />
  </div>
</template>

<script>
// slot-machine卷軸用
const next = window.requestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.msRequestAnimationFrame ||
   window.oRequestAnimationFrame ||
   function (cb) { window.setTimeout(cb, 1000 / 60) }

export default {
  name: 'slotMachine',
  props: {
    history: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      slots: [],
      opts: null,
      startedAt: null,
      pos: 0,
      itemHeight: 70,
      marginHeight: 10
    }
  },
  mounted () {
    this.ready()
  },
  methods: {
    ready: function () {
      let value = 0
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          value = 10 * i + j + 1
          this.slots.push(value)
        }
      }
    },
    // 開始轉動
    start: function () {
      // 轉動中禁止重新啟動
      if (this.opts) {
        return
      }
      // 開始
      let slot = this.slots

      // 找出還沒抽中過的答案
      // 全部都抽完了^^
      if (this.history.length === this.slots.length) {
        console.log('over')
        this.$emit('finished', 'over')
        return
      }
      let choice = 0
      let findChoice = false
      while (findChoice === false) {
        choice = Math.floor(Math.random() * slot.length)
        if (this.history.includes(slot[choice]) === false) {
          findChoice = true
        }
      }
      console.log('choice', slot[choice])

      this.opts = {
        choice: slot[choice], // 答案
        finalPos: choice * (this.itemHeight + this.marginHeight), // 最後的停駐位置
        startOffset: 2000 + Math.random() * 500, // 快停下來的緩衝位移, 會有慢慢停住的視覺效果
        height: slot.length * (this.itemHeight + this.marginHeight),
        duration: 500, // 轉動秒數 milliseconds
        isFinished: false
      }
      next(this.animate)
    },
    animate: function (timestamp) {
      if (this.startedAt == null) {
        this.startedAt = timestamp
      }

      const timeDiff = timestamp - this.startedAt

      if (this.opts.isFinished) {
        return
      }

      const timeRemaining = Math.max(this.opts.duration - timeDiff, 0)
      const power = 3
      const offset = (Math.pow(timeRemaining, power) / Math.pow(this.opts.duration, power)) * this.opts.startOffset

      // negative, such that slots move from top to bottom
      this.pos = -1 * Math.floor((offset + this.opts.finalPos) % this.opts.height)

      if (timeDiff > this.opts.duration) {
        console.log('finished', this.opts, this.opts.finalPos)
        this.opts.isFinished = true
      }

      if (this.opts.isFinished) {
        this.$emit('finished', this.opts.choice)
        this.opts = null
        this.startedAt = null
        console.log('finished')
      } else {
        next(this.animate)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.slot {
  float: left;
  margin-top: 2em;
}
.slot_window {
  background-color: gray;
  width: 90px;
  height: 90px;
  overflow: hidden;
}
.slot__item {
  margin-top: 10px; // marginHeight
  height: 70px; // itemHeight
  width: 90px;
  background-color: white;
  color: black;
  font-size: 70px;

  span {
    position: relative;

    &.oneHundred {
      left: -10px;
    }
  }
}
.button {
    background-color: rgb(199, 10, 10);
    width: 4em;
    height: 4em;
    position: relative;
    left: 0.6em;
    top: 1em;
    border-radius: 50%;
    box-shadow: 0px 9px 0px #b31905, 0px 9px 25px rgba(0,0,0,.7);

    &.active {
      background-color: #f54747;
      box-shadow: 0 5px 0px #800e0e, 0px 9px 35px rgba(143, 122, 5, 1);
      transform: translateY(5px);
    }
  }
</style>
