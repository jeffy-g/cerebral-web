/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2018 jeffy-g hirotom1107@gmail.com

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
 {
    let runApplication: TBC<() => void> =  async () => {
        console.log("---------- Fire main entry point");
        runApplication = null;
        if (
            /https?:/.test(location.protocol) && navigator.serviceWorker &&
            typeof navigator.serviceWorker.constructor === "function"
        ) {
            navigator.serviceWorker.register("./sw.js");
            console.log("service worker registered");
        }
        const atomic = await import("./init-atomic");
        await atomic.initAtomic();
        const renderer = await import("./render");
        renderer.renderUI();
    };
    if (document.readyState !== "complete") {
        window.addEventListener("load", runApplication, { once: true });
        console.log("scheduled window.load");
    } else {
        console.log("document.readyState were already <%s>", document.readyState);
        runApplication();
    }
}