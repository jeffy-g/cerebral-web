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
import * as R from "react";
import * as mf from "@util/misc-functions";
import {
    NEW_EVE_IMAGE_SERVER_URL,
} from "@eve/models/constants";
const FetchedImages: Record<string, boolean> = onil();
const SKELETON_IMAGE_PATH = "./eve-icon.png";
// @ts-ignore needed for pre cache image
const _ci = (() => {
    const img = new Image();
    img.src = SKELETON_IMAGE_PATH;
    return img;
})();
const SKELETON_IMAGE_24 = <img alt="" className="skeletonBase skeletonImg x24" src={SKELETON_IMAGE_PATH}/>;
const SKELETON_IMAGE_32 = <img alt="" className="skeletonBase skeletonImg x32" src={SKELETON_IMAGE_PATH}/>;
const imageOnload = (e: R.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const skeleton = img.nextElementSibling!;
    FetchedImages[
        img.src.substring(NEW_EVE_IMAGE_SERVER_URL.length)
    ] = true;
    skeleton.addEventListener("transitionend", () => skeleton.remove(), mf.LISTENER_OPTION_ONCE);
    skeleton.classList.add("loaded");
};
export type EVEImageProps = {
    path: string;
    size?: number;
    inline?: boolean;
    className?: string;
};
export const EVEImage = (props: EVEImageProps) => {
    const { inline, path, className, size = 24 } = props;
    const isExternal = path[0] === "/";
    const url = isExternal? NEW_EVE_IMAGE_SERVER_URL + path: "./images/sde/" + path;
    const needSkeleton = isExternal && !FetchedImages[path];
    let oocssClassName = `eve-image-icon x${size}`;
    if (inline) {
        oocssClassName += " is-inline";
    }
    if (className) {
        oocssClassName += " " + className;
    }
    const mainImage = <img alt="" className={oocssClassName} src={url} onLoad={needSkeleton? imageOnload: void 0}/>;
    if (needSkeleton) {
        return <span className="images-with-skeleton">
            {}
            {mainImage}
            {}
            {size === 24? SKELETON_IMAGE_24: SKELETON_IMAGE_32}
        </span>;
    } else {
        return mainImage;
    }
};