# Cerebral-web  [![license: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue)](https://www.gnu.org/licenses/agpl-3.0)
Character Manager for [EVE Online](https://www.eveonline.com/). (Rewrote https://github.com/PrometheusSatyen/Cerebral with typescript

> ## Details:

 * https://github.com/PrometheusSatyen/Cerebral web browser version.

 * Data management by IndexedDB.

 * ESI request using Fetch API.

 * Material-UI latest version.

 * added wallet, assets view etc to his program.

 * ~~others: can switch datasource to tranquility, singularity.~~

   + ⚠️ Currently, singularity test server ESI is disabled, see [here](https://developers.eveonline.com/blog/article/removing-datasource-singularity) for details.

> ## limited version (beta 2020/6/7

 + Publish a limited edition with some features omitted as a [Netlify](https://cerebral-web-beta.netlify.app/).

   * The product of command `npm run webpack:prod && npm run workbox:lib` is released

 + How to setup - [API Client ID/Secret Key Setup Instructions](./how-to/API-SETUP.md)

> ## How to build

 + Basically, build with webpack

    ```sh
    # production build
    yarn webpack:prod
    # development build
    yarn webpack

    # do "browser-sync" (global) install to run on local server
    yarn site:prod # production build
    yarn site:dev  # development build
    ```

 + When SDE (STATIC DATA EXPORT) is updated

    ```sh
    # More details see `./resources/eve-tool.js`
    yarn eve-tool -cmd all
    ```

    > NOTE: You may need to modify the generated source if necessary

> ## TODO

 + There are many things I want to implement and improve, but now I have no motivation or time...🤔
