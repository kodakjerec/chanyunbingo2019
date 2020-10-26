<template>
  <div class="history">
    <div v-for="i in 9" :key="i" class="board">
      <template v-for="j in 6">
        <div :key="j" class="ball" v-if="history[(i-1)*6+j-1]">
          <span class="text">{{ history[(i-1)*6+j-1].number }}</span>
        </div>
      </template>
      <div class="ballIndex" v-show="history[(i-1)*6]">
        {{(i-1)*6 + 1}} ~ {{i*6}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'history',
  props: {
    history: {
      type: Array,
      required: true }
  }
}
</script>
<style lang="scss" scoped>
.history{
  width: 100%;
  height: 100vh;
}

.board {
  display: flex;
  color: white;

  .ball {
    width: 13vw;
    height: 11vw;
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

    .text {
      font-size: 8vw;
    }
  }

  .ballIndex {
    position: absolute;
    right:1vw;
    font-size:4vw;
    margin-top: 10vh;
  }
}
</style>
