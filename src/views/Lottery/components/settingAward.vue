<template>
  <div>
    <div class="buttonGroupScreen">
      <input ref="fileUpload" accept="csv/text" type="file" class="uploadFile-img" @change.prevent="validFileMimeType" name="csv">
      <div class="button">匯入</div>
      <div class="buttonWide" @click.prevent="upload">上傳至前端</div>
    </div>
    <div class="newObject">
      <div class="head">
        <div>提供單位</div>
        <div>獎項</div>
        <div>數量</div>
      </div>
      <div class="body">
        <input type="text" v-model="newObject.supplier" />
        <input type="text" v-model="newObject.award" />
        <input type="text" v-model="newObject.number" />
        <div @click.prevent="addItem">新增</div>
      </div>
    </div>
    <div>
      <table class="table">
      <tr v-for="object in awards" :key="object.id">
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
  name: 'settingAward',
  components: {
    AlertBody
  },
  data () {
    return {
      // 設定這邊的變數名稱是複數型態
      // 人員名單
      awards: [],
      newObject: { id: '', depart: '', name: '' },
      alertTitle: '',
      alertText: '完成',
      showModal: false
    }
  },
  mounted () {
    if (localStorage.awards) {
      this.awards = JSON.parse(localStorage.awards)
    }
  },
  methods: {
    validFileMimeType (event) {
      let file = event.target.files[0]
      let reader = new FileReader()
      reader.onload = e => {
        // reset
        this.awards = []

        let lines = e.target.result.split('\n')
        lines.forEach(line => {
          let currentLine = line.split(',')
          if (currentLine[0] !== '') {
            let lineData = {
              id: currentLine[0],
              depart: currentLine[1],
              name: currentLine[2]
            }
            this.awards.push(lineData)
          }
        })
        localStorage.awards = JSON.stringify(this.awards)
        this.alertText = '匯入完成'
        this.showModal = true
        let input = this.$refs.fileUpload
        input.type = 'text'
        input.type = 'file'
      }
      reader.readAsText(file, 'utf-8')
    },
    addItem: function () {
      this.awards.push(this.newObject)
      this.newObject = { id: '', depart: '', name: '' }
      localStorage.awards = JSON.stringify(this.awards)
    },
    delItem: function (object) {
      let index = this.awards.indexOf(object)
      this.awards.splice(index, 1)
      localStorage.awards = JSON.stringify(this.awards)
    },
    upload: function () {
      this.$emit('done', this.awards)
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
