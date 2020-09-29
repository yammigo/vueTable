<style lang="less">
.f-selectCity {
    .f-select-panel-moduler-header {
        border-bottom: 1px solid #dadfe3;
        background-color: #f8f9fa;
        color: #333;
        font-size: 14px;
        line-height: 22px;
        padding: 8px 12px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }

    .f-select-panel-moduler-header-title {
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
    }

    .f-select-panel-moduler-container {
        height: 192px;
        padding: 6px 0;
        overflow-y: auto;
        position: relative;
    }

    .f-select-panel-moduler {
        width: 100%;
        background-color: #fff;
        border: 1px solid #dadfe3;
        overflow: hidden;
        box-sizing: border-box;
    }

    .f-select-panel-item {
        padding: 6px 12px;
        position: relative;
        cursor: pointer;

        .f-select-panel-item-name {
            display: block;
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            line-height: 22px;
            font-size: 14px;
            color: #333;
            font-weight: 400;
        }

        .byted-select-panel-item-toright {
            position: absolute;
            right: 12px;
            top: 10px;
            line-height: 0;
            cursor: pointer;

            .bui-icon-angle-right {
                width: 16px;
                height: 16px;
                fill: #999;
            }
        }
    }

    .f-select-panel-item-remove {
        margin: 8px 12px;
        padding: 2px 8px;
        background-color: #edf1f5;
        border-radius: 4px;
        position: relative;

        .f-select-panel-item-name {
            margin-right: 14px;
        }

        .f-select-panel-item-closeicon {
            position: absolute;
            right: 8px;
            top: 6px;
            line-height: 0;
            cursor: pointer;

            .bui-icon-close {
                width: 14px;
                height: 14px;
                fill: #999;
            }
        }
    }

    .f-select-panel-item-remove:first-child {
        margin-top: 6px;
    }

    .f-select-panel-moduler-header-clear {
        -ms-flex-negative: 0;
        flex-shrink: 0;
        color: #2f88ff;
        cursor: pointer;
        margin-left: 12px;
    }

    .f-select-panel {
        .fui-select-panel-left-moduler {
            display: inline-block;
            -webkit-box-flex: 0;
            -ms-flex: none;
            flex: none;

            &:not(:first-child) {
                margin-left: -1px;
            }
        }

        .fui-select-panel-right {
            display: inline-block;
        }

        .fui-select-panel-left {
            position: relative;
            display: -webkit-inline-box;
            display: -ms-inline-flexbox;
            display: inline-flex;
            overflow-x: auto;
            vertical-align: top;
        }
    }
}
</style>
<template>
<div class="f-selectCity" v-if="dataCity.length>0">
    <!-- 下拉组件 -->
    <div class="f-select-panel">
        <div class="fui-select-panel-left" style="margin-right: 16px; width:500px;">
            <div class="fui-select-panel-left-moduler" style="width: 50%; min-width: 200px;">
                <div class="f-select-panel-moduler">
                    <div class="f-select-panel-moduler-header">
                        <span class="f-select-panel-moduler-header-title">省份</span>
                    </div>
                    <div class="f-select-panel-moduler-container">
                        <div class="f-select-panel-item f-select-panel-item-active f-select-panel-item-check">
                            <Checkbox @click.native="selectAll(dataCity)" :checked="isSelectedAll" :indeterminate="isIndeterminate">全选</Checkbox>
                        </div>
                        <div v-for="(item,index) in dataCity" :key="index" class="f-select-panel-item f-select-panel-item-active f-select-panel-item-check" @click.self="clickProvince(index)">
                            <Checkbox @click.native="selectAll(item,index)" :checked="isCityListSelect[dataCity.indexOf(item)]" :indeterminate="item.indeterminate">{{item.provinceName}}</Checkbox>
                            <span class="byted-select-panel-item-toright" v-if="item.cityList.length!==1">
                                <div class="byted-icon bui-icon-angle-right">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" width="100%" height="100%">
                                        <defs>
                                            <path id="angle-right_svg__a" d="M0 0h48v48H0z" />
                                        </defs>
                                        <g fill-rule="evenodd" transform="rotate(-90 24 24)">
                                            <mask id="angle-right_svg__b" fill="#fff">
                                                <use xlink:href="#angle-right_svg__a" />
                                            </mask>
                                            <use opacity=".01" xlink:href="#angle-right_svg__a" />
                                            <path fill-rule="nonzero" d="M16.586 35.324a2 2 0 0 0 2.828 2.828l12-12a2 2 0 0 0 0-2.828l-12-12a2 2 0 0 0-2.828 2.828l10.586 10.586-10.586 10.586z" transform="rotate(90 24 24.738)" />
                                        </g>
                                    </svg>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fui-select-panel-left-moduler" style="width: 50%; min-width: 200px;border-top-right-radius: 0;border-bottom-right-radius: 0;">
                <div class="f-select-panel-moduler">
                    <div class="f-select-panel-moduler-header">
                        <span class="f-select-panel-moduler-header-title">城市</span>
                    </div>
                    <div class="f-select-panel-moduler-container" v-if="currentIndex>=0">
                        <div v-for="(item,index) in dataCity[currentIndex].cityList" :key="index" class="f-select-panel-item f-select-panel-item-active f-select-panel-item-check f-select-panel-item-selected">
                            <Checkbox :checked="item.checked" @click.native="changeCityItem(item)">{{item.cityName}}</Checkbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="fui-select-panel-right" style="width: 200px;">
            <div class="f-select-panel-moduler">
                <div class="f-select-panel-moduler-header">
                    <span class="f-select-panel-moduler-header-title">已选</span>
                    <span class="f-select-panel-moduler-header-clear">清空</span>
                </div>
                <div class="f-select-panel-moduler-container">
                    <div class="f-select-panel-item f-select-panel-item-remove f-select-panel-item-selected">
                        <span class="f-select-panel-item-name">北京</span>
                        <span class="f-select-panel-item-closeicon">
                            <div class="byted-icon bui-icon-close">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" width="100%" height="100%">
                                    <defs>
                                        <path id="close_svg__a" d="M0 0h48v48H0z" />
                                    </defs>
                                    <g fill-rule="evenodd">
                                        <mask id="close_svg__b" fill="#fff">
                                            <use xlink:href="#close_svg__a" />
                                        </mask>
                                        <use fill="#FFF" fill-opacity="0.01" xlink:href="#close_svg__a" />
                                        <path fill-rule="nonzero" d="M24 21.172l8.586-8.586a2 2 0 0 1 2.828 2.828L26.828 24l8.586 8.586a2 2 0 0 1-2.828 2.828L24 26.828l-8.586 8.586a2 2 0 0 1-2.828-2.828L21.172 24l-8.586-8.586a2 2 0 0 1 2.828-2.828L24 21.172z" />
                                    </g>
                                </svg>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
    <!-- end -->
