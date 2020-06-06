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
"use strict";

//
// imports
//
const path = require("path");
const fs = require("fs");

const del = require("del");
const pug = require("pug");
const gulp = require("gulp");
const greplace = require("gulp-replace");

/** @type {{ [key: string]: any }} */
// @ts-ignore cannot apply "resolveJsonModule" option
const thisPackage = require("./package.json");

const utils = require("./etc/utils");

//
// constants
//
/** ts compiled out put. */
const JS_DEST_DIR = "./build";
const SRC_DIR = "./src";

const SCSS_ROOT = `${SRC_DIR}/css`;
// "target", "module" property
const TSConfigPath = "./tsconfig-base.json";

// if need optional parametar.
/**
 * @typedef {object} BuildSettings
 * @prop {boolean} [debug]
 * @prop {boolean} [publish] + means use bundle script and shift css resource url
 *  + add google analytics code
 *  + ⚠️ Can not be used with electron option
 * @prop {boolean} [electron] build for electron (shift jquery cdn url etc)
 * @prop {boolean} [firebase] build for firebase site
 * @prop {boolean} [webpack]
 * @prop {boolean} [mangle] enable mangle for terser minifier
 * @prop {boolean} [noMinify] disable minifier
 * @prop {boolean} [nostrip] do not use "rm-cstyle-cmts" at not "production" build
 * @prop {"production" | "development"} [mode] specify webpack build mode (default: development)
 * @prop {string} [file] for `zip` task. can compress single resource.
 * @prop {string} [comment] for `zip` task. inject comment to compressed file.
 * @prop {string} [pugOutDir]
 * 
 * @prop {boolean} [major] version major?
 * @prop {boolean} [minor] version minor?
 */

/**
 * @type {BuildSettings}
 */
const settings = utils.getExtraArgs({ startIndex: 3, prefix: "--" }, true);

/** copy transpiled code for dist package. */
const COPY_FILEs = [
    `${SRC_DIR}/**/{main.css${settings.mode === "production" ? "": "*"},style.css,react-table.css,*.jpg}`,
    `${SRC_DIR}/**/!(jquery).js`,
    `${SRC_DIR}/**/!(*-web_page_load).png`, // OK
    `!${SRC_DIR}/eve/**/*.png`, // OK
];

// ------------------------------- shared function ------------------------------- //
/**
 * delete files by "globs" pattern.  
 * done callback(gulp) specified if need.
 * @param {string|string[]} globs file pattern.
 * @param {() => void} done gulp callback function.
 */
function _del_hook(globs, done) {
    del(globs, { force: true }).then(paths => {
        console.log(`Deleted files and folders:\n${paths.join("\n")}`);
        done && done();
    });
}

/**
 * 
 * @param {string} sourceFile 
 * @param {string} comment 
 */
function _zip(sourceFile, comment) {
    utils.compressScript(sourceFile, comment);
}
// gulp zip --file ./build/webpack.js --comment "this is test"
gulp.task("zip", done => {
    const { file, comment } = settings;
    if (file) {
        _zip(file, comment);
    } else {
        console.log(`usage: gulp zip --file [js path] --comment [zip entry comment]`);
    }
    done && done();
});

// for "webpack"
/**
 * it is bundled in webpack.js, other code becomes unnecessary.(at webpack
 * @param {() => void} done gulp callback function.
 * @requires openssl binary executable
 */
function postWebpacked(done) {

    console.log();
    console.log(" ---> running postWebpacked");

    const { exec } = require("child_process");
    /** @type {(src: string, signal?: () => void) => void} */
    const digestAndCompress = (scriptPath, doneSignal) => {
        exec(`openssl dgst -sha384 -binary ${path.normalize(scriptPath)} | openssl base64 -A`,
        // exec(`openssl dgst -sha384 -binary < ${path.normalize(scriptPath)} | openssl base64 -A`,
            (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                } else {
                    const sha384 = `sha384-${stdout}`;
                    console.log(sha384);
                    _zip(scriptPath, sha384);
                }
                if (doneSignal) {
                    doneSignal();
                }
            }
        );
    };
    const existsTypeMap = fs.existsSync(`${JS_DEST_DIR}/typeid-map.js`);

    digestAndCompress(`${JS_DEST_DIR}/webpack.js`, !existsTypeMap? done: void 0);
    console.log();
    if (existsTypeMap) {
        digestAndCompress(`${JS_DEST_DIR}/typeid-map.js`, done);
    }
    console.log(" <--- running postWebpacked");
}

/**
 * **replace main script element `src` attribute by `mainJsName`**.
 * 
 * @param {string} mainJsName main entry script name.
 * @param {string} dest resource copy destination.
 * @param {() => void} [done] notify callback. (optional
 */
