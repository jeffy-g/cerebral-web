declare global {
  interface Requiredskill {
    id: number;
    level: number;
  }
  type SkillDataBaseEntry = {
    name: string;
    desc: string;
    tid: number;
    mkt_gid: number;
    mkt_gname: string;
    p_attr: EVECharacterAttributesKeys;
    s_attr: EVECharacterAttributesKeys;
    ttm: number;
    rq_skills: Requiredskill[];
  };
  type GroupDataBaseEntry = {
    desc: string;
    mkt_gid: number;
    name: string;
    types: number[];
    children?: SkillDataBaseEntry[];
  };
  type EVESkillDataBase = {
    skills: {
      [skill_id: string]: SkillDataBaseEntry
    };
    groups: GroupDataBaseEntry[];
  };
}
export const SkillDB: EVESkillDataBase = {
  skills: {
    2403: {
      tid: 2403,
      name: "Advanced Planetology",
      desc: "The advanced understanding of planet evolution allowing you to interpret data from scans of planets for resources at much higher resolutions.\r\n\r\nBonus: The skill further increases the resolution of resource data when scanning a planet to allow for very precise surveying.",
      mkt_gid: 1823,
      mkt_gname: "Planet Management",
      rq_skills: [
        {
          id: 2406,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    2406: {
      tid: 2406,
      name: "Planetology",
      desc: "The understanding of planet evolution allowing you to better interpret data from scans of planets for resources.\n\nBonus: The skill increases the resolution of resource data when scanning a planet to allow for more accurate surveying.",
      mkt_gid: 1823,
      mkt_gname: "Planet Management",
      rq_skills: [
        {
          id: 13279,
          level: 3
        },
        {
          id: 3402,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    2495: {
      tid: 2495,
      name: "Interplanetary Consolidation",
      desc: "For each level in this skill, you may install a command center on one additional planet, to a maximum of 6 planets. You can have only one command center per planet.",
      mkt_gid: 1823,
      mkt_gname: "Planet Management",
      rq_skills: [],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 4
    },
    2505: {
      tid: 2505,
      name: "Command Center Upgrades",
      desc: "Each level in this skill improves the quality of command facility available to you, in turn allowing for a greater number of connected facilities on that planet.",
      mkt_gid: 1823,
      mkt_gname: "Planet Management",
      rq_skills: [],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 4
    },
    3184: {
      tid: 3184,
      name: "ORE Industrial",
      desc: "Skill at operating ORE industrial ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    3300: {
      tid: 3300,
      name: "Gunnery",
      desc: "Basic turret operation skill. 2% Bonus to weapon turrets' rate of fire per skill level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    3301: {
      tid: 3301,
      name: "Small Hybrid Turret",
      desc: "Operation of small hybrid turrets. 5% Bonus to small hybrid turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    3302: {
      tid: 3302,
      name: "Small Projectile Turret",
      desc: "Operation of small projectile turrets. 5% Bonus to small projectile turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    3303: {
      tid: 3303,
      name: "Small Energy Turret",
      desc: "Operation of small energy turrets. 5% Bonus to small energy turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    3304: {
      tid: 3304,
      name: "Medium Hybrid Turret",
      desc: "Operation of medium hybrid turrets. 5% Bonus to medium hybrid turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 3
        },
        {
          id: 3301,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    3305: {
      tid: 3305,
      name: "Medium Projectile Turret",
      desc: "Operation of medium projectile turrets. 5% Bonus to medium projectile turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 3
        },
        {
          id: 3302,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    3306: {
      tid: 3306,
      name: "Medium Energy Turret",
      desc: "Operation of medium energy turret. 5% Bonus to medium energy turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 3
        },
        {
          id: 3303,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    3307: {
      tid: 3307,
      name: "Large Hybrid Turret",
      desc: "Operation of large hybrid turret. 5% Bonus to large hybrid turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3304,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3308: {
      tid: 3308,
      name: "Large Projectile Turret",
      desc: "Operation of large projectile turret. 5% Bonus to large projectile turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3305,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3309: {
      tid: 3309,
      name: "Large Energy Turret",
      desc: "Operation of large energy turrets. 5% Bonus to large energy turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3306,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3310: {
      tid: 3310,
      name: "Rapid Firing",
      desc: "Skill at the rapid discharge of weapon turrets. 4% bonus per skill level to weapon turret rate of fire.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3311: {
      tid: 3311,
      name: "Sharpshooter",
      desc: "Skill at long-range weapon turret firing. 5% bonus to weapon turret optimal range per skill level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3312: {
      tid: 3312,
      name: "Motion Prediction",
      desc: "Improved ability at hitting moving targets. 5% bonus per skill level to weapon turret tracking speeds.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3315: {
      tid: 3315,
      name: "Surgical Strike",
      desc: "Knowledge of spaceships' structural weaknesses. 3% bonus per skill level to the damage of all weapon turrets.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 4
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    3316: {
      tid: 3316,
      name: "Controlled Bursts",
      desc: "Allows better control over the capacitor use of weapon turrets. 5% reduction in capacitor need of weapon turrets per skill level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3317: {
      tid: 3317,
      name: "Trajectory Analysis",
      desc: "Advanced understanding of zero-G physics. 5% bonus per skill level to weapon turret accuracy falloff.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 4
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3318: {
      tid: 3318,
      name: "Weapon Upgrades",
      desc: "Knowledge of gunnery computer systems, including the use of weapon upgrade modules. 5% reduction per skill level in the CPU needs of weapon turrets, launchers and smartbombs.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3300,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "memory",
      ttm: 2
    },
    3319: {
      tid: 3319,
      name: "Missile Launcher Operation",
      desc: "Basic operation of missile launcher systems. 2% Bonus to missile launcher rate of fire per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    3320: {
      tid: 3320,
      name: "Rockets",
      desc: "Skill with small short range missiles. Special: 5% bonus to rocket damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    3321: {
      tid: 3321,
      name: "Light Missiles",
      desc: "Skill with manually targeted missiles. 5% Bonus to light missile damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3322: {
      tid: 3322,
      name: "Auto-Targeting Missiles",
      desc: "Skill with auto-targeting missiles. Special: 5% bonus to Auto-Targeting Missiles (light, heavy and cruise) damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    3323: {
      tid: 3323,
      name: "Defender Missiles",
      desc: "Skill with anti-bomb missiles. Special: 10% bonus to defender missile max velocity per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3324: {
      tid: 3324,
      name: "Heavy Missiles",
      desc: "Skill with heavy missiles. Special: 5% bonus to heavy missile damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 3
        },
        {
          id: 3321,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    3325: {
      tid: 3325,
      name: "Torpedoes",
      desc: "Skill at the handling and firing of torpedoes. 5% bonus to torpedo damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 4
        },
        {
          id: 3324,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    3326: {
      tid: 3326,
      name: "Cruise Missiles",
      desc: "Skill at the handling and firing of very large guided missiles. 5% bonus to cruise missile damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 5
        },
        {
          id: 3324,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3327: {
      tid: 3327,
      name: "Spaceship Command",
      desc: "The basic operation of spaceships. 2% improved ship agility for all ships per skill level.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    3328: {
      tid: 3328,
      name: "Gallente Frigate",
      desc: "Skill at operating Gallente frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3329: {
      tid: 3329,
      name: "Minmatar Frigate",
      desc: "Skill at operating Minmatar frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3330: {
      tid: 3330,
      name: "Caldari Frigate",
      desc: "Skill at operating Caldari frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3331: {
      tid: 3331,
      name: "Amarr Frigate",
      desc: "Skill at operating Amarr frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    3332: {
      tid: 3332,
      name: "Gallente Cruiser",
      desc: "Skill at operating Gallente cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 2
        },
        {
          id: 33093,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3333: {
      tid: 3333,
      name: "Minmatar Cruiser",
      desc: "Skill at operating Minmatar cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 2
        },
        {
          id: 33094,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3334: {
      tid: 3334,
      name: "Caldari Cruiser",
      desc: "Skill at operating Caldari cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 2
        },
        {
          id: 33092,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3335: {
      tid: 3335,
      name: "Amarr Cruiser",
      desc: "Skill at operating Amarr cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 2
        },
        {
          id: 33091,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    3336: {
      tid: 3336,
      name: "Gallente Battleship",
      desc: "Skill at operating Gallente battleships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 4
        },
        {
          id: 33097,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    3337: {
      tid: 3337,
      name: "Minmatar Battleship",
      desc: "Skill at operating Minmatar battleships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 4
        },
        {
          id: 33098,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    3338: {
      tid: 3338,
      name: "Caldari Battleship",
      desc: "Skill at operating Caldari battleships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 4
        },
        {
          id: 33096,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    3339: {
      tid: 3339,
      name: "Amarr Battleship",
      desc: "Skill at operating Amarr battleships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 4
        },
        {
          id: 33095,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    3340: {
      tid: 3340,
      name: "Gallente Industrial",
      desc: "Skill at operating Gallente industrial ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    3341: {
      tid: 3341,
      name: "Minmatar Industrial",
      desc: "Skill at operating Minmatar industrial ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    3342: {
      tid: 3342,
      name: "Caldari Industrial",
      desc: "Skill at operating Caldari industrial ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    3343: {
      tid: 3343,
      name: "Amarr Industrial",
      desc: "Skill at operating Amarr industrial ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    3344: {
      tid: 3344,
      name: "Gallente Titan",
      desc: "Skill at operating Gallente titans.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 5
        },
        {
          id: 3336,
          level: 3
        },
        {
          id: 3348,
          level: 5
        },
        {
          id: 24562,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 16
    },
    3345: {
      tid: 3345,
      name: "Minmatar Titan",
      desc: "Skill at operating Minmatar titans.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 5
        },
        {
          id: 3337,
          level: 3
        },
        {
          id: 3348,
          level: 5
        },
        {
          id: 24562,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 16
    },
    3346: {
      tid: 3346,
      name: "Caldari Titan",
      desc: "Skill at operating Caldari titans.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 5
        },
        {
          id: 3338,
          level: 3
        },
        {
          id: 3348,
          level: 5
        },
        {
          id: 24562,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 16
    },
    3347: {
      tid: 3347,
      name: "Amarr Titan",
      desc: "Skill at operating Amarr titans.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 5
        },
        {
          id: 3339,
          level: 3
        },
        {
          id: 3348,
          level: 5
        },
        {
          id: 24562,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 16
    },
    3348: {
      tid: 3348,
      name: "Leadership",
      desc: "Basic proficiency at projecting beneficial effects to fleetmates. Increases Command Burst and Mining Foreman Burst area of effect range by 7% per skill level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 1
    },
    3349: {
      tid: 3349,
      name: "Skirmish Command",
      desc: "Basic proficiency at boosting the hit-and-run capabilities of allied ships. Grants a 10% bonus to the duration of Skirmish Command Burst effects per level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 2
    },
    3350: {
      tid: 3350,
      name: "Shield Command",
      desc: "Basic proficiency at boosting the shield defenses of allied ships. Grants a 10% bonus to the duration of Shield Command Burst effects per level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 2
    },
    3351: {
      tid: 3351,
      name: "Shield Command Specialist",
      desc: "Advanced proficiency at boosting the shield defenses of allied ships. Increases the strength of Shield Command Burst effects by 10% per skill level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        },
        {
          id: 3350,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 5
    },
    3352: {
      tid: 3352,
      name: "Information Command Specialist",
      desc: "Advanced proficiency at boosting the sensors and electronic warfare systems of allied ships. Increases the strength of Information Command Burst effects by 10% per skill level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        },
        {
          id: 20495,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 5
    },
    3354: {
      tid: 3354,
      name: "Command Burst Specialist",
      desc: "Improved fleet support flexibility. Reduces reload duration of all Command Burst and Mining Foreman Burst modules by 10% per level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 6
    },
    3355: {
      tid: 3355,
      name: "Social",
      desc: "Skill at social interaction. 5% bonus per level to NPC agent, corporation and faction standing increase.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 1
    },
    3356: {
      tid: 3356,
      name: "Negotiation",
      desc: "Skill at agent negotiation. 5% additional pay per skill level for agent missions.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [
        {
          id: 3355,
          level: 1
        }
      ],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 2
    },
    3357: {
      tid: 3357,
      name: "Diplomacy",
      desc: "Skill at interacting with hostile Agents in order to de-escalate tense situations as demonstrated by some of the finest diplomats in New Eden. 4% Modifier per level to effective standing towards hostile Agents. Not cumulative with Connections or Criminal Connections.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [
        {
          id: 3355,
          level: 2
        }
      ],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 1
    },
    3358: {
      tid: 3358,
      name: "Fast Talk",
      desc: "Skill at interacting with Concord. 5% Bonus to effective security rating increase.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [
        {
          id: 3355,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 4
    },
    3359: {
      tid: 3359,
      name: "Connections",
      desc: "Skill at interacting with friendly NPCs. 4% Modifier to effective standing from friendly NPC Corporations and Factions per level. Not cumulative with Diplomacy or Criminal Connections.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [
        {
          id: 3355,
          level: 3
        }
      ],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 3
    },
    3361: {
      tid: 3361,
      name: "Criminal Connections",
      desc: "Skill at interacting with friendly criminal NPCs. 4% Modifier per level to effective standing towards NPCs with low Concord standing. Not cumulative with Diplomacy or Connections.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [
        {
          id: 3355,
          level: 3
        }
      ],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 3
    },
    3363: {
      tid: 3363,
      name: "Corporation Management",
      desc: "Basic corporation operation. +20 corporation members allowed per level.\r\n\r\nNote: The CEO must update his corporation through the corporation user interface before the skill takes effect",
      mkt_gid: 365,
      mkt_gname: "Corporation Management",
      rq_skills: [],
      p_attr: "memory",
      s_attr: "charisma",
      ttm: 1
    },
    3368: {
      tid: 3368,
      name: "Diplomatic Relations",
      desc: "Skill at negotiating ally fees with Concord. Reduces cost to hire allies in wars by 5% per level.",
      mkt_gid: 365,
      mkt_gname: "Corporation Management",
      rq_skills: [
        {
          id: 3363,
          level: 2
        },
        {
          id: 3355,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "charisma",
      ttm: 2
    },
    3373: {
      tid: 3373,
      name: "Starbase Defense Management",
      desc: "Skill at using starbase weapon systems. Allows control of one array per level. Arrays must be placed outside of the forcefield to be controlled.",
      mkt_gid: 2152,
      mkt_gname: "Structure Management",
      rq_skills: [
        {
          id: 11584,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "charisma",
      ttm: 7
    },
    3380: {
      tid: 3380,
      name: "Industry",
      desc: "Allows basic operation of factories. 4% reduction in manufacturing time per skill level.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    3385: {
      tid: 3385,
      name: "Reprocessing",
      desc: "Skill at using reprocessing facilities in station, outposts and starbases to break ores and ice down into refined products.\r\n\r\n3% bonus to ore and ice reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3380,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    3386: {
      tid: 3386,
      name: "Mining",
      desc: "Skill at using mining lasers. 5% bonus to mining turret yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    3387: {
      tid: 3387,
      name: "Mass Production",
      desc: "Allows the operation of multiple factories. Ability to run 1 additional manufacturing job per level.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3380,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 2
    },
    3388: {
      tid: 3388,
      name: "Advanced Industry",
      desc: "Skill at efficiently using industrial facilities. 3% reduction in all manufacturing and research times per skill level.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3380,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 3
    },
    3389: {
      tid: 3389,
      name: "Reprocessing Efficiency",
      desc: "Advanced skill at using reprocessing facilities in station, outposts and starbases to break ores and ice down into refined products.\r\n\r\n2% bonus to ore and ice reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 3
    },
    3392: {
      tid: 3392,
      name: "Mechanics",
      desc: "Skill at maintaining the mechanical components and structural integrity of a spaceship. 5% bonus to structure hit points per skill level.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3393: {
      tid: 3393,
      name: "Repair Systems",
      desc: "Operation of armor/hull repair modules. 5% reduction in repair systems duration per skill level.\r\n\r\nNote: Has no effect on capital sized modules.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3392,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3394: {
      tid: 3394,
      name: "Hull Upgrades",
      desc: "Skill at maintaining your ship's armor and installing hull upgrades like expanded cargoholds and inertial stabilizers. Grants a 5% bonus to armor hit points per skill level.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3392,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3395: {
      tid: 3395,
      name: "Advanced Small Ship Construction",
      desc: "Skill required for the manufacturing of advanced frigates and destroyers. 1% reduction in manufacturing time for all items requiring Advanced Small Ship Construction per level.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3392,
          level: 1
        },
        {
          id: 3380,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3396: {
      tid: 3396,
      name: "Advanced Industrial Ship Construction",
      desc: "Skill required for the manufacturing of advanced industrial ships. 1% reduction in manufacturing time for all items requiring Advanced Industrial Ship Construction per level.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3392,
          level: 2
        },
        {
          id: 3380,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3397: {
      tid: 3397,
      name: "Advanced Medium Ship Construction",
      desc: "Skill required for the manufacturing of advanced cruisers and battlecruisers. 1% reduction in manufacturing time for all items requiring Advanced Medium Ship Construction per level.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3392,
          level: 3
        },
        {
          id: 3395,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    3398: {
      tid: 3398,
      name: "Advanced Large Ship Construction",
      desc: "Skill required for the manufacturing of advanced battleships. 1% reduction in manufacturing time for all items requiring Advanced Large Ship Construction per level.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3397,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 8
    },
    3400: {
      tid: 3400,
      name: "Outpost Construction",
      desc: "Skill required for the manufacturing of player controllable outposts.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3392,
          level: 5
        },
        {
          id: 3380,
          level: 5
        },
        {
          id: 11584,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 16
    },
    3402: {
      tid: 3402,
      name: "Science",
      desc: "Basic understanding of scientific principles. 5% Bonus to blueprint copying speed per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3403: {
      tid: 3403,
      name: "Research",
      desc: "Skill at researching more efficient production methods. 5% bonus to blueprint manufacturing time research per skill level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3405: {
      tid: 3405,
      name: "Biology",
      desc: "The science of life and of living organisms, and how chemicals affect them. 20% Bonus to attribute booster duration per skill level.",
      mkt_gid: 1746,
      mkt_gname: "Neural Enhancement",
      rq_skills: [
        {
          id: 3402,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3406: {
      tid: 3406,
      name: "Laboratory Operation",
      desc: "Allows basic operation of research facilities. Ability to run 1 additional research job per skill level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3408: {
      tid: 3408,
      name: "Sleeper Encryption Methods",
      desc: "Understanding of the techniques and methods to reverse engineer Sleeper technology.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3409,
          level: 4
        },
        {
          id: 3403,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 4
    },
    3409: {
      tid: 3409,
      name: "Metallurgy",
      desc: "Advanced knowledge of mineral composition. 5% Bonus to material efficiency research speed per skill level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3410: {
      tid: 3410,
      name: "Astrogeology",
      desc: "Skill at analyzing the content of celestial objects with the intent of mining them. 5% bonus to mining turret yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3402,
          level: 4
        },
        {
          id: 3386,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3411: {
      tid: 3411,
      name: "Cybernetics",
      desc: "The science of interfacing biological and machine components. Allows the use of cybernetic implants.",
      mkt_gid: 1746,
      mkt_gname: "Neural Enhancement",
      rq_skills: [
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3412: {
      tid: 3412,
      name: "Astrometrics",
      desc: "Skill at operating long range scanners.\r\n\r\n+5% scan strength per level.\r\n\r\n-5% max scan deviation per level.\r\n\r\n-5% scan probe scan time per level.",
      mkt_gid: 1110,
      mkt_gname: "Scanning",
      rq_skills: [
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3413: {
      tid: 3413,
      name: "Power Grid Management",
      desc: "Basic understanding of spaceship energy grid systems. 5% Bonus to ship's powergrid output per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3416: {
      tid: 3416,
      name: "Shield Operation",
      desc: "Skill at operating a spaceship's shield systems, including the use of shield boosters and other basic shield modules. 5% reduction in shield recharge time per skill level.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3413,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3417: {
      tid: 3417,
      name: "Capacitor Systems Operation",
      desc: "Skill at operating your ship's capacitor, including the use of capacitor boosters and other basic energy modules. 5% reduction in capacitor recharge time per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3413,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3418: {
      tid: 3418,
      name: "Capacitor Management",
      desc: "Skill at regulating your ship's overall energy capacity. 5% bonus to capacitor capacity per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3413,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3419: {
      tid: 3419,
      name: "Shield Management",
      desc: "Skill at regulating a spaceship's shield systems. 5% bonus to shield capacity per skill level.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3413,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3420: {
      tid: 3420,
      name: "Tactical Shield Manipulation",
      desc: "Skill at preventing damage from penetrating the shield, including the use of shield hardeners and other advanced shield modules. Reduces the chance of damage penetrating the shield when it falls below 25% by 5% per skill level, with 0% chance at level 5.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3413,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 4
    },
    3421: {
      tid: 3421,
      name: "Energy Pulse Weapons",
      desc: "Skill at using smartbombs. 5% decrease in smartbomb duration per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3413,
          level: 2
        },
        {
          id: 3402,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3422: {
      tid: 3422,
      name: "Shield Emission Systems",
      desc: "Operation of shield transfer array and other shield emission systems. 5% reduced capacitor need for shield emission system modules per skill level.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3413,
          level: 3
        },
        {
          id: 3402,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3423: {
      tid: 3423,
      name: "Capacitor Emission Systems",
      desc: "Operation of energy transfer array and other energy emission systems. 5% reduced capacitor need of energy emission weapons per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3413,
          level: 3
        },
        {
          id: 3402,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3424: {
      tid: 3424,
      name: "Energy Grid Upgrades",
      desc: "Skill at installing power upgrades e.g. capacitor battery and power diagnostic units. 5% reduction in CPU needs of modules requiring Energy Grid Upgrades per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3413,
          level: 2
        },
        {
          id: 3402,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3425: {
      tid: 3425,
      name: "Shield Upgrades",
      desc: "Skill at installing shield upgrades e.g. shield extenders and shield rechargers. 5% reduction in shield upgrade powergrid needs.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3413,
          level: 2
        },
        {
          id: 3402,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3426: {
      tid: 3426,
      name: "CPU Management",
      desc: "Basic understanding of spaceship sensory and computer systems. 5% Bonus to ship CPU output per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3427: {
      tid: 3427,
      name: "Electronic Warfare",
      desc: "Operation of ECM jamming systems. 5% less capacitor need for ECM and ECM Burst systems per skill level.\r\n\r\nNote: Does not affect capital class modules.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3428: {
      tid: 3428,
      name: "Long Range Targeting",
      desc: "Skill at long range targeting. 5% Bonus to targeting range per skill level.",
      mkt_gid: 1748,
      mkt_gname: "Targeting",
      rq_skills: [
        {
          id: 3426,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3429: {
      tid: 3429,
      name: "Target Management",
      desc: "Skill at targeting multiple targets. +1 extra target per skill level, up to the ship's maximum allowed number of targets locked.",
      mkt_gid: 1748,
      mkt_gname: "Targeting",
      rq_skills: [
        {
          id: 3426,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3430: {
      tid: 3430,
      name: "Advanced Target Management",
      desc: "Skill at targeting multiple targets. +1 extra target per skill level, up to the ship's maximum allowed number of targets locked.",
      mkt_gid: 1748,
      mkt_gname: "Targeting",
      rq_skills: [
        {
          id: 3429,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3431: {
      tid: 3431,
      name: "Signature Analysis",
      desc: "Skill at operating Targeting systems. 5% improved targeting speed per skill level.",
      mkt_gid: 1748,
      mkt_gname: "Targeting",
      rq_skills: [
        {
          id: 3426,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3432: {
      tid: 3432,
      name: "Electronics Upgrades",
      desc: "Skill at installing electronic upgrades, such as signal amplifiers, co-processors and backup sensor arrays. 5% reduction of CPU needs for all modules requiring Electronics Upgrades per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3426,
          level: 2
        },
        {
          id: 3413,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    3433: {
      tid: 3433,
      name: "Sensor Linking",
      desc: "Skill at using remote sensor booster/dampener. 5% less capacitor need for sensor link per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3434: {
      tid: 3434,
      name: "Weapon Disruption",
      desc: "Skill at using remote weapon disruptors. 5% less capacitor need for weapon disruptors per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3435: {
      tid: 3435,
      name: "Propulsion Jamming",
      desc: "Skill at using propulsion/warpdrive jammers. 5% Reduction to Warp Scrambler, Warp Disruptor, and Stasis Web capacitor need per skill level. ",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 3
        },
        {
          id: 3449,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    3436: {
      tid: 3436,
      name: "Drones",
      desc: "Skill at remote controlling drones. Can operate 1 drone per skill level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 1
    },
    3437: {
      tid: 3437,
      name: "Drone Avionics",
      desc: "Skill at control range for all drones.\r\n\r\nBonus: Drone control range increased by 5000 meters per skill level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 1
    },
    3438: {
      tid: 3438,
      name: "Mining Drone Operation",
      desc: "Skill at controlling mining drones. 5% bonus to mining drone yield per skill level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 1
        },
        {
          id: 3386,
          level: 2
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 2
    },
    3439: {
      tid: 3439,
      name: "Repair Drone Operation",
      desc: "Allows operation of logistic drones. 5% increased repair amount per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        },
        {
          id: 23618,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 3
    },
    3440: {
      tid: 3440,
      name: "Salvage Drone Operation",
      desc: "Skill at controlling salvage drones. 2% increased salvage chance per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 4
        },
        {
          id: 25863,
          level: 2
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 4
    },
    3441: {
      tid: 3441,
      name: "Heavy Drone Operation",
      desc: "Skill at controlling heavy combat drones. 5% bonus to heavy drone damage per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    3442: {
      tid: 3442,
      name: "Drone Interfacing",
      desc: "Improves damage and mining yield for drones and fighters under your control.\r\n\r\n10% bonus to drone damage and drone mining yield per level.\r\n10% bonus to fighter damage per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    3443: {
      tid: 3443,
      name: "Trade",
      desc: "Knowledge of the market and skill at manipulating it. Active buy/sell order limit increased by 4 per level of skill.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [],
      p_attr: "willpower",
      s_attr: "charisma",
      ttm: 1
    },
    3444: {
      tid: 3444,
      name: "Retail",
      desc: "Ability to organize and manage market operations. Each level raises the limit of active orders by 8.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 3443,
          level: 2
        }
      ],
      p_attr: "willpower",
      s_attr: "charisma",
      ttm: 2
    },
    3446: {
      tid: 3446,
      name: "Broker Relations",
      desc: "Proficiency at driving down market-related costs. Each level of skill subtracts a flat 0.3% from the costs associated with setting up a market order in a non-player station, which usually come to 5% of the order's total value. This can be further influenced by the player's standing towards the owner of the station where the order is entered.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 3443,
          level: 2
        }
      ],
      p_attr: "willpower",
      s_attr: "charisma",
      ttm: 2
    },
    3447: {
      tid: 3447,
      name: "Visibility",
      desc: "Skill at acquiring products remotely. Each level of skill increases the range your remote buy orders are effective to from their origin station. Level 1 allows for the placing of remote buy orders with a range limited to the same solar system, Level 2 extends that range to systems within 5 jumps, and each subsequent level then doubles it. Level 5 allows for a full regional range.\r\n\r\nNote: Only remotely placed buy orders (using Procurement) require this skill to alter the range. Any range can be set on a local buy order with no skill.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 16594,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 3
    },
    3449: {
      tid: 3449,
      name: "Navigation",
      desc: "Skill at regulating the power output of ship thrusters. 5% bonus to sub-warp ship velocity per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 1
    },
    3450: {
      tid: 3450,
      name: "Afterburner",
      desc: "Skill at using afterburners. 5% reduction to Afterburner duration and 10% reduction in Afterburner capacitor use per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3449,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 1
    },
    3451: {
      tid: 3451,
      name: "Fuel Conservation",
      desc: "Skill at improved control over afterburner energy consumption. 10% reduction in afterburner capacitor needs per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3449,
          level: 2
        },
        {
          id: 3450,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 2
    },
    3452: {
      tid: 3452,
      name: "Acceleration Control",
      desc: "Skill at efficiently using Afterburners and MicroWarpdrives. 5% Bonus to Afterburner and MicroWarpdrive speed boost per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3449,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 4
    },
    3453: {
      tid: 3453,
      name: "Evasive Maneuvering",
      desc: "Improved skill at efficiently turning and accelerating a spaceship. 5% improved ship agility for all ships per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3449,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 2
    },
    3454: {
      tid: 3454,
      name: "High Speed Maneuvering",
      desc: "Skill at using Microwarpdrives. 5% reduction in Microwarpdrive capacitor usage per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3449,
          level: 3
        },
        {
          id: 3450,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 5
    },
    3455: {
      tid: 3455,
      name: "Warp Drive Operation",
      desc: "Skill at managing warp drive efficiency. 10% reduction in capacitor need of initiating warp per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3449,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 1
    },
    3456: {
      tid: 3456,
      name: "Jump Drive Operation",
      desc: "Skill at using Jump Drives. 5% reduction in capacitor need of initiating a jump per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3449,
          level: 5
        },
        {
          id: 3455,
          level: 5
        },
        {
          id: 3402,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 5
    },
    3551: {
      tid: 3551,
      name: "Survey",
      desc: "Skill at operating ship, cargo and survey scanners. 5% improvement per level in the scan speeds of those module types.",
      mkt_gid: 1110,
      mkt_gname: "Scanning",
      rq_skills: [
        {
          id: 3426,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    3731: {
      tid: 3731,
      name: "Megacorp Management",
      desc: "Advanced corporation operation. +100 members per level.\r\n\r\nNote: The CEO must update his corporation through the corporation user interface before the skill takes effect.",
      mkt_gid: 365,
      mkt_gname: "Corporation Management",
      rq_skills: [
        {
          id: 3363,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "charisma",
      ttm: 3
    },
    3732: {
      tid: 3732,
      name: "Empire Control",
      desc: "Advanced corporation operation. +400 corporation members allowed per level. \r\n\r\nNote: The CEO must update his corporation through the corporation user interface before the skill takes effect.",
      mkt_gid: 365,
      mkt_gname: "Corporation Management",
      rq_skills: [
        {
          id: 3731,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "charisma",
      ttm: 5
    },
    3893: {
      tid: 3893,
      name: "Mining Connections",
      desc: "Understanding of corporate culture on the industrial level and the plight of the worker.\n\nImproves loyalty point gain by 10% per level when working for agents in the Mining corporation division.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [
        {
          id: 3380,
          level: 3
        },
        {
          id: 3355,
          level: 3
        }
      ],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 2
    },
    3894: {
      tid: 3894,
      name: "Distribution Connections",
      desc: "Understanding of the way trade is conducted at the corporate level.\n\nImproves loyalty point gain by 10% per level when working for agents in the Distribution corporation division.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [
        {
          id: 3443,
          level: 3
        },
        {
          id: 3355,
          level: 3
        }
      ],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 2
    },
    3895: {
      tid: 3895,
      name: "Security Connections",
      desc: "Understanding of military culture.\r\n\r\nImproves loyalty point gain by 10% per level when working for agents in the Security corporation division.",
      mkt_gid: 376,
      mkt_gname: "Social",
      rq_skills: [
        {
          id: 3355,
          level: 3
        },
        {
          id: 3348,
          level: 3
        }
      ],
      p_attr: "charisma",
      s_attr: "intelligence",
      ttm: 2
    },
    4385: {
      tid: 4385,
      name: "Micro Jump Drive Operation",
      desc: "Skill at using Micro Jump Drives. 5% reduction in activation time per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3449,
          level: 4
        },
        {
          id: 3455,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 5
    },
    4411: {
      tid: 4411,
      name: "Target Breaker Amplification",
      desc: "Improves the continuous reflection of active target spectrum breakers, resulting in much improved defenses against all those who wish to target any vessel in the vicinity.\n\nReduces duration time and capacitor need of Target Spectrum Breakers by 5% per level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11082: {
      tid: 11082,
      name: "Small Railgun Specialization",
      desc: "Specialist training in the operation of advanced small railguns. 2% bonus per skill level to the damage of small turrets requiring Small Railgun Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 3
        },
        {
          id: 3301,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    11083: {
      tid: 11083,
      name: "Small Beam Laser Specialization",
      desc: "Specialist training in the operation of small beam lasers. 2% bonus per skill level to the damage of small turrets requiring Small Beam Laser Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 3
        },
        {
          id: 3303,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    11084: {
      tid: 11084,
      name: "Small Autocannon Specialization",
      desc: "Specialist training in the operation of advanced small autocannons. 2% bonus per skill level to the damage of small turrets requiring Small Autocannon Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 3
        },
        {
          id: 3302,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    11207: {
      tid: 11207,
      name: "Advanced Weapon Upgrades",
      desc: "Reduces the powergrid needs of weapon turrets and launchers by 2% per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3318,
          level: 4
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 6
    },
    11395: {
      tid: 11395,
      name: "Deep Core Mining",
      desc: "Skill at operating mining lasers requiring Deep Core Mining. 20% reduction per skill level in the chance of a damage cloud forming while mining Mercoxit.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3386,
          level: 5
        },
        {
          id: 3410,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 6
    },
    11433: {
      tid: 11433,
      name: "High Energy Physics",
      desc: "Skill and knowledge of High Energy Physics and its use in the development of advanced technology. \r\n\r\nUsed primarily in the research of various energy system modules as well as smartbombs and laser based weaponry. \r\n\r\nAllows High Energy Physics research to be performed with the help of a research agent. 1% reduction in manufacturing time for all items requiring High Energy Physics per level.\r\n\r\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11441: {
      tid: 11441,
      name: "Plasma Physics",
      desc: "Skill and knowledge of Plasma physics and its use in the development of advanced technology. \r\n\r\nUsed primarily in the research of particle blaster weaponry as well as plasma based missiles and smartbombs. \r\n\r\nAllows Plasma Physics research to be performed with the help of a research agent. 1% reduction in manufacturing time for all items requiring Plasma Physics per level.\r\n\r\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11442: {
      tid: 11442,
      name: "Nanite Engineering",
      desc: "Skill and knowledge of Nanite Engineering and its use in the development of advanced technology. \r\n\r\nUsed primarily in the research of various armor and hull systems. \r\n\r\nAllows Nanite Engineering research to be performed with the help of a research agent. 1% reduction in manufacturing time for all items requiring Nanite Engineering per level.\r\n\r\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3426,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11443: {
      tid: 11443,
      name: "Hydromagnetic Physics",
      desc: "Skill and knowledge of Hydromagnetic Physics and its use in the development of advanced technology . \r\n\r\nUsed primarily in the research of shield system.\r\n\r\nAllows Hydromagnetic Physics research to be performed with the help of a research agent. \r\n\r\nNeeded for all research and manufacturing operations on related blueprints. 1% reduction in manufacturing time for all items requiring Hydromagnetic Physics per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11444: {
      tid: 11444,
      name: "Amarr Starship Engineering",
      desc: "Skill and knowledge of Amarr Starship Engineering. \r\n\r\nUsed in the research of Amarr Ships of all Sizes.\r\n\r\nAllows Amarr Starship Engineering research to be performed with the help of a research agent. \r\n\r\nNeeded for all research and manufacturing operations on related blueprints. 1% reduction in manufacturing time for all items requiring Amarr Starship Engineering per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11445: {
      tid: 11445,
      name: "Minmatar Starship Engineering",
      desc: "Skill and knowledge of Minmatar Starship Engineering and its use in the development of advanced technology. \r\n\r\nUsed in the research of Minmatar Ships of all Sizes.\r\n\r\nAllows Minmatar Starship Engineering research to be performed with the help of a research agent. \r\n\r\nNeeded for all research and manufacturing operations on related blueprints. 1% reduction in manufacturing time for all items requiring Minmatar Starship Engineering per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11446: {
      tid: 11446,
      name: "Graviton Physics",
      desc: "Skill and knowledge of Graviton physics and its use in the development of advanced technology. \r\n\r\nUsed primarily in the research of Cloaking and other spatial distortion devices as well as Graviton based missiles and smartbombs. \r\n\r\nAllows Graviton Physics research to be performed with the help of a research agent. \r\n\r\nNeeded for all research and manufacturing operations on related blueprints. 1% reduction in manufacturing time for all items requiring Graviton Physics per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11447: {
      tid: 11447,
      name: "Laser Physics",
      desc: "Skill and knowledge of Laser Physics and its use in the development of advanced Technology. \r\n\r\nUsed primarily in the research of Laser weaponry as well as EM based missiles and smartbombs.\r\n\r\nAllows Laser Physics research to be performed with the help of a research agent. 1% reduction in manufacturing time for all items requiring Laser Physics per level.\r\n\r\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11448: {
      tid: 11448,
      name: "Electromagnetic Physics",
      desc: "Skill and knowledge of Electromagnetic Physics and its use in the development of advanced technology. \r\n\r\nUsed primarily in the research of Railgun weaponry and various electronic systems.  \r\n\r\nAllows Electromagnetic Physics research to be performed with the help of a research agent. \r\n\r\nNeeded for all research and manufacturing operations on related blueprints. 1% reduction in manufacturing time for all items requiring Electromagnetic Physics per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3426,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11449: {
      tid: 11449,
      name: "Rocket Science",
      desc: "Skill and knowledge of Rocket Science and its use in the development of advanced technology. \r\n\r\nUsed primarily in the research of missiles and propulsion systems.  \r\n\r\nAllows Rocket Science research to be performed with the help of a research agent. 1% reduction in manufacturing time for all items requiring Rocket Science per level.\r\n\r\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11450: {
      tid: 11450,
      name: "Gallente Starship Engineering",
      desc: "Skill and knowledge of Gallente Starship Engineering and its use in the development of advanced technology. \r\n\r\nUsed in the research of Gallente Ships of all Sizes.\r\n\r\nAllows Gallente Starship Engineering research to be performed with the help of a research agent. \r\n\r\nNeeded for all research and manufacturing operations on related blueprints. 1% reduction in manufacturing time for all items requiring Gallente Starship Engineering per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11451: {
      tid: 11451,
      name: "Nuclear Physics",
      desc: "Skill and knowledge of Nuclear physics and its use in the development of advanced technology.  \r\n\r\nUsed primarily in the research of Projectile weaponry as well as Nuclear missiles and smartbombs. \r\n\r\nAllows Nuclear Physics research to be performed with the help of a research agent. 1% reduction in manufacturing time for all items requiring Nuclear Physics per level.\r\n\r\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11452: {
      tid: 11452,
      name: "Mechanical Engineering",
      desc: "Skill and knowledge of Mechanical Engineering and its use in the development of advanced technology. \r\n\r\nUsed in all Starship research as well as hull and armor repair systems.  \r\n\r\nAllows Mechanical Engineering research to be performed with the help of a research agent. 1% reduction in manufacturing time for all items requiring Mechanical Engineering per level.\r\n\r\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11453: {
      tid: 11453,
      name: "Electronic Engineering",
      desc: "Skill and knowledge of Electronic Engineering and its use in the development of advanced technology. \r\n\r\nUsed in all Electronics and Drone research.  \r\n\r\nAllows Electronic Engineering research to be performed with the help of a research agent. \r\n\r\nNeeded for all research and manufacturing operations on related blueprints. 1% reduction in manufacturing time for all items requiring Electronic Engineering per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3426,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11454: {
      tid: 11454,
      name: "Caldari Starship Engineering",
      desc: "Skill and knowledge of Caldari Starship Engineering and its use in the development of advanced technology. \r\n\r\nUsed in the research of Caldari Ships of all Sizes.\r\n\r\nAllows Caldari Starship Engineering research to be performed with the help of a research agent. \r\n\r\nNeeded for all research and manufacturing operations on related blueprints. 1% reduction in manufacturing time for all items requiring Caldari Starship Engineering per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11455: {
      tid: 11455,
      name: "Quantum Physics",
      desc: "Skill and knowledge of Quantum Physics and its use in the development of advanced Technology. \r\n\r\nUsed primarily in the research of shield systems and Particle Blasters.  \r\n\r\nAllows Quantum Physics research to be performed through a research agent. 1% reduction in manufacturing time for all items requiring Quantum Physics per level.\r\n\r\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11487: {
      tid: 11487,
      name: "Astronautic Engineering",
      desc: "Skill and knowledge of Astronautics and its use in the development of advanced technology. This skill has no practical application for capsuleers, and proficiency in its use conveys little more than bragging rights.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11529: {
      tid: 11529,
      name: "Molecular Engineering",
      desc: "Skill and knowledge of Molecular Engineering and its use in the development of advanced technology. \n\nUsed primarily in the research of various hull and propulsion systems.  \n\nAllows Molecular Engineering research to be performed with the help of a research agent. 1% reduction in manufacturing time for all items requiring Molecular Engineering per level.\n\nNeeded for all research and manufacturing operations on related blueprints.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    11566: {
      tid: 11566,
      name: "Thermal Shield Compensation",
      desc: "5% bonus to thermal resistance per level for Shield Amplifiers.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3416,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    11569: {
      tid: 11569,
      name: "Armored Command Specialist",
      desc: "Advanced proficiency at boosting the armor defenses of allied ships. Increases the strength of Armored Command Burst effects by 10% per skill level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        },
        {
          id: 20494,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 5
    },
    11572: {
      tid: 11572,
      name: "Skirmish Command Specialist",
      desc: "Advanced proficiency at boosting the hit-and-run capabilities of allied ships. Increases the strength of Skirmish Command Burst effects by 10% per skill level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        },
        {
          id: 3349,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 5
    },
    11574: {
      tid: 11574,
      name: "Wing Command",
      desc: "Improved proficiency at projecting beneficial effects to fleetmates. Increases Command Burst and Mining Foreman Burst area of effect range by 6% per skill level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 8
    },
    11579: {
      tid: 11579,
      name: "Cloaking",
      desc: "Skill at using Cloaking devices. 10% reduction in targeting delay after uncloaking per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 6
    },
    11584: {
      tid: 11584,
      name: "Anchoring",
      desc: "Skill at Anchoring Deployables.",
      mkt_gid: 2152,
      mkt_gname: "Structure Management",
      rq_skills: [],
      p_attr: "memory",
      s_attr: "charisma",
      ttm: 3
    },
    12092: {
      tid: 12092,
      name: "Interceptors",
      desc: "Skill for operation of Interceptors.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3453,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 4
    },
    12093: {
      tid: 12093,
      name: "Covert Ops",
      desc: "Covert operations frigates are designed for recon and espionage operation. Their main strength is the ability to travel unseen through enemy territory and to avoid unfavorable encounters. Much of their free space is sacrificed to house an advanced spatial field control system. This allows it to utilize very advanced forms of cloaking at greatly reduced CPU cost.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3432,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 4
    },
    12095: {
      tid: 12095,
      name: "Assault Frigates",
      desc: "Skill for operation of the Assault Frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3413,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 4
    },
    12096: {
      tid: 12096,
      name: "Logistics Cruisers",
      desc: "Skill for operation of Logistics cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3431,
          level: 5
        },
        {
          id: 3428,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 6
    },
    12098: {
      tid: 12098,
      name: "Interdictors",
      desc: "Skill for operation of Interdictors.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 4
        },
        {
          id: 11446,
          level: 1
        },
        {
          id: 3435,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 5
    },
    12179: {
      tid: 12179,
      name: "Research Project Management",
      desc: "Skill at overseeing agent research and development projects. Allows the simultaneous use of 1 additional Research and Development agent per skill level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3406,
          level: 5
        },
        {
          id: 3403,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "charisma",
      ttm: 8
    },
    12180: {
      tid: 12180,
      name: "Arkonor Processing",
      desc: "Specialization in Arkonor reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Arkonor reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 4
    },
    12181: {
      tid: 12181,
      name: "Bistot Processing",
      desc: "Specialization in Bistot reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Bistot reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 4
    },
    12182: {
      tid: 12182,
      name: "Crokite Processing",
      desc: "Specialization in Crokite reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Crokite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 4
    },
    12183: {
      tid: 12183,
      name: "Dark Ochre Processing",
      desc: "Specialization in Dark Ochre reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Dark Ochre reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 4
        },
        {
          id: 3409,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 3
    },
    12184: {
      tid: 12184,
      name: "Gneiss Processing",
      desc: "Specialization in Gneiss reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Gneiss reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 4
        },
        {
          id: 3409,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 3
    },
    12185: {
      tid: 12185,
      name: "Hedbergite Processing",
      desc: "Specialization in Hedbergite reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Hedbergite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 4
        },
        {
          id: 3409,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 3
    },
    12186: {
      tid: 12186,
      name: "Hemorphite Processing",
      desc: "Specialization in Hemorphite reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Hemorphite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 5
        },
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 2
    },
    12187: {
      tid: 12187,
      name: "Jaspet Processing",
      desc: "Specialization in Jaspet reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Jaspet reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 5
        },
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 2
    },
    12188: {
      tid: 12188,
      name: "Kernite Processing",
      desc: "Specialization in Kernite reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Kernite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 5
        },
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 2
    },
    12189: {
      tid: 12189,
      name: "Mercoxit Processing",
      desc: "Specialization in Mercoxit reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Mercoxit reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 5
    },
    12190: {
      tid: 12190,
      name: "Omber Processing",
      desc: "Specialization in Omber reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Omber reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 5
        },
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 2
    },
    12191: {
      tid: 12191,
      name: "Plagioclase Processing",
      desc: "Specialization in Plagioclase reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Plagioclase reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 4
        },
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    12192: {
      tid: 12192,
      name: "Pyroxeres Processing",
      desc: "Specialization in Pyroxeres reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Pyroxeres reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 4
        },
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    12193: {
      tid: 12193,
      name: "Scordite Processing",
      desc: "Specialization in Scordite reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Scordite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 4
        },
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    12194: {
      tid: 12194,
      name: "Spodumain Processing",
      desc: "Specialization in Spodumain reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Spodumain reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 4
        },
        {
          id: 3409,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 3
    },
    12195: {
      tid: 12195,
      name: "Veldspar Processing",
      desc: "Specialization in Veldspar reprocessing. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Veldspar reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3385,
          level: 4
        },
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    12196: {
      tid: 12196,
      name: "Scrapmetal Processing",
      desc: "Specialization in Scrapmetal reprocessing. Increases reprocessing returns for modules, ships and other reprocessable equipment (but not ore and ice).\r\n\r\n2% bonus to ship and module reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 5
    },
    12201: {
      tid: 12201,
      name: "Small Artillery Specialization",
      desc: "Specialist training in the operation of advanced small artillery. 2% bonus per skill level to the damage of small turrets requiring Small Artillery Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 3
        },
        {
          id: 3302,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    12202: {
      tid: 12202,
      name: "Medium Artillery Specialization",
      desc: "Specialist training in the operation of advanced medium artillery. 2% bonus per skill level to the damage of medium turrets requiring Medium Artillery Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 4
        },
        {
          id: 3305,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    12203: {
      tid: 12203,
      name: "Large Artillery Specialization",
      desc: "Specialist training in the operation of advanced large artillery. 2% bonus per skill level to the damage of large turrets requiring Large Artillery Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 5
        },
        {
          id: 3308,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    12204: {
      tid: 12204,
      name: "Medium Beam Laser Specialization",
      desc: "Specialist training in the operation of advanced medium beam lasers. 2% bonus per skill level to the damage of medium turrets requiring Medium Beam Laser Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 4
        },
        {
          id: 3306,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    12205: {
      tid: 12205,
      name: "Large Beam Laser Specialization",
      desc: "Specialist training in the operation of advanced large beam lasers. 2% Bonus per skill level to the damage of large turrets requiring Large Beam Laser Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 5
        },
        {
          id: 3309,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    12206: {
      tid: 12206,
      name: "Medium Railgun Specialization",
      desc: "Specialist training in the operation of advanced medium railguns. 2% bonus per skill level to the damage of medium turrets requiring Medium Railgun Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 4
        },
        {
          id: 3304,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    12207: {
      tid: 12207,
      name: "Large Railgun Specialization",
      desc: "Specialist training in the operation of advanced large railguns. 2% bonus per skill level to the damage of large turrets requiring Large Railgun Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 5
        },
        {
          id: 3307,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    12208: {
      tid: 12208,
      name: "Medium Autocannon Specialization",
      desc: "Specialist training in the operation of advanced medium autocannons. 2% bonus per skill level to the damage of medium turrets requiring Medium Autocannon Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 4
        },
        {
          id: 3305,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    12209: {
      tid: 12209,
      name: "Large Autocannon Specialization",
      desc: "Specialist training in the operation of advanced large autocannons. 2% Bonus per skill level to the damage of large turrets requiring Large Autocannon Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 5
        },
        {
          id: 3308,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    12210: {
      tid: 12210,
      name: "Small Blaster Specialization",
      desc: "Specialist training in the operation of advanced small blasters. 2% bonus per skill level to the damage of small turrets requiring Small Blaster Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 3
        },
        {
          id: 3301,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    12211: {
      tid: 12211,
      name: "Medium Blaster Specialization",
      desc: "Specialist training in the operation of advanced medium blasters. 2% bonus per skill level to the damage of medium turrets requiring Medium Blaster Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 4
        },
        {
          id: 3304,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    12212: {
      tid: 12212,
      name: "Large Blaster Specialization",
      desc: "Specialist training in the operation of advanced large blasters. 2% Bonus per skill level to the damage of large turrets requiring Large Blaster Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 5
        },
        {
          id: 3307,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    12213: {
      tid: 12213,
      name: "Small Pulse Laser Specialization",
      desc: "Specialist training in the operation of small pulse lasers. 2% bonus per skill level to the damage of small turrets requiring Small Pulse Laser Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 3
        },
        {
          id: 3303,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    12214: {
      tid: 12214,
      name: "Medium Pulse Laser Specialization",
      desc: "Specialist training in the operation of advanced medium pulse lasers. 2% bonus per skill level to the damage of medium turrets requiring Medium Pulse Laser Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 4
        },
        {
          id: 3306,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    12215: {
      tid: 12215,
      name: "Large Pulse Laser Specialization",
      desc: "Specialist training in the operation of advanced large pulse lasers. 2% bonus per skill level to the damage of large turrets requiring Large Pulse Laser Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 5
        },
        {
          id: 3309,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    12241: {
      tid: 12241,
      name: "Sovereignty",
      desc: "Advanced corporation operation. +2000 corporation members allowed per level. \r\n\r\nNote: The CEO must update his corporation through the corporation user interface before the skill takes effect.",
      mkt_gid: 365,
      mkt_gname: "Corporation Management",
      rq_skills: [
        {
          id: 3732,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "charisma",
      ttm: 8
    },
    12305: {
      tid: 12305,
      name: "Drone Navigation",
      desc: "Skill at controlling drones at high speeds.\r\n\r\n5% increase in drone max velocity per level.\r\n5% increase in fighter max velocity per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 1
    },
    12365: {
      tid: 12365,
      name: "EM Shield Compensation",
      desc: "5% bonus to EM resistance per level for Shield Amplifiers.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3416,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    12366: {
      tid: 12366,
      name: "Kinetic Shield Compensation",
      desc: "5% bonus to kinetic resistance per level for Shield Amplifiers.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3416,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    12367: {
      tid: 12367,
      name: "Explosive Shield Compensation",
      desc: "5% bonus to explosive resistance per level for Shield Amplifiers.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3416,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    12441: {
      tid: 12441,
      name: "Missile Bombardment",
      desc: "Proficiency at long-range missile combat. 10% bonus to all missiles' maximum flight time per level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    12442: {
      tid: 12442,
      name: "Missile Projection",
      desc: "Skill at boosting missile bay trigger circuits and enhancing guided missiles' ignition systems. 10% bonus to all missiles' maximum velocity per level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    12484: {
      tid: 12484,
      name: "Amarr Drone Specialization",
      desc: "Specialization in the operation of advanced Amarr drones. 2% bonus per skill level to the damage of light, medium, heavy and sentry drones requiring Amarr Drone Specialization.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    12485: {
      tid: 12485,
      name: "Minmatar Drone Specialization",
      desc: "Specialization in the operation of advanced Minmatar drones. 2% bonus per skill level to the damage of light, medium, heavy and sentry drones requiring Minmatar Drone Specialization.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    12486: {
      tid: 12486,
      name: "Gallente Drone Specialization",
      desc: "Specialization in the operation of advanced Gallente drones. 2% bonus per skill level to the damage of light, medium, heavy and sentry drones requiring Gallente Drone Specialization.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    12487: {
      tid: 12487,
      name: "Caldari Drone Specialization",
      desc: "Specialization in the operation of advanced Caldari drones. 2% bonus per skill level to the damage of light, medium, heavy and sentry drones requiring Caldari Drone Specialization.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    13278: {
      tid: 13278,
      name: "Archaeology",
      desc: "Proficiency at identifying and analyzing ancient artifacts. Required skill for the use of Relic Analyzer modules.\r\n\r\nGives +10 Virus Coherence per level.  ",
      mkt_gid: 1110,
      mkt_gname: "Scanning",
      rq_skills: [
        {
          id: 3402,
          level: 3
        },
        {
          id: 3551,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    13279: {
      tid: 13279,
      name: "Remote Sensing",
      desc: "The ability to gather and analyze remote sensing data from satellites in orbit around a planet and produce properly calibrated surveys.\r\n\r\nLevel 1: allows scans within 1 ly\r\nLevel 2: allows scans within 3 ly\r\nLevel 3: allows scans within 5 ly\r\nLevel 4: allows scans within 7 ly\r\nLevel 5: allows scans within 9 ly\r\n ",
      mkt_gid: 1823,
      mkt_gname: "Planet Management",
      rq_skills: [
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    16069: {
      tid: 16069,
      name: "Remote Armor Repair Systems",
      desc: "Operation of remote armor repair systems. 5% reduced capacitor need for remote armor repair system modules per skill level.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3392,
          level: 3
        },
        {
          id: 3393,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    16281: {
      tid: 16281,
      name: "Ice Harvesting",
      desc: "Skill at harvesting ice. 5% reduction per skill level to the cycle time of ice harvesters.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3386,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    16591: {
      tid: 16591,
      name: "Heavy Assault Cruisers",
      desc: "Skill for operation of Heavy Assault Cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3424,
          level: 5
        },
        {
          id: 3318,
          level: 5
        },
        {
          id: 3327,
          level: 5
        },
        {
          id: 3418,
          level: 4
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 6
    },
    16594: {
      tid: 16594,
      name: "Procurement",
      desc: "Proficiency at placing remote buy orders on the market. Level 1 allows for the placement of orders within the same solar system, Level 2 extends that range to systems within 5 jumps, and each subsequent level then doubles it. Level 5 allows for placement of remote buy orders anywhere within current region.  \r\n\r\nNote: Placing buy orders and directly buying an item are not the same thing. Direct remote purchase requires no skill.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 16598,
          level: 2
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 3
    },
    16595: {
      tid: 16595,
      name: "Daytrading",
      desc: "Allows for remote modification of buy and sell orders. Each level of skill increases the range at which orders may be modified. Level 1 allows for modification of orders within the same solar system, Level 2 extends that range to systems within 5 jumps, and each subsequent level then doubles it. Level 5 allows for market order modification anywhere within current region.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 3443,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 1
    },
    16596: {
      tid: 16596,
      name: "Wholesale",
      desc: "Ability to organize and manage large-scale market operations. Each level raises the limit of active orders by 16.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 3444,
          level: 5
        },
        {
          id: 16598,
          level: 2
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 4
    },
    16597: {
      tid: 16597,
      name: "Advanced Broker Relations",
      desc: "Ability to make potentially risky investments work in your favor. Each level of skill reduces the percentage of ISK placed in market escrow when entering buy orders. Starting with an escrow percentage of 100% at Level 0 (untrained skill), each skill level cumulatively reduces the percentage by 25%. This will bring your total escrow down to approximately 24% at level 5.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 16622,
          level: 4
        },
        {
          id: 3446,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 3
    },
    16598: {
      tid: 16598,
      name: "Marketing",
      desc: "Skill at selling items remotely. Each level increases the range from the seller to the item being sold. Level 1 allows for the sale of items within the same solar system, Level 2 extends that range to systems within 5 jumps, and each subsequent level then doubles it. Level 5 allows for sale of items located anywhere within current region.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 3443,
          level: 2
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 3
    },
    16622: {
      tid: 16622,
      name: "Accounting",
      desc: "Proficiency at squaring away the odds and ends of business transactions, keeping the checkbooks tight. Each level of skill reduces sales tax by 11%. Sales tax starts at 5%.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 3443,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 3
    },
    17940: {
      tid: 17940,
      name: "Mining Barge",
      desc: "Skill at operating ORE Mining Barges.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3410,
          level: 3
        },
        {
          id: 3380,
          level: 5
        },
        {
          id: 32918,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    18025: {
      tid: 18025,
      name: "Ice Processing",
      desc: "Skill for Ice reprocessing. Allows a skilled individual to utilize substandard reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Ice reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 11443,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 5
    },
    18580: {
      tid: 18580,
      name: "Tycoon",
      desc: "Ability to organize and manage ultra large-scale market operations. Each level raises the limit of active orders by 32.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 16596,
          level: 5
        },
        {
          id: 16598,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 6
    },
    19719: {
      tid: 19719,
      name: "Transport Ships",
      desc: "Skill for operation of Transport Ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3380,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 6
    },
    19759: {
      tid: 19759,
      name: "Long Distance Jamming",
      desc: "Skill at the long-range operation of electronic warfare systems. 10% bonus to optimal range of ECM, Remote Sensor Dampeners, Weapon Disruptors, Remote Tracking Computers, Remote Sensor Boosters and Target Painters per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 4
        },
        {
          id: 3427,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 4
    },
    19760: {
      tid: 19760,
      name: "Frequency Modulation",
      desc: "Advanced understanding of signal waves. 10% bonus to falloff for ECM, Remote Sensor Dampeners, Weapon Disruptors, Remote Tracking Computers, Remote Sensor Boosters and Target Painters per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 3
        },
        {
          id: 3427,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    19761: {
      tid: 19761,
      name: "Signal Dispersion",
      desc: "Skill at the operation of target jamming equipment. 5% bonus to strength of all ECM jammers per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 4
        },
        {
          id: 3427,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    19766: {
      tid: 19766,
      name: "Signal Suppression",
      desc: "Skill at the operation of remote sensor dampers. 5% bonus to remote sensor dampers' scan resolution and targeting range suppression per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 4
        },
        {
          id: 3433,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    19767: {
      tid: 19767,
      name: "Weapon Destabilization",
      desc: "Advanced understanding of weapon disruption technology. 5% bonus to the effectiveness of Weapon Disruptor modules per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 4
        },
        {
          id: 3434,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    19921: {
      tid: 19921,
      name: "Target Painting",
      desc: "Skill at using target painters. 5% less capacitor need for target painters per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    19922: {
      tid: 19922,
      name: "Signature Focusing",
      desc: "Advanced understanding of target painting technology. 5% bonus to target painter modules' signature radius multiplier per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3426,
          level: 4
        },
        {
          id: 19921,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    20209: {
      tid: 20209,
      name: "Rocket Specialization",
      desc: "Specialist training in the operation of advanced rocket launchers. 2% bonus per level to the rate of fire of modules requiring Rocket Specialization.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 3320,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    20210: {
      tid: 20210,
      name: "Light Missile Specialization",
      desc: "Specialist training in the operation of advanced light missile launchers and arrays. 2% bonus per level to the rate of fire of modules requiring Light Missile Specialization.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 3321,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    20211: {
      tid: 20211,
      name: "Heavy Missile Specialization",
      desc: "Specialist training in the operation of advanced heavy missile launchers. 2% bonus per level to the rate of fire of modules requiring Heavy Missile Specialization.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 3324,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    20212: {
      tid: 20212,
      name: "Cruise Missile Specialization",
      desc: "Specialist training in the operation of advanced cruise missile launchers. 2% bonus per level to the rate of fire of modules requiring Cruise Missile Specialization.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 3326,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    20213: {
      tid: 20213,
      name: "Torpedo Specialization",
      desc: "Specialist training in the operation of advanced siege launchers. 2% bonus per level to the rate of fire of modules requiring Torpedo Specialization.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 3325,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    20312: {
      tid: 20312,
      name: "Guided Missile Precision",
      desc: "Skill at precision missile homing. Proficiency at this skill increases the accuracy of a fired missile's exact point of impact, resulting in greater damage to small targets. 5% decrease per level in factor of signature radius for all missile explosions.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 4
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    20314: {
      tid: 20314,
      name: "Target Navigation Prediction",
      desc: "Proficiency at optimizing a missile's flight path to negate the effects of a target's speed upon the explosion's impact. 10% decrease per level in factor of target's velocity for all missiles.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    20315: {
      tid: 20315,
      name: "Warhead Upgrades",
      desc: "Proficiency at upgrading missile warheads with deadlier payloads. 2% bonus to all missile damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 4
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    20327: {
      tid: 20327,
      name: "Capital Energy Turret",
      desc: "Operation of capital energy turrets. 5% Bonus to capital energy turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3309,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 7
    },
    20342: {
      tid: 20342,
      name: "Advanced Spaceship Command",
      desc: "The advanced operation of spaceships. Grants a 5% Bonus per skill level to the agility of ships requiring Advanced Spaceship Command.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    20433: {
      tid: 20433,
      name: "Talocan Technology",
      desc: "Basic understanding of interfacing with Talocan technology.\r\n\r\nThe Talocan were masters of Spatial manipulation and Hypereuclidean Mathematics.\r\n\r\nAllows the rudimentary use of Talocan components in the creation of advanced technology, even though the scientific theories behind them remain a mystery.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 13278,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    20494: {
      tid: 20494,
      name: "Armored Command",
      desc: "Basic proficiency at boosting the armor defenses of allied ships. Grants a 10% bonus to the duration of Armored Command Burst effects per level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 2
    },
    20495: {
      tid: 20495,
      name: "Information Command",
      desc: "Basic proficiency at boosting the sensors and electronic warfare systems of allied ships. Grants a 10% bonus to the duration of Information Command Burst effects per level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 2
    },
    20524: {
      tid: 20524,
      name: "Amarr Freighter",
      desc: "Skill at operating Amarr freighters.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20342,
          level: 5
        },
        {
          id: 3343,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    20525: {
      tid: 20525,
      name: "Amarr Dreadnought",
      desc: "Skill at operating Amarr dreadnoughts.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 3
        },
        {
          id: 3339,
          level: 3
        },
        {
          id: 22043,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 12
    },
    20526: {
      tid: 20526,
      name: "Caldari Freighter",
      desc: "Skill at operating Caldari freighters.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20342,
          level: 5
        },
        {
          id: 3342,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    20527: {
      tid: 20527,
      name: "Gallente Freighter",
      desc: "Skill at operating Gallente freighters.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20342,
          level: 5
        },
        {
          id: 3340,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    20528: {
      tid: 20528,
      name: "Minmatar Freighter",
      desc: "Skill at operating Minmatar freighters.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20342,
          level: 5
        },
        {
          id: 3341,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    20530: {
      tid: 20530,
      name: "Caldari Dreadnought",
      desc: "Skill at operating Caldari dreadnoughts.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 3
        },
        {
          id: 3338,
          level: 3
        },
        {
          id: 22043,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 12
    },
    20531: {
      tid: 20531,
      name: "Gallente Dreadnought",
      desc: "Skill at operating Gallente dreadnoughts.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 3
        },
        {
          id: 3336,
          level: 3
        },
        {
          id: 22043,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 12
    },
    20532: {
      tid: 20532,
      name: "Minmatar Dreadnought",
      desc: "Skill at operating Minmatar dreadnoughts.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 3
        },
        {
          id: 3337,
          level: 3
        },
        {
          id: 22043,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 12
    },
    20533: {
      tid: 20533,
      name: "Capital Ships",
      desc: "Skill for the operation of capital ships. Grants a 5% bonus per skill level to the agility of ships requiring the Capital Ships skill.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20342,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    21059: {
      tid: 21059,
      name: "Shield Compensation",
      desc: "Improved skill for regulating energy flow to shields. 2% less capacitor need for shield boosters per skill level.\r\n\r\nNote: Has no effect on capital sized modules.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3416,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    21071: {
      tid: 21071,
      name: "Rapid Launch",
      desc: "Proficiency in operation of missile launchers. 3% bonus to missile launcher rate of fire per level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 2
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    21603: {
      tid: 21603,
      name: "Cynosural Field Theory",
      desc: "Skill at creating effective cynosural fields. 10% reduction in liquid ozone consumption for module activation per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3426,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    21610: {
      tid: 21610,
      name: "Jump Fuel Conservation",
      desc: "Skill at regulating energy flow to the jump drive. 10% reduction in isotope consumption amount for jump drive operation per light year per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3456,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 8
    },
    21611: {
      tid: 21611,
      name: "Jump Drive Calibration",
      desc: "Advanced skill at using Jump Drives. 20% increase in maximum jump range per skill level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3456,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "perception",
      ttm: 9
    },
    21666: {
      tid: 21666,
      name: "Capital Hybrid Turret",
      desc: "Operation of capital hybrid turrets. 5% Bonus to capital hybrid turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3307,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 7
    },
    21667: {
      tid: 21667,
      name: "Capital Projectile Turret",
      desc: "Operation of capital projectile turrets. 5% Bonus to capital projectile turret damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3308,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 7
    },
    21668: {
      tid: 21668,
      name: "XL Torpedoes",
      desc: "Skill at the handling and firing of XL torpedoes. 5% bonus to XL torpedo damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 5
        },
        {
          id: 3325,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 7
    },
    21718: {
      tid: 21718,
      name: "Hacking",
      desc: "Proficiency at breaking into guarded computer systems. Required skill for the use of Data Analyzer modules.\r\n\r\nGives +10 Virus Coherence per level.",
      mkt_gid: 1110,
      mkt_gname: "Scanning",
      rq_skills: [
        {
          id: 3402,
          level: 3
        },
        {
          id: 3432,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    21789: {
      tid: 21789,
      name: "Sleeper Technology",
      desc: "Basic understanding of interfacing with Sleeper technology.\r\n\r\nThe Sleepers were masters of virtual reality, neural interfacing and cryotechnology.\r\n\r\nAllows the rudimentary use of Sleeper components in the creation of advanced technology, even though the scientific theories behind them remain a mystery.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 13278,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    21790: {
      tid: 21790,
      name: "Caldari Encryption Methods",
      desc: "Understanding of the data encryption methods used by the Caldari State and its allies.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 21718,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    21791: {
      tid: 21791,
      name: "Minmatar Encryption Methods",
      desc: "Understanding of the data encryption methods used by the Minmatar Republic and its allies.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 21718,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    21802: {
      tid: 21802,
      name: "Capital Shield Operation",
      desc: "Operation of capital shield boosters and other shield modules. 2% reduction in capacitor need for capital shield boosters per skill level.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3419,
          level: 5
        },
        {
          id: 3416,
          level: 5
        },
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 8
    },
    21803: {
      tid: 21803,
      name: "Capital Repair Systems",
      desc: "Operation of capital armor/hull repair modules. 5% reduction in capital repair systems duration per skill level.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3392,
          level: 5
        },
        {
          id: 3394,
          level: 5
        },
        {
          id: 3393,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 8
    },
    22043: {
      tid: 22043,
      name: "Tactical Weapon Reconfiguration",
      desc: "Skill at the operation of siege modules. 25-unit reduction in strontium clathrate consumption amount for module activation per skill level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 11207,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    22242: {
      tid: 22242,
      name: "Capital Ship Construction",
      desc: "Skill required for the manufacturing of standard and advanced capital ships.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3392,
          level: 5
        },
        {
          id: 3380,
          level: 5
        },
        {
          id: 3388,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 14
    },
    22536: {
      tid: 22536,
      name: "Mining Foreman",
      desc: "Basic proficiency at boosting the mining capabilities of allied ships. Grants a 10% bonus to the duration of Mining Foreman Burst effects per level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 2
    },
    22541: {
      tid: 22541,
      name: "Mining Drone Specialization",
      desc: "Advanced proficiency at controlling mining drones. 2% bonus to the mining yield and max velocity of drones requiring Mining Drone Specialization per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3438,
          level: 5
        },
        {
          id: 3386,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    22551: {
      tid: 22551,
      name: "Exhumers",
      desc: "Skill for the operation of Exhumers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 4
        },
        {
          id: 3380,
          level: 5
        },
        {
          id: 3410,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 5
    },
    22552: {
      tid: 22552,
      name: "Mining Director",
      desc: "Advanced proficiency at boosting the mining capabilities of allied ships. Increases the strength of Mining Foreman Burst effects by 10% per skill level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 3348,
          level: 1
        },
        {
          id: 22536,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 5
    },
    22578: {
      tid: 22578,
      name: "Mining Upgrades",
      desc: "Skill at using mining upgrades. 5% reduction per skill level in CPU penalty of mining upgrade modules.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3386,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 4
    },
    22761: {
      tid: 22761,
      name: "Recon Ships",
      desc: "Skill for the operation of Recon Ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 11579,
          level: 4
        },
        {
          id: 3431,
          level: 5
        },
        {
          id: 3327,
          level: 5
        },
        {
          id: 3432,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 6
    },
    22806: {
      tid: 22806,
      name: "EM Armor Compensation",
      desc: "5% bonus to EM resistance per level for Armor Coatings and Energized Platings.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3394,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    22807: {
      tid: 22807,
      name: "Explosive Armor Compensation",
      desc: "5% bonus to explosive resistance per level for Armor Coatings and Energized Platings.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3394,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    22808: {
      tid: 22808,
      name: "Kinetic Armor Compensation",
      desc: "5% bonus to kinetic resistance per level for Armor Coatings and Energized Platings.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3394,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    22809: {
      tid: 22809,
      name: "Thermal Armor Compensation",
      desc: "5% bonus to thermal resistance per level for Armor Coatings and Energized Platings.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3394,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    23069: {
      tid: 23069,
      name: "Fighters",
      desc: "Allows operation of fighter craft. 5% increase in fighter damage per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3442,
          level: 5
        },
        {
          id: 3348,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 12
    },
    23087: {
      tid: 23087,
      name: "Amarr Encryption Methods",
      desc: "Understanding of the data encryption methods used by the Amarr Empire and its allies.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 21718,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    23121: {
      tid: 23121,
      name: "Gallente Encryption Methods",
      desc: "Understanding of the data encryption methods used by the Gallente Federation and its allies.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 21718,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    23123: {
      tid: 23123,
      name: "Takmahl Technology",
      desc: "Basic understanding of interfacing with Takmahl technology.\r\n\r\nThe Takmahl nation excelled in cybernetics and bio-engineering.\r\n\r\nAllows the rudimentary use of Takmahl components in the creation of advanced technology, even though the scientific theories behind them remain a mystery.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 13278,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    23124: {
      tid: 23124,
      name: "Yan Jung Technology",
      desc: "Basic understanding of interfacing with Yan Jung technology.\r\n\r\nThe Yan Jung nation possessed advanced gravitronic technology and force field theories.\r\n\r\nAllows the rudimentary use of Yan Jung components in the creation of advanced technology, even though the scientific theories behind them remain a mystery.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 13278,
          level: 2
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    23566: {
      tid: 23566,
      name: "Advanced Drone Avionics",
      desc: "This skill is required for the operation of Electronic Warfare Drones but also gives a bonus to the control range of all drones.\r\n\r\n3,000m bonus drone control range per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        },
        {
          id: 3427,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    23594: {
      tid: 23594,
      name: "Sentry Drone Interfacing",
      desc: "Skill at controlling sentry drones. 5% bonus to Sentry Drone damage per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3442,
          level: 4
        },
        {
          id: 23606,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    23606: {
      tid: 23606,
      name: "Drone Sharpshooting",
      desc: "Increases the weapon range of drones and fighters.\r\n\r\n5% bonus to drone optimal range per level.\r\n5% bonus to fighter optimal range per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 1
    },
    23618: {
      tid: 23618,
      name: "Drone Durability",
      desc: "Increases drone and fighter hit points.\r\n\r\n5% bonus to drone shield, armor and hull hit points per level.\r\n5% bonus to fighter hit points per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    23950: {
      tid: 23950,
      name: "Command Ships",
      desc: "Skill for the operation of Command Ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 5
        },
        {
          id: 3354,
          level: 4
        },
        {
          id: 11574,
          level: 4
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 8
    },
    24241: {
      tid: 24241,
      name: "Light Drone Operation",
      desc: "Skill at controlling light combat drones. 5% bonus to damage of light drones per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 1
    },
    24242: {
      tid: 24242,
      name: "Infomorph Psychology",
      desc: "Psychological training that strengthens the pilot's mental tenacity. The reality of having one's consciousness detached from one's physical form, scattered across the galaxy and then placed in a vat-grown clone can be very unsettling to the untrained mind.\r\n\r\nAllows 1 jump clone per level.\r\n\r\nNote: Clones can only be installed in stations with medical facilities or in ships with clone vat bays. Installed clones are listed in the character sheet.",
      mkt_gid: 1746,
      mkt_gname: "Neural Enhancement",
      rq_skills: [],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 1
    },
    24268: {
      tid: 24268,
      name: "Supply Chain Management",
      desc: "Proficiency at starting manufacturing jobs remotely. Without this skill, one can only start jobs within the solar system where one is located. Each level increases the distance at which manufacturing jobs can be started. Level 1 allows for jobs at a range within 5 jumps, and each subsequent level adds 5 more jumps to the range, with a maximum of a 25 jump range.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3387,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 3
    },
    24270: {
      tid: 24270,
      name: "Scientific Networking",
      desc: "Skill at running research operations remotely. Without this skill, one can only start jobs within the solar system where one is located. Each level increases the distance at which research projects can be started. Level 1 allows for jobs at a range within 5 jumps, and each subsequent level adds 5 more jumps to the range, with a maximum of a 25 jump range.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3406,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    24311: {
      tid: 24311,
      name: "Amarr Carrier",
      desc: "Skill at operating Amarr carriers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 4
        },
        {
          id: 3339,
          level: 3
        },
        {
          id: 3442,
          level: 5
        },
        {
          id: 21610,
          level: 4
        },
        {
          id: 21611,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    24312: {
      tid: 24312,
      name: "Caldari Carrier",
      desc: "Skill at operating Caldari carriers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 4
        },
        {
          id: 3338,
          level: 3
        },
        {
          id: 3442,
          level: 5
        },
        {
          id: 21610,
          level: 4
        },
        {
          id: 21611,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    24313: {
      tid: 24313,
      name: "Gallente Carrier",
      desc: "Skill at operating Gallente carriers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 4
        },
        {
          id: 3336,
          level: 3
        },
        {
          id: 3442,
          level: 5
        },
        {
          id: 21610,
          level: 4
        },
        {
          id: 21611,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    24314: {
      tid: 24314,
      name: "Minmatar Carrier",
      desc: "Skill at operating Minmatar carriers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 4
        },
        {
          id: 3337,
          level: 3
        },
        {
          id: 3442,
          level: 5
        },
        {
          id: 21610,
          level: 4
        },
        {
          id: 21611,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    24562: {
      tid: 24562,
      name: "Jump Portal Generation",
      desc: "Skill for the generation of jump portals to distant solar systems. 10% reduced material cost for jump portal activation per level.",
      mkt_gid: 374,
      mkt_gname: "Navigation",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3412,
          level: 5
        },
        {
          id: 3456,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 14
    },
    24563: {
      tid: 24563,
      name: "Doomsday Operation",
      desc: "Skill at operating titan doomsday weapons. 10% increased damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3421,
          level: 5
        },
        {
          id: 11207,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "intelligence",
      ttm: 14
    },
    24568: {
      tid: 24568,
      name: "Capital Remote Armor Repair Systems",
      desc: "Operation of capital sized remote armor repair systems. 5% reduced capacitor need for capital remote armor repair system modules per skill level.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 16069,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 10
    },
    24571: {
      tid: 24571,
      name: "Capital Shield Emission Systems",
      desc: "Operation of capital sized shield transfer array and other shield emission systems. 5% reduced capacitor need for capital shield emission system modules per skill level.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3413,
          level: 5
        },
        {
          id: 3422,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 10
    },
    24572: {
      tid: 24572,
      name: "Capital Capacitor Emission Systems",
      desc: "Operation of capital remote capacitor transmitters and other capacitor emission systems. 5% reduced capacitor need of capital capacitor emission systems per skill level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3413,
          level: 5
        },
        {
          id: 3423,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 10
    },
    24606: {
      tid: 24606,
      name: "Cloning Facility Operation",
      desc: "Needed for use of the Clone Vat Bay module.\r\n\r\nSpecial: Increases a Clone Vat Bay's maximum clone capacity by 15% per skill level.",
      mkt_gid: 1746,
      mkt_gname: "Neural Enhancement",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 20533,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 10
    },
    24613: {
      tid: 24613,
      name: "Fighter Hangar Management",
      desc: "5% bonus to Fighter Hangar size per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 23069,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 8
    },
    24624: {
      tid: 24624,
      name: "Advanced Laboratory Operation",
      desc: "Further training in the operation of multiple laboratories. Ability to run 1 additional research job per skill level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3406,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 8
    },
    24625: {
      tid: 24625,
      name: "Advanced Mass Production",
      desc: "Further training in the operation of multiple factories. Ability to run 1 additional manufacturing job per skill level.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [
        {
          id: 3387,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 8
    },
    24764: {
      tid: 24764,
      name: "Fleet Command",
      desc: "Advanced proficiency at projecting beneficial effects to fleetmates. Increases Command Burst and Mining Foreman Burst area of effect range by 5% per skill level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 11574,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 12
    },
    25233: {
      tid: 25233,
      name: "Corporation Contracting",
      desc: "You are familiar with the intricacies of formalizing contracts between your corporation and other entities. \r\n\r\nFor each level of this skill the number of concurrent corporation/alliance contracts you make on behalf of your corporation is increased by 10 up to a maximum of 60. \r\n\r\nThis skill has no effect on contracts you make personally.\r\n\r\nThere is no limit on the number of contracts a corporation can assign to itself.\r\n\r\nCorporations have a hard limit of 500 outstanding public contracts.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 25235,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 3
    },
    25235: {
      tid: 25235,
      name: "Contracting",
      desc: "This skill allows you to create formal agreements with other characters. \r\n\r\nFor each level of this skill the number of outstanding contracts is increased by four (up to a maximum of 21 at level 5)",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 3355,
          level: 1
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 1
    },
    25530: {
      tid: 25530,
      name: "Neurotoxin Recovery",
      desc: "Proficiency at biofeedback techniques intended to negate the side effects typically experienced upon injection of combat boosters.",
      mkt_gid: 1746,
      mkt_gname: "Neural Enhancement",
      rq_skills: [
        {
          id: 25538,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    25538: {
      tid: 25538,
      name: "Neurotoxin Control",
      desc: "Proficiency at reducing the severity of the side effects experienced upon injection of combat boosters.",
      mkt_gid: 1746,
      mkt_gname: "Neural Enhancement",
      rq_skills: [
        {
          id: 3402,
          level: 4
        },
        {
          id: 3405,
          level: 1
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    25544: {
      tid: 25544,
      name: "Gas Cloud Harvesting",
      desc: "Skill at harvesting gas clouds. Allows use of one gas cloud harvester per level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3386,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    25718: {
      tid: 25718,
      name: "Heavy Assault Missile Specialization",
      desc: "Specialist training in the operation of advanced heavy assault missile launchers. 2% bonus per level to the rate of fire of modules requiring Heavy Assault Missile Specialization.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 25719,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    25719: {
      tid: 25719,
      name: "Heavy Assault Missiles",
      desc: "Skill with heavy assault missiles. Special: 5% bonus to heavy assault missile damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 3
        },
        {
          id: 3321,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    25739: {
      tid: 25739,
      name: "Astrometric Rangefinding",
      desc: "Skill for the advanced operation of long range scanners. 5% increase to scan probe strength per level.",
      mkt_gid: 1110,
      mkt_gname: "Scanning",
      rq_skills: [
        {
          id: 3402,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 8
    },
    25810: {
      tid: 25810,
      name: "Astrometric Pinpointing",
      desc: "Greater accuracy in hunting down targets found through scanning. Reduces maximum scan deviation by 5% per level.",
      mkt_gid: 1110,
      mkt_gname: "Scanning",
      rq_skills: [
        {
          id: 3412,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    25811: {
      tid: 25811,
      name: "Astrometric Acquisition",
      desc: "Skill at the advanced operation of long range scanners. 5% reduction in scan probe scan time per level.",
      mkt_gid: 1110,
      mkt_gname: "Scanning",
      rq_skills: [
        {
          id: 3412,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    25863: {
      tid: 25863,
      name: "Salvaging",
      desc: "Proficiency at salvaging ship wrecks. Required skill for the use of salvager modules. 100% increase in chance of salvage retrieval per additional level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3392,
          level: 3
        },
        {
          id: 3551,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26224: {
      tid: 26224,
      name: "Drug Manufacturing",
      desc: "Needed to manufacture boosters.",
      mkt_gid: 369,
      mkt_gname: "Production",
      rq_skills: [],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 2
    },
    26252: {
      tid: 26252,
      name: "Jury Rigging",
      desc: "General understanding of the inner workings of starship components. Allows makeshift modifications to ship systems through the use of rigs. Required learning for further study in the field of rigging. ",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 3392,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    26253: {
      tid: 26253,
      name: "Armor Rigging",
      desc: "Advanced understanding of armor systems. Allows makeshift modifications to armor systems through the use of rigs. \r\n\r\n10% reduction in Armor Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26254: {
      tid: 26254,
      name: "Astronautics Rigging",
      desc: "Advanced understanding of a ships navigational systems. Allows makeshift modifications to warp drive, sub warp drive and other navigational systems through the use of rigs. \r\n\r\n10% reduction in Astronautics Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26255: {
      tid: 26255,
      name: "Drones Rigging",
      desc: "Advanced understanding of a ships drone control systems. Allows makeshift modifications to drone systems through the use of rigs. \r\n\r\n10% reduction in Drone Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26256: {
      tid: 26256,
      name: "Electronic Superiority Rigging",
      desc: "Advanced understanding of electronics systems. Allows makeshift modifications to targeting, scanning and ECM systems through the use of rigs. \r\n\r\n10% reduction in Electronic Superiority Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26257: {
      tid: 26257,
      name: "Projectile Weapon Rigging",
      desc: "Advanced understanding of the interface between projectile weapons and the numerous ship systems. Allows makeshift modifications to ship system architecture through the use of rigs. \r\n\r\n10% reduction in Projectile Weapon Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26258: {
      tid: 26258,
      name: "Energy Weapon Rigging",
      desc: "Advanced understanding of the interface between energy weapons and the numerous ship systems. Allows makeshift modifications to ship system architecture through the use of rigs. \r\n\r\n10% reduction in Energy Weapon Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26259: {
      tid: 26259,
      name: "Hybrid Weapon Rigging",
      desc: "Advanced understanding of the interface between hybrid weapons and the numerous ship systems. Allows makeshift modifications to ship system architecture through the use of rigs. \r\n\r\n10% reduction in Hybrid Weapon Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26260: {
      tid: 26260,
      name: "Launcher Rigging",
      desc: "Advanced understanding of the interface between Missile Launchers and the numerous ship systems. Allows makeshift modifications to ship system architecture through the use of rigs. \r\n\r\n10% reduction in Launcher Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    26261: {
      tid: 26261,
      name: "Shield Rigging",
      desc: "Advanced understanding of shield systems. Allows makeshift modifications to shield systems through the use of rigs. \r\n\r\n10% reduction in Shield Rig drawbacks per level.",
      mkt_gid: 372,
      mkt_gname: "Rigging",
      rq_skills: [
        {
          id: 26252,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    27902: {
      tid: 27902,
      name: "Remote Hull Repair Systems",
      desc: "Operation of remote hull repair systems. 5% reduced capacitor need for remote hull repair system modules per skill level.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3392,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    27906: {
      tid: 27906,
      name: "Tactical Logistics Reconfiguration",
      desc: "Skill at the operation of triage modules. 25-unit reduction in strontium clathrate consumption amount for module activation per skill level.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 12096,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 8
    },
    27911: {
      tid: 27911,
      name: "Burst Projector Operation",
      desc: "Operation of Burst Projector systems. Each skill level gives a 5% reduction in module activation time.",
      mkt_gid: 367,
      mkt_gname: "Electronic Systems",
      rq_skills: [
        {
          id: 3427,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 8
    },
    27936: {
      tid: 27936,
      name: "Capital Remote Hull Repair Systems",
      desc: "Operation of capital class remote hull repair systems. 5% reduced capacitor need for capital class remote hull repair system modules per skill level.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 27902,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 10
    },
    28073: {
      tid: 28073,
      name: "Bomb Deployment",
      desc: "Basic operation of bomb delivery systems. 10% reduction of Bomb Launcher reactivation delay per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 12441,
          level: 4
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 4
    },
    28164: {
      tid: 28164,
      name: "Thermodynamics",
      desc: "Advanced understanding of the laws of thermodynamics. Allows you to deliberately overheat a ship's modules in order to push them beyond their intended limit. Also gives you the ability to frown in annoyance whenever you hear someone mention a perpetual motion unit. Reduces heat damage by 5% per level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3413,
          level: 4
        },
        {
          id: 3418,
          level: 3
        },
        {
          id: 3402,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    28374: {
      tid: 28374,
      name: "Capital Industrial Ships",
      desc: "Skill at operating Capital Industrial Ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20342,
          level: 5
        },
        {
          id: 29637,
          level: 3
        },
        {
          id: 20533,
          level: 2
        },
        {
          id: 28585,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 12
    },
    28585: {
      tid: 28585,
      name: "Industrial Reconfiguration",
      desc: "Skill at the operation of industrial core modules. 50-unit reduction in heavy water consumption amount for module activation per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 24625,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 8
    },
    28609: {
      tid: 28609,
      name: "Heavy Interdiction Cruisers",
      desc: "Skill for operation of Heavy Interdiction Cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3435,
          level: 5
        },
        {
          id: 11446,
          level: 4
        },
        {
          id: 3327,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 6
    },
    28615: {
      tid: 28615,
      name: "Electronic Attack Ships",
      desc: "Skill for the operation of Electronic Attack Frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3428,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 4
    },
    28656: {
      tid: 28656,
      name: "Black Ops",
      desc: "Skill for the operation of Black Ops.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 11579,
          level: 4
        },
        {
          id: 21611,
          level: 4
        },
        {
          id: 3327,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 10
    },
    28667: {
      tid: 28667,
      name: "Marauders",
      desc: "Skill for the operation of Marauders.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3424,
          level: 5
        },
        {
          id: 11207,
          level: 5
        },
        {
          id: 3327,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 10
    },
    28879: {
      tid: 28879,
      name: "Nanite Operation",
      desc: "Skill at operating nanites. 5% reduction in nanite consumption per level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3392,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    28880: {
      tid: 28880,
      name: "Nanite Interfacing",
      desc: "Improved control of general-purpose repair nanites, usually deployed in a paste form. 20% increase in damaged module repair amount per second.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 28879,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    29029: {
      tid: 29029,
      name: "Jump Freighters",
      desc: "Skill for operation of Jump Freighters.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3380,
          level: 5
        },
        {
          id: 20342,
          level: 4
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 14
    },
    29637: {
      tid: 29637,
      name: "Industrial Command Ships",
      desc: "Skill at operating industrial command ships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 5
        },
        {
          id: 3184,
          level: 3
        },
        {
          id: 22552,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    30324: {
      tid: 30324,
      name: "Defensive Subsystem Technology",
      desc: "Understanding of the technology used to create advanced defensive subsystems.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3403,
          level: 5
        },
        {
          id: 11442,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    30325: {
      tid: 30325,
      name: "Core Subsystem Technology",
      desc: "Understanding of the technology used to create advanced core subsystems.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3403,
          level: 5
        },
        {
          id: 11433,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    30327: {
      tid: 30327,
      name: "Offensive Subsystem Technology",
      desc: "Understanding of the technology used to create advanced offensive subsystems.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3403,
          level: 5
        },
        {
          id: 11433,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    30532: {
      tid: 30532,
      name: "Amarr Defensive Systems",
      desc: "Skill in the operation of Amarr Defensive Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3392,
          level: 5
        },
        {
          id: 3416,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    30537: {
      tid: 30537,
      name: "Amarr Offensive Systems",
      desc: "Skill in the operation of Amarr Offensive Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3436,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    30538: {
      tid: 30538,
      name: "Amarr Propulsion Systems",
      desc: "Skill in the operation of Amarr Propulsion Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3449,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    30539: {
      tid: 30539,
      name: "Amarr Core Systems",
      desc: "Skill in the operation of Amarr Core Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    30540: {
      tid: 30540,
      name: "Gallente Defensive Systems",
      desc: "Skill in the operation of Gallente Defensive Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3392,
          level: 5
        },
        {
          id: 3416,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    30544: {
      tid: 30544,
      name: "Caldari Defensive Systems",
      desc: "Skill in the operation of Caldari Defensive Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3416,
          level: 5
        },
        {
          id: 3392,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    30545: {
      tid: 30545,
      name: "Minmatar Defensive Systems",
      desc: "Skill in the operation of Minmatar Defensive Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3392,
          level: 5
        },
        {
          id: 3416,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    30546: {
      tid: 30546,
      name: "Gallente Core Systems",
      desc: "Skill in the operation of Gallente Core Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    30547: {
      tid: 30547,
      name: "Minmatar Core Systems",
      desc: "Skill in the operation of Minmatar Core Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    30548: {
      tid: 30548,
      name: "Caldari Core Systems",
      desc: "Skill in the operation of Caldari Core Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3413,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 1
    },
    30549: {
      tid: 30549,
      name: "Caldari Offensive Systems",
      desc: "Skill in the operation of Caldari Offensive Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3319,
          level: 5
        },
        {
          id: 3300,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    30550: {
      tid: 30550,
      name: "Gallente Offensive Systems",
      desc: "Skill in the operation of Gallente Offensive Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3436,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    30551: {
      tid: 30551,
      name: "Minmatar Offensive Systems",
      desc: "Skill in the operation of Minmatar Offensive Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 3319,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    30552: {
      tid: 30552,
      name: "Caldari Propulsion Systems",
      desc: "Skill in the operation of Caldari Propulsion Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3449,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    30553: {
      tid: 30553,
      name: "Gallente Propulsion Systems",
      desc: "Skill in the operation of Gallente Propulsion Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3449,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    30554: {
      tid: 30554,
      name: "Minmatar Propulsion Systems",
      desc: "Skill in the operation of Minmatar Propulsion Subsystems used on Tech III ships.",
      mkt_gid: 1824,
      mkt_gname: "Subsystems",
      rq_skills: [
        {
          id: 3449,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    30650: {
      tid: 30650,
      name: "Amarr Strategic Cruiser",
      desc: "Skill at operating Amarr Strategic Cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3335,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    30651: {
      tid: 30651,
      name: "Caldari Strategic Cruiser",
      desc: "Skill at operating Caldari Strategic Cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3334,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    30652: {
      tid: 30652,
      name: "Gallente Strategic Cruiser",
      desc: "Skill at operating Gallente Strategic Cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3332,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    30653: {
      tid: 30653,
      name: "Minmatar Strategic Cruiser",
      desc: "Skill at operating Minmatar Strategic Cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3333,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    30788: {
      tid: 30788,
      name: "Propulsion Subsystem Technology",
      desc: "Understanding of the technology used to create advanced propulsion subsystems.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3403,
          level: 5
        },
        {
          id: 11446,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    32339: {
      tid: 32339,
      name: "Heavy Fighters",
      desc: "Allows operation of heavy fighter craft. 5% increase in heavy fighter damage per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 23069,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 12
    },
    32435: {
      tid: 32435,
      name: "XL Cruise Missiles",
      desc: "Skill at the handling and firing of XL Cruise Missiles. 5% bonus to XL Cruise Missile damage per skill level.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 5
        },
        {
          id: 3326,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 7
    },
    32797: {
      tid: 32797,
      name: "Resistance Phasing",
      desc: "Improves control over, and flow between, nano membranes that react to damage by shifting resistances.\r\n\r\nReduces cycle time of Reactive Armor Hardeners, Flex Armor Hardeners and Flex Shield Hardeners by 10% per level and capacitor need by 15% per level.",
      mkt_gid: 368,
      mkt_gname: "Engineering",
      rq_skills: [
        {
          id: 3394,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    32918: {
      tid: 32918,
      name: "Mining Frigate",
      desc: "Skill at operating ORE Mining Frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    32999: {
      tid: 32999,
      name: "Magnetometric Sensor Compensation",
      desc: "Skill at hardening Magnetometric Sensors against hostile Electronic Counter Measure modules. 4% improved Magnetometric Sensor Strength per skill level.\r\n\r\nMagnetometric Sensors are primarily found on Gallente, Serpentis, ORE, and Sisters of EVE ships.",
      mkt_gid: 1748,
      mkt_gname: "Targeting",
      rq_skills: [
        {
          id: 3426,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    33000: {
      tid: 33000,
      name: "Gravimetric Sensor Compensation",
      desc: "Skill at hardening Gravimetric Sensors against hostile Electronic Counter Measure modules. 4% improved Gravimetric Sensor Strength per skill level.\r\n\r\nGravimetric Sensors are primarily found on Caldari, Guristas and Mordu's Legion ships.",
      mkt_gid: 1748,
      mkt_gname: "Targeting",
      rq_skills: [
        {
          id: 3426,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    33001: {
      tid: 33001,
      name: "Ladar Sensor Compensation",
      desc: "Skill at hardening Ladar Sensors against hostile Electronic Counter Measure modules. 4% improved Ladar Sensor Strength per skill level.\r\n\r\nLadar Sensors are primarily found on Minmatar and Angel ships.",
      mkt_gid: 1748,
      mkt_gname: "Targeting",
      rq_skills: [
        {
          id: 3426,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    33002: {
      tid: 33002,
      name: "Radar Sensor Compensation",
      desc: "Skill at hardening Radar Sensors against hostile Electronic Counter Measure modules. 4% improved Radar Sensor Strength per skill level.\r\n\r\nRadar Sensors are primarily found on Amarr, Blood Raider and Sanshas ships.",
      mkt_gid: 1748,
      mkt_gname: "Targeting",
      rq_skills: [
        {
          id: 3426,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 2
    },
    33078: {
      tid: 33078,
      name: "Armor Layering",
      desc: "Skill at installing upgraded armor plates efficiently and securely, reducing the impact they have on agility and speed. Grants a 5% reduction to armor plate mass penalty per level.",
      mkt_gid: 1745,
      mkt_gname: "Armor",
      rq_skills: [
        {
          id: 3392,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 3
    },
    33091: {
      tid: 33091,
      name: "Amarr Destroyer",
      desc: "Skill at operating Amarr destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3331,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    33092: {
      tid: 33092,
      name: "Caldari Destroyer",
      desc: "Skill at operating Caldari destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3330,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    33093: {
      tid: 33093,
      name: "Gallente Destroyer",
      desc: "Skill at operating Gallente destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3328,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    33094: {
      tid: 33094,
      name: "Minmatar Destroyer",
      desc: "Skill at operating Minmatar destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3329,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    33095: {
      tid: 33095,
      name: "Amarr Battlecruiser",
      desc: "Skill at operating Amarr battlecruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3335,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 6
    },
    33096: {
      tid: 33096,
      name: "Caldari Battlecruiser",
      desc: "Skill at operating Caldari battlecruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3334,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 6
    },
    33097: {
      tid: 33097,
      name: "Gallente Battlecruiser",
      desc: "Skill at operating Gallente battlecruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3332,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 6
    },
    33098: {
      tid: 33098,
      name: "Minmatar Battlecruiser",
      desc: "Skill at operating Minmatar battlecruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3333,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 6
    },
    33399: {
      tid: 33399,
      name: "Infomorph Synchronizing",
      desc: "Psychological training that strengthens the pilot's mental tenacity. Improved ability to synchronize with new clones allows pilots to jump-clone more frequently without risk of neural damage.\r\n\r\nReduced time between clone jumps by 1 hour per level.\r\n\r\nNote: Clones can only be installed in stations with medical facilities or in ships with clone vat bays. Installed clones are listed in the character sheet.",
      mkt_gid: 1746,
      mkt_gname: "Neural Enhancement",
      rq_skills: [
        {
          id: 24242,
          level: 1
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 2
    },
    33407: {
      tid: 33407,
      name: "Advanced Infomorph Psychology",
      desc: "Advanced training for those Capsuleers who want to push clone technology to its limits.\r\n\r\nAllows 1 additional jump clone per level.\r\n\r\nNote: Clones can only be installed in stations with medical facilities or in ships with clone vat bays. Installed clones are listed in the character sheet.",
      mkt_gid: 1746,
      mkt_gname: "Neural Enhancement",
      rq_skills: [
        {
          id: 24242,
          level: 5
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 5
    },
    33467: {
      tid: 33467,
      name: "Customs Code Expertise",
      desc: "Expertise in cutting through the red tape of customs regulations. Reduces Import and Export empire tax in Customs Offices by 10% per level.\r\n\r\nThis does not affect InterBus Customs Offices.",
      mkt_gid: 378,
      mkt_gname: "Trade",
      rq_skills: [
        {
          id: 3443,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "memory",
      ttm: 2
    },
    33699: {
      tid: 33699,
      name: "Medium Drone Operation",
      desc: "Skill at controlling medium combat drones. 5% bonus to damage of medium drones per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 2
    },
    33856: {
      tid: 33856,
      name: "Expedition Frigates",
      desc: "Skill for operation of Expedition Frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3432,
          level: 5
        },
        {
          id: 3380,
          level: 5
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 4
    },
    34327: {
      tid: 34327,
      name: "ORE Freighter",
      desc: "Skill at operating ORE freighters.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20342,
          level: 5
        },
        {
          id: 3184,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 9
    },
    34390: {
      tid: 34390,
      name: "Amarr Tactical Destroyer",
      desc: "Skill at operating Amarr Tactical Destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 33091,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    34533: {
      tid: 34533,
      name: "Minmatar Tactical Destroyer",
      desc: "Skill at operating Minmatar Tactical Destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 33094,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    35680: {
      tid: 35680,
      name: "Caldari Tactical Destroyer",
      desc: "Skill at operating Caldari Tactical Destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 33092,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    35685: {
      tid: 35685,
      name: "Gallente Tactical Destroyer",
      desc: "Skill at operating Gallente Tactical Destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 33093,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    37615: {
      tid: 37615,
      name: "Command Destroyers",
      desc: "Skill for the operation of Command Destroyers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 5
        },
        {
          id: 3354,
          level: 4
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 6
    },
    37796: {
      tid: 37796,
      name: "Structure Missile Systems",
      desc: "Basic operation of structure missile launchers.\r\n\r\n2% bonus to all structure missile and guided bomb damage per level.",
      mkt_gid: 2152,
      mkt_gname: "Structure Management",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 11584,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "willpower",
      ttm: 2
    },
    37797: {
      tid: 37797,
      name: "Structure Doomsday Operation",
      desc: "Specialization in operating Citadel doomsday weapons.\r\n\r\n2% reduction in Arcing Vorton Projector duration per level.",
      mkt_gid: 2152,
      mkt_gname: "Structure Management",
      rq_skills: [
        {
          id: 3402,
          level: 1
        },
        {
          id: 11584,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "willpower",
      ttm: 2
    },
    37798: {
      tid: 37798,
      name: "Structure Electronic Systems",
      desc: "Basic operation of structure electronic modules.\r\n\r\n3% reduction in capacitor consumption of all structure electronic warfare and tackle modules per level.",
      mkt_gid: 2152,
      mkt_gname: "Structure Management",
      rq_skills: [
        {
          id: 3426,
          level: 1
        },
        {
          id: 11584,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "willpower",
      ttm: 2
    },
    37799: {
      tid: 37799,
      name: "Structure Engineering Systems",
      desc: "Basic operation of structure engineering modules.\r\n\r\n2% reduction in capacitor consumption of all structure energy neutralizers and point defense batteries per level.",
      mkt_gid: 2152,
      mkt_gname: "Structure Management",
      rq_skills: [
        {
          id: 3413,
          level: 1
        },
        {
          id: 11584,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "willpower",
      ttm: 2
    },
    40328: {
      tid: 40328,
      name: "Logistics Frigates",
      desc: "Skill for operation of Logistics Frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 3
        },
        {
          id: 3431,
          level: 5
        },
        {
          id: 3428,
          level: 4
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 4
    },
    40535: {
      tid: 40535,
      name: "Amarr Force Auxiliary",
      desc: "Skill at operating Amarr force auxiliaries.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 4
        },
        {
          id: 3339,
          level: 3
        },
        {
          id: 27906,
          level: 1
        },
        {
          id: 21610,
          level: 4
        },
        {
          id: 21611,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    40536: {
      tid: 40536,
      name: "Caldari Force Auxiliary",
      desc: "Skill at operating Caldari force auxiliaries.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 4
        },
        {
          id: 3338,
          level: 3
        },
        {
          id: 27906,
          level: 1
        },
        {
          id: 21610,
          level: 4
        },
        {
          id: 21611,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    40537: {
      tid: 40537,
      name: "Gallente Force Auxiliary",
      desc: "Skill at operating Gallente force auxiliaries.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 4
        },
        {
          id: 3336,
          level: 3
        },
        {
          id: 27906,
          level: 1
        },
        {
          id: 21610,
          level: 4
        },
        {
          id: 21611,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    40538: {
      tid: 40538,
      name: "Minmatar Force Auxiliary",
      desc: "Skill at operating Minmatar force auxiliaries.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 4
        },
        {
          id: 3337,
          level: 3
        },
        {
          id: 27906,
          level: 1
        },
        {
          id: 21610,
          level: 4
        },
        {
          id: 21611,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 14
    },
    40572: {
      tid: 40572,
      name: "Light Fighters",
      desc: "Allows operation of light fighter craft. 5% increase in light fighter velocity per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 23069,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 12
    },
    40573: {
      tid: 40573,
      name: "Support Fighters",
      desc: "Allows operation of support fighter craft. 5% increase in support fighter hit-points per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 23069,
          level: 1
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 12
    },
    41403: {
      tid: 41403,
      name: "Capital Autocannon Specialization",
      desc: "Specialist training in the operation of advanced capital autocannons. 2% Bonus per skill level to the damage of capital turrets requiring Capital Autocannon Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 5
        },
        {
          id: 21667,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    41404: {
      tid: 41404,
      name: "Capital Artillery Specialization",
      desc: "Specialist training in the operation of advanced capital artillery. 2% bonus per skill level to the damage of capital turrets requiring Capital Artillery Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 5
        },
        {
          id: 21667,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    41405: {
      tid: 41405,
      name: "Capital Blaster Specialization",
      desc: "Specialist training in the operation of advanced capital blasters. 2% Bonus per skill level to the damage of capital turrets requiring Capital Blaster Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 5
        },
        {
          id: 21666,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    41406: {
      tid: 41406,
      name: "Capital Railgun Specialization",
      desc: "Specialist training in the operation of advanced capital railguns. 2% bonus per skill level to the damage of capital turrets requiring Capital Railgun Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 5
        },
        {
          id: 21666,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    41407: {
      tid: 41407,
      name: "Capital Pulse Laser Specialization",
      desc: "Specialist training in the operation of advanced capital pulse lasers. 2% bonus per skill level to the damage of capital turrets requiring Capital Pulse Laser Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 5
        },
        {
          id: 20327,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    41408: {
      tid: 41408,
      name: "Capital Beam Laser Specialization",
      desc: "Specialist training in the operation of advanced capital beam lasers. 2% Bonus per skill level to the damage of capital turrets requiring Capital Beam Laser Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3311,
          level: 5
        },
        {
          id: 20327,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    41409: {
      tid: 41409,
      name: "XL Torpedo Specialization",
      desc: "Specialist training in the operation of advanced XL torpedo launchers. 2% bonus per level to the rate of fire of modules requiring XL Torpedo Specialization.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 21668,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    41410: {
      tid: 41410,
      name: "XL Cruise Missile Specialization",
      desc: "Specialist training in the operation of advanced XL cruise missile launchers. 2% bonus per level to the rate of fire of modules requiring XL Cruise Missile Specialization.",
      mkt_gid: 373,
      mkt_gname: "Missiles",
      rq_skills: [
        {
          id: 3319,
          level: 1
        },
        {
          id: 32435,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 10
    },
    41537: {
      tid: 41537,
      name: "Doomsday Rapid Firing",
      desc: "Skill at the rapid discharge of titan doomsday weapons. 4% reduction per skill level to doomsday duration.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 24563,
          level: 2
        }
      ],
      p_attr: "willpower",
      s_attr: "intelligence",
      ttm: 14
    },
    43702: {
      tid: 43702,
      name: "Ice Harvesting Drone Operation",
      desc: "Skill at controlling ice harvesting drones. 5% reduction in ice harvesting drone cycle time per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 3436,
          level: 1
        },
        {
          id: 16281,
          level: 2
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 2
    },
    43703: {
      tid: 43703,
      name: "Ice Harvesting Drone Specialization",
      desc: "Advanced proficiency at controlling ice harvesting drones. 2% reduction in cycle time and bonus to max velocity of drones requiring Ice Harvesting Drone Specialization per level.",
      mkt_gid: 366,
      mkt_gname: "Drones",
      rq_skills: [
        {
          id: 43702,
          level: 5
        },
        {
          id: 16281,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "perception",
      ttm: 5
    },
    43728: {
      tid: 43728,
      name: "Spatial Phenomena Generation",
      desc: "Proficiency in operation of Titan Phenomena Generator modules. Increases the duration of Titan Phenomena Generator effects by 10% per level.",
      mkt_gid: 370,
      mkt_gname: "Fleet Support",
      rq_skills: [
        {
          id: 24764,
          level: 1
        },
        {
          id: 3354,
          level: 4
        }
      ],
      p_attr: "charisma",
      s_attr: "willpower",
      ttm: 10
    },
    44067: {
      tid: 44067,
      name: "Invulnerability Core Operation",
      desc: "Skill at operating the Rorqual's Pulse Activated Nexus Invulnerability Core module. 10% increase per level to the effect duration and cycle time of the Pulse Activated Nexus Invulnerability Core.",
      mkt_gid: 1747,
      mkt_gname: "Shields",
      rq_skills: [
        {
          id: 3420,
          level: 5
        },
        {
          id: 24571,
          level: 3
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 8
    },
    45746: {
      tid: 45746,
      name: "Reactions",
      desc: "Allows basic operation of Reaction Service Module. 4% reduction in reaction time per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 1
    },
    45748: {
      tid: 45748,
      name: "Mass Reactions",
      desc: "Allows the operation of multiple reactions simultaneously. Ability to run 1 additional reaction job per level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 45746,
          level: 3
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 2
    },
    45749: {
      tid: 45749,
      name: "Advanced Mass Reactions",
      desc: "Further training in the operation of multiple reactions. Ability to run 1 additional reaction job per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 45748,
          level: 5
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 8
    },
    45750: {
      tid: 45750,
      name: "Remote Reactions",
      desc: "Proficiency at starting reaction jobs remotely. Without this skill, one can only start jobs within the solar system where one is located. Each level increases the distance at which reaction jobs can be started. Level 1 allows for jobs at a range within 5 jumps, and each subsequent level adds 5 more jumps to the range, with a maximum of a 25 jump range.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 45746,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 3
    },
    46152: {
      tid: 46152,
      name: "Ubiquitous Moon Ore Processing",
      desc: "Specialization in reprocessing of the most common forms of ore extracted from New Eden's moons. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Zeolites, Sylvite, Bitumens, and Coesite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 4
    },
    46153: {
      tid: 46153,
      name: "Common Moon Ore Processing",
      desc: "Specialization in reprocessing of the moderately common forms of ore extracted from New Eden's moons. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Cobaltite, Euxenite, Titanite, and Scheelite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 5
    },
    46154: {
      tid: 46154,
      name: "Uncommon Moon Ore Processing",
      desc: "Specialization in reprocessing of the less common forms of ore extracted from New Eden's moons. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Otavite, Sperrylite, Vanadinite, and Chromite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 6
    },
    46155: {
      tid: 46155,
      name: "Rare Moon Ore Processing",
      desc: "Specialization in reprocessing of the rarer forms of ore extracted from New Eden's moons. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Carnotite, Zircon, Pollucite, and Cinnabar reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 7
    },
    46156: {
      tid: 46156,
      name: "Exceptional Moon Ore Processing",
      desc: "Specialization in reprocessing of the rarest and most prized forms of ore extracted from New Eden's moons. Allows a skilled individual to utilize reprocessing facilities at considerably greater efficiency.\r\n\r\n2% bonus to Xenotime, Monazite, Loparite, and Ytterbite reprocessing yield per skill level.",
      mkt_gid: 1323,
      mkt_gname: "Resource Processing",
      rq_skills: [
        {
          id: 3389,
          level: 5
        },
        {
          id: 3409,
          level: 4
        }
      ],
      p_attr: "memory",
      s_attr: "intelligence",
      ttm: 8
    },
    47445: {
      tid: 47445,
      name: "Flag Cruisers",
      desc: "Skill for the operation of Flag Cruisers",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 5
        },
        {
          id: 24764,
          level: 1
        },
        {
          id: 3430,
          level: 1
        }
      ],
      p_attr: "willpower",
      s_attr: "perception",
      ttm: 8
    },
    47867: {
      tid: 47867,
      name: "Precursor Frigate",
      desc: "Skill at operating Precursor Frigates.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    47868: {
      tid: 47868,
      name: "Precursor Cruiser",
      desc: "Skill at operating Precursor Cruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 4
        },
        {
          id: 49742,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    47869: {
      tid: 47869,
      name: "Precursor Battleship",
      desc: "Skill at operating Precursor Battleships.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 5
        },
        {
          id: 49743,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    47870: {
      tid: 47870,
      name: "Small Precursor Weapon",
      desc: "Operation of small precursor weapons. 5% Bonus to small precursor weapon damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 1
    },
    47871: {
      tid: 47871,
      name: "Medium Precursor Weapon",
      desc: "Operation of medium precursor weapons. 5% Bonus to medium precursor weapon damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 3
        },
        {
          id: 47870,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    47872: {
      tid: 47872,
      name: "Large Precursor Weapon",
      desc: "Operation of large precursor weapons. 5% Bonus to large precursor weapon damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 47871,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    47873: {
      tid: 47873,
      name: "Small Disintegrator Specialization",
      desc: "Specialist training in the operation of advanced Light Entropic Disintegrators. 2% bonus per skill level to the damage of small weapons requiring Small Disintegrator Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 3
        },
        {
          id: 47870,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 3
    },
    47874: {
      tid: 47874,
      name: "Medium Disintegrator Specialization",
      desc: "Specialist training in the operation of advanced Heavy Entropic Disintegrators. 2% bonus per skill level to the damage of medium weapons requiring Medium Disintegrator Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 4
        },
        {
          id: 47871,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 5
    },
    47875: {
      tid: 47875,
      name: "Large Disintegrator Specialization",
      desc: "Specialist training in the operation of advanced Supratidal Entropic Disintegrators. 2% bonus per skill level to the damage of large weapons requiring Large Disintegrator Specialization.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3312,
          level: 5
        },
        {
          id: 47872,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 8
    },
    49742: {
      tid: 49742,
      name: "Precursor Destroyer",
      desc: "Skill at operating Precursor Destroyers",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 47867,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 2
    },
    49743: {
      tid: 49743,
      name: "Precursor Battlecruiser",
      desc: "Skill at operating Precursor Battlecruisers.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 3327,
          level: 4
        },
        {
          id: 47868,
          level: 3
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 6
    },
    52307: {
      tid: 52307,
      name: "Triglavian Quantum Engineering",
      desc: "Skill and knowledge of Triglavian Quantum Engineering and its use in the development of advanced technology.\r\n\r\nUsed primarily in the research and manufacturing of Triglavian ship technologies.\r\n\r\nProvides a 1% reduction in manufacturing time for all items requiring Triglavian Quantum Engineering per level.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3392,
          level: 5
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 5
    },
    52308: {
      tid: 52308,
      name: "Triglavian Encryption Methods",
      desc: "Understanding of the data encryption methods used by the Triglavian Collective.\r\n\r\nCritical to the research and development of advanced ship designs based on Triglavian technology.",
      mkt_gid: 375,
      mkt_gname: "Science",
      rq_skills: [
        {
          id: 3402,
          level: 5
        },
        {
          id: 3409,
          level: 4
        },
        {
          id: 3403,
          level: 4
        }
      ],
      p_attr: "intelligence",
      s_attr: "memory",
      ttm: 4
    },
    52997: {
      tid: 52997,
      name: "Precursor Dreadnought",
      desc: "Skill at operating precursor dreadnoughts.",
      mkt_gid: 377,
      mkt_gname: "Spaceship Command",
      rq_skills: [
        {
          id: 20533,
          level: 3
        },
        {
          id: 47869,
          level: 3
        },
        {
          id: 22043,
          level: 1
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 12
    },
    52998: {
      tid: 52998,
      name: "Capital Precursor Weapon",
      desc: "Operation of capital precursor weapons. 5% Bonus to capital precursor weapon damage per level.",
      mkt_gid: 364,
      mkt_gname: "Gunnery",
      rq_skills: [
        {
          id: 3300,
          level: 5
        },
        {
          id: 47872,
          level: 5
        }
      ],
      p_attr: "perception",
      s_attr: "willpower",
      ttm: 7
    }
  },
  groups: [
    {
      desc: "Skills pertaining to efficiently protecting the structural integrity of spaceships",
      mkt_gid: 1745,
      name: "Armor",
      types: [
        3392,
        3393,
        3394,
        16069,
        21803,
        22806,
        22807,
        22808,
        22809,
        24568,
        27902,
        27936,
        33078
      ]
    },
    {
      desc: "Skills pertaining to management of large social groups",
      mkt_gid: 365,
      name: "Corporation Management",
      types: [
        3363,
        3368,
        3731,
        3732,
        12241
      ]
    },
    {
      desc: "Skills pertaining to the efficient operation of drones",
      mkt_gid: 366,
      name: "Drones",
      types: [
        3436,
        3437,
        3438,
        3439,
        3440,
        3441,
        3442,
        12305,
        12484,
        12485,
        12486,
        12487,
        22541,
        23069,
        23566,
        23594,
        23606,
        23618,
        24241,
        24613,
        32339,
        33699,
        40572,
        40573,
        43702,
        43703
      ]
    },
    {
      desc: "Skills pertaining to management of a spaceship's electronic systems",
      mkt_gid: 367,
      name: "Electronic Systems",
      types: [
        3427,
        3433,
        3434,
        3435,
        4411,
        11579,
        19759,
        19760,
        19761,
        19766,
        19767,
        19921,
        19922,
        27906,
        27911
      ]
    },
    {
      desc: "Skills pertaining to management of a spaceship's hardware",
      mkt_gid: 368,
      name: "Engineering",
      types: [
        3318,
        3413,
        3417,
        3418,
        3421,
        3423,
        3424,
        3426,
        3432,
        11207,
        24572,
        28164,
        28879,
        28880,
        32797
      ]
    },
    {
      desc: "Skills pertaining to the operation of Command Burst modules",
      mkt_gid: 370,
      name: "Fleet Support",
      types: [
        3348,
        3349,
        3350,
        3351,
        3352,
        3354,
        11569,
        11572,
        11574,
        20494,
        20495,
        22536,
        22552,
        24764,
        43728
      ]
    },
    {
      desc: "Skills pertaining to the efficient use of turret-based weapon systems",
      mkt_gid: 364,
      name: "Gunnery",
      types: [
        3300,
        3301,
        3302,
        3303,
        3304,
        3305,
        3306,
        3307,
        3308,
        3309,
        3310,
        3311,
        3312,
        3315,
        3316,
        3317,
        11082,
        11083,
        11084,
        12201,
        12202,
        12203,
        12204,
        12205,
        12206,
        12207,
        12208,
        12209,
        12210,
        12211,
        12212,
        12213,
        12214,
        12215,
        20327,
        21666,
        21667,
        22043,
        24563,
        41403,
        41404,
        41405,
        41406,
        41407,
        41408,
        41537,
        47870,
        47871,
        47872,
        47873,
        47874,
        47875,
        52998
      ]
    },
    {
      desc: "Skills pertaining to the efficient use of self-propelled warheads",
      mkt_gid: 373,
      name: "Missiles",
      types: [
        3319,
        3320,
        3321,
        3322,
        3323,
        3324,
        3325,
        3326,
        12441,
        12442,
        20209,
        20210,
        20211,
        20212,
        20213,
        20312,
        20314,
        20315,
        21071,
        21668,
        25718,
        25719,
        28073,
        32435,
        41409,
        41410
      ]
    },
    {
      desc: "Skills pertaining to navigating your spaceship as quickly and efficiently as possible",
      mkt_gid: 374,
      name: "Navigation",
      types: [
        3449,
        3450,
        3451,
        3452,
        3453,
        3454,
        3455,
        3456,
        4385,
        21603,
        21610,
        21611,
        24562
      ]
    },
    {
      desc: "Skills pertaining to managing boosters, implants and clone operations",
      mkt_gid: 1746,
      name: "Neural Enhancement",
      types: [
        3405,
        3411,
        24242,
        24606,
        25530,
        25538,
        33399,
        33407
      ]
    },
    {
      desc: "Skills required for the control and remote operation of planetary colonies",
      mkt_gid: 1823,
      name: "Planet Management",
      types: [
        2403,
        2406,
        2495,
        2505,
        13279
      ]
    },
    {
      desc: "Skills pertaining to the efficient use of manufacturing facilities and industrial devices",
      mkt_gid: 369,
      name: "Production",
      types: [
        3380,
        3387,
        3388,
        3395,
        3396,
        3397,
        3398,
        3400,
        22242,
        24268,
        24625,
        26224
      ]
    },
    {
      desc: "Skills pertaining to efficiently extracting raw materials and refining them",
      mkt_gid: 1323,
      name: "Resource Processing",
      types: [
        3385,
        3386,
        3389,
        3410,
        11395,
        12180,
        12181,
        12182,
        12183,
        12184,
        12185,
        12186,
        12187,
        12188,
        12189,
        12190,
        12191,
        12192,
        12193,
        12194,
        12195,
        12196,
        16281,
        18025,
        22578,
        25544,
        25863,
        28585,
        45746,
        45748,
        45749,
        45750,
        46152,
        46153,
        46154,
        46155,
        46156
      ]
    },
    {
      desc: "Skills pertaining to the fine tuning of a spaceship's installed systems",
      mkt_gid: 372,
      name: "Rigging",
      types: [
        26252,
        26253,
        26254,
        26255,
        26256,
        26257,
        26258,
        26259,
        26260,
        26261
      ]
    },
    {
      desc: "Skills pertaining to signature recognition and identification procedures",
      mkt_gid: 1110,
      name: "Scanning",
      types: [
        3412,
        3551,
        13278,
        21718,
        25739,
        25810,
        25811
      ]
    },
    {
      desc: "Skills pertaining to various fields of scientific knowledge",
      mkt_gid: 375,
      name: "Science",
      types: [
        3402,
        3403,
        3406,
        3408,
        3409,
        11433,
        11441,
        11442,
        11443,
        11444,
        11445,
        11446,
        11447,
        11448,
        11449,
        11450,
        11451,
        11452,
        11453,
        11454,
        11455,
        11487,
        11529,
        12179,
        20433,
        21789,
        21790,
        21791,
        23087,
        23121,
        23123,
        23124,
        24270,
        24624,
        30324,
        30325,
        30327,
        30788,
        52307,
        52308
      ]
    },
    {
      desc: "Skills pertaining to management of a spaceship's energy barriers",
      mkt_gid: 1747,
      name: "Shields",
      types: [
        3416,
        3419,
        3420,
        3422,
        3425,
        11566,
        12365,
        12366,
        12367,
        21059,
        21802,
        24571,
        44067
      ]
    },
    {
      desc: "Skills pertaining to efficient navigation through the social landscape",
      mkt_gid: 376,
      name: "Social",
      types: [
        3355,
        3356,
        3357,
        3358,
        3359,
        3361,
        3893,
        3894,
        3895
      ]
    },
    {
      desc: "Skills required for commanding all shapes and sizes of spaceships",
      mkt_gid: 377,
      name: "Spaceship Command",
      types: [
        3184,
        3327,
        3328,
        3329,
        3330,
        3331,
        3332,
        3333,
        3334,
        3335,
        3336,
        3337,
        3338,
        3339,
        3340,
        3341,
        3342,
        3343,
        3344,
        3345,
        3346,
        3347,
        12092,
        12093,
        12095,
        12096,
        12098,
        16591,
        17940,
        19719,
        20342,
        20524,
        20525,
        20526,
        20527,
        20528,
        20530,
        20531,
        20532,
        20533,
        22551,
        22761,
        23950,
        24311,
        24312,
        24313,
        24314,
        28374,
        28609,
        28615,
        28656,
        28667,
        29029,
        29637,
        30650,
        30651,
        30652,
        30653,
        32918,
        33091,
        33092,
        33093,
        33094,
        33095,
        33096,
        33097,
        33098,
        33856,
        34327,
        34390,
        34533,
        35680,
        35685,
        37615,
        40328,
        40535,
        40536,
        40537,
        40538,
        47445,
        47867,
        47868,
        47869,
        49742,
        49743,
        52997
      ]
    },
    {
      desc: "Skills pertaining to the efficient use of player owned structures",
      mkt_gid: 2152,
      name: "Structure Management",
      types: [
        3373,
        11584,
        37796,
        37797,
        37798,
        37799
      ]
    },
    {
      desc: "Skills pertaining to the use and control of ship subsystems",
      mkt_gid: 1824,
      name: "Subsystems",
      types: [
        30532,
        30537,
        30538,
        30539,
        30540,
        30544,
        30545,
        30546,
        30547,
        30548,
        30549,
        30550,
        30551,
        30552,
        30553,
        30554
      ]
    },
    {
      desc: "Skills pertaining to management of a spaceship's sensor and tracking systems",
      mkt_gid: 1748,
      name: "Targeting",
      types: [
        3428,
        3429,
        3430,
        3431,
        32999,
        33000,
        33001,
        33002
      ]
    },
    {
      desc: "Skills pertaining to managing commercial activities",
      mkt_gid: 378,
      name: "Trade",
      types: [
        3443,
        3444,
        3446,
        3447,
        16594,
        16595,
        16596,
        16597,
        16598,
        16622,
        18580,
        25233,
        25235,
        33467
      ]
    }
  ]
};