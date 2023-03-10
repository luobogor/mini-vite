const Koa = require('koa')
const moduleResolvePlugin = require('./serverPluginModuleResolve')
const moduleRewritePlugin = require('./serverPluginModuleRewrite')
const serverStaticPlugin = require('./serverPluginServerStatic')
const vuePlugin = require('./serverPluginVue')

function createServer() {
  let app = new Koa()

  const context = {
    app,
    root: process.cwd()
  }

  const resolvePlugin = [
    // 浏览器 es module 只识别路径，不识别模块，所以需要重写路径将 import Vue from 'vue' 转换成 import Vue from '@/modules/vue'
    moduleRewritePlugin,
    // 响应 @modules 请求，响应第三方库对应的 js 文件
    moduleResolvePlugin,
    // 解析 .vue 请求
    // - 无 type：将 .vue 解析成 .js，该 js 文件让浏览器再次发请求，通过 query.type 参数区分加载 SFC 各个模块
    // - type 为 template：将 template 变成可执行的 render 方法
    // - type 为 style：返回可执行的 js 脚本更新 style
    vuePlugin,
    // 静态服务返回 html 文件
    serverStaticPlugin,
  ]

  resolvePlugin.forEach(plugin => plugin(context))

  return app
}


createServer().listen(4000, () => {
  console.log('vite start ...')
})
