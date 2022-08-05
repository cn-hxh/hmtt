const path = require('path')
module.exports = {
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 直接覆盖变量
          // 'nav-bar-background-color': '#007bff',
          // 'nav-bar-title-text-color': '#fff'
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${path.join(__dirname, '/src/styles/cover.less')}";`
        }
      }
    }
  },
  publicPath: './' // 告诉 webpack 打包的 index.html 引入其它资源文件以 ./ 开头，不要默认 / 开头
}
