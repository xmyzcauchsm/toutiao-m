module.exports = {
  plugins: {
    // 配置使用autoprefixer，生成浏览器CSS样式前缀
    // 'autoprefixer':{
    //     // 配置要兼容的环境信息
    //     browsers:['Android >= 4.0','iOS >= 8']
    // },
    'postcss-pxtorem': {
      rootValue ({ file }) {
        console.log(file)
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*']
    }
  }
}