</div>
</template>

<script>
import {
    deepCopy,
    findIndex
} from "../../util/utils"
export default {
    props: {
        value: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data() {
        return {
            modelValue: [],
            dictCity: [{
                    provinceName: '北京',
                    cityList: [{
                        cityName: '北京',
                        cityCode: '2001'
                    }]
                },
                {
                    provinceName: '天津',
                    cityList: [{
                        cityName: '天津',
                        cityCode: '2002'
                    }]
                },
                {
                    provinceName: '河北',
                    cityList: [{
                            cityName: '沈阳',
                            cityCode: '2003'
                        },
                        {
                            cityName: '唐山',
                            cityCode: '2004'
                        }
                    ]
                },
                {
                    provinceName: '山西',
                    cityList: [{
                            cityName: '太原',
                            cityCode: '2005'
                        },
                        {
                            cityName: '大同',
                            cityCode: '2006'
                        }
                    ]
                }
            ],
            dataCity: [],
            //当前需要展现的列表,
            currentIndex:0,
            currentList: {}
        };
    },
    created() {
        //  this.valueInit();
    },
    mounted() {},
    methods: {
        emitVal() {

            let select = [];
            this.dataCity.map((value, key) => {
                let cityList = value.cityList;
                cityList.map((value, key) => {
                    value.checked && select.push(value.cityCode);
                });
            });
            console.log(select);
            this.$emit('input',select);
            
            //  this.valueInit();
        },
        valueInit() {
            var dictCity = this.dictCity.slice(0),
                modelValue = this.value;
            dictCity.forEach(item1 => {
                let cityList = item1.cityList,
                    length = cityList.length,
                    index = 0;
                cityList.forEach(item2 => {
                    if (modelValue.indexOf(item2.cityCode) > -1) {
                        index += 1;
                        item2.checked = true;
                    } else {
                        item2.checked = false;
                    }
                    if (index == length) {
                        item1.checked = true;
                        item1.indeterminate = false;
                    } else {
                        if (index < length && index > 0) {
                            item1.checked = false;
                            item1.indeterminate = true;
                        } else {
                            item1.checked = false;
                            item1.indeterminate = false;
                        }
                    }
                });
                index = 0;
            });
           
            this.dataCity = deepCopy(this.dictCity);
        },
        clickProvince(index) {
            this.currentIndex=index;
            // this.currentList =this.dataCity[index];
        },
        changeCityItem(item) {
            try {
                item.checked = !item.checked;
                
                let idx =this.currentIndex,
                    a = 0;
                   
                   
                for (var i = 0, len = this.dataCity[idx].cityList.length; i < len; i++) {
                    if (this.dataCity[idx].cityList[i].checked) {
                        a += 1;
                    }
                }
                if (a > 0 && a < this.dataCity[idx].cityList.length) {
                    this.dataCity[idx].indeterminate = true;
                } else {
                    this.dataCity[idx].indeterminate = false;
                }

            } catch (error) {
                console.log(error);
            }

            this.emitVal();

        },
        selectAll: function (all) {
            //展示当前选中的列表

            if (all instanceof Array) {
                var bool = !this.isSelectedAll;
                for (var i = 0; i < all.length; i++) {
                    var cityList = all[i].cityList;
                    all[i].indeterminate = false;
                    for (var j = 0; j < cityList.length; j++) {
                        cityList[j].checked = bool;
                    }
                }
            } else {
                all.indeterminate = false;
                var index = this.dataCity.indexOf(all);
               
                this.currentIndex =index;
                var bool = !this.isCityListSelect[index];
                this.dataCity[index].checked=bool;
                for (var i = 0; i < all.cityList.length; i++) {
                    all.cityList[i].checked = bool;
                }
            }

            this.emitVal();
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function (a, b) {

                this.valueInit();

            }
        },
        dataCity: {
            handler: function (a, b) {}
        }
    },
    computed: {
        //所有省份是否被选中
        isSelectedAll: {
            get() {
                for (var i = 0; i < this.dataCity.length; i++) {
                    console.log(this.isCityListSelect[i],i);
                    if (!this.isCityListSelect[i]) {
                        return false;
                    }
                }
                return true;
            },
            // 这里要加一个空的setter，因为用v-model绑定时会报错
            set() {}
        },
        //一级选项是否半选
        isIndeterminate: {
            get() {
                //所有城市是否都被选中
                for (var i = 0, len = this.dataCity.length; i < len; i++) {
                    for (var j = 0, jlen = this.dataCity[i].cityList.length; j < jlen; j++) {
                        if (this.dataCity[i].cityList[j].checked && i >= 0 && i < len) {
                            return true;
                        }
                    }
                }
                return false;
            },

            set() {}
        },

        //每个省份下的所有城市是否被选中
        isCityListSelect() {
            var tempArr = [];
            for (var i = 0; i < this.dataCity.length; i++) {
                tempArr[i] = true;

                var cityList = this.dataCity[i].cityList;
                for (var j = 0; j < cityList.length; j++) {
                    if (!cityList[j].checked) {
                        tempArr[i] = false;
                        break;
                    }
                }
            }
            return tempArr;
        }
    }
};
</script>
