## uniapp适配We码JSAPI的文档说明

以下适配的API都是We码支持的，其他未说明的API可按照 [uniapp官网](https://uniapp.dcloud.io) 的说明直接调用。
 |接口说明|HWH5|UNIAPP|入参|返回值|备注
 |---|---|---|---|---|---|
 |选择图片或使用相机拍照|chooseImage|chooseImage|1.只支持选择original或compressed中的一种，不能同时都有。2.只支持选择album或camera中的一种，不能同时都有|不返回File对象的size属性|---|
 |打开在线图片预览界面|previewImage|previewImage|indicator,loop,longPressAction参数不适配|---|---|
 |打开文件|openFile|openDocument|fielType参数不适配|---|---|
 |删除文件|removeFile|removeSavedFile|---|平台会多返回参数status|---|
 |吐司信息|showToast|showToast|image,duration,position，icon,mask参数不适配|---|---|---|
 |展示loading组件|showLoading|showLoading|mask,type参数不适配|---|---|---|
 |隐藏loading组件|hideLoading|hideLoading|mask,type参数不适配|---|---|---|
 |获取当前地理位置|getLoaction|getLoaction|不适配altitude参数|speed,altitude,verticalAccuracy,shorizontalAccuracy,accuracy属性返回值为null|---|
 |打卡位置选择|searchLocation|chooseLocation|keyword参数不适配|---|---|
 |使用线上地图打开地理位置|openLoaction|openLoaction|latitude和longitude只支持number类型|---|---|
 |设置导航栏背景颜色，字体颜色|setNavigationBarColor|setNavigationBarColor|animation参数不适配|---|---|
 |录音|recordAudio|getRecordManager|不适配onFrameRecorded方法
 |---|---|
 |发起网络请求|fetchInternet|request|1.dateType,responseType,sslVerify参数不适配; 2.只适配method的值为GET、PUT、POST、DELETE|---|---|
 |上传文件|uploadFile|uploadFile|fileType参数不适配|statusCode属性返回值为null|---|
 |下载文件|downloadFile|downloadFile|---|---|---|
 |设置标题到导航栏|setNavigationBarTitle|setNavigationBarTitle|---|---|---|
 |打开其他We码小程序|navigateToWecode|navigateToWecode|---|---|---|
 |返回到上一个We码|navigateBackWecode|navigateBackWecode|---|---|---|
 |回到上一个历史记录页面|navigateBack|navigateBack| delta,animationType,animationDuration参数不适配|---|---|
 |拨打电话|makePhoneCall|makePhoneCall|---|---|---|
 |调用IM分享功能|share|share|1.provider,mediaUrl,miniProgram参数不适配；2.只适配type的值为IM，scene的值为WXSceneSession|---|---|
 |调起扫码界面进行扫码|scanCode|scanCode|---|---|---|
 |监听用户主动截屏事件|onUserCaptureScreen|onUserCaptureScreen|---|---|---|
 |网络状态变化事件|onNetworkStatusChange|onNetworkStatusChange|---|---|---|
 |设置屏幕亮度|setScreenBrightness|setScreenBrightness|---|---|---|
 |获取屏幕亮度|getScreenBrightness|getScreenBrightness|---|---|---|
 |振动|vibrate|vibrate|---|---|---|
 |获取网络类型|getNetworkType|getNetworkType|---|---|---
 |获取系统信息：包含设备OS类型、设备版本、设备名称|getDeviceInfo|getSystemInfo|brand,pixelRatio,screenWidth,screenHeight, windowWidth, windowHeight,windowTop,windowBottom参数不适配|---|---|
 |设置缓存|setStorage|setStorage|增加了isolation参数|---|---|
 |获取缓存|getStorage|getStorage|增加了isolation参数|---|---|
 |清除缓存|clearStorage|clearStorage|---|---|---|
 |删除缓存|removeStorage|removeStorage|增加了isolation参数|---|---|
 |生命周期事件|onLaunch  onShow  onHide  onClose|onLaunch  onShow  onHide  onClose|---|---|在main.js文件做了适配|
 |背景音频播放|getBackgroundAudioManager|getBackgroundAudioManager|1/1.duration,currentTime,paused,buffered,title,epname,singer,coverImgUrl,webUrl,protocol属性和onCanplay,onPrev,onNext,onWaiting方法不适配；2.增加了background,repeat,playbackSpeed属性|---|---|





 
 
 
 
 
 
 
 


