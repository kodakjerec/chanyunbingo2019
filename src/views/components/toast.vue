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
  width: 50px;
  background-color: lightgray;
  color: black;
  border-radius: 2px;
  position: fixed;
  z-index: 1;
  right: 10px;
  bottom: 30px;
  font-size: 40px;
}

#toast.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
</style>
