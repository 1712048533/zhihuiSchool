
/* Copyright 2018 -parsent, Dcloud.

 *

 * Licensed under the Apache License, Version 2.0 (the "License");

 * you may not use this file except in compliance with the License.

 * You may obtain a copy of the License at

 *

 *   http://www.apache.org/licenses/LICENSE-2.0

 *

 * Unless required by applicable law or agreed to in writing, software

 * distributed under the License is distributed on an "AS IS" BASIS,

 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

 * See the License for the specific language governing permissions and

 * limitations under the License.

 

 *  2020.03.11-Changed the UniApp adapts to the JSAPI of the WeCode.

 *                  Huawei Technologies Co., Ltd.
 */
const _toString = Object.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function'
}

function isStr(str) {
  return typeof str === 'string'
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

const HOOKS = [
  'invoke',
  'success',
  'fail',
  'complete',
  'returnValue'
];

const globalInterceptors = {};
const scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

function removeHook(hooks, hook) {
  const index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(hook => {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return
  }
  Object.keys(option).forEach(hook => {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function tips(methodName, name, type) {
  let tips = type === 'props' ? '属性' : '方法';
  console.warn(`We码小程序不支持${methodName}的${name}${tips}`);
}

function getRecorderManager() {
  let stopCallBack = () => { }
  let errorCallBack = () => { }
  return {
    start: (options) => {
      const defaultOptions = {
        type: 'startTape'
      }
      HWH5.recordAudio({ ...options, ...defaultOptions }).then(data => {
        console.log(data);
      }).catch(error => {
        console.log('启动录音异常', error);
        let err=JSON.parse(error)
        const errors = { "code": err.code, "errMsg": err.message, "type": err.type }
        errorCallBack(errors)
      });

    },

    pause: () => {
      HWH5.recordAudio({ type: 'pauseTape' }).then(data => {
        console.log(data);
      }).catch(error => {
        console.log('暂停录音异常', error);
        let err=JSON.parse(error)
        const errors = { "code": err.code, "errMsg": err.message, "type": err.type }
        errorCallBack(errors)
      });

    },

    resume: () => {
      HWH5.recordAudio({ type: 'continueTape' }).then(data => {
        console.log(data);
      }).catch(error => {
        console.log('继续录音异常', error);
        let err=JSON.parse(error)
        const errors = { "code": err.code, "errMsg": err.message, "type": err.type }
        errorCallBack(errors)
      });
    },
    stop: () => {
      HWH5.recordAudio({ type: 'endTape' }).then(data => {
        const filePath = { tempFilePath: data.filePath }
        stopCallBack(filePath)
      }).catch(error => {
        console.log('停止录音异常', error);
        let err=JSON.parse(error)
        const errors = { "code": err.code, "errMsg": err.message, "type": err.type }
        errorCallBack(errors)
      });
    },

    onStart: () => {
      return console.error('无onStart方法')

    },
    onPause: () => {
      return console.error('无onPause方法')

    },
    onStop: (callback) => {
      stopCallBack = callback
    },

    onFrameRecorded: (callback) => {
      tips('getRecorderManager', 'onFrameRecorded', 'method');
    },

    onError: (callback) => {
      errorCallBack = callback
    },
  }
}



function getBackgroundAudioManager() {
  let audioManager = HWH5.getBackgroundAudioManager();
  let newObject = {
    src: '',
    startTime: 0,
    background: false,
    repeat: false,
    playbackSpeed: 1,
    duration: null,
    currentTime: null,
    paused: null,
    buffered: null,
    title: null,
    epname: null,
    singer: null,
    coverImgUrl: null,
    webUrl: null,
    protocol: null,
    play: function () {
      audioManager.play();
    },
    pause: function () {
      audioManager.pause();
    },
    stop: function () {
      audioManager.stop();
    },
    seek: function (seek) {
      audioManager.seek(seek)
    },
    onPlay: () => { },
    onPause: () => { },
    onStop: () => { },
    onEnded: () => { },
    onError: () => { },
    onTimeUpdate: (data) => { },
    onCanplay: null,
    onPrev: null,
    onNext: null,
    onWaiting: null
  }
  let methodName = 'getBackgroundAudioManager';
  Object.defineProperties(newObject, {
    src: {
      get: function () {
        return audioManager.url;
      },
      set: function (newValue) {
        audioManager.url = newValue;
      }
    },

    startTime: {
      get: function () {
        return audioManager.startTime;
      },
      set: function (newValue) {
        audioManager.startTime = newValue;
      }
    },
    background: {
      get: function () {
        return audioManager.background;
      },
      set: function (newValue) {
        audioManager.background = newValue;
      }
    },
    repeat: {
      get: function () {
        return audioManager.repeat;
      },
      set: function (newValue) {
        audioManager.repeat = newValue;
      }
    },
    playbackSpeed: {
      get: function () {
        return audioManager.playbackSpeed;
      },
      set: function (newValue) {
        audioManager.playbackSpeed = newValue;
      }
    },
    duration: {
      get: function () {
        tips(methodName, 'duration', 'props');
        return audioManager.duration

      },
      set: function (newValue) {
        tips(methodName, 'duration', 'props');
      }
    },
    currentTime: {
      get: function () {
        tips(methodName, 'currentTime', 'props');
        return audioManager.currentTime;
      },
      set: function (newValue) {
        tips(methodName, 'currentTime', 'props');
      }
    },
    paused: {
      get: function () {
        tips(methodName, 'paused', 'props');
        return audioManager.paused;
      },
      set: function (newValue) {
        tips(methodName, 'paused', 'props');
      }
    },
    buffered: {
      get: function () {
        tips(methodName, 'buffered', 'props');
        return audioManager.buffered;
      },
      set: function (newValue) {
        tips(methodName, 'buffered', 'props');
      }
    },
    title: {
      get: function () {
        tips(methodName, 'title', 'props');
        return audioManager.title;
      },
      set: function (newValue) {
        tips(methodName, 'title', 'props');
      }
    },
    epname: {
      get: function () {
        tips(methodName, 'epname', 'props');
        return audioManager.epname;
      },
      set: function (newValue) {
        tips(methodName, 'epname', 'props');
      }
    },
    singer: {
      get: function () {
        tips(methodName, 'singer', 'props');
        return audioManager.singer;
      },
      set: function (newValue) {
        tips(methodName, 'singer', 'props');
      }
    },
    coverImgUrl: {
      get: function () {
        tips(methodName, 'coverImgUrl', 'props');
        return audioManager.coverImgUrl;
      },
      set: function (newValue) {
        tips(methodName, 'coverImgUrl', 'props');
      }
    },
    webUrl: {
      get: function () {
        tips(methodName, 'webUrl', 'props');
        return audioManager.webUrl;
      },
      set: function (newValue) {
        tips(methodName, 'webUrl', 'props');
      }
    },
    protocol: {
      get: function () {
        tips(methodName, 'protocol', 'props');
        return audioManager.protocol;
      },
      set: function (newValue) {
        tips(methodName, 'protocol', 'props');
      }
    },
    onCanplay: {
      get: function () {
        tips(methodName, 'onCanplay', 'method');
        return audioManager.onCanplay;
      },
      set: function (newValue) {
        tips(methodName, 'onCanplay', 'method');
      }
    },
    onPrev: {
      get: function () {
        tips(methodName, 'onPrev', 'method');
        return audioManager.onPrev;
      },
      set: function (newValue) {
        tips(methodName, 'onPrev', 'method');
      }
    },
    onNext: {
      get: function () {
        tips(methodName, 'onNext', 'method');
        return audioManager.onNext;
      },
      set: function (newValue) {
        tips(methodName, 'onNext', 'method');
      }
    },
    onWaiting: {
      get: function () {
        tips(methodName, 'onWaiting', 'method');
        return audioManager.onWaiting;
      },
      set: function (newValue) {
        tips(methodName, 'onWaiting', 'method');
      }
    },
    onPlay: {
      get: function () {
        return audioManager.onPlay;
      },
      set: function (newValue) {
        audioManager.onPlay = newValue;
      }
    },
    onPause: {
      get: function () {
        return audioManager.onPause;
      },
      set: function (newValue) {
        audioManager.onPause = newValue;
      }
    },
    onStop: {
      get: function () {
        return audioManager.onStop;
      },
      set: function (newValue) {
        audioManager.onStop = newValue;
      }
    },
    onEnded: {
      get: function () {
        return audioManager.onEnded;
      },
      set: function (newValue) {
        audioManager.onEnded = newValue;
      }
    },
    onError: {
      get: function () {
        return audioManager.onError;
      },
      set: function (newValue) {
        audioManager.onError = newValue;
      }
    },
    onTimeUpdate: {
      get: function () {
        return audioManager.onTimeUpdate;
      },
      set: function (newValue) {
        audioManager.onTimeUpdate = newValue;
      }
    }
  });
  return newObject;
}


function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data
  }
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

function queue(hooks, data) {
  let promise = false;
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      const res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() { }
        }
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data)
    }
  }
}

