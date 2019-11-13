<template>
  <div class='slot'>
    <div class="button" @click.prevent="start" />
    <div class="slot_window">
      <div class='slot__wrap' :style="{ transform: 'translateY(' + pos + 'px)'}">
        <div class='slot__item' v-for='opt in slots' :key="opt">{{ opt }}</div>
        <div class='slot__item slot__item--copy' >{{ slots[0] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
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
      pos: 0
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
          if (this.history.includes(value) === false) {
            this.slots.push(value)
          }
        }
      }
    },
    // 開始轉動
    start: function () {
      if (this.opts) {
        return
      }
      let slot = this.slots
      let choice = Math.floor(Math.random() * slot.length)
      console.log('choice', slot[choice])

      this.opts = {
        finalPos: choice * 20,
        startOffset: 2000 + Math.random() * 500,
        height: slot.length * 20,
        duration: 3000, // milliseconds
        isFinished: false
      }
      next(this.animate)
    },
    animate: function (timestamp) {
      if (this.startedAt == null) {
        this.startedAt = timestamp
      }

      const timeDiff = timestamp - this.startedAt

      let opt = this.opts
      if (opt.isFinished) {
        return
      }

      const timeRemaining = Math.max(opt.duration - timeDiff, 0)
      const power = 3
      const offset = (Math.pow(timeRemaining, power) / Math.pow(opt.duration, power)) * opt.startOffset

      // negative, such that slots move from top to bottom
      this.pos = -1 * Math.floor((offset + opt.finalPos) % opt.height)

      if (timeDiff > opt.duration) {
        console.log('finished', opt, opt.finalPos)
        opt.isFinished = true
      }

      if (opt.isFinished) {
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
  width: 100%;
  height:100%;
}
.slot_window {
  background-color: green;
  width: 200px;
  height: 200px;
}
.slot__item {
  height: 20px;
  width: 100px;
  padding: 0 10px;

  text-align: center;
  background-color: blue;
  color: white;

  line-height: 160px;
}
.button {
    background-color: rgb(199, 10, 10);
    width: 4em;
    height: 4em;
    position: relative;
    left: 10em;
    border-radius: 50%;
    box-shadow: 0px 9px 0px rgb(179, 25, 5), 0px 9px 25px rgba(0,0,0,.7);
  }
</style>
