<template>
    <div>
        <el-row>
            <el-button type="primary" @click="roll">Roll</el-button>
            <el-button type="info" @click="reset">Reset</el-button>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col class="ball">
                <div class="ballCenter">{{rollNumber}}</div>
            </el-col>
        </el-row>
        <!-- Header -->
        <el-card class="box-card bingoMainCard">
            <div slot="header" class="clearfix">
                <span>賓果盤</span>
            </div>
            <el-row>
                <el-col :span="24">
                    <el-button plain :class="bingoLines[10]===1?'lightLine':''">↘</el-button>
                    <el-button plain :class="bingoLines[0]===1?'lightLine':''">B</el-button>
                    <el-button plain :class="bingoLines[1]===1?'lightLine':''">I</el-button>
                    <el-button plain :class="bingoLines[2]===1?'lightLine':''">N</el-button>
                    <el-button plain :class="bingoLines[3]===1?'lightLine':''">G</el-button>
                    <el-button plain :class="bingoLines[4]===1?'lightLine':''">O</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-button plain :class="bingoLines[5]===1?'lightLine':''">1</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==0"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain :class="bingoLines[6]===1?'lightLine':''">2</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==1"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain :class="bingoLines[7]===1?'lightLine':''">3</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==2"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain :class="bingoLines[8]===1?'lightLine':''">4</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==3"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain :class="bingoLines[9]===1?'lightLine':''">5</el-button>
                <el-button plain v-for="(item,index) in spreadTable" :key="index" v-show="Math.floor(index/5)==4"
                 :class="spreadTableCheck[index] === 'Y'?'gotCheck':''">
                    <span>{{item}}</span>
                </el-button>
            </el-row>
            <el-row>
                <el-button plain :class="bingoLines[11]===1?'lightLine':''">↗</el-button>
                <el-button plain class="fontwhite">_</el-button>
                <el-button plain class="fontwhite">_</el-button>
                <el-button plain class="fontwhite">_</el-button>
                <el-button plain class="fontwhite">_</el-button>
                <el-button plain class="fontwhite">_</el-button>
            </el-row>
        </el-card>

        <!-- Result -->
        <el-card class="box-card resultCard">
            <div slot="header" class="clearfix">
                <span>結果</span>
            </div>
            <el-row type="flex" justify="center">
                <el-col class="ball" v-for="(item,index) in history.slice(0,5)" :key="index">
                    <div class="ballCenter">{{item}}</div>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col class="ball" v-for="(item,index) in history.slice(5,10)" :key="index">
                    <div class="ballCenter">{{item}}</div>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col class="ball" v-for="(item,index) in history.slice(10,15)" :key="index">
                    <div class="ballCenter">{{item}}</div>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col class="ball" v-for="(item,index) in history.slice(15,20)" :key="index">
                    <div class="ballCenter">{{item}}</div>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col class="ball" v-for="(item,index) in history.slice(20,25)" :key="index">
                    <div class="ballCenter">{{item}}</div>
                </el-col>
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

            this.checkLine()
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
                    this.bingoLines[5+i] = 1
                }
                // 直列
                if (this.spreadTableCheck[0 + i] ==='Y' 
                    && this.spreadTableCheck[5 + i] ==='Y'
                    && this.spreadTableCheck[10 + i] ==='Y' 
                    && this.spreadTableCheck[15 + i] ==='Y'
                    && this.spreadTableCheck[20 + i] ==='Y'){
                    this.bingoLines[i] = 1
                }
            }

            // 左上右下
            if (this.spreadTableCheck[0] ==='Y' 
                && this.spreadTableCheck[6] ==='Y'
                && this.spreadTableCheck[12] ==='Y' 
                && this.spreadTableCheck[17] ==='Y'
                && this.spreadTableCheck[24] ==='Y')
                this.bingoLines[10] = 1

            // 右上左下
            if (this.spreadTableCheck[4] ==='Y' 
                && this.spreadTableCheck[8] ==='Y'
                && this.spreadTableCheck[12] ==='Y' 
                && this.spreadTableCheck[16] ==='Y'
				&& this.spreadTableCheck[20] ==='Y')
                this.bingoLines[11] = 1
        }
    }
}
</script>
<style scoped>
button{
    width:5em
}
.gotCheck{
    color: white;
    background-color: red
}
.lightLine{
    font-weight: bold;
    background-color: yellow
}
.fontwhite{
    color: #e6b69a;
    background-color: inherit;
    border-color: #e6b69a
}
.bingoMainCard{
    background-color: #e6b69a
}
.resultCard{
    color: white;
    background-color: #614700
}
.ball{
    width: 3em;
    height: 3em;
    border-radius: 50%;
    background-color: black;
    margin-right: 4px;
}
.ballCenter{
    width: 1em;
    height: 1em;
    padding: 4px 6px 4px 6px;
    margin-left: 8px;
    margin-top: 8px;
    background-color: white;
    border-radius: 50%;
    color: black;
    border:2px sienna solid;
}
</style>