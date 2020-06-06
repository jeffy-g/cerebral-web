/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2019 jeffy-g hirotom1107@gmail.com

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
/// <reference path="../src/ts.d/js-extensions.d.ts"/>
// create slide show image list module

const fs = require("fs");

Object.defineProperty(Array.prototype, "randomSort", {
    value: function () {
        let pointer = this.length;
        while (pointer) {
            const i = Math.floor(Math.random() * pointer--);
            const temp = this[pointer];
            this[pointer] = this[i];
            this[i] = temp;
        }
        return this;
    }
});

/** @type {string[]} */
const imageList = [];
const fetchImagePaths = () => {
    // ./src/images/bg-images
    fs.readdirSync("./src/images/bg-images", { withFileTypes: true }).forEach(dirent => {
        if (dirent.isFile()) {
            imageList.push(dirent.name);
        }
    });
    console.log(imageList);
    console.log("list size:" + imageList.length);
};

module.exports = {
    updateImageList: async () => {
        fetchImagePaths();
        // update page-config.json
        console.log("update background slide show image list"); {
            const jsonPath = "./src/page-config.json";
            // @ts-ignore cannot apply resolveJsonModule option
            const pageConfig = require(`.${jsonPath}`);
            pageConfig["/app/bg-slide-setting"].images = imageList;//.randomSort();
            // pageConfig["/app/bg-slide-setting"].images = await fetchScreenShots();
            fs.writeFile(jsonPath, Buffer.from(JSON.stringify(pageConfig, null, 2)), err => {
                err && console.log(err);
                console.log("update page-config.json!");
            });
        }
    },
};

