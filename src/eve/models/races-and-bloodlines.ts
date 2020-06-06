export const createRacesContext = (char: IEVECharacter) => {
    const race = RaceMap[char.race_id];
    const bloodline = BloodlineMap[char.bloodline_id];
    const ancestry = AncestryMap[char.ancestry_id];
    return {
        race,
        bloodline,
        ancestry
    };
};
export const RaceMap: NumberMap<string> = {
    1: "caldari",
    2: "minmatar",
    4: "amarr",
    8: "gallente",
};
export const BloodlineMap: NumberMap<string> = {
    1: "deteis",
    2: "civire",
    3: "sebiestor",
    4: "brutor",
    5: "amarr",
    6: "ni-kunni",
    7: "gallente",
    8: "intaki",
    11: "achura",
    12: "jin-mei",
    13: "khanid",
    14: "vherokior",
};
export const AncestryMap: NumberMap<{ name: string, iconFile: string }> = {
    1: {
        name: "Liberal Holders",
        iconFile: "30_64_1.png",
    },
    2: {
        name: "Wealthy Commoners",
        iconFile: "30_64_2.png",
    },
    3: {
        name: "Religious Reclaimers",
        iconFile: "30_64_3.png",
    },
    4: {
        name: "Free Merchants",
        iconFile: "30_64_4.png",
    },
    5: {
        name: "Border Runners",
        iconFile: "31_64_3.png",
    },
    6: {
        name: "Navy Veterans",
        iconFile: "30_64_6.png",
    },
    7: {
        name: "Entrepreneurs",
        iconFile: "30_64_5.png",
    },
    8: {
        name: "Mercs",
        iconFile: "30_64_8.png",
    },
    9: {
        name: "Dissenters",
        iconFile: "30_64_7.png",
    },
    10: {
        name: "Merchandisers",
        iconFile: "30_64_13.png",
    },
    11: {
        name: "Scientists",
        iconFile: "30_64_12.png",
    },
    12: {
        name: "Tube Child",
        iconFile: "31_64_5.png",
    },
    13: {
        name: "Activists",
        iconFile: "31_64_7.png",
    },
    14: {
        name: "Miners",
        iconFile: "30_64_14.png",
    },
    15: {
        name: "Immigrants",
        iconFile: "30_64_9.png",
    },
    16: {
        name: "Artists",
        iconFile: "31_64_6.png",
    },
    17: {
        name: "Diplomats",
        iconFile: "31_64_8.png",
    },
    18: {
        name: "Reborn",
        iconFile: "30_64_11.png",
    },
    19: {
        name: "Tinkerers",
        iconFile: "30_64_10.png",
    },
    20: {
        name: "Traders",
        iconFile: "31_64_2.png",
    },
    21: {
        name: "Rebels",
        iconFile: "31_64_4.png",
    },
    22: {
        name: "Workers",
        iconFile: "31_64_1.png",
    },
    23: {
        name: "Tribal Traditionalists",
        iconFile: "30_64_15.png",
    },
    24: {
        name: "Slave Child",
        iconFile: "30_64_16.png",
    },
    31: {
        name: "Inventors",
        iconFile: "58_64_2.png",
    },
    32: {
        name: "Monks",
        iconFile: "58_64_4.png",
    },
    33: {
        name: "Stargazers",
        iconFile: "58_64_3.png",
    },
    34: {
        name: "Sang Do Caste",
        iconFile: "58_64_5.png",
    },
    35: {
        name: "Saan Go Caste",
        iconFile: "58_64_6.png",
    },
    36: {
        name: "Jing Ko Caste",
        iconFile: "58_64_7.png",
    },
    37: {
        name: "Cyber Knights",
        iconFile: "58_64_9.png",
    },
    38: {
        name: "Unionists",
        iconFile: "58_64_10.png",
    },
    39: {
        name: "Zealots",
        iconFile: "58_64_11.png",
    },
    40: {
        name: "Drifters",
        iconFile: "58_64_13.png",
    },
    41: {
        name: "Mystics",
        iconFile: "58_64_14.png",
    },
    42: {
        name: "Retailers",
        iconFile: "58_64_15.png",
    },
};