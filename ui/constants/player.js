export const INLINE_PLAYER_WRAPPER_CLASS = 'inline-player__wrapper';
export const FLOATING_PLAYER_CLASS = 'content__viewer--floating';

export const VIDEO_ALMOST_FINISHED_THRESHOLD = 0.8;
export const VIDEO_PLAYBACK_RATES = Object.freeze([0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2]);

// Quality Options
export const AUTO = 'auto';
export const ORIGINAL = 'original';
export const VIDEO_QUALITY_OPTIONS = [AUTO, ORIGINAL, 144, 240, 360, 480, 720, 1080];

// Player Position
export const DEFAULT_INITIAL_FLOATING_POS = { x: window.innerWidth, y: window.innerHeight - 500 };
