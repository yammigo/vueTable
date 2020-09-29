<template>
<div class="waterfull">
    <div class="v-waterfall-content" ref="Waterfall">
        <div v-for="(item, index) in waterfallList" :key="index" class="v-waterfall-item" :style="{top:item.top+'px',left:item.left+'px',width:waterfallImgWidth+'px',height:item.height+'px'}">
            <slot :item="item"></slot>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        dataArr: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    name: "Waterfall",
    data() {
        return {
            waterfallList: [],
            waterfallImgWidth: 210, // 每个盒子的宽度
            waterfallImgCol: 4, // 瀑布流的列数
            waterfallImgRight: 10, // 每个盒子的右padding
            waterfallImgBottom: 10, // 每个盒子的下padding
            waterfallDeviationHeight: [],

        }
    },
    created() {

        // 触发入口
        // for (let i = 0; i < this.datas.length; i++) {
        //     // this.imgList.push(this.imgArr[Math.round(Math.random() * 8)]);// 图片随机显示
        //     this.imgList.push(this.datas[i].libraryUrl);
        // }
    },
    mounted() {
        // this.calculationWidth();
    },
    watch: {
        "dataArr": {
            handler: function (newVal, old) {
                setTimeout(() => {
                    this.$refs.Waterfall && this.calculationWidth();
                },20)

            },
            immediate: true
        }
    },
    methods: {
        //计算每个图片的宽度或者是列数
        calculationWidth() {
            let domWidth = this.$refs.Waterfall.offsetWidth;
            if (!this.waterfallImgWidth && this.waterfallImgCol) {
                this.waterfallImgWidth = (domWidth - this.waterfallImgRight * this.waterfallImgCol) / this.waterfallImgCol;
            } else if (this.waterfallImgWidth && !this.waterfallImgCol) {
                this.waterfallImgCol = Math.floor(domWidth / (this.waterfallImgWidth + this.waterfallImgRight))
            }
            //初始化偏移高度数组
            this.waterfallDeviationHeight = new Array(this.waterfallImgCol);
            for (let i = 0; i < this.waterfallDeviationHeight.length; i++) {
                this.waterfallDeviationHeight[i] = 0;
            }
            this.imgPreloading()
        },
        //图片预加载
        imgPreloading() {
             this.waterfallList=[];
            for (let i = 0; i < this.dataArr.length; i++) {
                let aImg = new Image();
                aImg.src = this.dataArr[i].libraryUrl;
                aImg.onload = aImg.onerror = (e) => {
                    let imgData = this.dataArr[i];
                    imgData.height = this.waterfallImgWidth / aImg.width * aImg.height;
                    this.waterfallList.push(imgData);
                    this.rankImg(imgData);
                }
            }
        },
        //瀑布流布局
        rankImg(imgData) {
            let {
                waterfallImgWidth,
                waterfallImgRight,
                waterfallImgBottom,
                waterfallDeviationHeight,
                waterfallImgCol
            } = this;
            let minIndex = this.filterMin();
            imgData.top = waterfallDeviationHeight[minIndex];
            imgData.left = minIndex * (waterfallImgRight + waterfallImgWidth);
            // waterfallDeviationHeight[minIndex] += imgData.height + waterfallImgBottom;// 不加文字的盒子高度
            waterfallDeviationHeight[minIndex] += imgData.height + waterfallImgBottom; // 加了文字的盒子高度，留出文字的地方（这里设置56px）
        },
        /**
         * 找到最短的列并返回下标
         * @returns {number} 下标
         */
        filterMin() {
            const min = Math.min.apply(null, this.waterfallDeviationHeight);
            return this.waterfallDeviationHeight.indexOf(min);
        }
    },
}
</script>

<style scoped>
.waterfull {
    width: 100%;
}

.v-waterfall-content {
    /* 主要 */
    width: 100%;
    /* height: 400px; */
    position: relative;
    /* 次要：设置滚动条，要求固定高度 */
    /* overflow-y: auto; */
}

.v-waterfall-item {
    /* 主要 */
    float: left;
    position: absolute;
}

.v-waterfall-item img {
    /* 主要 */
    /* width: auto;height: auto; */
    width: 100%;
    height: auto;
    /* 次要 */
    border-radius: 6px;
}
</style>
