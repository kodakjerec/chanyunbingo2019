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
            <el-row type="flex" class="row-bg">
                <el-col :span="24">
                    <el-button plain>\</el-button>
                    <el-button plain>B</el-button>
                    <el-button plain>I</el-button>
                    <el-button plain>N</el-button>
                    <el-button plain>G</el-button>
                    <el-button plain>O</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-button plain>1</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==0"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>2</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==1"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>3</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==2"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>4</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==3"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>5</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==4"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain>/</el-button>
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
            bingoLines: [0,0,0,0,0,0,0,0,0,0,0], // 橫排 0~4 直列 5~9 左上右下 10 右上左下 11 
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
        },
        checkLine: function () {
            // check 直線
            for (let i = 0; i < 5; i++) {
                // 橫排
                if (this.spreadTableCheck[0 + 5 * i] ==='Y' 
                    && this.spreadTableCheck[1 + 5 * i] ==='Y'
                    && this.spreadTableCheck[2 + 5 * i] ==='Y'
                    && this.spreadTableCheck[3 + 5 * i] ==='Y'
                    && this.spreadTableCheck[4 + 5 * i] ==='Y'){
                    this.bingoLines[i] = 1
                }
                // 直列
                if (this.spreadTableCheck[0 + i] ==='Y' 
                    && this.spreadTableCheck[5 + i] ==='Y'
                    && this.spreadTableCheck[10 + i] ==='Y' 
                    && this.spreadTableCheck[15 + i] ==='Y'
                    && this.spreadTableCheck[20 + i] ==='Y'){
                    this.bingoLines[5+i] = 1
                }
            }

            // 左上右下
            if (spreadTableCheck[0] != 0 && spreadTableCheck[6] != 0
                    && spreadTableCheck[12] != 0 && spreadTableCheck[17] != 0
                    && spreadTableCheck[24] != 0)
                this.bingoLines[10] = 1

            // 右上左下
            if (spreadTableCheck[4] != 0 && spreadTableCheck[8] != 0
				&& spreadTableCheck[12] != 0 && spreadTableCheck[16] != 0
				&& spreadTableCheck[20] != 0)
                this.bingoLines[11] = 1
        }
    }
}
</script>
<style scoped>
.gotCheck{
    color: white;
    background-color: red
}
</style>