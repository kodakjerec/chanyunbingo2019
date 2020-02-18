<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@import url(https://fonts.googleapis.com/earlyaccess/cwtexkai.css);

#app {
  font-family: 'cwTeXKai', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  background-color: black;
}
html {
  font-size: 62.5%;
  min-width: 1024px;
  min-height: 768px;
}
</style>
