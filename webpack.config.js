const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/js/client/index.js',
    mode: "development",
    devtool: "source-map",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            idendifier: 'module',
            $: 'jquery',
            L: 'leaflet',
            _map: ['lodash', 'map'],
            Vue: "vue"
        })
    ]
};
