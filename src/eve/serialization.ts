import * as mf from "@util/misc-functions";
type ExportSkillItem = {
    type: "skill";
    typeId: number;
    level: number;
};
declare global {
    namespace PlanDatas {
        type ExportedPlanQueueKinds = ExportSkillItem | QueueItemKind<"remap"> | QueueItemKind<"note">;
        type CerebralSkillPlanExport = {
            planName: string;
            queue: ExportedPlanQueueKinds[];
            formatVersion?: 1;
            source?: string;
            created?: number;
        };
        type CerebralSkillImportFormat = Pick<CerebralSkillPlanExport, "planName" | "queue">;
        type TSerializeFormat = "json" | "clipboard" | "xml" | "shoppinglist" | "skillQueue";
    }
}
const ROMAN_NUMERALS = [
    "I",
    "II",
    "III",
    "IV",
    "V",
];
const exportJSON = (items?: PlanQueueItem[], planName?: string) => {
    if (planName !== void 0 && items !== void 0) {
        const queue: PlanDatas.ExportedPlanQueueKinds[] = [];
        try {
            items.forEach(item => {
                if (item.type === "skill") {
                    queue.push(<ExportSkillItem>{
                        type: "skill",
                        typeId: item.id,
                        level: item.level
                    });
                } else {
                    queue.push(item);
                }
            });
            if (queue.length) {
                const data: PlanDatas.CerebralSkillPlanExport = {
                    formatVersion: 1,
                    planName,
                    created: Date.now(),
                    queue
                };
                const content = JSON.stringify(data, null, 2);
                mf.createLocalFile(content, `${planName}.json`, "application/json");
            }
        } catch (e) {
            console.log(e);
        }
    }
};
const exportClipboard = (items?: PlanQueueItem[], isShoppingList = false) => {
    if (items !== void 0) {
        let clipboardData = "";
        for (let index = 0, inserted = 0, end = items.length; index < end;) {
            const item = items[index++];
            if (item.type === "skill") {
                if (isShoppingList) {
                    clipboardData += `${item.name} 1\n`;
                } else {
                    inserted++;
                    clipboardData += `${item.name} ${ROMAN_NUMERALS[item.level - 1]}\n`;
                }
            }
            if (!isShoppingList && inserted === 50) {
                break;
            }
        }
        mf.copyToClipboard(clipboardData);
    }
};
export function serialize(
    format: PlanDatas.TSerializeFormat,
    items?: PlanQueueItem[],
    planName?: string
) {
    if (format === "json") {
        exportJSON(items, planName);
    } else if (format === "clipboard") {
        exportClipboard(items);
    } else if (format === "shoppinglist") {
        exportClipboard(items, true);
    }
}
export function deserialize(
    format: PlanDatas.TSerializeFormat,
    source: string
) {
    if (format === "json") {
        return importJSON(source);
    } else if (format === "xml") {
        return importEVEMonXML(source);
    }
    return void 0;
}
const importJSON = (content: string) => {
    if (content !== void 0) {
        let plan: PlanDatas.CerebralSkillPlanExport | undefined;
        try {
            plan = JSON.parse(content);
        } catch (e) {
            console.log(e);
        }
        if (plan !== void 0 && plan.formatVersion === 1) {
            return plan as PlanDatas.CerebralSkillImportFormat;
        }
    }
    return void 0;
};
const importEVEMonXML = (source: string) => {
    let planRoot: Element | undefined;
    const queue: PlanDatas.ExportedPlanQueueKinds[] = [];
    if (source !== void 0) {
        try {
            const xml = new DOMParser().parseFromString(source, "text/xml");
            planRoot = xml.getElementsByTagName("plan")[0];
            Array.from(xml.getElementsByTagName("entry")).forEach(e => {
                const notesText = e.children[0].childNodes[0].nodeValue!;
                if (notesText !== e.getAttribute("skill")) {
                    const title = /^.+$/gm.exec(notesText) || "notes extraction failed";
                    queue.push(<QueueItemKind<"note">>{
                        type: "note",
                        details: notesText,
                        title
                    });
                }
                const remap = e.children[1];
                if (remap) {
                    const attributes: EVECharacterAttributesFragment = {
                        intelligence: +(remap.getAttribute("int")!),
                        memory: +(remap.getAttribute("mem")!),
                        perception: +(remap.getAttribute("per")!),
                        willpower: +(remap.getAttribute("wil")!),
                        charisma: +(remap.getAttribute("cha")!),
                    };
                    let title = remap.getAttribute("description")!;
                    // @ts-ignore unused parameter $0
                    title = title.replace(/(Intelligence|Perception|Charisma|Willpower|Memory) \([-+]?\d+\) = (\d+) = \(.+\)/g, ($0, $1, $2) => {
                        return $1[0] + $2;
                    }).replace(/(?:\r\n|\n)/, "Remap - ").replace(/(?:\r\n|\n)/g, " ");
                    queue.push(<QueueItemKind<"remap">>{
                        type: "remap",
                        attributes,
                        implants: 0,
                        title
                    });
                }
                queue.push(<ExportSkillItem>{
                    type: "skill",
                    typeId: +(e.getAttribute("skillID")!),
                    level: +(e.getAttribute("level")!)
                });
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    return planRoot? {
        planName: planRoot.getAttribute("name")!,
        queue
    } as PlanDatas.CerebralSkillImportFormat: void 0;
};