/// <reference types="workbox-sw"/>
// @ts-nocheck
workbox.setConfig({ debug: false });
workbox.routing.registerRoute(
  /^https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/,
  new workbox.strategies.CacheFirst()
);