function copyResource(mainJsName, dest, done) {
    // copy index.html and replace main script name. 
    gulp.src("./src/index.html").pipe( // always replace.
        greplace(/init.(?:js|ts)/, mainJsName)
    ).pipe(gulp.dest(dest));

    gulp.src("./callback/index.html").pipe(gulp.dest(dest + "/callback/"));
    gulp.src(COPY_FILEs).pipe(gulp.dest(dest)).on("end", () => {
        done && done();
    });
}
/**
 * generate `dependencies.ts`
 */
function createDependenciesTS() {
    const dependencies = {...thisPackage.dependencies};
    // for (const packageName of Object.keys(dependencies)) {
    //     if (packageName.includes("electron")) {
    //         dependencies[packageName] += "  (at Electron browser)";
    //     }
    // }
    utils.writeTextUTF8(
        `export const dependencies = ${JSON.stringify(dependencies, null, 1)};`,
        "./src/dependencies.ts"
    );
    // - - - -
}

/**
 * #### generate index.html from pug templete.
 * 
 *  gulp pug [--electron --pugOutDir ../out-repo]
 * 
 * @param {string} renderTo output directory. if not specified then apply "./src"
 * @param {() => void} [done] the callback (optional
 */
function doPug(renderTo, done) {
    console.log(settings);

    let cmpOption; {
        let json = utils.removeJsonComments(
            utils.readTextUTF8(TSConfigPath)
        );
        cmpOption = eval(`(${json})`).compilerOptions;
        // DEVNOTE: error when ends with trailing comma
        // cmpOption = JSON.parse(json).compilerOptions;
    }

    const appConfig = require(`${SRC_DIR}/page-config.json`);
    const pug_file = `${SRC_DIR}/index.pug`;
    const post_title = `(${thisPackage.version}, target: ${cmpOption.target}, ${cmpOption.module})`;
    // @ts-ignore missing function parameter detection
    let html = pug.renderFile(pug_file, /* locals: */ {
        pretty: true,
        compileDebug: false, // important?
        vars: {
            post_title,
            webpack: settings.webpack,
            publish: settings.publish,
            electron: settings.electron,
            firebase: settings.firebase,
        }
    });
    html = html.replace(
        /<!-- page-config-json -->/,
        `<script id="page-config" type="application/json">
${JSON.stringify(appConfig, null, 2)}
    </script>`);

    // 
    !renderTo && (renderTo = SRC_DIR);

    utils.writeTextUTF8(html, `${renderTo}/index.html`);
    if (settings.electron) {
        utils.fireReplace(
            /(?<=version: )"\d+\.\d+\.\d+-dev"/, `"${thisPackage.version}"`, ["./src/index.ts"]
        );
        // DEVNOTE: basically, it is a process unrelated to electron build
        // create DependenciesTS();
    }

    done && done();
    // return gulp.src([pug_file]).pipe(pug({ pretty: true }))
}


/**
 * #### compile sass file.
 * 
 *  node ./etc/build-tool -cmd sass [-destDir ../out-repo/css]
 * 
 * @param {string} destDir result output directory
 * @param {() => void} [done] callback when process done.
 */
function doSass(destDir, done) {

    const sass = require("sass");
    const name = "main";
    !destDir && (destDir = SCSS_ROOT);
    const resultFilePath = `${destDir}/${name}.css`;

    sass.render({
        file: `${SCSS_ROOT}/${name}.scss`,
        outFile: resultFilePath,
        outputStyle: "expanded",
        // sourceMap: true,  // default false
        // sourceMapContents: false,
        // // @ts-ignore https://sass-lang.com/documentation/js-api#sourcemapembed
        // embedSourceMap: false
    }, function (
        /** @type {import("sass").SassException} */error,
        /** @type {import("sass").Result} */result
    ) {
        if (!error) {
            const copyDest = `${JS_DEST_DIR}/css/`;
            // No errors during the compilation, write this result on the disk
            utils.writeTextUTF8(result.css, resultFilePath, () => {
                gulp.src([resultFilePath]).pipe(gulp.dest(copyDest));
                console.log(`${resultFilePath} -> ${copyDest}`);
            });
            if (result.map) {
                const mapFile = `${resultFilePath}.map`;
                utils.writeTextUTF8(result.map, mapFile, () => {
                    gulp.src([mapFile]).pipe(gulp.dest(copyDest));
                    console.log(`${mapFile} -> ${copyDest}`);
                });
            }
        }
    });

    done && done();
}

/**
 * 
 * @param {Error} err 
 * @param {import("webpack").Stats} stats 
 * @returns {boolean} when error occurs returns `true`
 */
