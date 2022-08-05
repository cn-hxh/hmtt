// 封装中间件函数插件
export const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      // inserted 函数在指令所在标签被插入真实 DOM 时触发，如果标签用 display: none 隐藏再出现，则不会再触发 inserted 函数
      inserted (el) {
        // 指令用在的 van-search 组件
        // 组件根标签是 div，input 在 div 的内部
        // 以上都是原生标签对象
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          if (theInput) {
            theInput.focus()
          }
          if (theTextArea) {
            theTextArea.focus()
          }
        }
      },
      // updated 函数会在指令所在标签被更新时触发
      update (el) {
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          if (theInput) {
            theInput.focus()
          }
          if (theTextArea) {
            theTextArea.focus()
          }
        }
      }
    })
  }
}
