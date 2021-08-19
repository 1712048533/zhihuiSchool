import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

const actions = {
    // 改变头像是否为圆角边框
    changeAvatarRadius(content,value){
        content.commit('changeAvatarRadius',null);
    },
    //获取用户信息
    getLoginUserInfo(content,value){
        content.commit('getLoginUserInfo',value);
    }
};

const mutations = {
    changeAvatarRadius(state,value){
        state.settings.isAvatarRadius = !state.settings.isAvatarRadius
    },
    getLoginUserInfo(state,value){
        state.userInfo = value;
    }
};

// 存放公共数据，比如用户信息
const state = {
    userInfo:{

    },
    
    settings:{
        isAvatarRadius : true
    }
};

const getters = {
    getAvatarRaduis(state){
        return state.settings.isAvatarRadius
    }
};

export default new Vuex.Store({
    actions,mutations,state,getters
})