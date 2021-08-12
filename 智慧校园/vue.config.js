
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = function () {
  const { WECODE_PLATFORM } = process.env;
  const ISLOCALDEV = process.env.NODE_ENV === 'development';
  const targetPluginPath = '.wecode/plugin.json';
  const buildPluginPath = `${process.env.UNI_OUTPUT_DIR}/plugin.json`;

  return {
    devServer: {
      before: function (app, server, compiler) {
        if(WECODE_PLATFORM) { 
          // 1、开发时引入We码JSAPI
          const platform = process.env.UNI_PLATFORM;
          const commonPath = path.join(__dirname, 'node_modules/@wecode/wlk-jsapi/lib');
          if (platform === 'h5') { // We码本地调试，引入 jsapi common 包
            app.use(express.static(path.join(commonPath))); // common 包路径
          }
        }
      }
    },
    configureWebpack: {
      plugins: [
        WECODE_PLATFORM && new CopyPlugin([
          // 2、编译时复制根目录的plugin.json至编译完之后的目录
          !ISLOCALDEV && { from: targetPluginPath, to: buildPluginPath }
        ].filter(Boolean)),
        WECODE_PLATFORM && new WeCodeCheckDoneHooksPlugin({
          head: {
            links: ['../../../common/css/hwh5.css']
          },
          body: {
            scripts: ['../../../common/js/hwh5.js']
          }
        }),
        WECODE_PLATFORM && new webpack.DefinePlugin({
          'process.env.WECODE_PLATFORM': JSON.stringify(WECODE_PLATFORM)
        })
      ].filter(Boolean)
    }
  }
}

const pluginName = 'WeCodeCheckDoneHooksPlugin';
class WeCodeCheckDoneHooksPlugin {

  constructor(options = { message: null }) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap(pluginName, (stats) => {
      // 报错时，需通知IDE插件，处理，避免IDE一直处理监听状态，而无法处理其他任务。
      if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
        console.error('Build fail.');
        const { message } = this.options;
        let requestMessage = null;
        try {
          requestMessage = JSON.parse(message);
        } catch (error) {
          console.log(error);
        }
        if (!requestMessage) {
          console.log('message arg is null.');
          return;
        }
        if (requestMessage && process && process.send) {
          const processMessage = {
            status: 'error',
            request: requestMessage, // 同一进程需要回相同数据给IDE，便于IDE识别进程类别如start或者build
            message: {
              tip: 'Build fail.',
              details: stats.compilation.errors.join(',')
            }
          };
          process.send(processMessage);
        }
      }
    })
    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        pluginName,
        (htmlPluginData, cb) => {
          const {
            head = { links: [] },
            body = { scripts: [] }
          } = this.options;
          head.links.reverse().forEach(function(value) {
            htmlPluginData.head = [
              {
                "tagName": "link",
                "closeTag": true,
                "attributes": { "rel": "stylesheet", "href": value }
              }
            ].concat(htmlPluginData.head);
          });

          body.scripts.reverse().forEach(function(value) {
            htmlPluginData.body = [
              {
                "tagName": "script",
                "closeTag": true,
                "attributes": { "type": "text/javascript", "src": value }
              }
            ].concat(htmlPluginData.body);
          });
          return cb(null, htmlPluginData)
        }
      )
    })
  }
}