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
type ESIHealthStatusTokens = "green" | "yellow" | "red";
type ESIHealthStatus = {
    endpoint: string;
    method: string;
    route: string;
    status: ESIHealthStatusTokens;
    tags: string[];
};
type EVEId = number | string;
type EVECharacterInfo = {
    alliance_id?: number;
    ancestry_id: number;
    birthday: Date | string;
    bloodline_id: number;
    corporation_id: number;
    description: string;
    faction_id?: number;
    gender: string;
    name: string;
    race_id: number;
    security_status?: number;
    title?: string;
};
type EVECharacterOnline = {
    last_login?: string;
    last_logout?: string;
    logins?: number;
    online: boolean;
};
type EVEAlliance = {
    creator_corporation_id: number;
    creator_id: number;
    date_founded: Date | string;
    name: string;
    ticker: string;
    executor_corporation_id?: number;
    faction_id?: number;
};
type EVEAgentResearch = {
    agent_id: number;
    points_per_day: number;
    remainder_points: number;
    started_at: Date;
    skill_type_id: number;
};
type EVELoyaltyPoints = {
    corporation_id: number;
    loyalty_points: number;
    corporation: EVECorporation;
    error?: string;
};
interface EVECorporation {
    ceo_id: number;
    creator_id: number;
    member_count: number;
    name: string;
    tax_rate: number;
    ticker: string;
    alliance_id? : number;
    description?: string;
    faction_id?: number;
    home_station_id?: number;
    shares?: number;
    url?: string;
    date_founded?: Date;
    war_eligible?: boolean;
}
type EVECharacterAttributes = {
    perception: number;
    memory: number;
    willpower: number;
    intelligence: number;
    charisma: number;
    bonus_remaps: number;
    accrued_remap_cooldown_date: DateString;
    last_remap_date: DateString;
};
type EVECharacterAttributesKeys = Exclude<keyof EVECharacterAttributes, "bonus_remaps" | "accrued_remap_cooldown_date" | "last_remap_date">;
type EVESkill = {
    skill_id: number;
    active_skill_level: number;
    trained_skill_level: number;
    skillpoints_in_skill: number;
};
type EVESkills = {
    skills: EVESkill[];
    total_sp: number;
    unallocated_sp?: number;
};
type EVESkillQueue = {
    start_date: string;
    finish_date: string;
    level_start_sp: number;
    level_end_sp: number;
    training_start_sp: number;
    skill_id: number;
    finished_level: number;
    queue_position?: number;
};
type EVELocation = {
    solar_system_id?: number;
    station_id?: number;
    structure_id?: number;
    system_id: number;
    system: EVESystem;
    location?: EVEStation | EVEStructure;
};
type EVEImplantIDs = number[];
type EVEHomeLocation = {
    location_id: number;
    location_type: "station" | "structure";
    location?: EVEStation | EVEStructure;
};
type EVEJumpClone = {
    implants: EVEImplantIDs;
    jump_clone_id: number;
    location_id: number;
    location_type: "station" | "structure";
    name?: string;
};
type EVEClones = {
    home_location: EVEHomeLocation;
    jump_clones: EVEJumpClone[];
    last_clone_jump_date?: DateString;
    last_station_change_date?: DateString;
};
type EVEMailLabel = {
    color: string;
    label_id: number;
    name: string;
    unread_count?: number;
};
type EVEMailLabels = {
    labels?: EVEMailLabel[];
    total_unread_count: number;
};
type EVERecipients = {
    recipient_id: number;
    recipient_type: "alliance" | "character" | "corporation" | "mailing_list";
    recipient_name?: string;
};
type EVEMailData = {
    from: number;
    is_read: boolean;
    labels: number[];
    mail_id: number;
    recipients: EVERecipients[];
    subject: string;
    timestamp: Date;
    label_names: string[]
    is_sent: boolean;
    [k: string]: any;
};
type EVEMailBody = {
    body: string;
    from: number;
    labels: number[];
    read: boolean;
    recipients: EVERecipients[];
    subject: string;
    timestamp: Date | string;
};
type EVEMailingLists = {
    mailing_list_id: number;
    name: string;
};
type EVEFatigue = {
    jump_fatigue_expire_date?: DateString;
    last_jump_date?: DateString;
    last_update_date?: DateString;
};
type EVEContact = {
    contact_id: number;
    contact_type: "character" | "corporation" | "alliance" | "faction";
    standing: number;
    is_blocked?: boolean;
    is_watched?: boolean;
    label_ids?: number[];
};
type EVEContactLabel = {
    label_id: number;
    label_name: string;
};
type EVEContractData = {
    acceptor_id: number;
    assignee_id: number;
    availability: "public" | "personal" | "corporation" | "alliance";
    buyout?: number;
    collateral?: number;
    contract_id: number;
    date_accepted?: string;
    date_completed?: string;
    date_issued: string;
    date_expired: string;
    days_to_complete?: number;
    end_location_id?: number;
    for_corporation: boolean;
    issuer_corporation_id: number;
    issuer_id: number;
    price?: number;
    reward?: number;
    start_location_id?: number;
    status: "outstanding" | "in_progress" | "finished_issuer" | "finished_contractor" | "finished" | "cancelled" | "rejected" | "failed" | "deleted" | "reversed";
    title?: string;
    type: "unknown" | "item_exchange" | "auction" | "courier" | "loan";
    volume?: number;
    [k: string]: any;
};
type EVEContracts = EVEContractData[];
type EVEContractItem = {
    is_included: boolean;
    is_singleton: boolean;
    quantity: number;
    record_id: number;
    type_id: number;
    raw_quantity?: number;
};
type EVEContractItems = EVEContractItem[];
type EVEContractBids = {
    amount: number;
    bid_id: number;
    bidder_id: number;
    date_bid: Date;
};
type EVEGroup = {
    category_id: number;
    group_id: number;
    name: string;
    published: boolean;
    types: number[];
};
type DogmaAttribute = {
    attribute_id: number;
    value: number;
};
type DogmaEffects = {
    effect_id: number;
    is_default: boolean;
};
type EVEType = {
    description: string;
    name: string;
    group_id: number;
    type_id: number;
    published: boolean;
    capacity?: number;
    dogma_attributes?: DogmaAttribute[];
    dogma_effects?: DogmaEffects[];
    graphic_id?: number;
    market_group_id?: number;
    icon_id?: number;
    mass?: number;
    volume?: number;
    packaged_volume?: number;
    portion_size?: number;
    radius?: number;
};
type AssetsLocationFlags =
"AssetSafety" | "AutoFit" | "BoosterBay" | "CorpseBay" | "Deliveries" |
"Hangar" | "HangarAll" |
"HiSlot0" | "HiSlot1" | "HiSlot2" | "HiSlot3" | "HiSlot4" | "HiSlot5" | "HiSlot6" | "HiSlot7" |
"MedSlot0" | "MedSlot1" | "MedSlot2" | "MedSlot3" | "MedSlot4" | "MedSlot5" | "MedSlot6" | "MedSlot7" |
"LoSlot0" | "LoSlot1" | "LoSlot2" | "LoSlot3" | "LoSlot4" | "LoSlot5" | "LoSlot6" | "LoSlot7" |
"SubSystemBay" | "SubSystemSlot0" | "SubSystemSlot1" | "SubSystemSlot2" | "SubSystemSlot3" | "SubSystemSlot4" | "SubSystemSlot5" | "SubSystemSlot6" | "SubSystemSlot7" |
"RigSlot0" | "RigSlot1" | "RigSlot2" | "RigSlot3" | "RigSlot4" | "RigSlot5" | "RigSlot6" | "RigSlot7" |
"Cargo" |
"DroneBay" | "FighterBay" |
"FighterTube0" |"FighterTube1" | "FighterTube2" | "FighterTube3" | "FighterTube4" |
"FleetHangar" | "ShipHangar" |
"HiddenModifiers" | "Implant" | "Locked" | "QuafeBay" | "Skill" |
"SpecializedAmmoHold" | "SpecializedCommandCenterHold" |
"SpecializedFuelBay" | "SpecializedGasHold" | "SpecializedIndustrialShipHold" | "SpecializedLargeShipHold" | "SpecializedMaterialBay" |"SpecializedMediumShipHold" |
"SpecializedMineralHold" | "SpecializedOreHold" | "SpecializedPlanetaryCommoditiesHold" | "SpecializedSalvageHold" | "SpecializedShipHold" | "SpecializedSmallShipHold" |
"Unlocked" | "Wardrobe";
type CorpsAssetsLocationFlags = Exclude<AssetsLocationFlags, "CorpseBay">
| "Bonus"
| "Booster"
| "Capsule"
| "CorpDeliveries"
| "CorpSAG1" | "CorpSAG2" | "CorpSAG3" | "CorpSAG4" | "CorpSAG5" | "CorpSAG6" | "CorpSAG7"
| "CrateLoot"
| "DustBattle"
| "DustDatabank"
| "Impounded"
| "JunkyardReprocessed"
| "JunkyardTrashed"
| "OfficeFolder"
| "Pilot"
| "PlanetSurface"
| "Reward"
| "SecondaryStorage"
| "ServiceSlot0" | "ServiceSlot1" | "ServiceSlot2" | "ServiceSlot3" | "ServiceSlot4" | "ServiceSlot5" | "ServiceSlot6" | "ServiceSlot7"
| "ShipOffline"
| "SkillInTraining"
| "StructureActive"
| "StructureFuel"
| "StructureInactive"
| "StructureOffline"
| "Wallet";
type EVEAsset = {
    is_blueprint_copy?: boolean;
    is_singleton: boolean;
    item_id: number;
    location_flag: AssetsLocationFlags;
    location_id: number;
    location_type: "station" | "solar_system" | "item" | "other";
    quantity: number;
    type_id: number;
};
type EVECoordinate = {
    x: number,
    y: number,
    z: number
};
type EVEAssetLocation = {
    item_id: number;
    position: EVECoordinate;
};
type EVEAssetName = {
    item_id: number;
    name: string;
};
type TIdNameEntry = {
    id: number;
    name: string;
};
type EVEUniverseNamesCategory = "alliance" | "character" | "constellation" | "corporation" | "inventory_type" | "region" | "solar_system" | "station" | "faction";
type EVEUniverseNames = TIdNameEntry & {
    category: EVEUniverseNamesCategory;
};
type EVEUniverseIdsCategory = "agents" | "alliances" | "characters" | "constellations" | "corporations" | "inventory_types" | "regions" | "systems" | "stations" | "factions";
type EVEUniverseIds = {
    [k in EVEUniverseIdsCategory]?: TIdNameEntry[];
};
type EVEStationServices =
    | "bounty-missions"
    | "assasination-missions"
    | "courier-missions"
    | "interbus"
    | "reprocessing-plant"
    | "refinery"
    | "market"
    | "black-market"
    | "stock-exchange"
    | "cloning"
    | "surgery"
    | "dna-therapy"
    | "repair-facilities"
    | "factory"
    | "labratory"
    | "gambling"
    | "fitting"
    | "paintshop"
    | "news"
    | "storage"
    | "insurance"
    | "docking"
    | "office-rental"
    | "jump-clone-facility"
    | "loyalty-point-store"
    | "navy-offices"
    | "security-offices";
