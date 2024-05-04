/**
 * This file contains constants to be used throughout the application
 */

const {
  IS_LOCAL, IS_PROD, IS_CANARY, BUILD_VERSION
} = require('./config.json');
const APP_NAME = 'MassEnergize Administration';

//  ---- setting  API routes
let API_HOST = 'https://api.massenergize.org';
if (IS_LOCAL) {
  API_HOST = 'http://localhost:8000';
} else if (IS_PROD) {
  API_HOST = 'https://api.massenergize.org';
} else if (IS_CANARY) {
  API_HOST = 'https://api-canary.massenergize.org';
} else {
  // IS_DEV
  API_HOST = 'https://api.massenergize.dev';
}
const CC_HOST = API_HOST.replace('//api', '//cc'); // local should stay the same

//  ---- setting  Firebase Config routes
let FIREBASE_CONFIG = {
  apiKey:  process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (IS_PROD || IS_CANARY) {
  FIREBASE_CONFIG = {
    ...FIREBASE_CONFIG,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };
} 


console.log("=== ENV===", IS_PROD ? 'PROD' : IS_CANARY ? 'CANARY' : 'DEV')
console.log(FIREBASE_CONFIG)

//  ---- setting  Community Portal routes
let PORTAL_HOST = 'https://community.massenergize.org';
if (IS_LOCAL) {
  PORTAL_HOST = 'http://community.massenergize.test:3000';
} else if (IS_PROD) {
  PORTAL_HOST = 'https://community.massenergize.org';
} else if (IS_CANARY) {
  PORTAL_HOST = 'https://community-canary.massenergize.org';
} else {
  // IS_DEV
  PORTAL_HOST = 'https://community.massenergize.dev';
}

//  ---- Sandbox routes now reached through URL parameter sandbox=true

module.exports = {
  IS_LOCAL,
  IS_PROD,
  IS_CANARY,
  API_HOST,
  CC_HOST,
  APP_NAME,
  FIREBASE_CONFIG,
  PORTAL_HOST,
  BUILD_VERSION
};