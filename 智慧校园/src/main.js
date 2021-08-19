import Vue from 'vue'
import App from './App'
import store from "./store/index";

if (process.env.WECODE_PLATFORM === 'h5') { // 仅We码中需要使用
  require('./wecode.polyfill');
  __uniConfig.router.base = './'; // fix h5 image load fail bug.
}

Vue.config.productionTip = false

App.mpType = 'app'
console.log(process.env.WECODE_PLATFORM, '-- process.env.WECODE_PLATFORM');
if (process.env.WECODE_PLATFORM === 'h5') {
  const { onLaunch, onShow, onHide, onClose, ...others } = App;
  const app = new Vue({
    ...others,
    store
  })
  app.$mount();
  // 重构应用生命周期函数
  HWH5.app && HWH5.app({
    onLaunch() {
      const args = {
        path: app.$route.meta && app.$route.meta.pagePath,
        query: app.$route.query,
        scene: 1001
      }
      // 启动事件
      onLaunch && onLaunch(args);
    },
    onShow() {
      const args = {
        path: app.$route.meta && app.$route.meta.pagePath,
        query: app.$route.query,
        scene: 1001
      }
      // 切换前台事件
      onShow && onShow(args);
    },
    onHide() {
      // 切换后台事件
      onHide && onHide();
    },
    onClose() {
      // 关闭事件
      onClose && onClose();
    }
  }).catch(error => {
    console.log(error);
  });
} else { // 原uniapp代码逻辑
  const app = new Vue({
    ...App,
    store
  })
  app.$mount()
}
window.HWH5.navTitle({ title: 'uni-app' });


