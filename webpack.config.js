/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) 2018  jeffy-g hirotom1107@gmail.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/
// @ts-check

//
// webpack config for ts file.
//

/** @typedef {import("webpack").Configuration} WebpackConfigration */

/**
 * 
 * @param {"development" | "production"} [mode] default is "development"
 * @type {(ugOptions: { [k: string]: any }, mode?: string) => WebpackConfigration} 
 */
function getWebpackConfig(ugOptions, mode) {

    // extend "webpack.configjs".
    const webpackConfig = require("./webpack.configjs")(ugOptions, mode);

    webpackConfig.entry = {
        webpack: "./src/init.ts",
        "typeid-map": "./src/eve/api/typeid-map.ts"
    };

    const wm = webpackConfig.module;
    webpackConfig.module = {
        ...wm,
        rules: [
            {
                test: /\.tsx?$/,
                // DEVNOTE: Possible values:
                //   'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' |
                //   'webassembly/sync' | 'webassembly/async' | 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
                // DEVNOTE: If set tsconfig@compilerOptions@module to something other than "commonjs" such as "esnext", it seems that the "type" property needs to be "javascript/auto"
                // type: "javascript/auto",
                use: [
                    {
                        // see: https://github.com/s-panferov/awesome-typescript-loader#the-best-typescript-loader-for-webpack
                        loader: "ts-loader",
                        options: {
                            // 191212 - enable tsc --build 
                            // projectReferences: true,
                            // exclude: /node_modules/, // this option not exists.
                            // true -> doWebpack::webpack: 11341.385ms
                            // false -> doWebpack::webpack: 18702.002ms
                            transpileOnly: true, // DEVNOTE: this option cannot work on ts-loader@7.x with projectReferences option (maybe
                            // happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
                        }
                    },
                ]
            }
        ],
    };

    return webpackConfig;
}

module.exports = getWebpackConfig;
