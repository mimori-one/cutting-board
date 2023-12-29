<template>
    <div class="m-4 w-full flex">
        <div class="w-1/2 space-y-2">
            <select v-model="sizeSelect" @change="selectCutSize" class="select select-bordered">
                <option v-for="size in CUT_SIZE_LIST" :value="size">{{ size.label }}</option>
            </select>
            <div v-if="sizeSelect.label === 'カスタム'">
                <input type="number" placeholder="タテ" class="input input-bordered w-24" v-model="size.width" /> mm x
                <input type="number" placeholder="ヨコ" class="input input-bordered w-24" v-model="size.height"/> mm
                ※長い方の数値を左に入れる
            </div>
            <div class="flex items-center">
                <div class="mr-2">X(左からの横位置)</div>
                <input v-model="f_x" type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
                <div  class="ml-2">mm</div>
            </div>
            <div class="flex items-center">
                <div class="mr-2">Y(下からの縦位置)</div>
                <input v-model="f_y" type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
                <div class="ml-2">mm</div>
            </div>
            <div class="flex justify-between space-x-4 w-full">
                <button class="btn btn-primary" @click="addFact">キズ位置を追加</button>
                <button class="btn" @click="setSampleFact">sample</button>
            </div>
        </div>        
    </div>

    <!-- プロット -->
    <div class="m-4">
        <div class="flex items-center space-x-2">
            <button @click="tande('A')" class="btn btn-primary">切り出し位置を計算</button>
            <div class="text-lg">計算時間: {{ tandeTime / 1000 }}秒</div>
            <div class="text-xl">枚数: {{ tmpBoards.length }}枚</div>
        </div>
        <div class="flex w-full">
            <div>
                <canvas width="1300" height="650">
                キャンバスの表示内容を説明する代替テキストです。
            </canvas>
            </div>
            
            <div class="flex flex-col space-y-2">
                <div>キズ位置</div>
                <div @click='facts.splice(0)' class="btn btn-secondary">キズ位置を全てリセット</div>
                <div class="flex flex-col space-y-2">
                    <div v-for="(fact, index) in facts" class="flex items-center">
                        <div class="w-32">
                        {{fact.f_x}}, {{ fact.f_y }}
                    </div>
                        <button @click=deleteFact(index) class="btn">消す</button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    <div class="m-4">
        <div class="text-lg">切り出し位置</div>
        <div class="flex flex-col space-y-2 m-2">
            <div v-for="fact in tmpBoards" class="flex items-center">
                <div class="text-lg font-bold">
                    {{ fact.dir === 'vertical' ? 'タテ' : 'ヨコ' }} x: {{fact.x}}, y:{{ fact.y }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const sampleFacts = [
    {
        x: 185,
        y: 131
    },
    {
        x: 483,
        y: 336
    },
    {
        x: 503,
        y: 400
    },
    {
        x: 596,
        y: 45
    },
    {
        x: 640,
        y: 197
    },
    {
        x: 737,
        y: 313
    },
    {
        x: 794,
        y: 518
    },
    {
        x: 842,
        y: 301
    },
    {
        x: 926,
        y: 390
    },
    {
        x: 926,
        y: 494
    },
    {
        x: 964,
        y: 502
    },
    {
        x: 1085,
        y: 527
    },
    {
        x: 1232,
        y: 123
    }
]

const CUT_SIZE_LIST = [
    {
        label: 'B6(デフォルト) 182x128',
        x: 182,
        y: 128
    },
    {
        label: 'A5 210x148',
        x: 210,
        y: 148
    },
    {
        label: 'カスタム',
        x: 0,
        y: 0
    },
]

const sizeSelect = ref(CUT_SIZE_LIST[0])

const facts = ref([])

const size = ref({
    width: 182,
    height: 128
})

// 板の下・左のマージン
const init_margin = 10

// 切り出し板の間隔
const boardMargin = 7

const boards = ref([{}])

const tmpBoards = ref([{}])

// キズの位置から距離を取る半径
const mg = 4

// 検索更新間隔
const searchMargin = 3

const f_x = ref(0)
const f_y = ref(0)

const tandeTime = ref(0)

const selectCutSize = () => {
    size.value = {
        width: sizeSelect.value.x,
        height: sizeSelect.value.y
    }
}

const setSampleFact = () => {
    sampleFacts.forEach((value)=> {
        facts.value.push({f_x: value.x, f_y: value.y})
        draw()
    })
}

const addFact = () => {
    facts.value.push({f_x: f_x.value, f_y: f_y.value})
    draw()
}

const deleteFact = (index) => {
    facts.value.splice(index, 1)
    draw()
}

const draw = () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "paleturquoise";
    ctx.fillRect(0, 0, 1200, 610);
    ctx.fillStyle = "silver";
    ctx.fillRect(1200, 0, 50, 610);

    facts.value.forEach((value) => {
        const x = value.f_x - mg
        const y = 610 - value.f_y - mg
        ctx.fillStyle = "deeppink";
        ctx.fillRect(x, y, mg * 2, mg * 2);
    })
}

