// DEVNOTE: see https://developers.google.com/web/tools/workbox/modules/workbox-cli
//  - https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW
/// <reference types="workbox-sw"/>

/**
 * @param {string} publishDir
 * @param {string} [extraInclude]
 */
function workboxConfig(publishDir, extraInclude) {
    const config = {
        globDirectory: publishDir,
        globPatterns: [
            "**/*.{html,jpg}",
            "**/!(skin-icons)/*.png",
            "**/*{-loader.js,.min.js,eve-icon.png}",
        ],
        swDest: `${publishDir}/sw.js`,
        clientsClaim: true,
        // https://developers.google.com/web/tools/workbox/modules/workbox-cli#skipWaiting
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        importScripts: ["./bin/sw.js"],

        // - - - - version 5 options
        // mode: "production",
        // // inlineWorkboxRuntime: true,
        // sourcemap: false,
    };

    extraInclude && config.globPatterns.push(extraInclude);

    return config;
}

module.exports = {
    workboxConfig
};
