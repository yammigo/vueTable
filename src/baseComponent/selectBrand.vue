<style lang='less'>
</style>
<template>
<div style="width:500px;">
    <div class="campaign-have-list" style="margin-left: 0px; margin-right: 0px;border-radius:0px;width:50%;float:left;height:auto">
        <div class="campaign-have-header">
            <strong>可选品牌</strong>
        </div>
        <ul style="overflow:auto;height:192px;">
            <li class="ad-d-flex ad-d-flex-between">
                <div>
                    <Checkbox :checked="true">不限</Checkbox>
                </div>
            </li>
            <li class="ad-d-flex ad-d-flex-between" v-for="(item,index) in deviceBrand" :key="index">
                <div>
                    <Checkbox :value='item.key' v-model="formData.deviceBrand">{{item.title}}</Checkbox>
                </div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
    
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {

        }
    },
    computed: {
        deviceBrand(){
            
        }
    }
}
</script>