type EVEStation = {
    max_dockable_ship_volume: number;
    name: string;
    office_rental_cost: number;
    position: EVECoordinate;
    reprocessing_efficiency: number;
    reprocessing_stations_take: number;
    services: EVEStationServices[];
    station_id: number;
    system_id: number;
    type_id: number;
    owner?: number;
    race_id?: number;
    system: EVESystem;
    type: EVETypeEx;
};
type EVESystem = {
    constellation_id: number;
    name: string;
    position: EVECoordinate;
    security_class?: string;
    security_status: number;
    system_id: number;
    stations: number[];
    planets?: {
        asteroid_belts?: number[];
        moons?: number[];
        planet_id: number;
    }[];
    star_id?: number;
    stargates?: number[];
};
type EVEStructure = {
    name: string;
    owner_id: number;
    solar_system_id: number;
    position?: EVECoordinate;
    type_id?: number;
    system: EVESystem;
    system_id: number;
    type: EVETypeEx;
};
type EVEShip = {
    ship_item_id: number;
    ship_name: string;
    ship_type_id: number;
    type?: EVEType;
};
type EVECharacterOrder = {
    escrow?: number;
    is_buy_order?: boolean;
    duration: number;
    is_corporation: boolean;
    issued: string;
    min_volume?: number;
    location_id: number;
    order_id: number;
    price: number;
    range: "1" | "10" | "2" | "20" | "3" | "30" | "4" | "40" | "5" | "region" | "solarsystem" | "station";
    region_id: number;
    type_id: number;
    volume_remain: number;
    volume_total: number;
};
type EVECharacterOrderHistory = EVECharacterOrder & {
    state?: "cancelled" | "expired";
};
type EVEWalletJournalRefTypes =
    | "acceleration_gate_fee"
    | "advertisement_listing_fee"
    | "agent_donation"
    | "agent_location_services"
    | "agent_miscellaneous"
    | "agent_mission_collateral_paid" | "agent_mission_collateral_refunded"
    | "agent_mission_reward" | "agent_mission_reward_corporation_tax"
    | "agent_mission_time_bonus_reward" | "agent_mission_time_bonus_reward_corporation_tax"
    | "agent_security_services" | "agent_services_rendered"
    | "agents_preward"
    | "alliance_maintainance_fee" | "alliance_registration_fee"
    | "asset_safety_recovery_tax"
    | "bounty" | "bounty_prize" | "bounty_prize_corporation_tax" | "bounty_prizes" | "bounty_reimbursement" | "bounty_surcharge"
    | "brokers_fee"
    | "clone_activation" | "clone_transfer"
    | "contraband_fine"
    | "contract_auction_bid" | "contract_auction_bid_corp" | "contract_auction_bid_refund" | "contract_auction_sold"
    | "contract_brokers_fee" | "contract_brokers_fee_corp"
    | "contract_collateral" | "contract_collateral_deposited_corp" | "contract_collateral_payout" | "contract_collateral_refund"
    | "contract_deposit" | "contract_deposit_corp" | "contract_deposit_refund" | "contract_deposit_sales_tax"
    | "contract_price" | "contract_price_payment_corp"
    | "contract_reversal" | "contract_reward" | "contract_reward_deposited" | "contract_reward_deposited_corp" | "contract_reward_refund"
    | "contract_sales_tax"
    | "copying"
    | "corporate_reward_payout" | "corporate_reward_tax"
    | "corporation_account_withdrawal" | "corporation_bulk_payment" | "corporation_dividend_payment" | "corporation_liquidation" | "corporation_logo_change_cost"
    | "corporation_payment" | "corporation_registration_fee"
    | "courier_mission_escrow"
    | "cspa"
    | "cspaofflinerefund"
    | "datacore_fee"
    | "dna_modification_fee"
    | "docking_fee"
    | "duel_wager_escrow" | "duel_wager_payment" | "duel_wager_refund"
    | "factory_slot_rental_fee"
    | "gm_cash_transfer"
    | "industry_job_tax"
    | "infrastructure_hub_maintenance"
    | "inheritance"
    | "insurance"
    | "item_trader_payment"
    | "jump_clone_activation_fee" | "jump_clone_installation_fee"
    | "kill_right_fee"
    | "lp_store"
    | "manufacturing"
    | "market_escrow"
    | "market_fine_paid"
    | "market_transaction"
    | "medal_creation" | "medal_issued"
    | "mission_completion" | "mission_cost" | "mission_expiration" | "mission_reward"
    | "office_rental_fee"
    | "operation_bonus"
    | "opportunity_reward"
    | "planetary_construction" | "planetary_export_tax" | "planetary_import_tax"
    | "player_donation" | "player_trading"
    | "project_discovery_reward" | "project_discovery_tax"
    | "reaction"
    | "release_of_impounded_property"
    | "repair_bill"
    | "reprocessing_tax"
    | "researching_material_productivity" | "researching_technology" | "researching_time_productivity"
    | "resource_wars_reward"
    | "reverse_engineering"
    | "security_processing_fee"
    | "shares"
    | "skill_purchase"
    | "sovereignity_bill"
    | "store_purchase" | "store_purchase_refund"
    | "structure_gate_jump"
    | "transaction_tax"
    | "upkeep_adjustment_fee"
    | "war_ally_contract"
    | "war_fee" | "war_fee_surrender";
