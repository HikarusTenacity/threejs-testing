type SpaceType = keyof typeof SPACE_TYPES;

type Bounds = {
    xMin: number;
    xMax: number;
    zMin: number;
    zMax: number;
};

type BoardSpace = {
    id: number;
    name: string | null;
    type: SpaceType;
    bounds: Bounds;
    center: { x: number; z: number };
    dimensions: { width: number; depth: number };
};

let BOARD_SPACES = [];
let SPACE_BOUNDS: { [key: number]: Bounds } = {};

const SPACE_TYPES = {
    GO: 'GO',
    TAX: 'TAX',
    REROLL: 'REROLL',
    NRA_COMMITTEE: 'NRA_COMMITTEE',
    MENTAL_HEALTH_COMMITTEE: 'MENTAL_HEALTH_COMMITTEE',
    AEA_COMMITTEE: 'AEA_COMMITTEE',
    SIERRA_CLUB_COMMITTEE: 'SIERRA_CLUB_COMMITTEE',
    GENERAL_COMMITTEE: 'GENERAL_COMMITTEE',
    SIERRA_VS_AEA: 'SIERRA_VS_AEA',
    MH_VS_NRA: 'MH_VS_NRA',
    CHANCE: 'CHANCE',
    COMMUNITY_CHEST: 'COMMUNITY_CHEST',
    JAIL: 'JAIL',
    POLITICO: 'POLITICO',
    GO_TO_JAIL: 'GO_TO_JAIL',
};

const SPACE_DEFINITIONS = [
    { id: 0, type: SPACE_TYPES.GO, name: 'Appropriations Committee' }, //bottom right
    { id: 1, type: SPACE_TYPES.TAX, name: 'Tax Bracket' },
    { id: 2, type: SPACE_TYPES.REROLL, name: 'Reroll Time' },
    { id: 3, type: SPACE_TYPES.NRA_COMMITTEE, name: 'House Judiciary Committee on Crime/Federal Government Surveillance' },
    { id: 4, type: SPACE_TYPES.CHANCE, name: 'Chance Space' },
    { id: 5, type: SPACE_TYPES.GENERAL_COMMITTEE, name: 'House Committee on Judiciary' },
    { id: 6, type: SPACE_TYPES.COMMUNITY_CHEST, name: 'Lobbyist/Fund Space' },
    { id: 7, type: SPACE_TYPES.NRA_COMMITTEE, name: 'Senate Judiciary Committee on Federal Rights' },
    { id: 8, type: SPACE_TYPES.NRA_COMMITTEE, name: 'Senate Judiciary Committee on Crime and Counterterrorism' },
    { id: 9, type: SPACE_TYPES.NRA_COMMITTEE, name: 'House Judiciary Committee on Constitution and Civil Crime' },
    { id: 10, type: SPACE_TYPES.JAIL, name: 'Conference Committee' }, //bottom left
    { id: 11, type: SPACE_TYPES.SIERRA_VS_AEA, name: 'House Committee on Energy and Commerce' },
    { id: 12, type: SPACE_TYPES.REROLL, name: 'Reroll Time' },
    { id: 13, type: SPACE_TYPES.MENTAL_HEALTH_COMMITTEE, name: 'Senate Committee on Health, Education, Labor, and Pensions' },
    { id: 14, type: SPACE_TYPES.CHANCE, name: 'Chance Space' },
    { id: 15, type: SPACE_TYPES.GENERAL_COMMITTEE, name: 'House Committee on Armed Services' },
    { id: 16, type: SPACE_TYPES.COMMUNITY_CHEST, name: 'Lobbyist/Fund Space' },
    { id: 17, type: SPACE_TYPES.MENTAL_HEALTH_COMMITTEE, name: 'House\'s Congressional Mental Health Caucus' },
    { id: 18, type: SPACE_TYPES.MENTAL_HEALTH_COMMITTEE, name: 'House Ways and Means Committee on Health' },
    { id: 19, type: SPACE_TYPES.MENTAL_HEALTH_COMMITTEE, name: 'Senate Mental Health Caucus' },
    { id: 20, type: SPACE_TYPES.POLITICO, name: 'POLITICO!' }, //top left
    { id: 21, type: SPACE_TYPES.TAX, name: 'Tax Bracket' },
    { id: 22, type: SPACE_TYPES.REROLL, name: 'Reroll Time' },
    { id: 23, type: SPACE_TYPES.SIERRA_CLUB_COMMITTEE, name: 'House Committee on Natural Resources: Water, Wildlife, and Fisheries' },
    { id: 24, type: SPACE_TYPES.CHANCE, name: 'Chance Space' },
    { id: 25, type: SPACE_TYPES.GENERAL_COMMITTEE, name: 'Senate Committee on Agriculture, Nutrition, and Forestry' },
    { id: 26, type: SPACE_TYPES.COMMUNITY_CHEST, name: 'Lobbyist/Fund Space' },
    { id: 27, type: SPACE_TYPES.SIERRA_CLUB_COMMITTEE, name: 'Senate Committee on Environment and Public Works: Waste Management, Environmental Justice, and Regulatory Oversight' },
    { id: 28, type: SPACE_TYPES.SIERRA_CLUB_COMMITTEE, name: 'House Committee on Transportation and Infrastructure: Water Resources and Environment' },
    { id: 29, type: SPACE_TYPES.SIERRA_CLUB_COMMITTEE, name: 'Senate Committee on Environment and Public Works: Water, Wildlife and Fisheries' },
    { id: 30, type: SPACE_TYPES.GO_TO_JAIL, name: 'Filibuster (Go to Conference Committee)' }, //top right
    { id: 31, type: SPACE_TYPES.MH_VS_NRA, name: 'House Committee on Natural Resources: Energy and Mineral Resources' },
    { id: 32, type: SPACE_TYPES.TAX, name: 'Tax Bracket' },
    { id: 33, type: SPACE_TYPES.AEA_COMMITTEE, name: 'House Committee on Ways and Means: Trade' },
    { id: 34, type: SPACE_TYPES.CHANCE, name: 'Chance Space' },
    { id: 35, type: SPACE_TYPES.GENERAL_COMMITTEE, name: 'House Committee on Education and Workforce' },
    { id: 36, type: SPACE_TYPES.COMMUNITY_CHEST, name: 'Lobbyist/Fund Space' },
    { id: 37, type: SPACE_TYPES.AEA_COMMITTEE, name: 'House Committee on Energy and Commerce, Subcommittee on Commerce, Manufacturing, and Trade' },
    { id: 38, type: SPACE_TYPES.AEA_COMMITTEE, name: 'Senate Committee on Commerce, Science, and Transportation: Surface Transportation, Freight, Pipelines, and Safety' },
    { id: 39, type: SPACE_TYPES.AEA_COMMITTEE, name: 'Senate Committee on Commerce, Science, and Transportation: Coast Guard, Maritime, and Fisheries' }
];

let SPACE_DEFINITION_BY_ID = {};
for (let definitionIndex = 0; definitionIndex < SPACE_DEFINITIONS.length; definitionIndex++) {
    SPACE_DEFINITION_BY_ID[SPACE_DEFINITIONS[definitionIndex].id] = SPACE_DEFINITIONS[definitionIndex];
}

// dimensions
const CORNER_MULT = 1.6;
const PROPERTY_WIDTH = 1;
const SCALE = 20 / (2 * CORNER_MULT + 9 * PROPERTY_WIDTH);
const CORNER = CORNER_MULT * SCALE;
const PROPERTY = PROPERTY_WIDTH * SCALE;