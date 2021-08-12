# We码集成uniapp开发指南

本文介绍了对uniapp模板的改造以适配We码，以及开发We码的指南。集成步骤模板中已经完成，开发只需做了解即可。

## 如何使用IDE开发uniapp

开发前，需要准备好开发环境工作。确保电脑中已经安装了node环境，如未安装，可前往官网[下载node](https://nodejs.org/)。

安装成功后，可在终端中执行命令，确保安装已经完成：

```sh
node --version
```

然后安装依赖

```sh
npm install 或者 yarn
```

### 「调试」、「预览」和「上传」功能

说明：在wecode.json中，默认配置了启动脚本，请勿修改此配置。

wecode.json
```json
{
    ...
    "scripts": {
        "dev": "npm run serve:mp-wecode", // 「调试」启动逻辑
        "build": "npm run build:mp-wecode" // 「预览」和「上传」逻辑
    }
}
```

点击「预览」和「上传」功能时，


### 使用vConsole调试项目

在public/index.html中，可开启vConsole的代码，方便调试阶段使用（注意，生产环境不需要时，需要隐藏此代码逻辑）：

```html
<script src="./static/vconsole.min.js"></script>
<script>
    // init vConsole
    var vConsole = new VConsole();
</script>
```
