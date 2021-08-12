# 使用uni-app模板开发
-----------------------------

### 前言

更多uni-app开发技巧和学习指南可参考[uni-app 官网](https://uniapp.dcloud.io)。

使用uni-app开发框架可以快速构建和开发We码程序，基于uni-app官方提供的模板，注入了jssdk，符合We码规范。

+ We码要遵循WeLink目录规范才可在WeLink上正常运行。此模板会自动构建符合WeLink规范的代码包。

+ 集成了WeLink JSAPI，构建项目时会自动引入JSAPI。通过JSAPI就可以调用WeLink 原生能力。

> We码开发文档URL: https://open.welink.huaweicloud.com/wecode/index.html#/wecode/doc

### 目录结构
- [安装npm依赖](#安装npm依赖)
- [新建项目](#新建项目)
- [安装VUE语法高亮插件](#安装VUE语法高亮插件)
- [工程目录](#工程目录)
  + [引入图片和文件](#引入图片和文件)
  - [添加路由](#添加路由)
    + [路由跳转](#路由跳转)
  + [样式引用](#样式引用)
  + [国际化](#国际化)
  + [创建新页面](#创建新页面)
  + [真机调试](#真机调试)

### 安装npm依赖

We码提供的模板是基于uni-app 模板，在此基础上增加了一些功能，uni-app 模板需要另外安装依赖。

当新建uni-app项目后， We码开发者工具会自动打开，请跟进We码开发者工具提示，点击按钮安装依赖。或者也可以在项目根目录执行`npm install` 或 `yarn`

### 新建项目

通过We码开发者工具**新建项目**，选择项目类型“**uni-app模板**”。

> 为了帮助开发者快速开发We码小程序提升办公效率，我们准备了We码小程序开发者工具，该工具具备新建项目、代码编辑、程序模拟、真机预览、上传等功能。

### 安装语法高亮插件

语法高亮插件体积较大，目前We码开发者工具未内置该插件，但是我们可以手动添加。

+ 第一步，先通过浏览器，下载插件[vetur](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.24.0/vspackage)到本地。

+ 第二步，通过IDE【菜单栏】-【个性化】-【安装插件】，加载下载好文件： `octref.vetur-0.24.0.vsix`。
  
> 由于插件加载过程，会去安装一些依赖，时间可能有点久，请耐心等待，直至提示安装完成。

### 工程目录

项目文件结构如下：

```js
|—— dist                          
│   └── build                       // 默认无此目录，项目构建后自动产生，项目打包后的目录   
│—— doc                             // uni-app 详细说明文档        
├── public                          // 静态资源目录，不会进行编译、压缩、混淆
├── src                             // 源代码目录
│   ├── pages                       // 业务页面文件存放的目录
│   ├── static                      // 存放应用引用静态资源（如：图片、视频等）的目录。注意：静态资源只能存放于此
│   ├── App.vue                     // 应用配置，用来配置App全局样式以及监听
│   ├── main.js                     // Vue初始化入口文件
│   ├── manifest.json               // 配置应用名称、appid、logo、版本等打包信息
|   ├── pages.json                  // 配置页面路由、导航条、选项卡等页面类信息
│   ├── uni.scss                    // uni-app内置的常用样式
│   └── wecode.polyfill.js          // We码补丁文件，调用uni-app api能力不用改动代码即可实现适配We码对应jsapi能力
├── .gitignore                      // git忽略配置文件 
├── babel.config.js                 // uni-app babel 配置文件
├── package.json                    // npm 包管理文件
├── plugin.json                     // We码信息配置文件
├── postcss.config.js               // postcss 配置文件
├── tsconfig.json                   // typescript 配置文件
└── vue.config.json                 // vue webpack配置文件
```

### 引入图片和文件

```js
<template>
  <image class="logo" src="/static/logo.png" />
</template>
```
当项目构建完，模板 会将图片放到 `dist/build` 目录中，以及引用正确的访问地址。

同样适合在 CSS 中：

```css
.logo {
	background-image: url(/static/logo.png);
}
```

### 添加路由

在 `src/pages.json` 添加配置，如下：
 
```json
{
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			"path": "pages/index/index",
			"style": {
				"navigationStyle": "custom" // 取消默认的原生导航栏
			}
		}, { // 列表页面
			"path": "pages/list/list",
			"style": {
				"navigationStyle": "custom"
			}
		}
	]
}
```

#### `路由跳转`

方法：使用 <router-link> 组件进行跳转

```js
<template>
  <router-link to="/pages/list/list">跳转到XX页面</router-link>
</template>
```

### 样式引用

#### Xx.vue引入

```js
<template>
  <div class="title">{{title}}</div>
</template>
<script>
  import './index.css';
  export default {
    data() {
      return {};
    }
  };
</script>
```

### 国际化

[请参考uni-app 国际化指导](https://ask.dcloud.net.cn/article/35102)

### 创建新页面

第一步：在 `src/pages/list/` 目录下创建 `list.vue`：

```text
└───template/
    ├───src/
        ├───pages/index                
        ├───index.css                  
        ├───index.vue                  // 首页
        └───pages/list               
            └───list.vue               // 列表页
```

第二步： 在 在 `src/pages.json` 添加配置，例如：

```json
{
	"pages": [
		{ // 列表页面
			"path": "pages/list/list", // 路由地址
			"style": {
				"navigationStyle": "custom"
			}
		}
	]
}
```

### 真机调试

当新建 `uni-app` 项目时，在`public/index.html`中默认添加如下代码，是为了方便在真机上打开调试器调试代码。如不需要，请直接在`public/index.html`中注释或删除下面的代码即可。

```html
<script src="./static/vconsole.min.js"></script>
<script>
    // init vConsole
    var vConsole = new VConsole();
</script> 
```
