<template>
    <div>
        <div>
            <button type="primary" @click="roll">Roll</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'test',
  data () {
    return {
      parameters: {}
    }
  },
  methods: {
    roll: function () {
      axios.post('http://localhost:3000/baseData')
        .then(response => {
          console.log(response)
        })
        .catch(error => { // 请求失败处理
          console.log(error)
        })
    }
  }
}
</script>
