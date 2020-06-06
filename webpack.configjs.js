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
// webpack config for js file.
//

const path = require("path");

const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const utils = require("./etc/utils");

/**
 * output directory
 */
const WEBPACK_OUTPUT = "docs/";


/**
 * @typedef {import("webpack").Configuration} WebpackConfigration
 * @typedef {TerserPlugin.TerserPluginOptions["terserOptions"]["ecma"]} ECMA
 */

/**
 * @param {"development" | "production"} [mode] default is "development"
 * @type {(ugOptions: { [k: string]: any }, mode?: string) => WebpackConfigration}
 */
function getWebpackConfig(ugOptions, mode) {

    /**
     * @type {import("terser-webpack-plugin").TerserPluginOptions["terserOptions"]}
     */
    const terserOptions = {
        ecma: 8,
        // NOTE: The sourceMap setting of uglify in webpack v4,
        // It must be set with option of UglifyJsPlugin instance.
        // sourceMap: true,
        // decide mangle for var name, function name, class name
        parse: {
            ecma: 8,
        },
        mangle: false, //settings["mangle"],
        output: {
            ecma: 8,
            // beautify: true, //settings["uglifyes-beautify"],
            indent_level: 1,
            comments: false,
            max_line_len: 1800,
            quote_style: 0,
        },
        /*
          inline (default: true) -- inline calls to function with simple/return statement:
          
            false -- same as 0
            0 -- disabled inlining
            1 -- inline simple functions
            2 -- inline functions with arguments
            3 -- inline functions with arguments and variables
            true -- same as 3

          reduce_funcs (default: true)
            Allows single-use functions to be inlined as function expressions when permissible allowing further optimization.
            Enabled by default.
            Option depends on reduce_vars being enabled. Some code runs faster in the Chrome V8 engine if this option is disabled.
            Does not negatively impact other major browsers.

          reduce_vars (default: true) -- Improve optimization on variables assigned with and used as constant values

        */
        compress: {
            ecma: 8,
            // remove console.* at production mode.
            // drop_console: true
            inline: 3, // NOTE: 0:43 2019/08/01 - I'm not sure how to use this option..?
            reduce_funcs: true,
            reduce_vars: false,  //
        },
        // keep_fnames: /updateAuthDataTask/ meaningless
    };

    Object.assign(terserOptions, ugOptions || {});

    // DEVNOTE: 2019/9/21 improved mode specification
    mode = mode || "development";
    return {
        name: "Cerebral-next-web",
        // "production", "development", "none"
        mode,
        // https://webpack.js.org/configuration/target
        // can be omitted, default is "web"
        target: "web",
        // entry point
        entry: {
            // DEVNOTE: important - libraryTarget: "window"
            // format: [bundle source name]: [actual source path]

            // NOTE: init.ts(js) are not module.
            // so, basically output.library is unnecessary.
            webpack: "./build/init.js",
            // vendor: ["react", "react-dom"]
            "typeid-map": "./build/eve/api/typeid-map.js"
        },
        // output config.
        output: {
            path: `${__dirname}/${WEBPACK_OUTPUT}`,
            // NOTE: enable optimization.splitChunks then "webpack.js", "1.webpack.js".
            // use "[name].webpack.js": "index.webpack.js", "vendor.webpack.js".
            filename: "[name].js",

            // "var" (default), "window".
            libraryTarget: "var",
            // DEVNOTE: 2020/2/26 - https://webpack.js.org/configuration/output/#outputecmaversion
            //  - webpack@5
            // ecmaVersion: 2020 // ERROR: cannot work
        },

        // devServer: {
        //     contentBase: path.join(__dirname, WEBPACK_OUTPUT),
        //     // filename: "webpack",
        //     index: "index.html",
        //     port: 8111,
        //     publicPath: "/",
        //     hot: true,
        // },

        // https://webpack.github.io/docs/configuration.html#externals
        externals: [
            {
                fs: true,
                http: true, // this need for Electron version, web version are ignored this.
                electron: true,
                "winston": true,

                // format: [real source path for import]: [global name(in window etc)]
                // DEVNOTE: 2020/3/5 - dummy mapping, this entry is never used
                "./eve/api/typeid-map": ["x"]
                // "./eve/api/typeid-map": ["EVEApp", "EVETypeIdMap"], // -> module.exports = window["EVEApp"]["EVETypeIdMap"];
                // "./eve/api/typeid-map": true;                       // -> module.exports = window["./eve/api/typeid-map"];

                // DEVNOTE: the following are confusing...
                // "EVETypeIdMap": {
                //     // root: "self"
                //     root: ["EVEApp", "EVETypeIdMap"]
                // };
            }
        ],
        resolve: {
            // DEVNOTE: 2020/2/28 - https://webpack.js.org/configuration/resolve/#resolvemainfields
            // mainFields: ["module", "main"],
            extensions: [".ts", ".tsx", ".js"],
            // extensions: [".ts", ".tsx", ".js", ".json"],
            modules: [
                "./node_modules",
                path.resolve(__dirname, "src")
                // NOTE: With an absolute path, it will only search in the given directory.
                // https://webpack.js.org/configuration/resolve/#resolve-modules
                // path.resolve(__dirname, "./node_modules")  // - error...
            ],
            // DEVNOTE: 2020/3/5 - Attempt to resolve module path by "alias", but something was missing or intended result was not obtained
            // DEVNOTE: 2020/3/8 - solved above issue so `TsconfigPathsPlugin` is no longer needed
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@com": path.resolve(__dirname, "src/components"),
                "@eve": path.resolve(__dirname, "src/eve"),
                "@util": path.resolve(__dirname, "src/util"),
            },
            plugins: [
                // DEVNOTE: 2019/9/18 - https://github.com/dividab/tsconfig-paths-webpack-plugin
                //  - the tsconfig paths resolver
                //new TsconfigPathsPlugin(),
                // 
                // DEVNOTE: 2020/3/5
                // An attempt was made to generate a webpack source that bundled all sources as "esm" modules from the js source that was tsc built with module = "esnext" set,
                // but was eventually split due to module = "esnext" Only generated module could be created
                // 
                // new TsconfigPathsPlugin({
                //     configFile: "./tsconfig-js.json",
                //     baseUrl: "./build",
                //     extensions: [
                //         ".js"
                //     ]
                // }),
            ]
        },

        module: {
            // noParse: /^electron$|^fs$/,
            // noParse: noParseHandler(),
            rules: []
        },
        performance: {
            maxAssetSize : 10000000, // abount 10M
            maxEntrypointSize: 10000000,
        },

        plugins: [
            // DEVNOTE: 2020/3/5 - https://webpack.js.org/plugins/progress-plugin/
            //  -> However, this page doesn't seem to be currently managed, and had an old option property
            //  📝 if want more details see followings:
            //    scheme: node_modules/webpack/schemas/plugins/ProgressPlugin.json
            //     or - https://github.com/webpack/webpack/blob/master/lib/ProgressPlugin.js
            // new webpack.ProgressPlugin({
            //     // @ts-ignore 
            //     profile: true,
            // }),
            new webpack.ProgressPlugin(
                utils.createWebpackProgressPluginHandler(/* `./logs/${utils.dateStringForFile()}-webpack.log` */)
            ),

            // DEVNOTE: 2019/9/22
            // new webpack.HotModuleReplacementPlugin()
        ],

        // see: https://webpack.js.org/configuration/devtool/#devtool
        // 📝 "inline-source-map": add inline sourceMap to last line at build source
        //   -> ⚠️ too large size!
        devtool: mode === "development"? "source-map": false, // need this for complete sourcemap.
        optimization: {
            minimizer: [
                new TerserPlugin({
                    // Enable parallelization. Default number of concurrent runs: os.cpus().length - 1.
                    parallel: true,
                    cache: true,
                    // NOTE: The sourceMap setting of uglify in webpack v4,
                    // It must be set with option of UglifyJsPlugin instance.
                    sourceMap: true,
                    exclude: /typeid-map/,
                    terserOptions
                }),
                new TerserPlugin({
                    // Enable parallelization. Default number of concurrent runs: os.cpus().length - 1.
                    parallel: true,
                    cache: true,
                    // NOTE: The sourceMap setting of uglify in webpack v4,
                    // It must be set with option of UglifyJsPlugin instance.
                    sourceMap: false,
                    include: /typeid-map/,
                    terserOptions: {
                        mangle: true, compress: true,
                        output: {
                            // beautify: true, comments: false, indent_level: 1,
                            // ecma: 7,
                            max_line_len: 12000
                        }
                    }
                })
            ],
            // NOTE: "splitChunks" option are translate moduleId to number.
            // splitChunks: {
            //     name: "vendor",
            //     // Select chunks for determining shared modules (defaults to "async", "initial" and "all" requires adding these chunks to the HTML)
            //     chunks: "initial",
            // }
        },
        profile: false,
        cache: true,
        // CHANGES: 2019/9/22 - Setting recordsPath will essentially set recordsInputPath and recordsOutputPath to the same location.
        //   This is usually all that's necessary unless you decide to change the name of the file containing the records.
        //   - see https://webpack.js.org/configuration/other-options/#recordspath
        recordsPath: path.join(__dirname, "./etc/webpack-module-ids.json"),
    };
}

module.exports = getWebpackConfig;
