<template>
    <div>
        <el-row>
            <el-button type="primary" @click="roll">Roll</el-button>
            <el-button type="info" @click="reset">Reset</el-button>
        </el-row>
        <el-row>
            <el-button type="primary" circle>{{rollNumber}}</el-button>
        </el-row>
        <!-- Header -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>賓果盤</span>
            </div>
            <el-row>
                <el-button plain>_</el-button>
                <el-button plain>B</el-button>
                <el-button plain>I</el-button>
                <el-button plain>N</el-button>
                <el-button plain>G</el-button>
                <el-button plain>O</el-button>
            </el-row>
            <el-row>
                <el-button plain>1</el-button>
                <el-button circle v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==0">
                    {{item}}
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>2</el-button>
                <el-button circle v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==1">
                    {{item}}
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>3</el-button>
                <el-button circle v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==2">
                    {{item}}
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>4</el-button>
                <el-button circle v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==3">
                    {{item}}
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>5</el-button>
                <el-button circle v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==4">
                    {{item}}
                </el-button>
            </el-row>
        </el-card>

        <!-- Result -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>結果</span>
            </div>
            <el-row>
                <el-button circle v-for="(item,index) in history" :key="index">
                    {{item}}
                </el-button>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
    name: 'Bingo',
    data () {
        return {
            remainingNumbers: [],
            spreadTable: [],
            spreadTableCheck: [],
            history: [],
            rollNumber: 0,
            maxLength: 25
        }
    },
    mounted () {
        this.reset()
    },
    methods: {
        roll: function () {
            // get number
            let length = this.remainingNumbers.length
            if(length<=0){
                this.$message('Finish!')
                return
            }
            let getIndex = Math.floor(Math.random()*length)

            // show data
            this.rollNumber = this.remainingNumbers[getIndex]
            this.remainingNumbers.splice(getIndex, 1)
            this.history.push(this.rollNumber)

            // light
            let findIndex = 0
            this.spreadTable.forEach((element, index) => {
                if (element === this.rollNumber){
                    findIndex = index
                }
            });
            this.spreadTableCheck[findIndex] = 'Y'
        },
        reset: function () {
            this.spreadTable = []
            this.spreadTableCheck = []
            this.history = []
            this.rollNumber = 0

            // 盤面大小
            this.remainingNumbers = []
            for (let i=1;i<=this.maxLength;i++){
                this.remainingNumbers.push(i)
            }

            // 產生盤面
            let spreadOrigin = this.remainingNumbers.slice()
            let length = 0
            let index = 0
            let item = 0

            for (let i=1;i<=this.maxLength;i++){
                length = spreadOrigin.length
                index = Math.floor(Math.random()*length)
                item = spreadOrigin[index]

                this.spreadTable.push(item)
                this.spreadTableCheck.push('N')
                spreadOrigin.splice(index, 1)
            }
        }
    }
}
</script>
