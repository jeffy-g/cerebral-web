///<reference path="./char-stats-combat.d.ts"/>
///<reference path="./char-stats-industry.d.ts"/>
///<reference path="./char-stats-market.d.ts"/>
///<reference path="./char-stats-mining.d.ts"/>
///<reference path="./char-stats-module.d.ts"/>
///<reference path="./char-stats-social.d.ts"/>
///<reference path="./char-stats-travel.d.ts"/>
declare interface CharStats {
    character?: {
        daysOfActivity?: number;
        minutes?: number;
        sessionsStarted?: number;
    };
    combat?: CharacterStatsCombat;
    industry?: CharacterStatsIndustry;
    inventory?: {
        abandonLootQuantity?: number;
        trashItemQuantity?: number;
    };
    isk?: {
        _in?: number;
        out?: number;
    };
    market?: CharacterStatsMarket;
    mining?: CharacterStatsMining;
    module?: CharacterStatsModule;
    orbital?: {
        strikeCharactersKilled?: number;
        strikeDamageToPlayersArmorAmount?: number;
        strikeDamageToPlayersShieldAmount?: number;
    };
    pve?: {
        dungeonsCompletedAgent?: number;
        dungeonsCompletedDistribution?: number;
        missionsSucceeded?: number;
        missionsSucceededEpicArc?: number;
    };
    social?: CharacterStatsSocial;
    travel?: CharacterStatsTravel;
    year: number;
}