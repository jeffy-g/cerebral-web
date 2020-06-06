import * as R from "react";
import { Router } from "react-router";
import {
    createHashHistory,
    HashHistoryBuildOptions,
} from "history";
export const HashRouter = (props: HashHistoryBuildOptions & Readonly<{ children?: R.ReactNode }>) => {
    return <Router history={createHashHistory(props)} children={props.children} />;
};