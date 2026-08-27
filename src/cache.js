// Robust Local-First Caching & Persistence System for NextRole Job Analytics
// Handles settings, filters, applied progress, jobs dataset, and JD descriptions.

export const COOKIE_APPLIED_KEY = 'job_analytics_applied';
export const COOKIE_THEME_KEY = 'job_analytics_theme';
export const COOKIE_NEW_DAYS_KEY = 'job_analytics_new_days';

export const STORAGE_SETTINGS_KEY = 'job_analytics_settings_v1';
export const STORAGE_FILTERS_KEY = 'job_analytics_filters_v1';
export const STORAGE_DATA_KEY = 'job_analytics_data_v1';
export const STORAGE_JD_KEY = 'job_analytics_jd_cache_v1';

// Cookie utilities
export function setCookie(name, value, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie set error:', e);
  }
}

export function getCookie(name) {
  try {
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + encodeURIComponent(name).replace(/[-.+*]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// 1. Settings Persistence (theme, days threshold, analytics deck, sort)
// -------------------------------------------------------------
export function loadCachedSettings() {
  const defaults = {
    theme: 'light',
    newWithinDays: 1,
    showAnalyticsDeck: false,
    sortColumn: 'deadline',
    sortDirection: 'asc'
  };

  try {
    const savedCookieTheme = getCookie(COOKIE_THEME_KEY);
    const savedCookieDays = getCookie(COOKIE_NEW_DAYS_KEY);

    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    return {
      theme: savedCookieTheme || parsed.theme || defaults.theme,
      newWithinDays: savedCookieDays !== null && !isNaN(parseInt(savedCookieDays))
        ? parseInt(savedCookieDays)
        : (parsed.newWithinDays !== undefined ? parsed.newWithinDays : defaults.newWithinDays),
      showAnalyticsDeck: parsed.showAnalyticsDeck ?? defaults.showAnalyticsDeck,
      sortColumn: parsed.sortColumn || defaults.sortColumn,
      sortDirection: parsed.sortDirection || defaults.sortDirection
    };
  } catch {
    return defaults;
  }
}

export function saveCachedSettings(settings) {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    if (settings.theme) setCookie(COOKIE_THEME_KEY, settings.theme, 365);
    if (settings.newWithinDays !== undefined) setCookie(COOKIE_NEW_DAYS_KEY, String(settings.newWithinDays), 365);
  } catch (e) {
    console.warn('Failed to save settings to localStorage:', e);
  }
}

// -------------------------------------------------------------
// 2. Filters Persistence (tabs, search, categories, mode, etc.)
// -------------------------------------------------------------
export function loadCachedFilters() {
  const defaults = {
    activeTab: 'all',
    searchQuery: '',
    categoryFilter: 'all',
    experienceFilter: 'all',
    selectedSkill: '',
    modeFilter: 'all',
    typeFilter: 'all',
    appearedFilter: 'all',
    hideApplied: false,
    hidePassed: false,
    hasEmailFilter: false
  };

  try {
    const raw = localStorage.getItem(STORAGE_FILTERS_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function saveCachedFilters(filters) {
  try {
    localStorage.setItem(STORAGE_FILTERS_KEY, JSON.stringify(filters));
  } catch (e) {
    console.warn('Failed to save filters to localStorage:', e);
  }
}

// -------------------------------------------------------------
// 3. Applied Progress Persistence (Zero-signup cookie + LocalStorage)
// -------------------------------------------------------------
export function loadCachedApplied() {
  const cookieVal = getCookie(COOKIE_APPLIED_KEY);
  if (cookieVal) {
    try {
      const parsed = JSON.parse(cookieVal);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {}
  }
  try {
    const localVal = localStorage.getItem(COOKIE_APPLIED_KEY);
    if (localVal) {
      const parsed = JSON.parse(localVal);
      if (parsed && typeof parsed === 'object') {
        setCookie(COOKIE_APPLIED_KEY, localVal, 365);
        return parsed;
      }
    }
  } catch {}
  return {};
}

export function saveCachedApplied(appliedMap) {
  const jsonStr = JSON.stringify(appliedMap);
  setCookie(COOKIE_APPLIED_KEY, jsonStr, 365);
  try {
    localStorage.setItem(COOKIE_APPLIED_KEY, jsonStr);
  } catch {}
}

// -------------------------------------------------------------
// 4. Jobs Dataset Local-First Cache ("once fetched data - don't fetch twice")
// -------------------------------------------------------------
export function loadCachedJobsData() {
  try {
    const raw = localStorage.getItem(STORAGE_DATA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.jobs) && parsed.jobs.length > 0) {
      return parsed; // { jobs, timestamp, source }
    }
  } catch {}
  return null;
}

export function saveCachedJobsData(jobs, source = 'local') {
  try {
    const payload = {
      jobs,
      timestamp: Date.now(),
      source
    };
    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to cache jobs data:', e);
  }
}

// -------------------------------------------------------------
// 5. Targeted JD Text Cache ("once fetched data - don't fetch twice")
// -------------------------------------------------------------
export function loadCachedJdText(path) {
  try {
    const raw = localStorage.getItem(STORAGE_JD_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    return cache[path] || null;
  } catch {
    return null;
  }
}

export function saveCachedJdText(path, text) {
  try {
    const raw = localStorage.getItem(STORAGE_JD_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[path] = text;
    localStorage.setItem(STORAGE_JD_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Failed to cache JD text:', e);
  }
}

// -------------------------------------------------------------
// 6. Ostad Direct Apply Check Helper
// -------------------------------------------------------------
export function isOstadLink(url) {
  if (!url) return true;
  const lower = String(url).toLowerCase().trim();
  return (
    lower.includes('ostad.com') ||
    lower.includes('ostad.app') ||
    lower === 'n/a' ||
    lower === ''
  );
}

// -------------------------------------------------------------
// 7. Colorise Same Company: Deterministic Beautiful Color Palette
// -------------------------------------------------------------
const COMPANY_PALETTES = [
  {
    // 0. Orange
    lightBg: 'bg-orange-500/10',
    lightBorder: 'border-orange-500/30',
    lightText: 'text-orange-700',
    darkBg: 'bg-orange-500/15',
    darkBorder: 'border-orange-500/35',
    darkText: 'text-orange-400',
    dot: 'bg-orange-500'
  },
  {
    // 1. Indigo
    lightBg: 'bg-indigo-500/10',
    lightBorder: 'border-indigo-500/30',
    lightText: 'text-indigo-700',
    darkBg: 'bg-indigo-500/15',
    darkBorder: 'border-indigo-500/35',
    darkText: 'text-indigo-400',
    dot: 'bg-indigo-500'
  },
  {
    // 2. Emerald
    lightBg: 'bg-emerald-500/10',
    lightBorder: 'border-emerald-500/30',
    lightText: 'text-emerald-700',
    darkBg: 'bg-emerald-500/15',
    darkBorder: 'border-emerald-500/35',
    darkText: 'text-emerald-400',
    dot: 'bg-emerald-500'
  },
  {
    // 3. Purple
    lightBg: 'bg-purple-500/10',
    lightBorder: 'border-purple-500/30',
    lightText: 'text-purple-700',
    darkBg: 'bg-purple-500/15',
    darkBorder: 'border-purple-500/35',
    darkText: 'text-purple-400',
    dot: 'bg-purple-500'
  },
  {
    // 4. Rose
    lightBg: 'bg-rose-500/10',
    lightBorder: 'border-rose-500/30',
    lightText: 'text-rose-700',
    darkBg: 'bg-rose-500/15',
    darkBorder: 'border-rose-500/35',
    darkText: 'text-rose-400',
    dot: 'bg-rose-500'
  },
  {
    // 5. Blue
    lightBg: 'bg-blue-500/10',
    lightBorder: 'border-blue-500/30',
    lightText: 'text-blue-700',
    darkBg: 'bg-blue-500/15',
    darkBorder: 'border-blue-500/35',
    darkText: 'text-blue-400',
    dot: 'bg-blue-500'
  },
  {
    // 6. Amber
    lightBg: 'bg-amber-500/10',
    lightBorder: 'border-amber-500/30',
    lightText: 'text-amber-800',
    darkBg: 'bg-amber-500/15',
    darkBorder: 'border-amber-500/35',
    darkText: 'text-amber-400',
    dot: 'bg-amber-500'
  },
  {
    // 7. Teal
    lightBg: 'bg-teal-500/10',
    lightBorder: 'border-teal-500/30',
    lightText: 'text-teal-700',
    darkBg: 'bg-teal-500/15',
    darkBorder: 'border-teal-500/35',
    darkText: 'text-teal-400',
    dot: 'bg-teal-500'
  },
  {
    // 8. Fuchsia
    lightBg: 'bg-fuchsia-500/10',
    lightBorder: 'border-fuchsia-500/30',
    lightText: 'text-fuchsia-700',
    darkBg: 'bg-fuchsia-500/15',
    darkBorder: 'border-fuchsia-500/35',
    darkText: 'text-fuchsia-400',
    dot: 'bg-fuchsia-500'
  },
  {
    // 9. Cyan
    lightBg: 'bg-cyan-500/10',
    lightBorder: 'border-cyan-500/30',
    lightText: 'text-cyan-800',
    darkBg: 'bg-cyan-500/15',
    darkBorder: 'border-cyan-500/35',
    darkText: 'text-cyan-400',
    dot: 'bg-cyan-500'
  },
  {
    // 10. Lime
    lightBg: 'bg-lime-500/15',
    lightBorder: 'border-lime-500/35',
    lightText: 'text-lime-800',
    darkBg: 'bg-lime-500/15',
    darkBorder: 'border-lime-500/35',
    darkText: 'text-lime-400',
    dot: 'bg-lime-500'
  },
  {
    // 11. Violet
    lightBg: 'bg-violet-500/10',
    lightBorder: 'border-violet-500/30',
    lightText: 'text-violet-700',
    darkBg: 'bg-violet-500/15',
    darkBorder: 'border-violet-500/35',
    darkText: 'text-violet-400',
    dot: 'bg-violet-500'
  }
];

export function getCompanyTheme(name = '', isDark = false) {
  const clean = (name || '').trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COMPANY_PALETTES.length;
  const p = COMPANY_PALETTES[index];

  return {
    badge: isDark
      ? `${p.darkBg} ${p.darkBorder} ${p.darkText}`
      : `${p.lightBg} ${p.lightBorder} ${p.lightText}`,
    avatarBorder: isDark ? p.darkBorder : p.lightBorder,
    dot: p.dot,
    text: isDark ? p.darkText : p.lightText
  };
}