function wrapperOptions(interceptor, options = {}) {
  ['success', 'fail', 'complete'].forEach(name => {
    if (Array.isArray(interceptor[name])) {
      const oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then((res) => {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res
        });
      };
    }
  });
  return options
}

function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach(hook => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue
}

function getApiInterceptorHooks(method) {
  const interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(hook => {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(hook => {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor
}

function invokeApi(method, api, options, ...params) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options);
      return res.then((options) => {
        return api(wrapperOptions(interceptor, options), ...params)
      })
    } else {
      return api(wrapperOptions(interceptor, options), ...params)
    }
  }
  return api(options, ...params)
}
/** modify by wecode team start */
function invokePromiseApi(method, api, options, ...params) {
  api(options, ...params).then((data) => {
    options.success(data);
  }).catch((error) => {
    options.fail(error);
  })
}
/** modify by wecode team end */
const promiseInterceptor = {
  returnValue(res) {
    if (!isPromise(res)) {
      return res
    }
    return res.then(res => {
      return res[1]
    }).catch(res => {
      return res[0]
    })
  }
};

const SYNC_API_RE =
  /^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

const CONTEXT_API_RE = /^create|Manager$/;

const CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name)
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name)
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush'
}

function handlePromise(promise) {
  return promise.then(data => {
    return [null, data]
  })
    .catch(err => [err])
}

