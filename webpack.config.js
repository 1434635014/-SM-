/**
 * Created by Administrator on 2017/6/26/026.
 */

let path = require("path");
/*
let ExtractTextPlugin = require('extract-text-webpack-plugin');
*/

module.exports = {
    entry: {
        // all: path.resolve(__dirname,'./src/develop/all.js'),
        // tweeter: path.resolve(__dirname,'./src/develop/tweeter.js'),
        // tweeterH5: path.resolve(__dirname,'./src/develop/tweeterH5.js'),
        test: path.resolve(__dirname,'./src/develop/test.js'),
        // paging: path.resolve(__dirname,'./src/develop/paging.js'),
        pc: path.resolve(__dirname,'./src/develop/pc.js'),
        cell: path.resolve(__dirname,'./src/develop/cell'),
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'js/SnowMoon.[name].js'
        /*publicPath:'http://cdn.com'*/             //指定线上路径：上线项目
    },
    module:{
        loaders:[
            {
                test:/\.js$/, loader: 'babel-loader',
                exclude:path.resolve(__dirname,'node_modules/'),             //不让处理node_modules里的文件
                include:path.resolve(__dirname,'src/'),                      //只打包src下的文件
                query:{
                    presets: ['latest']
                }
            },{
                test:/\.css$/, loader:'style-loader!css-loader?importLoaders=1!postcss-loader',
                /*loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader','postcss-loader'] })*/
            },{
                test:/\.scss/,
                loader: 'style-loader!css-loader!postcss-loader!sass-loader',
                /*loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader','postcss-loader','sass-loader'] })        //将样式文件抽离出来*/
            },{
                test: /\.(jpe?g|png|gif)$/i, loader:"url-loader?limit=10000&images/[name].[ext]"           //limit为文件大小限制,单位为bit
            }, {
                test: /\.(eot|svg|ttf|woff)$/, loader: "file-loader?name=fonts/[name].[ext]"
            }
        ]
    },

};