const drawBoards = () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    tmpBoards.value.forEach((value) => {
        const width = value.dir === 'horizontal' ? size.value.width : size.value.height
        const height = value.dir === 'horizontal' ? size.value.height : size.value.width

        const x = value.x
        const y = 610 - value.y - height
        
        ctx.fillStyle = "darkslategray";
        ctx.fillRect(x, y, width, height);

        ctx.font = "20px serif";
        ctx.fillStyle = "white";
        ctx.fillText(`${width > height ? 'ヨコ' : 'タテ'}`, x + 2 , y + 24);
        ctx.fillText(`x: ${value.x}`, x + 4 , y + 50);
        ctx.fillText(`y: ${value.y}`, x + 4 , y + 70);
    })
}

const origin = ref({
    x: 10,
    y: 10
})


const tande = (type) => {
    const startTime = performance.now();
    origin.value = {
        x: 10,
        y: 10
    }
    tmpBoards.value.splice(0)
    let index = 0
    // originが超えるまでループ
    while(origin.value.x + size.value.height < 1250 && origin.value.y + size.value.height < 610 && index < 100){

        // 縦で入るか試す
        let vertical = checksum(origin.value.x, origin.value.y, size.value.height, size.value.width)
        if(vertical){
            // 縦で入るので追加
            tmpBoards.value.push({
                x: origin.value.x,
                y: origin.value.y,
                dir: 'vertical'
            })
            // origin.yを横+margin追加
            let nextY = origin.value.y + size.value.width + boardMargin
            if((nextY + size.value.height) > 600){
                // 次の板が入らないのでX検索してcontinue
                origin.value = {
                    x: origin.value.x + searchMargin,
                    y: init_margin
                } 
                continue;
            }else{
                // まだ次の板が入るかもしれないのでYを更新してcontinue
                origin.value = {
                    x: origin.value.x,
                    y: nextY
                } 
                continue;
            }
        } else {
            // 縦では入らないので横にしてみる
            let horizon = checksum(origin.value.x, origin.value.y, size.value.width, size.value.height)
            if(horizon){
                // 横で入るので追加
                tmpBoards.value.push({
                    x: origin.value.x,
                    y: origin.value.y,
                    dir: 'horizontal'
                })
                // origin.yを縦+margin追加
                let nextY = origin.value.y + size.value.height + boardMargin
                if((nextY + size.value.height) > 600){
                    // 次の板が入らないのでX検索してcontinue
                    origin.value = {
                        x: origin.value.x + searchMargin,
                        y: init_margin
                    } 
                    continue;
                }else{
                    // まだ次の板が入るかもしれないのでYを更新してcontinue
                    origin.value = {
                        x: origin.value.x,
                        y: nextY
                    } 
                    continue;
                }
            }else{
                //縦でも横でも入らないのでYを更新
                let nextY = origin.value.y + searchMargin
                if(nextY + size.value.height > 600){
                    // 次の板が入らないのでX検索してcontinue
                    origin.value = {
                        x: origin.value.x + searchMargin,
                        y: init_margin
                    }
                    continue;
                }else{
                    // まだ次の板が入るかもしれないのでYを更新してcontinue
                    origin.value = {
                        x: origin.value.x,
                        y: nextY
                    } 
                    continue;
                }
            }
        }
    }
    const endTime = performance.now();
    tandeTime.value = endTime - startTime
    drawBoards()
}

const checksum = (x, y, width, height) => {
    // 上辺の衝突判定
    if(y + height > 600){
        return false
    }
    // 右辺の衝突判定
    if(x + width > 1197){
        return false
    }

    // キズ位置との衝突判定
    if(facts.value.some((value) => {
        if(
            // 下判定
            y - mg < value.f_y &&
            // 上判定
            y + height + mg > value.f_y &&
            // 右判定
            x - mg < value.f_x &&
            // 左判定
            x + width + mg > value.f_x
        ){
            return true
        }
        return false
    })){
        return false
    }
    
    // 置いた板との衝突判定
    if(tmpBoards.value.some((value) => {
        // 縦か横か
        if(value.dir === 'horizontal'){
            // 横のとき
            // 上下判定
            return (y < value.y + size.value.height + (boardMargin) && y + height > value.y - (boardMargin)) &&
            // 左右判定
            (x < value.x + size.value.width + (boardMargin) && x + width > value.x - (boardMargin))
        }else{
            // 縦のとき
            return (y < value.y + size.value.width + (boardMargin) && y + height > value.y - (boardMargin)) &&
            // 左右判定
            (x < value.x + size.value.height + (boardMargin) && x + size.value.width > value.x - (boardMargin))
        }
    })){
        return false
    }

    return true
}

</script>