function shouldPromise(name) {
  if (
    isContextApi(name) ||
    isSyncApi(name) ||
    isCallbackApi(name)
  ) {
    return false
  }
  return true
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api
  }
  return function promiseApi(options = {}, ...params) {
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      /** modify by wecode team start */
      // return wrapperReturnValue(name, invokeApi(name, api, options, ...params))
      return invokePromiseApi(name, api, options, ...params)
      /** modify by wecode team end */
    }
    /** modify by wecode team start */
    // We码api都是promise的
    if (isPromise(api)) {
      return wrapperReturnValue(name, handlePromise(api))
    }
    /** modify by wecode team end */
    return wrapperReturnValue(name, handlePromise(new Promise((resolve, reject) => {
      invokeApi(name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params);
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          const promise = this.constructor;
          return this.then(
            value => promise.resolve(callback()).then(() => value),
            reason => promise.resolve(callback()).then(() => {
              throw reason
            })
          )
        };
      }
    })))
  }
}

const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;

function checkDeviceWidth() {
  const {
    platform,
    pixelRatio,
    windowWidth
  } = uni.getSystemInfoSync(); // uni=>HWH5 runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0
  }
  let result = (number / BASE_DEVICE_WIDTH) * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1
    } else {
      return 0.5
    }
  }
  return number < 0 ? -result : result
}

const interceptors = {
  promiseInterceptor
};



var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor,
  //录音，不能用通用的适配方法进行适配，需要单独适配
  getRecorderManager: getRecorderManager,
  getBackgroundAudioManager: getBackgroundAudioManager
});

