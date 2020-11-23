const path = require('path')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


module.exports = {
  entry: "./src/main.ts",
  output: {
    // 出口路径__dirname
    path: path.resolve(__dirname, 'dist'),
    filename: "main.js"
  },
  // 模式： 开发环境
  mode: 'development',
  devServer: {
    // 服务器根路径
    contentBase: "/dist",
    open: true, // 自动打开浏览器
  },
  // webpack 引入的文件不带后缀，webpack先找js,找不到就找json文件，再找不到报错
  // 这里修改为优先匹配ts文件，
  resolve: {
    // 省略以下文件的扩展名，之后匹配顺序见数组
    "extensions": ['.ts','.js','.json']
  },
  // 引入loader
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // css-loader让webpack 解析css语言，style-loader，将样式解析到浏览器上
        // 为了防止封装的组件内部css被污染，
        exclude: [
          path.resolve(__dirname,'src/components')
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader",{
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            }, // src/components下的css 文件开启模块化，防止类名冲突
          }
        }], 
        // 为了防止封装的组件内部css被污染，
        include: [
          path.resolve(__dirname,'src/components')
        ]
      },
      {
        test: /\.(eot|woff2|woff|ttf|svg)$/,
        use: ["file-loader"]
      },
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        // 排除node-Modules中的ts文件
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    // 自动将编译好的js文件引入html中，
    new HtmlWebpackPlugin({
      // 被引入js的html文件
      template: "./src/index.html",
      title: "sunny的小实践"
    }),
    new CleanWebpackPlugin()
  ]
}