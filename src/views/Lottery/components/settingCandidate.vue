<template>
  <div>
    <div class="buttonGroupScreen">
      <input ref="fileUpload" accept="csv/text" type="file" class="uploadFile-img" @change.prevent="validFileMimeType" name="csv">
      <div class="button">匯入</div>
      <div class="buttonWide" @click.prevent="upload">上傳至前端</div>
    </div>
    <div class="newObject">
      <div class="head">
        <div>帳號</div>
        <div>單位</div>
        <div>姓名</div>
      </div>
      <div class="body">
        <input type="text" v-model="newObject.id" />
        <input type="text" v-model="newObject.depart" />
        <input type="text" v-model="newObject.name" />
        <div @click.prevent="addItem">新增</div>
      </div>
    </div>
    <div>
      <table class="table">
      <tr v-for="object in candidates" :key="object.id">
        <td><input type="text" v-model="object.id" /></td>
        <td><input type="text" v-model="object.depart" /></td>
        <td><input type="text" v-model="object.name" /></td>
        <td><button @click.prevent="delItem(object)">刪除</button></td>
      </tr>
      </table>
    </div>
    <AlertBody :title="alertTitle" :text="alertText" v-if="showModal" @close="showModal = false">
    </AlertBody>
  </div>
</template>

<script>
import AlertBody from '@/components/AlertBody'

export default {
  name: 'settingCandidate',
  components: {
    AlertBody
  },
  data () {
    return {
      // 設定這邊的變數名稱是複數型態
      // 人員名單
      candidates: [],
      newObject: { id: '', depart: '', name: '' },
      alertTitle: '',
      alertText: '完成',
      showModal: false
    }
  },
  mounted () {
    if (localStorage.candidates) {
      this.candidates = JSON.parse(localStorage.candidates)
    }
  },
  methods: {
    validFileMimeType (event) {
      let file = event.target.files[0]
      let reader = new FileReader()
      reader.onload = e => {
        // reset
        this.candidates = []

        let lines = e.target.result.split('\n')
        lines.forEach(line => {
          let currentLine = line.split(',')
          if (currentLine[0] !== '') {
            let lineData = {
              id: currentLine[0],
              depart: currentLine[1],
              name: currentLine[2]
            }
            this.candidates.push(lineData)
          }
        })
        localStorage.candidates = JSON.stringify(this.candidates)
        this.alertText = '匯入完成'
        this.showModal = true
        let input = this.$refs.fileUpload
        input.type = 'text'
        input.type = 'file'
      }
      reader.readAsText(file, 'utf-8')
    },
    addItem: function () {
      this.candidates.push(this.newObject)
      this.newObject = { id: '', depart: '', name: '' }
      localStorage.candidates = JSON.stringify(this.candidates)
    },
    delItem: function (object) {
      let index = this.candidates.indexOf(object)
      this.candidates.splice(index, 1)
      localStorage.candidates = JSON.stringify(this.candidates)
    },
    upload: function () {
      this.$emit('done', this.candidates)
    }
  }
}
</script>

<style lang="scss" scoped>
.buttonGroupScreen {
  .button {
    color: white;
    font-size: 5vw;
    border: 1px white solid;
    height: 8vh;
    width: 10vw;
    display: inline-block;
  }
  .buttonWide {
    color: white;
    font-size: 5vw;
    border: 1px white solid;
    height: 8vh;
    width: 30vw;
    display: inline-block;
  }

  .uploadFile-img {
    height: 8vh;
    width: 10vw;
    margin: 0 auto;
    opacity: 0;
    z-index: 99999;
    position: absolute;
  }
}

.newObject {
  border: 1px white solid;
  padding: 10px;
  width: 50vw;
  margin-left: auto;
  margin-right: auto;

  .head {
    div {
      font-size: 2vw;
      width: 15vw;
      color:white;
      display: inline-block;
    }
  }

  .body {
    input {
      font-size: 2vw;
      width: 15vw;
    }
    div {
      font-size: 2vw;
      background-color: red;
      color:white;
    }
  }
}

.table {
  color: white;
  border: 1px white solid;
  margin-left: auto;
  margin-right: auto;
}
</style>
