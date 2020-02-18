<template>
  <div id="toast" :class="[isActive?'show':'']">
    <span>已<br/>經<br/>抽<br/>完<br/>了<br/>^^</span>
  </div>
</template>

<script>
export default {
  name: 'toast',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
#toast {
  visibility: hidden;
  background-color: #857867;
  border-radius: 0.5rem;
  position: fixed;
  z-index: 1;
  right: 2vw;
  bottom: 2vh;
  width: 6vw;
  height: 28vh;

  span {
    position: relative;
    top: 2vh;
    font-size: 3vw;
    color: black;
  }
}

#toast.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 2vh; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 2vh; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 2vh; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 2vh; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
</style>