var difApi = {
  request: {
    method: ['get', 'post', 'put', 'delete']
  },
   //只支持的参数值
  share: {
    type: ['IM'],
    scene: ['WXSceneSession']
  },
  //只支持的参数值
  scanCode: {
    onlyFromCamera: [false],
    scanType: ['qrCode', 'barCode']
  }
};
//onUserCaptureScreen、onNetworkStatusChange没有适配，与uniapp的调用方式完全相同，可直接调用
const protocols = {
  previewImage: { // 图片预览
    args(fromArgs) {
      fromArgs.current = parseInt(fromArgs.current) || 0;
      const len = fromArgs.urls.length;
      if (!len) {
        return
      }
      fromArgs.urls = JSON.stringify(fromArgs.urls)
      if (fromArgs.current < 0) {
        fromArgs.current = 0;
      } else if (fromArgs.current >= len) {
        fromArgs.current = len - 1;
      }
      fromArgs.current = fromArgs.current.toString()
      return {
        current: 'index',
        urls: 'imageArray',
        indicator: false,
        loop: false,
        longPresssActions: false
      }
    }
  },
  //发起网络请求,返回的数据多于uni
  request: {
    name: 'fetchInternet',
    args(fromArgs) {
      fromArgs.url = fromArgs.url || '';
      fromArgs.method = fromArgs.method || 'GET';
      fromArgs.method = fromArgs.method.toLocaleLowerCase();
      if (isPlainObject(fromArgs.data)) {
        fromArgs.data = JSON.stringify(fromArgs.data);
      }
      if (isPlainObject(fromArgs.header)) {
        for (let key in fromArgs.header) {
          let arr = [];
          let keys = key.split('-');
          for (let value of keys) {
            value = value.charAt(0).toLocaleUpperCase() + value.slice(1);
            arr.push(value);
          }
          let arrStr = arr.join('-');
          fromArgs.header[arrStr] = fromArgs.header[key];
        }
      }
      fromArgs.header = fromArgs.header || {
        'Content-Type': 'application/json'
      };
      return {
        url: 'url',
        method: 'method',
        data: 'body',
        header: 'headers',
        timeout: 'timeout',
        dateType: false,
        responseType: false,
        sslVerify: false,
        withCredentials: false
      }
    },
    transData(res, fromArgs) {
      let { __options, ...cloneRes } = res;
      res = {
        data: cloneRes.data,
        statusCode: cloneRes.status,
        header: cloneRes.headers || fromArgs.header
      };
      if (__options !== undefined) {
        res.__options = __options;
      }
      return res;
    }
  },
  // 媒体资源api----------------------------------------------------------------------
  //选择图片
  chooseImage: {
    args(fromArgs) {
      if (!fromArgs.count) {
        fromArgs.count = 9
      }
      let count = parseInt(fromArgs.count);
      if (isNaN(count)) {
        return
      }
      if (count <= 0) {
        fromArgs.count = 1
      }

      if (!fromArgs.sourceType || (fromArgs.sourceType instanceof Array && fromArgs.sourceType.length === 0)) {
        fromArgs.sourceType = ['album', 'camera']
      }

      if ((fromArgs.sourceType).indexOf('album') !== -1 || ((fromArgs.sourceType).indexOf('camera') !== -1 && (fromArgs.sourceType).indexOf('album') !== -1)) {
        fromArgs.sourceType = 1
      } else {
        fromArgs.sourceType = 2
      }


      if (!fromArgs.sizeType || (fromArgs.sizeType instanceof Array && fromArgs.sizeType.length === 0)) {
        fromArgs.sizeType = ['original', 'compressed']
      }

      if ((fromArgs.sizeType).indexOf('compressed') !== -1 || ((fromArgs.sizeType).indexOf('original') !== -1 && (fromArgs.sizeType).indexOf('compressed') !== -1)) {
        fromArgs.sizeType = false
      } else {
        fromArgs.sizeType = true
      }

      return {
        count: 'maxSelectedCount',
        sizeType: 'showOrigin',
        sourceType: 'flag',
      }
    },
    transData(res) {
      let tempFilePaths = [];
      let templ = null;
      if (res instanceof Array) {
        templ = res;
      }
      let options = null;
      if (res.url) {
        let { __options, ...cloneRes } = res;
        options = __options;
        templ = cloneRes.url;
      }
      for (let key in templ) {
        tempFilePaths.push(templ[key]);
      };
      let tempFiles = [];
      let size = null;
      for (let key in templ) {
		let File = {};
        File.path = templ[key];
        File.name = templ[key].split("/")[templ[key].split("/").length - 1];
        File.size = size;
        tempFiles.push(File);
      }
     
      res = {
        tempFilePaths: tempFilePaths,
        tempFiles: tempFiles
      }
      if (options) {
        res.__options = options;
      }
      return res;
    }
  },

  //打开文件
  openDocument: {
    name: 'openFile',
    args(fromArgs) {
      return {
        filePath: 'filePath',
        fileType: false,
      }
    },
  },

  //删除文件
  removeSavedFile: {
    name: 'removeFile',
    args(fromArgs) {
      return {
        filePath: 'path',
      }
    }
  },
  // 显示吐司
  showToast: {
    args(fromArgs) {
      fromArgs.type = "n"
      return {
        title: 'msg',
        type: 'type',
        image: false,
        duration: false,
        position: false,

      }
    }
  },

  // hideLoading 默认透传，直接可以调用

  // 显示loading组件
  showLoading: {
    return: {
      mask: false,
      title: false
    }
  },

  //位置，返回位置信息 ------------------------

  getLocation: {
    args(fromArgs) {

      if (!fromArgs.type) {
        fromArgs.type = "gcj02"
      }
      if (!fromArgs.geocode) {
        fromArgs.geocode = false
      }
      if (fromArgs.geocode === true) {
        fromArgs.geocode = 1
      }
      if (fromArgs.geocode === false) {
        fromArgs.geocode = 0
      }

      return {
        type: "types",
        geocode: "type",
        altitude: false,
      }
    },

    returnValue(res, toArgs, fromArgs) {
      console.log(res)
      if (fromArgs.geocode === 1) {
        res['speed'] = null;
        res['altitude'] = null;
        res['verticalAccuracy'] = null;
        res['shorizontalAccuracy'] = null;
        res['accuracy'] = null;
      }
      console.log(fromArgs.types)
      if (fromArgs.types === "wgs84") {
        var coordtransform = require('coordtransform')
        var gcj02towgs84 = coordtransform.gcj02towgs84(res.longitude, res.latitude)
        res.longitude = gcj02towgs84[0];
        res.latitude = gcj02towgs84[1];
      }

      return (
        res = {
          latitude: 'latitude',
          longitude: 'longitude',
          speed: 'speed',
          accuracy: 'accuracy',
          altitude: 'altitude',
          verticalAccuracy: 'verticalAccuracy',
          shorizontalAccuracy: 'shorizontalAccuracy',
          adCode: 'postalCode',
          address: 'address',
          country: 'country',
          province: 'province',
          city: 'city',
          cityCode: 'cityCode',
          district: 'district',
          street: 'street',
          streetNum: 'streetNum',
          aoiName: 'aoiName',
          poiName: 'poiName'

        }
      )
    },

  },


  // 选择地理位置，并返回相关信息
  chooseLocation: {
    name: 'searchLocation',
    args(fromArgs) {
      if (!fromArgs.logititude) {
        fromArgs.geocode = '0'
      }
      if (!fromArgs.latitude) {
        fromArgs.latitude = '0'
      }

      return {
        keyword: false,
        longitude: "longitude",
        latitude: 'latitude',
      }
    },

    returnValue: {
      latitude: 'latitude',
      longitude: 'longitude',
      name: 'name',
      address: 'address',
    }

  },
  //使用线上地图打开地理位置
  openLocation: {
    args(fromArgs) {
      return {
        name: 'name',
        longitude: "longitude",
        latitude: 'latitude',
        scale: 'zoom',
        address: 'address'
      }
    },

  },
  //设置导航栏颜色
  setNavigationBarColor: {
    args(fromArgs) {
      return {
        frontColor: 'frontColor',
        backgroundColor: 'backgroundColor',
        animation: false
      }
    },
    returnValue(res) {
      console.log(1233)
      console.log(res)
      res.status = res.status || null;
      return {
        status: 'errMsg'
      }
    }
  },

  // 上传文件
  uploadFile: {
    args(fromArgs) {
      fromArgs.url = fromArgs.url || '';
      fromArgs.formData = fromArgs.formData || {};
      fromArgs.filePath = fromArgs.filePath || '';
      if (fromArgs.files && fromArgs.files instanceof Array) {
        if(fromArgs.files.length === 1 && isPlainObject(fromArgs.files[0])){
          let file = fromArgs.files[0];
          for (let key in file) {
            if (['uri', 'name'].includes(key)) {
              if (key === 'uri') {
                fromArgs.filePath = file[key];
              }
              fromArgs[key] = file[key];
            }
          }
        }
        if(fromArgs.files.length !== 1){
          console.warn('uploadFile的files数组长度只能为1')
        }
      }
      if(fromArgs.files && !(fromArgs.files instanceof Array)){
        console.warn('uploadFile的files格式只能为数组')
      }
      if (fromArgs.timeout) {
        let timeout = parseInt(fromArgs.timeout);
        if (isNaN(timeout)) {
          // return;
        }
      }
      fromArgs.progress = 1;
      if (fromArgs.progress) {
        fromArgs.progress = parseInt(fromArgs.progress);
      }
      if (fromArgs.progress === 1) {
        fromArgs.onProgress = fromArgs.onProgress || function () {}
      }
      if (isNaN(fromArgs.progress) || [0, 1].indexOf(fromArgs.progress) === -1) {
        // return
      }
      return {
        url: 'serverUrl',
        formData: 'formData',
        filePath: 'filePath',
        name: 'name',
        header: 'headers',
        timeout: 'timeout',
        progress: 'progress',
        onProgress: 'onProgress',
        fileType: false
      }
    },
    transData(res) {
      let { __options, ...cloneRes } = res;
      res = {
        data: cloneRes,
        statusCode: null
      };
      if (__options !== undefined) {
        res.__options = __options;
      }
      return res;
    }
  },

  //下载文件，支持进度回调
  downloadFile: {
    args(fromArgs) {
      fromArgs.url = fromArgs.url || '';
      let headers = {
        name: 'headers',
        value: fromArgs.header
      }
      return {
        url: 'url',
        filePath: 'filePath',
        header: headers
      }
    },
    returnValue(res) {
      if (res && typeof res.status === 'string') {
        res.status = Number(res.status);
      }
      return {
        filePath: 'tempFilePath',
        status: 'statusCode'
      }
    }
  },
  //设置标题到导航栏，同名
  setNavigationBarTitle: {
    args(fromArgs) {
      fromArgs.title = fromArgs.title || '';
      return {
        title: 'title'
      }
    }
  },
  //打开其他We码小程序适配navigateToWecode
  navigateToMiniProgram: {
    name: 'navigateToWecode',
    transFroms(fromArgs) {
      fromArgs.appId = fromArgs.appId || '';
      if (isNaN(parseInt(fromArgs.appId))) {
        console.warn('navigateToMinProgram的appId格式有误');
      }
      fromArgs.path = fromArgs.path || '/html/index.html';
      let uri = 'h5://' + fromArgs.appId;
      fromArgs.envVersion = fromArgs.envVersion || 'release';
      if (fromArgs.envVersion === 'develop') {
        uri = uri + '.debug' + fromArgs.path;
      } else if (fromArgs.envVersion === 'trial') {
        uri = uri + '.dev.debug' + fromArgs.path;
      } else {
        uri = uri + fromArgs.path;
      }
      return {
        uri: uri,
        extraData: fromArgs.extraData || {}
      }
    },
    args(fromArgs) {
      return {
        path: 'uri',
        extraData: 'extraData'
      }
    }
  },
  //返回到上一个We码，并传参
  navigateBackMiniProgram: {
    name: 'navigateBackWecode',
    args(fromArgs) {
      fromArgs.extraData = fromArgs.extraData || {}
      return {
        extraData: 'extraData'
      }
    }
  },
  //回到上一个历史记录页面
  navigateBack: {
    args(fromArgs) {
      return {
        delta: false,
        animationType: false,
        animationDuration: false
      };
    }
  },
  //拨打电话，makeWay： 0代表不回拨， 1代表回拨
  makePhoneCall: {
    args(fromArgs) {
      fromArgs.phoneNumber = fromArgs.phoneNumber || '';
      if (fromArgs.makeWay === undefined) {
        fromArgs.makeWay = 0;
      } else {
        fromArgs.makeWay = Number(fromArgs.makeWay);
      }
      return {
        phoneNumber: 'dialNumber',
        makeWay: 'makeWay'
      }
    }
  },
  //分享
  share: {
    transFroms(fromArgs) {
      fromArgs.type = 'IM';
      fromArgs.title = fromArgs.title || '';
      fromArgs.href = fromArgs.href || '';
      fromArgs.from = fromArgs.from || '';
      if (fromArgs.isPCDisplay) {
        fromArgs.isPCDisplay = parseInt(fromArgs.isPCDisplay);
      }
      if (fromArgs.isPCDisplay === 1) {
        fromArgs.pcUri = fromArgs.pcUri || '';
      }
      if (isNaN(fromArgs.isPCDisplay) || [0, 1].indexOf(fromArgs.isPCDisplay) === -1) {
        // return;
      }
      let data = {};
      for (let key in fromArgs) {
        if (['title', 'href', 'from', 'summary', 'isPCDisplay', 'pcUri', 'imageUrl'].indexOf(key) !== -1) {
          switch (key) {
            case 'href':
              data['h5Uri'] = fromArgs[key];
              break;
            case 'summary':
              data['desc'] = fromArgs[key];
              break;
            case 'imageUrl':
              data['iconURL'] = fromArgs[key];
              break;
            default:
              data[key] = fromArgs[key];
          }
        }
      }
      return {
        type: fromArgs.type,
        data: data
      }
    },
    args(fromArgs) {
      return {
        type: 'type',
        data: 'data',
        provider: false,
        mediaUrl: false,
        miniProgram: false
      };
    }
  },
  //调起扫码界面进行扫码
  scanCode: {
    args(fromArgs) {
      fromArgs.needResult = fromArgs.needResult || 0;
      if ((isNaN(fromArgs.needResult) && fromArgs.needResult !== undefined) || [0, 1].indexOf(fromArgs.needResult) === -1) {
        // console.warn('');
      }
      if (!(fromArgs.scanType instanceof Array)) {
        console.warn('scanCode的scanType为数组类型');
      }
      return {
        needResult: 'needResult',
        scanType: 'scanType',
        onlyFromCamera: 'onlyFromCamera'
      }
    },
    // eslint-disable-next-line no-empty-pattern
    returnValue(res, {}, requestArgs) {
      const returnArgs = ['scanType', 'charSet', 'path'];
      for (let value of returnArgs) {
        if (!res[value]) {
          if (value === 'scanType' && requestArgs[value]) {
            let types = [];
            for (let key of requestArgs[value]) {
              if (difApi['scanCode'][value].includes(key)) {
                types.push(key);
              }
            }
            res[value] = types;
          } else if (value === 'path') {
            res[value] = res.content;
          } else {
            res[value] = null;
          }
        }
      }
      return {
        content: 'result'
      }
    }
  },
  //设置屏幕亮度，value是0~1之间的值
  setScreenBrightness: {
    args(fromArgs) {
      fromArgs.value = fromArgs.value || 1;
      fromArgs.value = parseFloat(fromArgs.value);
      return {
        value: 'value'
      }
    },
    returnValue(res) {
      return {
        status: 'status'
      }
    }
  },
  // 获取屏幕亮度
  getScreenBrightness: {
    returnValue(res) {
      res.value = res.value || null;
      return {
        'value': 'value'
      }
    }
  },
  //振动，没有震动长短之分，只按默认值
  vibrate: {
    returnValue(res) {
      return {
        status: 'status'
      }
    }
  },
  //获取网络类型，返回是否有网络，网络类型是wifi还是4g/3g/2g
  getNetworkType: {
    returnValue(res) {
      return {
        status: 'status',
        type: 'networkType'
      }
    }
  },
  //获取系统信息：包含设备OS类型、设备版本、设备名称，屏幕宽高和位置暂时获取不到，后面可以做优化
  getSystemInfo: {
    name: 'getDeviceInfo',
    returnValue(res) {
      let returns = ['brand', 'pixelRatio', 'screenWidth', 'screenHeight', 'windowWidth', 'windowHeight', 'windowTop', 'windowBottom'];
      for (let value of returns) {
        if (!res[value]) {
          res[value] = null;
        }
      }
      return {
        deviceName: 'model',
        osType: 'platform',
        osVersion: 'system',
        deviceID: 'deviceID'
      }
    }
  },
  //JSAPI权限校验，//返回值
  // canIUse: {
  //   args(fromArgs) {
  //     if(!(fromArgs.schema instanceof Array) && fromArgs.schema !== undefined){
  //       return;
  //     }
  //     return {
  //       schema: fromArgs.schema
  //     }
  //   },
  //   transData(res){
  //     if(isPlainObject(res)){
  //       let cloneRes = Object.assign(res);
  //       res = {
  //         data: cloneRes
  //       }
  //     }
  //     return res;
  //   }
  // },
  //设置指定key值缓存
  setStorage: {
    name: 'setStorage',
    args(fromArgs) {
      fromArgs.key = fromArgs.key || '';
      fromArgs.isolation = fromArgs.isolation || 0;
      return {
        key: 'key',
        data: 'data',
        isolation: 'isolation'
      }
    }
  },
  
  getStorage: {
    args (fromArgs) {
      return fromArgs.key;
    },
    transData(res) {
      let templ = null;
      let options = null;
      if(res instanceof Object){
        let { __options, ...cloneRes } = res;
        templ = cloneRes;
        options = __options;
      } else {
        templ = res;
      }
      res = {
        data: templ
      }
      if (options !== null) {
        res.__options = options;
      }
    }
  },
  //清除所有缓存
  clearStorage: {
    name: 'clearStorage',
    returnValue(res) {
      return {
        data: res || null
      }
    }
  },
  //删除指定缓存
  removeStorage: {
    name: 'removeStorage',
    args(fromArgs) {
      fromArgs.key = fromArgs.key || '';
      return {
        key: 'key',
        isolation: 'isolation'
      }
    },
    returnValue(res) {
      return {
        data: res || null
      }
    }
  }
};
const CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue))
  }
}

