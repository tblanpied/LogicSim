// config.js

const VERSION = '0.5.0';

// Environment variables
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const ZOOMIN_FACTOR = 1.05;
const ZOOMOUT_FACTOR = 0.95;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 10.0;

const SNAP_RANGE = 10;

// Export the configuration object
export const config = {
  version: VERSION,
  environment: ENVIRONMENT,
  logLevel: LOG_LEVEL,
  breadboard:{
    zoom:{
        zoomin_factor: ZOOMIN_FACTOR,
        zoomout_factor: ZOOMOUT_FACTOR,
        min: MIN_ZOOM,
        max: MAX_ZOOM
    }
  },
  wire:{
    snap_range: SNAP_RANGE
  }
};