type EVEWalletContextIdTypes =
    | "structure_id"
    | "station_id"
    | "market_transaction_id"
    | "character_id"
    | "corporation_id"
    | "alliance_id"
    | "eve_system"
    | "industry_job_id"
    | "contract_id"
    | "planet_id"
    | "system_id"
    | "type_id";
type EVEWalletJournal = {
    date: Date;
    ref_type: EVEWalletJournalRefTypes;
    amount?: number;
    balance?: number;
    description: string;
    id: number;
    first_party_id?: number;
    second_party_id?: number;
    reason?: string;
    context_id?: number;
    context_id_type?: EVEWalletContextIdTypes;
    tax?: number;
    tax_receiver_id?: number;
};
type EVEWalletTransactions = {
    date: string;
    type_id: number;
    unit_price: number;
    quantity: number;
    client_id: number;
    location_id: number;
    is_buy: boolean;
    is_personal: boolean;
    journal_ref_id: number;
    transaction_id: number;
};
interface BookmarkSubject {
    item_id: number;
    type_id: number;
}
interface EVEBookmark {
    bookmark_id: number;
    created: string;
    creator_id: number;
    folder_id: number;
    coordinates?: EVECoordinate;
    item?: BookmarkSubject;
    label: string;
    location_id: number;
    notes: string;
}
interface EVEBookmarkFolder {
    folder_id: number;
    name: string;
    creator_id?: number;
}
type NotificationTypes =
    | "AcceptedAlly"
    | "AcceptedSurrender"
    | "AllAnchoringMsg" | "AllMaintenanceBillMsg" | "AllStrucInvulnerableMsg" | "AllStructVulnerableMsg" | "AllWarCorpJoinedAllianceMsg" | "AllWarDeclaredMsg"
    | "AllWarInvalidatedMsg" | "AllWarRetractedMsg" | "AllWarSurrenderMsg"
    | "AllianceCapitalChanged"
    | "AllianceWarDeclaredV2"
    | "AllyContractCancelled" | "AllyJoinedWarAggressorMsg" | "AllyJoinedWarAllyMsg" | "AllyJoinedWarDefenderMsg"
    | "BattlePunishFriendlyFire"
    | "BillOutOfMoneyMsg"
    | "BillPaidCorpAllMsg"
    | "BountyClaimMsg" | "BountyESSShared" | "BountyESSTaken" | "BountyPlacedAlliance" | "BountyPlacedChar" | "BountyPlacedCorp" | "BountyYourBountyClaimed"
    | "BuddyConnectContactAdd"
    | "CharAppAcceptMsg"
    | "CharAppRejectMsg"
    | "CharAppWithdrawMsg"
    | "CharLeftCorpMsg"
    | "CharMedalMsg"
    | "CharTerminationMsg"
    | "CloneActivationMsg" | "CloneActivationMsg2" | "CloneMovedMsg" | "CloneRevokedMsg1" | "CloneRevokedMsg2"
    | "CombatOperationFinished"
    | "ContactAdd"
    | "ContactEdit"
    | "ContainerPasswordMsg"
    | "CorpAllBillMsg"
    | "CorpAppAcceptMsg"
    | "CorpAppInvitedMsg"
    | "CorpAppNewMsg"
    | "CorpAppRejectCustomMsg"
    | "CorpAppRejectMsg"
    | "CorpBecameWarEligible"
    | "CorpDividendMsg"
    | "CorpFriendlyFireDisableTimerCompleted" | "CorpFriendlyFireDisableTimerStarted" | "CorpFriendlyFireEnableTimerCompleted" | "CorpFriendlyFireEnableTimerStarted"
    | "CorpKicked"
    | "CorpLiquidationMsg"
    | "CorpNewCEOMsg"
    | "CorpNewsMsg"
    | "CorpNoLongerWarEligible"
    | "CorpOfficeExpirationMsg"
    | "CorpStructLostMsg"
    | "CorpTaxChangeMsg"
    | "CorpVoteCEORevokedMsg"
    | "CorpVoteMsg"
    | "CorpWarDeclaredMsg"
    | "CorpWarDeclaredV2"
    | "CorpWarFightingLegalMsg"
    | "CorpWarInvalidatedMsg"
    | "CorpWarRetractedMsg"
    | "CorpWarSurrenderMsg"
    | "CustomsMsg"
    | "DeclareWar"
    | "DistrictAttacked"
    | "DustAppAcceptedMsg"
    | "EntosisCaptureStarted"
    | "FWAllianceKickMsg"
    | "FWAllianceWarningMsg"
    | "FWCharKickMsg"
    | "FWCharRankGainMsg"
    | "FWCharRankLossMsg"
    | "FWCharWarningMsg"
    | "FWCorpJoinMsg"
    | "FWCorpKickMsg"
    | "FWCorpLeaveMsg"
    | "FWCorpWarningMsg"
    | "FacWarCorpJoinRequestMsg" | "FacWarCorpJoinWithdrawMsg" | "FacWarCorpLeaveRequestMsg" | "FacWarCorpLeaveWithdrawMsg"
    | "FacWarLPDisqualifiedEvent" | "FacWarLPDisqualifiedKill" | "FacWarLPPayoutEvent" | "FacWarLPPayoutKill"
    | "GameTimeAdded"
    | "GameTimeReceived"
    | "GameTimeSent"
    | "GiftReceived"
    | "IHubDestroyedByBillFailure"
    | "IncursionCompletedMsg"
    | "IndustryOperationFinished" | "IndustryTeamAuctionLost" | "IndustryTeamAuctionWon"
    | "InfrastructureHubBillAboutToExpire"
    | "InsuranceExpirationMsg" | "InsuranceFirstShipMsg" | "InsuranceInvalidatedMsg" | "InsuranceIssuedMsg" | "InsurancePayoutMsg"
    | "InvasionSystemLogin"
    | "JumpCloneDeletedMsg1"
    | "JumpCloneDeletedMsg2"
    | "KillReportFinalBlow"
    | "KillReportVictim"
    | "KillRightAvailable" | "KillRightAvailableOpen" | "KillRightEarned" | "KillRightUnavailable" | "KillRightUnavailableOpen" | "KillRightUsed"
    | "LocateCharMsg"
    | "MadeWarMutual"
    | "MercOfferedNegotiationMsg"
    | "MissionOfferExpirationMsg"
    | "MissionTimeoutMsg"
    | "MoonminingAutomaticFracture" | "MoonminingExtractionCancelled" | "MoonminingExtractionFinished" | "MoonminingExtractionStarted" | "MoonminingLaserFired"
    | "MutualWarExpired"
    | "MercOfferRetractedMsg"
    | "MutualWarInviteAccepted"
    | "MutualWarInviteRejected"
    | "MutualWarInviteSent"
    | "NPCStandingsGained"
    | "NPCStandingsLost"
    | "OfferToAllyRetracted"
    | "OfferedSurrender"
    | "OfferedToAlly"
    | "OldLscMessages"
    | "OperationFinished"
    | "OrbitalAttacked"
    | "OrbitalReinforced"
    | "OwnershipTransferred"
    | "ReimbursementMsg"
    | "ResearchMissionAvailableMsg"
    | "RetractsWar"
    | "SeasonalChallengeCompleted"
    | "SovAllClaimAquiredMsg" | "SovAllClaimLostMsg" | "SovCommandNodeEventStarted" | "SovCorpBillLateMsg" | "SovCorpClaimFailMsg" | "SovDisruptorMsg" | "SovStationEnteredFreeport"
    | "SovStructureDestroyed" | "SovStructureReinforced" | "SovStructureSelfDestructCancel" | "SovStructureSelfDestructFinished" | "SovStructureSelfDestructRequested"
    | "SovereigntyIHDamageMsg" | "SovereigntySBUDamageMsg" | "SovereigntyTCUDamageMsg"
    | "StationAggressionMsg1" | "StationAggressionMsg2" | "StationConquerMsg" | "StationServiceDisabled" | "StationServiceEnabled" | "StationStateChangeMsg"
    | "StoryLineMissionAvailableMsg"
    | "StructureAnchoring" | "StructureCourierContractChanged" | "StructureDestroyed" | "StructureFuelAlert" | "StructureItemsDelivered" | "StructureItemsMovedToSafety" | "StructureLostArmor"
    | "StructureLostShields" | "StructureOnline" | "StructureServicesOffline" | "StructureUnanchoring" | "StructureUnderAttack" | "StructureWentHighPower" | "StructureWentLowPower"
    | "StructuresJobsCancelled" | "StructuresJobsPaused" | "StructuresReinforcementChanged"
    | "TowerAlertMsg"
    | "TowerResourceAlertMsg"
    | "TransactionReversalMsg"
    | "TutorialMsg"
    | "WarAdopted " | "WarAllyInherited" | "WarAllyOfferDeclinedMsg" | "WarConcordInvalidates" | "WarDeclared" | "WarHQRemovedFromSpace" | "WarInherited" | "WarInvalid"
    | "WarRetracted" | "WarRetractedByConcord" | "WarSurrenderDeclinedMsg" | "WarSurrenderOfferMsg";