function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false, requestArgs) {
  if (isPlainObject(fromArgs) || fromArgs instanceof Object) { // 一般 api 的参数解析
    const toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs, requestArgs) || {};
    }
    // We码中有单个参数为字符串的，需直接返回，如 getStorage()
    if (typeof argsOption === 'string') {
      return argsOption;
    }
    for (let key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        let keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) { // 不支持的参数
          console.warn(`We码小程序 ${methodName} 暂不支持 ${key}`);
        } else if (isStr(keyOption)) { // 重写参数 key
          if (difApi[methodName] && difApi[methodName][key] instanceof Array) {
            if (fromArgs[key] instanceof Array) {
              for (let i of fromArgs[key]) {
                if (!(difApi[methodName][key].includes(i))) {
                  console.warn(`We码小程序的 ${key} 参数不支持值为 ${i}`)
                }
              }
            } else {
              if (!(difApi[methodName][key].includes(fromArgs[key]))) {
                console.warn(`We码小程序的 ${key} 参数不支持值为 ${fromArgs[key]}`)
              }
            }
          }
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) { // {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        } else if (keyOption instanceof Array) {
          toArgs[key] = fromArgs[key];
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key]);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs);
  } else if (isFn(argsOption)) {
    let _returnValue = argsOption(fromArgs);
    if (isPlainObject(fromArgs)) {
      fromArgs = processArgs(methodName, fromArgs, _returnValue, {})
    }
    fromArgs = _returnValue;
  }


  return fromArgs
}

