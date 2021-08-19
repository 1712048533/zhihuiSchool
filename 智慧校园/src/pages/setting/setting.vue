<template>
    <view class="setting-view">
        <view class="setting-view_content">
            <uni-list>
                <uni-list-item
                    title="头像是否圆角显示"
                    show-switch
                    :switchChecked = "$store.getters.getAvatarRaduis"
                    @switchChange="change_avatarRadius"
                >
                    
                </uni-list-item>
            </uni-list>
        </view>
    </view>
</template>

<script>
export default {
    name:'setting',
    methods:{
        change_avatarRadius(){
            this.$store.dispatch('changeAvatarRadius',null);
            // 缓存这个设置
            this.setDataToStorage();
        },


        setDataToStorage(){
            HWH5.setStorage({
              key: 'data_settings',
              data: {...this.$store.state.settings},
              isolation: 1 
            }).catch((error) => {
              console.log('设置缓存异常', error);
            });
        }
    },
    mounted(){
        console.log(this);
    }
}
</script>

<style>

</style>