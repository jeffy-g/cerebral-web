// DEVNOTE: see https://developers.google.com/web/tools/workbox/modules/workbox-cli
//  - https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW
const wConfig = require("./scripts/workbox-template");
module.exports = wConfig.workboxConfig("./docs", "**/*.css");
