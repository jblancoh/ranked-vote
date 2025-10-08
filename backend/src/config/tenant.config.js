/**
 * Tenant Configuration System
 *
 * Three-layer configuration strategy:
 * 1. Environment Variables (.env) - Deployment secrets
 * 2. JSON Files (config/*.json) - Default settings
 * 3. Database (Tenant.config) - Runtime tenant configs
 *
 * Precedence: Database > JSON > Environment > Hardcoded defaults
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Default configuration
 * Used when no other config is available
 */
const DEFAULT_CONFIG = {
  voting: {
    positions: 5,
    pointsSystem: {
      '1st': 5,
      '2nd': 4,
      '3rd': 3,
      '4th': 2,
      '5th': 1
    },
    allowDuplicates: false,
    ipValidation: true,
    emailVerification: false,
    requireVoterName: true
  },
  candidates: {
    requiredFields: ['name', 'municipality'],
    customFields: []
  },
  branding: {
    eventTitle: 'Ranked Vote Event',
    description: 'Vote for your favorites',
    logoUrl: null,
    primaryColor: '#dc2626',
    secondaryColor: '#f97316'
  },
  features: {
    publicResults: true,
    anonymousVoting: true,
    realTimeResults: true,
    allowRevote: false
  }
};

/**
 * Load JSON configuration file
 */
export function loadJSONConfig(configName = 'default') {
  try {
    const configPath = path.join(__dirname, `../../config/${configName}.json`);

    if (!fs.existsSync(configPath)) {
      console.warn(`Config file not found: ${configPath}`);
      return null;
    }

    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Error loading JSON config: ${error.message}`);
    return null;
  }
}

/**
 * Deep merge objects
 */
function deepMerge(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Get configuration for a tenant
 *
 * @param {Object} tenant - Tenant object from database
 * @returns {Object} - Merged configuration
 */
export function getTenantConfig(tenant) {
  // Layer 1: Start with defaults
  let config = { ...DEFAULT_CONFIG };

  // Layer 2: Merge JSON config if exists
  const jsonConfig = loadJSONConfig(tenant?.slug || 'default');
  if (jsonConfig) {
    config = deepMerge(config, jsonConfig);
  }

  // Layer 3: Merge tenant-specific database config (highest priority)
  if (tenant?.config && typeof tenant.config === 'object') {
    config = deepMerge(config, tenant.config);
  }

  return config;
}

/**
 * Get specific config value with dot notation
 *
 * Example:
 *   getConfigValue(tenant, 'voting.positions') => 5
 *   getConfigValue(tenant, 'branding.primaryColor') => '#dc2626'
 */
export function getConfigValue(tenant, path, defaultValue = undefined) {
  const config = getTenantConfig(tenant);

  const keys = path.split('.');
  let value = config;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value !== undefined ? value : defaultValue;
}

/**
 * Get voting points system for a tenant
 */
export function getVotingPoints(tenant) {
  const pointsConfig = getConfigValue(tenant, 'voting.pointsSystem');

  // Convert to standard format
  return {
    firstPlace: pointsConfig['1st'] || 5,
    secondPlace: pointsConfig['2nd'] || 4,
    thirdPlace: pointsConfig['3rd'] || 3,
    fourthPlace: pointsConfig['4th'] || 2,
    fifthPlace: pointsConfig['5th'] || 1
  };
}

/**
 * Validate tenant configuration
 */
export function validateTenantConfig(config) {
  const errors = [];

  // Validate voting config
  if (config.voting) {
    if (typeof config.voting.positions !== 'number' || config.voting.positions < 1 || config.voting.positions > 10) {
      errors.push('voting.positions must be a number between 1 and 10');
    }

    if (config.voting.pointsSystem) {
      const points = Object.values(config.voting.pointsSystem);
      if (points.some(p => typeof p !== 'number' || p < 0)) {
        errors.push('voting.pointsSystem values must be positive numbers');
      }
    }
  }

  // Validate branding
  if (config.branding) {
    if (config.branding.primaryColor && !isValidColor(config.branding.primaryColor)) {
      errors.push('branding.primaryColor must be a valid hex color');
    }
    if (config.branding.secondaryColor && !isValidColor(config.branding.secondaryColor)) {
      errors.push('branding.secondaryColor must be a valid hex color');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate hex color
 */
function isValidColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Create default config file if it doesn't exist
 */
export function ensureDefaultConfigFile() {
  const configDir = path.join(__dirname, '../../config');
  const defaultConfigPath = path.join(configDir, 'default.json');

  // Create config directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Create default config file if it doesn't exist
  if (!fs.existsSync(defaultConfigPath)) {
    fs.writeFileSync(
      defaultConfigPath,
      JSON.stringify(DEFAULT_CONFIG, null, 2),
      'utf8'
    );
    console.log(`Created default config file: ${defaultConfigPath}`);
  }
}

export default {
  DEFAULT_CONFIG,
  loadJSONConfig,
  getTenantConfig,
  getConfigValue,
  getVotingPoints,
  validateTenantConfig,
  ensureDefaultConfigFile
};