type EVENotifications = {
    is_read?: boolean;
    text?: string;
    notification_id: number;
    sender_id: number;
    sender_type: "character" | "corporation" | "alliance" | "faction" | "other";
    timestamp: Date;
    type: NotificationTypes;
};
type EVEOrderRange = "station" | "region" | "solarsystem" | "1" | "2" | "3" | "4" | "5" | "10" | "20" | "30" | "40";
type EVEMarketOrder = {
    duration: number;
    is_buy_order: boolean;
    issued: string;
    location_id: number;
    min_volume: number;
    order_id: number;
    price: number;
    range: EVEOrderRange;
    type_id: number;
    volume_remain: number;
    volume_total: number;
};
type EVEGeneralMarketOrder = EVEMarketOrder & {
    system_id: number;
};
type EVEFittingItemFlags =
  | "Cargo"
  | "DroneBay"
  | "FighterBay"
  | "HiSlot0"
  | "HiSlot1"
  | "HiSlot2"
  | "HiSlot3"
  | "HiSlot4"
  | "HiSlot5"
  | "HiSlot6"
  | "HiSlot7"
  | "Invalid"
  | "LoSlot0"
  | "LoSlot1"
  | "LoSlot2"
  | "LoSlot3"
  | "LoSlot4"
  | "LoSlot5"
  | "LoSlot6"
  | "LoSlot7"
  | "MedSlot0"
  | "MedSlot1"
  | "MedSlot2"
  | "MedSlot3"
  | "MedSlot4"
  | "MedSlot5"
  | "MedSlot6"
  | "MedSlot7"
  | "RigSlot0"
  | "RigSlot1"
  | "RigSlot2"
  | "ServiceSlot0"
  | "ServiceSlot1"
  | "ServiceSlot2"
  | "ServiceSlot3"
  | "ServiceSlot4"
  | "ServiceSlot5"
  | "ServiceSlot6"
  | "ServiceSlot7"
  | "SubSystemSlot0"
  | "SubSystemSlot1"
  | "SubSystemSlot2"
  | "SubSystemSlot3";
interface EVEFittingItem {
  flag: EVEFittingItemFlags;
  quantity: number;
  type_id: number;
}
interface EVEFitting {
    description: string;
    fitting_id: number;
    name: string;
    ship_type_id: number;
    items: EVEFittingItem[];
}
interface EVEIndustryJob {
    activity_id: number;
    blueprint_id: number;
    blueprint_location_id: number;
    blueprint_type_id: number;
    completed_character_id?: number;
    completed_date?: DateString;
    cost?: number;
    duration: number;
    end_date: DateString;
    facility_id: number;
    installer_id: number;
    job_id: number;
    licensed_runs?: number;
    output_location_id: number;
    pause_date?: DateString;
    probability?: number;
    product_type_id?: number;
    runs: number;
    start_date: DateString;
    station_id: number;
    status: "active" | "cancelled" | "delivered" | "paused" | "ready" | "reverted";
    successful_runs?: number;
}