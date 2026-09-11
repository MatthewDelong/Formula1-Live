/**
 * OpenF1 API Service
 * Connects to the Cloudflare worker proxy for OpenF1 data
 * Includes rate limiting protection with retry and staggered requests
 */

const BASE_URL = 'https://openf1-proxy.matthew-delong73.workers.dev/v1';

let requestQueue = Promise.resolve();
const STAGGER_DELAY = 200; // ms between requests

function enqueueFetch(urlStr) {
  const promise = requestQueue.then(async () => {
    await new Promise(resolve => setTimeout(resolve, STAGGER_DELAY));
    return fetchWithRetry(urlStr);
  });
  
  // ensure queue doesn't halt if a request fails
  requestQueue = promise.catch(() => {});
  return promise;
}

// In-memory cache for API responses (TTL: 8 seconds to cover strict mode and rapid reloads)
const apiCache = new Map();
const CACHE_TTL = 8000;

async function fetchWithRetry(urlStr, retries = 3, backoff = 1000) {
  let currentUrl = urlStr;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(currentUrl);
      if (response.status === 429) {
        // Rate limited - wait and retry
        const waitTime = backoff * Math.pow(2, attempt);
        console.warn(`Rate limited on ${currentUrl}, retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (response.status === 404) {
        return [];
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error('OpenF1 Worker returned 401/403 — check your Worker is configured and allows this origin.');
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      if (attempt === retries) throw err;
      const waitTime = backoff * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

async function fetchAPI(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  const cacheKey = url.toString();

  if (apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.promise ? cached.promise : cached.data;
    }
  }

  // Cache the promise so concurrent identical requests wait for the same fetch
  const promise = enqueueFetch(cacheKey);
  apiCache.set(cacheKey, { promise, timestamp: Date.now() });
  
  try {
    const data = await promise;
    apiCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    apiCache.delete(cacheKey);
    throw err;
  }
}

// ===== SESSION =====
export async function getSessions(params = {}) {
  return fetchAPI('/sessions', params);
}

export async function getLatestSession() {
  return fetchAPI('/sessions', { session_key: 'latest' });
}

// ===== DRIVERS =====
export async function getDrivers(sessionKey) {
  return fetchAPI('/drivers', { session_key: sessionKey });
}

// ===== POSITION =====
export async function getPositions(sessionKey) {
  return fetchAPI('/position', { session_key: sessionKey });
}

export async function getLatestPositions(sessionKey) {
  // Get the latest position for each driver
  return fetchAPI('/position', { session_key: sessionKey });
}

// ===== LAPS =====
export async function getLaps(sessionKey, driverNumber) {
  const params = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;
  return fetchAPI('/laps', params);
}

// ===== STINTS =====
export async function getStints(sessionKey, driverNumber) {
  const params = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;
  return fetchAPI('/stints', params);
}

// ===== WEATHER =====
export async function getWeather(sessionKey) {
  return fetchAPI('/weather', { session_key: sessionKey });
}

// ===== PIT STOPS =====
export async function getPitStops(sessionKey) {
  return fetchAPI('/pit', { session_key: sessionKey });
}

// ===== RACE CONTROL =====
export async function getRaceControl(sessionKey) {
  return fetchAPI('/race_control', { session_key: sessionKey });
}

// ===== CAR DATA (telemetry) =====
export async function getCarData(sessionKey, driverNumber) {
  const params = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;
  return fetchAPI('/car_data', params);
}

// ===== INTERVALS =====
export async function getIntervals(sessionKey) {
  return fetchAPI('/intervals', { session_key: sessionKey });
}

// ===== TEAM RADIO =====
export async function getTeamRadio(sessionKey) {
  return fetchAPI('/team_radio', { session_key: sessionKey });
}

// ===== MEETINGS =====
export async function getMeetings(params = {}) {
  return fetchAPI('/meetings', params);
}

// ===== Helper: Get combined driver timing data =====
export async function getTimingData(sessionKey) {
  const [drivers, laps, stints, positions, intervals] = await Promise.all([
    getDrivers(sessionKey).catch(() => []),
    getLaps(sessionKey).catch(() => []),
    getStints(sessionKey).catch(() => []),
    getPositions(sessionKey).catch(() => []),
    getIntervals(sessionKey).catch(() => []),
  ]);

  return { drivers, laps, stints, positions, intervals };
}

// ===== Helper: Get latest weather =====
export async function getLatestWeather(sessionKey) {
  const data = await getWeather(sessionKey);
  if (data && data.length > 0) {
    return data[data.length - 1];
  }
  return null;
}

export default {
  getSessions,
  getLatestSession,
  getDrivers,
  getPositions,
  getLatestPositions,
  getLaps,
  getStints,
  getWeather,
  getPitStops,
  getRaceControl,
  getCarData,
  getIntervals,
  getTeamRadio,
  getMeetings,
  getTimingData,
  getLatestWeather,
};
