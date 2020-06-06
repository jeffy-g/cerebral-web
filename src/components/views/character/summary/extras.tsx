import * as R from "react";
import { EVEImage } from "@com/tiny/eve-image-icon";
export const listItemClasses = {
    root: "summary-listitem-root"
};
export const listItemTextClasses = {
    primary: "ellipsis-text",
    secondary: "list-item-secondary-text"
};
export const nextListItemClasses = {
    primary: "-inline-block"
};
export const SummaryPara = (props: { children: React.ReactNode }) => {
    return <p className="summary-para">{props.children}</p>;
};
export const createActiveImplantList = (implants: ImplantData[], hasMergin = false, fallback?: string) => {
    let contents: ReactInstanceType<"div">[] = [];
    if (!implants.length) {
        contents = [
            <div key="fallback">{fallback}</div>
        ];
    } else {
        for (let index = 0, end = implants.length; index < end;) {
            const { id, name } = implants[index];
            contents[index++] = <div key={id}>
                <span>
                    <EVEImage path={`/types/${id}/icon?size=32`}/>
                    {}
                </span>
                <span>{name}</span>
            </div>;
        }
    }
    let cn = "implants-list";
    if (hasMergin) {
        cn += " has-margin";
    }
    return <div  className={cn}>{
        contents
    }</div>;
};