const GAME_RENDER_CONFIG = {
    pixelationScale: 2,
    rendererOptions: {
        antialias: false,
        powerPreference: 'high-performance'
    },
};

//clouds
const CLOUD_COLOR: number = 0xFFFFFF;
const CLOUD_IS_TRANSPARENT: boolean = true;
const CLOUD_USES_FLATSHADING: boolean = true;
const CLOUD_OPACITY: number = 0.7;
const CLOUD_SPHERE_COUNT: number = 8;
const CLOUD_SPHERE_RADIUS_BASE: number = 10;
const CLOUD_SPHERE_RADIUS_RANGE: number = 10;
const CLOUD_SPHERE_Y_FLATTEN: number = 0.8;
const CLOUD_SPREAD_XZ: number = 25;
const CLOUD_SPREAD_Y: number = 10;
const CLOUD_HEIGHT_MIN = 30;
const CLOUD_HEIGHT_RANGE = 30; // min + range = max
const CLOUD_SCALE_MIN = 0.5;
const CLOUD_SCALE_RANGE = 0.1;
const CLOUD_BOUNDS = { xMin: -125, xMax: 125, zMin: -125, zMax: 125 };
const CLOUD_GEOMETRY_DETAIL = { widthSegments: 8, heightSegments: 4 };
const CLOUD_BASE_SPEED = 0.01;

//mountain
const MOUNTAIN_GEOMETRY_DETAIL: number = 4;
const MOUNTAIN_COLOR: number = 0x808080;
const MOUNTAIN_IS_TRANSPARENT: boolean = true;
const MOUNTAIN_USES_FLATSHADING: boolean = true;
const MOUNTAIN_OPACITY: number = 0.7;
const MOUNTAIN_CASTS_SHADOW: boolean = true;

//mountain snow
const SNOW_COLOR: number = 0xFFFFFF;
const SNOW_USES_FLATSHADING: boolean = true;
const SNOW_IS_TRANSPARENT: boolean = true;
const SNOW_OPACITY: number = 0.8;
const SNOW_GEOMETRY_DETAIL: number = 4;
const SNOW_SCALE: number = 0.3;
const SNOW_MIN_HEIGHT: number = 0.86;
const SNOW_CASTS_SHADOW: boolean = true;

//mountain ring
const MOUNTAIN_DISTANCE: number = 80;
const MOUNTAIN_HALF_DISTANCE: number = MOUNTAIN_DISTANCE / 2;
const MOUNTAIN_WIDTH_BASE: number = 15;
const MOUNTAIN_WIDTH_RANGE: number = 10;
const MOUNTAIN_HEIGHT_BASE: number = 25;
const MOUNTAIN_HEIGHT_RANGE: number = 15;

//tree trunk
const TREE_TRUNK_CASTS_SHADOW: boolean = true;
const TREE_TRUNK_USES_FLATSHADING: boolean = true;
const TREE_TRUNK_COLOR: number = 0x4d2600;
const TREE_FOLIAGE_COLOR: number = 0x1a5f1a;
const TREE_TRUNK_RADIUS_TOP: number = 0.3;
const TREE_TRUNK_RADIUS_BOTTOM: number = 0.4;
const TREE_TRUNK_HEIGHT: number = 3;
const TREE_TRUNK_SEGMENTS: number = 6;
const TREE_TRUNK_Y_OFFSET: number = -1;

//tree foliage
const TREE_FOLIAGE_RADIUS: number = 1.5;
const TREE_FOLIAGE_CASTS_SHADOW: boolean = true;
const TREE_FOLIAGE_USES_FLATSHADING: boolean = true;
const TREE_FOLIAGE_HEIGHT: number = 3;
const TREE_FOLIAGE_SEGMENTS: number = 6;
const TREE_FOLIAGE_LOWER_Y: number = 3.5;
const TREE_FOLIAGE_UPPER_Y: number = 5;
const TREE_FOLIAGE_TOP_SCALE: number = 0.7;

//tree rings
const TREE_RING_MIN_RADIUS: number = 18;
const TREE_RING_MAX_RADIUS: number = 60;
const TREE_RING_COUNT: number = 150;
const TREE_SCALE_RANDOM_RANGE: number = 0.25;