const checkWebpackError = (err/* : Error */, stats/* : Stats */) => {
    if (err) {
        console.error(err.stack || err);
        // @ts-ignore 
        if (err.details) {
            // @ts-ignore 
            console.error(err.details);
        }
        return true;
    }

    const info = stats.toJson();
    let fail = false;
    let errorText = "";
    if (stats.hasErrors()) {
        fail = true;
        errorText += "[[errors]]\n" + info.errors.join("\n\n");
    }
    if (stats.hasWarnings()) {
        errorText += "\n\n[[warnings]]\n" + info.warnings.join("\n\n");
    }
    if (errorText) {
        utils.writeTextUTF8(errorText, `./logs/${utils.dateStringForFile()}-webpack-errors.log`);
    }

    return fail;
};
/**
 * @param {string} configFile 
 * @param {() => void} done 
 */
// gulp webpack:build --mode production --mangle
const doWebpack = (configFile, done) => {

    /** @typedef {import("webpack").Configuration} WebpackConfigration */
    const webpack = require("webpack");
    /** @type {WebpackConfigration} */
    const webpackConfig = require(configFile)(
        { mangle: !!settings.mangle },
        settings.mode
    );

    console.log(settings);

    settings["noMinify"] && (webpackConfig.optimization.minimizer = [], webpackConfig.optimization.minimize = false);

    console.time("doWebpack::webpack");
    webpack(webpackConfig, (err/* : Error */, stats/* : Stats */) => {
        console.log();
        console.timeEnd("doWebpack::webpack");
        if (checkWebpackError(err, stats)) {
            done && done();
            return;
        }
        console.log("- - - - > webpack process done <- - - -");
        // console.log("- - - - > webpack process done, error=%s <- - - -", err);
        if (settings.mode !== "production" && !settings.nostrip) {
            console.log("doWebpack::rm-cstyle-cmts firing");
            const rmc = require("rm-cstyle-cmts");
            const originWebpackPath = `${JS_DEST_DIR}/webpack.js`;
            const tmpWebpackPath = `${JS_DEST_DIR}/webpack-rmc.js`;
            console.time("doWebpack::removeComments");
            utils.readTextUTF8(originWebpackPath, (err, contents) => {
                const commentsRemoved = rmc(contents);
                utils.writeTextUTF8(commentsRemoved, tmpWebpackPath, () => {
                    fs.unlinkSync(originWebpackPath);
                    fs.renameSync(tmpWebpackPath, originWebpackPath);
                    console.timeEnd("doWebpack::removeComments");
                    postWebpacked(done);
                });
            });
        } else {
            postWebpacked(done); // <- this is a bit slow...
        }
    });
};

/**
 * 
 * @param {() => void} done 
 * @param {string} configFile
 */
// production watch: npx gulp webpack:build --mangle --mode production
const doWebpackWatch = (done, configFile = "./webpack.config") => {

    /** @typedef {import("webpack").Configuration} WebpackConfigration */
    const webpack = require("webpack");
    /** @type {WebpackConfigration} */
    const webpackConfig = require(configFile)(
        { mangle: !!settings.mangle },
        settings.mode
    );

    console.log(settings);

    webpackConfig.watch = true;
    webpackConfig.watchOptions = {
        poll: 1000
    };
    webpack(webpackConfig, (err, stats) => {
        if (checkWebpackError(err, stats)) {
            done && done();
            return;
        }
        postWebpacked(done);
    });
};

// npx gulp webpack:watch
gulp.task("webpack:watch", done => {
    doWebpackWatch(done);
});

// ---------------------------------- tasks ---------------------------------- //
/**
 * task "clean"
 * @param {() => void} done gulp callback function.
 */
gulp.task("clean", done => {
    _del_hook([`${JS_DEST_DIR}/**/*`], done);
});

gulp.task("pug", done => {
    doPug(settings.pugOutDir, done);
});

gulp.task("sass", done => {
    doSass(SCSS_ROOT, done);
});


//
// webpack tasks.
//
gulp.task("webpack:build", done => {
    settings.webpack = true;
    doSass(SCSS_ROOT);
    doPug(settings.pugOutDir);
    copyResource("webpack.js", `${JS_DEST_DIR}`);
    // DEVNOTE: need this task before `doWebpack` because bundle it.
    createDependenciesTS();

    doWebpack("./webpack.config", done);
});
// for local server
gulp.task("webpack", done => {
    settings.webpack = true;
    // force nostrip
    settings.nostrip = true;
    doWebpack("./webpack.config", done);
});

gulp.task("webpack:js", done => {
    settings.webpack = true;
    doSass(SCSS_ROOT);
    doPug(settings.pugOutDir);
    copyResource("webpack.js", `${JS_DEST_DIR}`);
    // 
    createDependenciesTS();
    doWebpack("./webpack.configjs", done);
});

gulp.task("sass:watch", function () {
    gulp.watch("./src/css/**/*.scss", gulp.task("sass"));
});
