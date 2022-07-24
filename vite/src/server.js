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
    // 重写路径将 import Vue from 'vue' 转换成 import Vue from '@/modules/vue'
    moduleRewritePlugin,
    // 响应 @modules 请求
    moduleResolvePlugin,
    // 解析 .vue 请求，将 template 变成可执行的 render 方法
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
