import * as R from "react";
import { CharactersOverviewTable } from "@com/tables/char-overview-table";
import { processEVESSO } from "@eve/sso-authorization";
import * as Extras from "@com/tiny/extras";
import { LocalStorage } from "@util/web-storage-util";
const ls = new LocalStorage("/eve.sso/login/withPopup", true);
export const Overview = () => {
    const [withPopup, setPopup] = R.useState(ls.load());
    return <>
        <Extras.EVEBannerButton
            onClick={() => processEVESSO(withPopup)}
            checkboxProps={{
                size: "small",
                label: "with popup",
                rootClassName: "eve-banner-button__checkbox", labelClassName: "fs08125",
                checked: withPopup, value: "unused",
                // @ts-ignore 
                onChange: (e: R.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                    ls.save(checked);
                    setPopup(checked);
                }
            }}
        />
        <CharactersOverviewTable/>
    </>;
};