function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
  if (isFn(protocols.returnValue)) { // 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue)
}

/** modify by wecode team start */
function processReturnPromiseValue(methodName, res, returnValue, keepReturnValue = false, requestArgs, args, transData) {
  let promise = null;
  if(methodName === 'uploadFile') {
    // eslint-disable-next-line no-inner-declarations
    function onProgress (data) {
      if (promise && promise.userFun) {
        promise.userFun(data);
      }
    }
    args[0].onProgress = onProgress;
  }
  promise = res.then(async (payload) => {
    // 异步请求需单独处理下data
    if (methodName === 'request') {
      const headers = requestArgs.header;
      // let data = data;
      if ((headers['content-type'] || headers['Content-Type']) === 'application/json') {
        payload.data = await payload.json();
      } else {
        payload.data = await payload.text();
      }
    }
    if (isFn(protocols.returnValue)) { // 处理通用 returnValue
      payload = protocols.returnValue(methodName, payload);
    }
    if (isFn(transData)) { // 转换数据
      payload = transData(payload, requestArgs);
      for (let key in payload) {
        if (!payload[key]) {
          console.warn(`We码平台不支持${methodName}的${key}返回参数`);
        }
      }
    }
    const resultData = processArgs(methodName, payload, returnValue, {}, keepReturnValue, requestArgs)
    // 如有success方法，则返回数据
    if (isFn(requestArgs['success'])) {
      requestArgs['success'](resultData);
    }
    if (isFn(requestArgs['complete'])) {
      requestArgs['complete'](resultData);
    }
    return resultData;
  }).catch((error) => {
    console.log('-----error:', error)
    if (isFn(requestArgs['fail'])) {
      requestArgs['fail'](error);
    }
    return error;
  });
  if(methodName === 'uploadFile') {
    promise.onProgressUpdate = function (fun) {
      promise.userFun = fun;
    }
    Object.defineProperties(promise, {
      abort: {
        get: function () {
          tips(methodName, 'abort', 'method');
          return () => {};
        }
      },
      onHeadersReceived: {
        get: function () {
          tips(methodName, 'onHeadersReceived', 'method');
          return () => {};
        }
      },
      offProgressUpdate: {
        get: function () {
          tips(methodName, 'offProgressUpdate', 'method');
          return () => {};
        }
      },
      offHeadersReceived: {
        get: function () {
          tips(methodName, 'offHeadersReceived', 'method');
          return () => {};
        }
      }
    })
  }
  return promise;
}
/** modify by wecode team end */


