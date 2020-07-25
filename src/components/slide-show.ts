/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  <one line to give the program's name and a brief idea of what it does.>
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>

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
import {
    ITransitionCurtain
} from "./tiny/transition-curtain";
import * as ls from "@/global/shared-storage";
import * as mf from "@util/misc-functions";
const CURTAIN_ConfKey = "disable-curtain";
const raf = mf.getRafFunction();
let ssConfig: ConfigTypes.SlideShowConfig;
export const getInterval = () => ssConfig.interval;
export const initImages = () => {
    (ssConfig = EVEApp.Config.getConfig("/app/bg-slide-setting")).images.randomSort(false);
};
export const curtainIf: ITransitionCurtain = onil();
let suspend = ls.get(CURTAIN_ConfKey, false);
export const isCurtainSuspended = () => suspend;
export const isCurtainEnable = () => {
    return !suspend && EVEApp.getThemeType() === "dark";
};
export const updateBgImage = (enable: boolean, index: number = 0) => {
    const ss = document.body.style;
    const sdeVersion = $query("div.sde-version");
    const handler = () => {
        ss.setProperty(
            "--bg-image",
            enable? `url("${location.pathname}./images/bg-images/${ssConfig.images[index]}")`: "none"
        );
        if (!enable) {
            initImages();
        }
    };
    const binary = (+enable) + "";
    if (sdeVersion) {
        sdeVersion.dataset.enablecurtain = binary;
        sdeVersion.title = enable? "slideshow task running": "";
    }
    // @ts-ignore 
    enable && !handler()
    || document.body.addEventListener("transitionend", handler, mf.LISTENER_OPTION_ONCE);
    ss.setProperty("--bg-opacity", binary);
};
export let transitionEndHandler: () => void; {
    let index = 1;
    transitionEndHandler = () => {
        if (EVEApp.getThemeType() === "dark") {
            const nextIndex = (index++) % ssConfig.images.length;
            updateBgImage(true, nextIndex);
        }
    };
}
export const installBackgroundImagePane = () => {
    if (!$query("body > .bg-image-pane")) {
        const body = document.body;
        body.style.setProperty("--bg-image", "none");
        body.style.setProperty("--bg-opacity", "1");
        const div = document.createElement("div");
        div.className = "bg-image-pane";
        div.style.cssText = `
background-image: var(--bg-image);
opacity: var(--bg-opacity);
transition: opacity 800ms ease;
top: 0; left: 0; bottom: 0; right: 0;
position: fixed;
background-size: cover;
background-position: center center;
background-repeat: no-repeat;
background-attachment: local;
background-origin: border-box;
`;
        body.insertBefore(div, body.firstElementChild);
    }
};
export const handleSlideshowToggle = ((interval: number) => {
    let last = Date.now();
    return (e: UIEvent) => {
        if (e instanceof MouseEvent) {
            if (e.offsetX < 0) {
                e.stopPropagation();
            } else {
                return;
            }
        }
        if (last + interval < Date.now()) {
            last = Date.now();
            raf(async () => {
                if (EVEApp.getThemeType() === "dark") {
                    if (curtainIf.running) {
                        raf(() => {
                            EVEApp.marshalling({
                                "notify.warn": "currently, transition curtain is active.\nexecute the requested command after event completes."
                            });
                        });
                        await mf.waitForObject(curtainIf, "running", 500);
                    }
                    ls.set(CURTAIN_ConfKey, suspend = !suspend);
                    updateBgImage(!suspend);
                    curtainIf.setEnable(!suspend);
                    console.log("TransitionCurtaion enable:", !suspend);
                } else {
                    console.log("TransitionCurtaion event disabled, suspending:", !suspend);
                }
            });
        } else {
            console.warn("handleSlideshowToggle is buzy!");
        }
    };
})(777);