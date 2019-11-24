const path = require('path');

module.exports = {
    entry: "./src/index.ts",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js" ]
    },
    
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },
        ],
    },

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'bin'),
    }
};