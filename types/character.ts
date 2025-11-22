export type CharacteristicName =
    | "WS" | "BS" | "S" | "T" | "I" | "Ag" | "Dex" | "Int" | "WP" | "Fel";

export interface Characteristic {
    initial: number;
    advances: number;
    // current is calculated as initial + advances + modifiers (modifiers not stored here usually, but maybe needed)
}

export interface Characteristics {
    WS: Characteristic;
    BS: Characteristic;
    S: Characteristic;
    T: Characteristic;
    I: Characteristic;
    Ag: Characteristic;
    Dex: Characteristic;
    Int: Characteristic;
    WP: Characteristic;
    Fel: Characteristic;
}

export interface Skill {
    name: string;
    characteristic: CharacteristicName;
    advances: number;
    isGroup?: boolean; // For "Art (Painting)" vs just "Art"
    group?: string;
}

export interface Talent {
    name: string;
    timesTaken: number;
    description?: string;
}

export interface Weapon {
    id: string;
    name: string;
    group: string;
    encumbrance: number;
    range: string;
    damage: string; // e.g. "SB+4"
    qualities: string[];
}

export interface Armor {
    id: string;
    name: string;
    locations: string[]; // "Head", "Body", etc.
    encumbrance: number;
    ap: number;
    qualities: string[];
}

export interface Trapping {
    id: string;
    name: string;
    amount: number;
    encumbrance: number;
}

export interface Spell {
    id: string;
    name: string;
    cn: number; // Casting Number
    range: string;
    target: string;
    duration: string;
    effect: string;
}

export interface Character {
    id?: string;
    userId: string;
    name: string;
    species: string;
    class: string;
    career: string;
    careerLevel: string;
    status: string; // e.g. "Silver 3"
    age: string;
    height: string;
    hair: string;
    eyes: string;

    characteristics: Characteristics;

    fate: {
        total: number;
        current: number;
    };
    fortune: number; // usually same as current fate, but tracked separately in some sheets

    resilience: {
        total: number;
        current: number;
    };
    resolve: number;

    experience: {
        current: number;
        spent: number;
        total: number;
    };

    movement: {
        move: number;
        walk: number;
        run: number;
    };

    basicSkills: Skill[];
    advancedSkills: Skill[];
    talents: Talent[];

    weapons: Weapon[];
    armor: Armor[];
    trappings: Trapping[];
    money: {
        gc: number;
        ss: number;
        bp: number;
    };

    spells: Spell[];
    prayers: unknown[]; // Define if needed

    notes: string;
}

export const initialCharacter: Omit<Character, "id" | "userId"> = {
    name: "New Character",
    species: "Human",
    class: "Burgher",
    career: "Agitator",
    careerLevel: "1",
    status: "Brass 1",
    age: "25",
    height: "5'9",
    hair: "Brown",
    eyes: "Brown",

    characteristics: {
        WS: { initial: 30, advances: 0 },
        BS: { initial: 30, advances: 0 },
        S: { initial: 30, advances: 0 },
        T: { initial: 30, advances: 0 },
        I: { initial: 30, advances: 0 },
        Ag: { initial: 30, advances: 0 },
        Dex: { initial: 30, advances: 0 },
        Int: { initial: 30, advances: 0 },
        WP: { initial: 30, advances: 0 },
        Fel: { initial: 30, advances: 0 },
    },

    fate: { total: 3, current: 3 },
    fortune: 3,
    resilience: { total: 3, current: 3 },
    resolve: 3,

    experience: { current: 0, spent: 0, total: 0 },
    movement: { move: 4, walk: 8, run: 16 },

    basicSkills: [], // Should populate with default basic skills list
    advancedSkills: [],
    talents: [],

    weapons: [],
    armor: [],
    trappings: [],
    money: { gc: 0, ss: 0, bp: 0 },

    spells: [],
    prayers: [],

    notes: "",
};