function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    const protocol = protocols[methodName];
    if (!protocol) { // 暂不支持的 api
      return function () {
        console.error(`We码小程序暂不支持${methodName}`);
      }
    }
    return function (arg1, arg2) { // 目前 api 最多两个参数
      let isFetch = methodName === 'request';
      let options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }
      //入参结构转换
      if (isFn(options.transFroms)) {
        arg1 = options.transFroms(arg1);
      }
      let newArg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      // newArg1.progress = 1;
      let args = [newArg1];
      // 转化为fetch请求，特殊api，需单独处理：由obj参数处理成 (url,options)
      if (isFetch) {
        const { url, ..._options } = newArg1;
        args = [url, _options];
      }
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      if (!HWH5[options.name || methodName]) {
        console.error(`We码小程序暂不支持${methodName}`);
      } else {
        const returnValue = HWH5[options.name || methodName].apply(HWH5, args);
        /** modify by wecode team start */
        if (isPromise(returnValue)) {
          return processReturnPromiseValue(methodName, returnValue, options.returnValue, isContextApi(methodName), arg1, args, options.transData)
        }
        /** modify by wecode team end */
        // We码中，暂无同步api
        if (isSyncApi(methodName)) { // 同步 api
          return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName))
        }
        return returnValue
      }
    }
  }
  return method
}

const todoApis = Object.create(null);

const TODOS = [
  'onTabBarMidButtonTap',
  'subscribePush',
  'unsubscribePush',
  'onPush',
  'offPush',
  'getConnectedWifi',
  'canIUse'
];

function createTodoApi(name) {
  return function todoApi({
    fail,
    complete
  }) {
    const res = {
      errMsg: `${name}:fail:暂不支持 ${name} 方法`
    };
    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  }
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null
});

const getEmitter = (function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter
  }
  let Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new Vue();
    }
    return Emitter
  }
})();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args)
}

function $on() {
  return apply(getEmitter(), '$on', [...arguments])
}
function $off() {
  return apply(getEmitter(), '$off', [...arguments])
}
function $once() {
  return apply(getEmitter(), '$once', [...arguments])
}
function $emit() {
  return apply(getEmitter(), '$emit', [...arguments])
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit
});

var api = /*#__PURE__*/Object.freeze({
  __proto__: null
});

let uni = {};

if (typeof Proxy !== 'undefined') {
  uni = new Proxy({}, {
    get(target, name) {
      if (target[name]) {
        return target[name]
      }
      if (baseApi[name]) {
        return baseApi[name]
      }
      if (api[name]) {
        return promisify(name, api[name])
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name])
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name])
        }
      }
      if (eventApi[name]) {
        return eventApi[name]
      }
      if (!hasOwn(HWH5, name) && !hasOwn(protocols, name)) {
        return
      }
      return wrapper(name, HWH5[name])
    },
    set(target, name, value) {
      target[name] = value;
      return true
    }
  });
} else {
  Object.keys(baseApi).forEach(name => {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(name => {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(name => {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(name => {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(name => {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(HWH5).forEach(name => {
    if (hasOwn(HWH5, name) || hasOwn(protocols, name)) {
      uni[name] = wrapper(name, HWH5[name]);
    }
  });
}

if (typeof window !== 'undefined' && window.uni) {
  uni.getSystemInfoSync = window.uni.getSystemInfoSync; // 此方法必须存在，用于页面 uptopx 等操作。
  for (let key in window.uni) {
    if (!protocols[key] && !HWH5[key] && !baseApi[key] && !extraApi[key] && !eventApi[key]) {
      uni[key] = window.uni[key];
    }
  }
  window.uni = uni;
}
var uni$1 = uni;
module.exports = uni$1;
