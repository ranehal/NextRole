import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  Briefcase,
  CheckSquare,
  Square,
  Search,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  X,
  Copy,
  Check,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  SlidersHorizontal,
  Flame,
  Hourglass,
  CalendarX,
  Globe,
  Mail,
  Send,
  Layers,
  Award,
  GraduationCap,
  Code2,
  CheckCircle2,
  Tag,
  Sun,
  Moon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  BarChart3,
  EyeOff,
  Filter,
  ShieldCheck,
  Database
} from 'lucide-react';
import {
  loadCachedSettings,
  saveCachedSettings,
  loadCachedFilters,
  saveCachedFilters,
  loadCachedApplied,
  saveCachedApplied,
  loadCachedJobsData,
  saveCachedJobsData,
  loadCachedJdText,
  saveCachedJdText,
  isOstadLink,
  getCompanyTheme
} from './cache';

// 3-Letter Month Formatter Helper (e.g., "9 September" -> "9 Sep", "4ঠা November" -> "4 Nov")
export function formatMonth3Ltr(str) {
  if (!str || str === 'N/A') return 'Ongoing';
  let clean = str.replace(/(\d+)\s*ঠা/g, '$1');
  const monthMap = [
    [/january/gi, 'Jan'],
    [/february/gi, 'Feb'],
    [/march/gi, 'Mar'],
    [/april/gi, 'Apr'],
    [/may/gi, 'May'],
    [/june/gi, 'Jun'],
    [/july/gi, 'Jul'],
    [/august/gi, 'Aug'],
    [/september/gi, 'Sep'],
    [/october/gi, 'Oct'],
    [/november/gi, 'Nov'],
    [/december/gi, 'Dec']
  ];
  for (const [pattern, rep] of monthMap) {
    clean = clean.replace(pattern, rep);
  }
  return clean.trim();
}

// Compact Salary Formatter (e.g., "BDT 30,000–50,000/month" -> "৳30k–50k", "Competitive Salary" -> "Competitive")
export function formatCompactSalary(str) {
  if (!str || str === 'Not specified' || str === 'N/A') return '—';
  const s = str.trim();
  const lower = s.toLowerCase();
  
  if (lower.includes('payout on successful completion')) return '৳10k stipend';
  if (lower.includes('fixed') && lower.includes('bonus')) return '৳5k+5k';
  if (lower.includes('project')) return '$100–$500';
  if (lower.includes('hour')) return '$90–$140/hr';
  if (lower.includes('25k to 40k') || lower.includes('25k-40k')) return '৳25k–40k';
  if (lower.includes('up to') && lower.includes('40')) return '≤৳40k';
  if (lower.includes('10000 - 10000') || lower.includes('10000-10000')) return '৳10k/mo';
  if (lower.includes('30,000') || lower.includes('30000')) return '৳30k–50k';
  if (lower.includes('35,000') || lower.includes('35000')) return '৳35k–40k';
  if (lower.includes('40,000') || lower.includes('40000')) return '৳40k–70k';
  if (lower.includes('8000') || lower.includes('8,000')) return '৳8k–12k';
  if (lower.includes('5,000') || lower.includes('5000')) return '৳5k/mo';
  if (lower.includes('50,000') || lower.includes('50000')) return '৳50k/mo';
  if (lower.includes('competitive')) return 'Competitive';
  if (lower.includes('negotiable')) return 'Negotiable';
  if (lower.includes('policy')) return 'Policy';

  return s.length > 12 ? s.slice(0, 10) + '…' : s;
}

// Company Monogram Helper
function getCompanyInitials(name = '') {
  const clean = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'CO';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Company Monogram & Logo Thumbnail Component with 2x MORE ZOOM on Hover
function CompanyAvatar({ company, logo, size = 'sm', isDark = false }) {
  const [imgError, setImgError] = useState(false);
  const initials = getCompanyInitials(company);
  const theme = getCompanyTheme(company, isDark);

  const isLg = size === 'lg';
  const sizeClasses = isLg
    ? 'size-12 text-xs rounded-xl font-extrabold shadow-sm'
    : 'size-9 text-[11px] rounded-xl font-bold shadow-2xs';

  if (logo && !imgError) {
    return (
      <div
        className="relative group/logo inline-flex items-center justify-center shrink-0 z-10 hover:z-[99999]"
        title={company || 'Company'}
      >
        <div
          className={`${sizeClasses} p-1 border overflow-hidden flex items-center justify-center transition-all duration-300 ease-out origin-center group-hover/logo:scale-[8.4] group-hover/logo:z-[99999] group-hover/logo:shadow-[0_30px_90px_-10px_rgba(0,0,0,0.85)] group-hover/logo:ring-2 group-hover/logo:ring-[#FF6B00] group-hover/logo:rounded-2xl cursor-zoom-in will-change-transform transform-gpu ${
            isDark ? 'bg-[#1C1A17] border-white/10' : 'bg-white border-[#D9D0C3]'
          }`}
        >
          <img
            src={logo}
            alt={company || 'Company Logo'}
            className="w-full h-full object-contain object-center select-none pointer-events-none group-hover/logo:filter group-hover/logo:drop-shadow-sm"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative group/logo inline-flex items-center justify-center shrink-0 z-10 hover:z-[99999]"
      title={company || 'Company'}
    >
      <div
        className={`${sizeClasses} shrink-0 flex items-center justify-center border font-mono font-bold tracking-wider select-none transition-all duration-300 ease-out origin-center group-hover/logo:scale-[8.4] group-hover/logo:z-[99999] group-hover/logo:shadow-[0_30px_90px_-10px_rgba(0,0,0,0.85)] group-hover/logo:ring-2 group-hover/logo:ring-[#FF6B00] group-hover/logo:rounded-2xl cursor-zoom-in will-change-transform transform-gpu ${theme.badge}`}
      >
        <span>{initials}</span>
      </div>
    </div>
  );
}

export default function App() {
  // Load saved settings from local-first storage
  const initialSettings = useMemo(() => loadCachedSettings(), []);
  const initialFilters = useMemo(() => loadCachedFilters(), []);

  // Jobs dataset & loading states
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('cache'); // 'cache' | 'supabase' | 'local'

  // Settings states: theme, newWithinDays, showAnalyticsDeck, sorting
  const [theme, setTheme] = useState(initialSettings.theme);
  const [newWithinDays, setNewWithinDays] = useState(initialSettings.newWithinDays);
  const [showAnalyticsDeck, setShowAnalyticsDeck] = useState(initialSettings.showAnalyticsDeck);
  const [sortColumn, setSortColumn] = useState(initialSettings.sortColumn);
  const [sortDirection, setSortDirection] = useState(initialSettings.sortDirection);

  // Filter states: activeTab, search, categories, experience, skill, modes, toggles
  const [activeTab, setActiveTab] = useState(initialFilters.activeTab);
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [categoryFilter, setCategoryFilter] = useState(initialFilters.categoryFilter);
  const [experienceFilter, setExperienceFilter] = useState(initialFilters.experienceFilter);
  const [selectedSkill, setSelectedSkill] = useState(initialFilters.selectedSkill);
  const [modeFilter, setModeFilter] = useState(initialFilters.modeFilter);
  const [typeFilter, setTypeFilter] = useState(initialFilters.typeFilter);
  const [appearedFilter, setAppearedFilter] = useState(initialFilters.appearedFilter);
  const [hideApplied, setHideApplied] = useState(initialFilters.hideApplied);
  const [hidePassed, setHidePassed] = useState(initialFilters.hidePassed);
  const [hasEmailFilter, setHasEmailFilter] = useState(initialFilters.hasEmailFilter);

  // JD Drawer Modal state
  const [selectedJd, setSelectedJd] = useState(null);
  const [jdContent, setJdContent] = useState('');
  const [jdLoading, setJdLoading] = useState(false);
  const [copiedJd, setCopiedJd] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState('');

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateNewWithinDays = (days) => {
    const valid = Math.max(0, parseInt(days) || 0);
    setNewWithinDays(valid);
  };

  // -------------------------------------------------------------
  // Powerful Cache: Auto-save Settings & Filters on change
  // -------------------------------------------------------------
  useEffect(() => {
    saveCachedSettings({
      theme,
      newWithinDays,
      showAnalyticsDeck,
      sortColumn,
      sortDirection
    });
  }, [theme, newWithinDays, showAnalyticsDeck, sortColumn, sortDirection]);

  useEffect(() => {
    saveCachedFilters({
      activeTab,
      searchQuery,
      categoryFilter,
      experienceFilter,
      selectedSkill,
      modeFilter,
      typeFilter,
      appearedFilter,
      hideApplied,
      hidePassed,
      hasEmailFilter
    });
  }, [
    activeTab,
    searchQuery,
    categoryFilter,
    experienceFilter,
    selectedSkill,
    modeFilter,
    typeFilter,
    appearedFilter,
    hideApplied,
    hidePassed,
    hasEmailFilter
  ]);

  // Dynamic system today reference date (September 9, 2026)
  const todayRef = useMemo(() => new Date('2026-09-08T00:00:00Z'), []);
  const todayDate = useMemo(() => new Date(), []);

  // -------------------------------------------------------------
  // Data Hydration Helper
  // -------------------------------------------------------------
  const hydrateJobItems = (rawData) => {
    const savedApplied = loadCachedApplied();

    return rawData.map((item, index) => {
      const url = item.live_url;
      const isApplied = savedApplied[url] !== undefined
        ? savedApplied[url]
        : String(item.applied).toLowerCase() === 'true';

      // Calculate deadline ISO if missing
      let deadlineIso = item.deadline_iso || '';
      if (!deadlineIso && item.deadline) {
        const m = item.deadline.match(/(\d+)\s+([A-Za-z]+)/);
        if (m) {
          const day = String(m[1]).padStart(2, '0');
          const monthMap = {
            january: '01', february: '02', march: '03', april: '04',
            may: '05', june: '06', july: '07', august: '08',
            september: '09', october: '10', november: '11', december: '12'
          };
          const month = monthMap[m[2].toLowerCase()] || '09';
          deadlineIso = `2026-${month}-${day}`;
        }
      }

      // Deadline urgency & Delisted / Disappeared detection
      let deadlineDiffDays = null;
      let isPastDeadline = false;
      if (deadlineIso) {
        const dDate = new Date(`${deadlineIso}T23:59:59Z`);
        const diffMs = dDate.getTime() - todayRef.getTime();
        deadlineDiffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        isPastDeadline = deadlineDiffDays < 0;
      }

      const isDelisted = Boolean(
        item.disappeared_datetime &&
        String(item.disappeared_datetime).trim() !== '' &&
        item.disappeared_datetime !== 'N/A'
      );
      const isDeadlinePassed = isDelisted || isPastDeadline;
      const isDeadlineSoon = !isDelisted && deadlineDiffDays !== null && deadlineDiffDays >= 0 && deadlineDiffDays <= 3;

      const deadline_display = formatMonth3Ltr(item.deadline);

      // Appeared Date & Exact Days Old Calculation
      let daysOld = 0;
      let appearedDateIso = '';
      if (item.appeard_datetime) {
        try {
          const appDate = new Date(item.appeard_datetime);
          appearedDateIso = appDate.toISOString().slice(0, 10);
          const appDateOnly = new Date(appDate.getFullYear(), appDate.getMonth(), appDate.getDate());
          const todayDateOnly = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
          const diffMs = todayDateOnly.getTime() - appDateOnly.getTime();
          daysOld = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
        } catch {}
      }

      // Clean direct apply URL
      const directApplyUrl = item.direct_apply_url && item.direct_apply_url !== 'N/A'
        ? item.direct_apply_url
        : item.live_url;

      // Clean email
      const email = item.email && item.email !== 'N/A' ? item.email.trim() : '';

      // Skills array
      const skillsList = item.skills
        ? item.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      return {
        ...item,
        originalIndex: index + 1,
        applied: isApplied,
        deadline_iso: deadlineIso,
        deadlineDiffDays,
        deadline_display,
        isDelisted,
        isDeadlineSoon,
        isDeadlinePassed,
        daysOld,
        appearedDateIso,
        direct_apply_url: directApplyUrl,
        email,
        skillsList,
        company_logo: item.company_logo || ''
      };
    });
  };

  // -------------------------------------------------------------
  // Local-First Data Fetching: Don't fetch same twice!
  // -------------------------------------------------------------
  const fetchJobs = async (forceRefresh = false) => {
    // Check local-first cache if not forcing refresh
    if (!forceRefresh) {
      const cached = loadCachedJobsData();
      if (cached && Array.isArray(cached.jobs) && cached.jobs.length > 0) {
        setJobs(cached.jobs);
        setDataSource(cached.source || 'cache');
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let rawData = null;
      let source = 'local';

      // 1. First priority: Live Supabase API via /api/jobs (Vercel Serverless Function)
      try {
        const apiRes = await fetch('/api/jobs');
        if (apiRes.ok) {
          const json = await apiRes.json();
          if (json && Array.isArray(json.data) && json.data.length > 0) {
            rawData = json.data;
            source = 'supabase';
          }
        }
      } catch (e) {
        console.warn('API /api/jobs notice (proceeding to local fallback):', e);
      }

      // 2. Second priority: Local jobs.json
      if (!rawData) {
        try {
          const res = await fetch('./jobs.json?t=' + Date.now());
          if (res.ok) {
            rawData = await res.json();
            source = 'json';
          }
        } catch {}
      }

      // 3. Third priority: Local jobs.csv
      if (!rawData) {
        const csvRes = await fetch('./jobs.csv?t=' + Date.now());
        if (csvRes.ok) {
          const csvText = await csvRes.text();
          const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
          rawData = parsed.data;
          source = 'csv';
        }
      }

      if (!rawData || rawData.length === 0) {
        throw new Error('No jobs data found. Please run: python scrape.py');
      }

      // If data source was Supabase, merge with static catalog to ensure all rich taxonomies exist
      if (source === 'supabase') {
        try {
          const staticRes = await fetch('./jobs.json');
          if (staticRes.ok) {
            const staticJobs = await staticRes.json();
            const staticMap = new Map(staticJobs.map((j) => [j.live_url, j]));
            rawData = rawData.map((item) => {
              const matched = staticMap.get(item.live_url);
              return matched ? { ...matched, ...item, applied: item.applied } : item;
            });
          }
        } catch {}
      }

      const hydrated = hydrateJobItems(rawData);
      setJobs(hydrated);
      setDataSource(source);
      // Cache locally so we don't fetch twice!
      saveCachedJobsData(hydrated, source);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // -------------------------------------------------------------
  // Applied State Persistence & Live Supabase Cloud Sync
  // -------------------------------------------------------------
  const syncAppliedToCloud = async (liveUrl, nextAppliedState) => {
    try {
      await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ live_url: liveUrl, applied: nextAppliedState })
      });
    } catch (e) {
      console.warn('Live Supabase sync deferred (offline/local):', e);
    }
  };

  const persistJobsApplied = (nextJobs) => {
    const appliedMap = {};
    nextJobs.forEach((j) => {
      if (j.applied) appliedMap[j.live_url] = true;
    });
    saveCachedApplied(appliedMap);
  };

  // Toggle applied checkbox
  const toggleApplied = (liveUrl) => {
    let nextState = false;
    setJobs((prev) => {
      const next = prev.map((j) => {
        if (j.live_url === liveUrl) {
          nextState = !j.applied;
          return { ...j, applied: nextState };
        }
        return j;
      });
      persistJobsApplied(next);
      saveCachedJobsData(next, dataSource);
      return next;
    });

    setSelectedJd((prev) => {
      if (prev && prev.live_url === liveUrl) {
        return { ...prev, applied: nextState };
      }
      return prev;
    });

    // Cloud background sync
    syncAppliedToCloud(liveUrl, nextState);
  };

  // Auto mark applied as true when clicking Direct Apply
  const markAsApplied = (liveUrl) => {
    setJobs((prev) => {
      const next = prev.map((j) => (j.live_url === liveUrl ? { ...j, applied: true } : j));
      persistJobsApplied(next);
      saveCachedJobsData(next, dataSource);
      return next;
    });

    setSelectedJd((prev) => {
      if (prev && prev.live_url === liveUrl) {
        return { ...prev, applied: true };
      }
      return prev;
    });

    syncAppliedToCloud(liveUrl, true);
  };

  // -------------------------------------------------------------
  // Open targeted JD with Powerful Local-First Text Caching
  // -------------------------------------------------------------
  const handleOpenJd = async (job) => {
    setSelectedJd(job);
    setJdLoading(true);
    setJdContent('');
    setCopiedJd(false);

    // Powerful Cache check: don't fetch same text twice!
    const cachedText = loadCachedJdText(job.local_txt_url);
    if (cachedText) {
      setJdContent(cachedText);
      setJdLoading(false);
      return;
    }

    try {
      const res = await fetch(`./${job.local_txt_url}`);
      if (res.ok) {
        let text = await res.text();
        text = text.replace(/এপ্লাই\s*করুন/g, '').trim();
        setJdContent(text);
        saveCachedJdText(job.local_txt_url, text);
      } else {
        setJdContent(`Targeted JD text not found at ${job.local_txt_url}.\nPlease visit live link: ${job.live_url}`);
      }
    } catch (e) {
      setJdContent(`Failed to read targeted JD text: ${e.message}\nLink: ${job.live_url}`);
    } finally {
      setJdLoading(false);
    }
  };

  const handleCopyJd = () => {
    if (jdContent) {
      navigator.clipboard.writeText(jdContent);
      setCopiedJd(true);
      setTimeout(() => setCopiedJd(false), 2000);
    }
  };

  const handleCopyEmail = (e, email) => {
    e.stopPropagation();
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(''), 2000);
    }
  };

  // Interactive column sorting handler
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Analytics Stats and Aggregations
  const stats = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter((j) => !j.disappeared_datetime).length;
    const applied = jobs.filter((j) => j.applied).length;
    const appliedRate = total > 0 ? Math.round((applied / total) * 100) : 0;
    
    const newRolesCount = jobs.filter((j) => j.daysOld <= newWithinDays).length;
    const appearedTodayCount = jobs.filter((j) => j.daysOld === 0).length;

    const deadlineSoon = jobs.filter((j) => j.isDeadlineSoon).length;
    const deadlinePassed = jobs.filter((j) => j.isDeadlinePassed).length;

    const remote = jobs.filter((j) => j.remote_onsite === 'Remote').length;
    const onsite = jobs.filter((j) => j.remote_onsite === 'Onsite').length;
    const hybrid = jobs.filter((j) => j.remote_onsite === 'Hybrid').length;

    const withEmail = jobs.filter((j) => j.email).length;
    const withDirectApply = jobs.filter((j) => !isOstadLink(j.direct_apply_url)).length;

    // Categories breakdown
    const categoryCounts = {};
    jobs.forEach((j) => {
      const cat = j.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const categoriesSorted = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1]);

    // Experience breakdown
    const experienceCounts = {
      'Internship / Trainee': 0,
      'Entry / Junior': 0,
      'Mid Level': 0,
      'Senior Level': 0
    };
    jobs.forEach((j) => {
      const exp = j.experience_level || 'Mid Level';
      experienceCounts[exp] = (experienceCounts[exp] || 0) + 1;
    });

    // Top Skills breakdown
    const skillCounts = {};
    jobs.forEach((j) => {
      j.skillsList.forEach((s) => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16);

    // Monthly breakdown simulation for chart
    const chartBars = [
      { month: 'Apr', total: 12, applied: 2, height: '40%' },
      { month: 'May', total: 18, applied: 5, height: '55%' },
      { month: 'Jun', total: 24, applied: 8, height: '70%' },
      { month: 'Jul', total: 32, applied: 14, height: '85%', highlighted: true },
      { month: 'Aug', total: 28, applied: 10, height: '75%' },
      { month: 'Sep', total: total || 46, applied: applied, height: '100%' },
      { month: 'Oct', total: 38, applied: 11, height: '60%' },
      { month: 'Nov', total: 20, applied: 4, height: '35%' },
      { month: 'Dec', total: 15, applied: 3, height: '25%' }
    ];

    return {
      total,
      active,
      applied,
      appliedRate,
      newRolesCount,
      appearedTodayCount,
      deadlineSoon,
      deadlinePassed,
      remote,
      onsite,
      hybrid,
      withEmail,
      withDirectApply,
      categoriesSorted,
      experienceCounts,
      topSkills,
      chartBars
    };
  }, [jobs, newWithinDays]);

  // Unique lists for filter dropdowns
  const availableCategories = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return Array.from(set).sort();
  }, [jobs]);

  const availableExperiences = useMemo(() => {
    return ['Internship / Trainee', 'Entry / Junior', 'Mid Level', 'Senior Level'];
  }, []);

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Tab Filter
        if (activeTab === 'new_roles' && job.daysOld > newWithinDays) return false;
        if (activeTab === 'deadline_soon' && !job.isDeadlineSoon) return false;
        if (activeTab === 'deadline_passed' && !job.isDeadlinePassed) return false;
        if (activeTab === 'applied' && !job.applied) return false;

        // Quick Toggles: Hide Applied & Hide Passed
        if (hideApplied && job.applied) return false;
        if (hidePassed && job.isDeadlinePassed) return false;

        // Appeared Date Filter
        if (appearedFilter === 'today' && job.daysOld !== 0) return false;
        if (appearedFilter === '2026-09-08' && job.appearedDateIso !== '2026-09-08') return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            job.title?.toLowerCase().includes(q) ||
            job.company?.toLowerCase().includes(q) ||
            job.category?.toLowerCase().includes(q) ||
            job.experience_level?.toLowerCase().includes(q) ||
            job.skills?.toLowerCase().includes(q) ||
            job.email?.toLowerCase().includes(q) ||
            job.salary?.toLowerCase().includes(q) ||
            job.deadline?.toLowerCase().includes(q) ||
            job.remote_onsite?.toLowerCase().includes(q) ||
            job.employment_type?.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Category Filter
        if (categoryFilter !== 'all' && job.category !== categoryFilter) return false;

        // Experience Filter
        if (experienceFilter !== 'all' && job.experience_level !== experienceFilter) return false;

        // Selected Skill Filter
        if (selectedSkill && !job.skillsList.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())) {
          return false;
        }

        // Email filter
        if (hasEmailFilter && !job.email) return false;

        // Secondary Filters
        if (modeFilter !== 'all' && job.remote_onsite !== modeFilter) return false;
        if (typeFilter !== 'all' && !job.employment_type?.toLowerCase().includes(typeFilter.toLowerCase())) return false;

        return true;
      })
      .sort((a, b) => {
        let result = 0;
        if (sortColumn === 'index') {
          result = (a.originalIndex || 0) - (b.originalIndex || 0);
        } else if (sortColumn === 'applied') {
          const aVal = a.applied ? 1 : 0;
          const bVal = b.applied ? 1 : 0;
          result = aVal - bVal;
        } else if (sortColumn === 'title') {
          result = (a.title || '').localeCompare(b.title || '');
        } else if (sortColumn === 'company') {
          result = (a.company || '').localeCompare(b.company || '');
        } else if (sortColumn === 'skills') {
          result = (a.skillsList?.length || 0) - (b.skillsList?.length || 0);
        } else if (sortColumn === 'mode') {
          result = (a.remote_onsite || '').localeCompare(b.remote_onsite || '');
        } else if (sortColumn === 'salary') {
          const aHasSal = a.salary && a.salary !== 'Not specified' ? 1 : 0;
          const bHasSal = b.salary && b.salary !== 'Not specified' ? 1 : 0;
          if (aHasSal !== bHasSal) {
            result = aHasSal - bHasSal;
          } else {
            result = (a.salary || '').localeCompare(b.salary || '');
          }
        } else if (sortColumn === 'email') {
          const aHasEmail = a.email ? 1 : 0;
          const bHasEmail = b.email ? 1 : 0;
          if (aHasEmail !== bHasEmail) {
            result = aHasEmail - bHasEmail;
          } else {
            result = (a.email || '').localeCompare(b.email || '');
          }
        } else if (sortColumn === 'deadline') {
          const aDate = a.deadline_iso || '9999-99-99';
          const bDate = b.deadline_iso || '9999-99-99';
          result = aDate.localeCompare(bDate);
        }

        return sortDirection === 'asc' ? result : -result;
      });
  }, [
    jobs,
    activeTab,
    newWithinDays,
    hideApplied,
    hidePassed,
    appearedFilter,
    searchQuery,
    categoryFilter,
    experienceFilter,
    selectedSkill,
    hasEmailFilter,
    modeFilter,
    typeFilter,
    sortColumn,
    sortDirection
  ]);

  // Reusable Sort Header Renderer for all table columns
  const renderSortHeader = (key, label, className = '') => {
    const isActive = sortColumn === key;
    return (
      <th
        key={key}
        onClick={() => handleSort(key)}
        className={`px-3 py-3 cursor-pointer select-none group transition-colors ${
          isActive ? 'text-[#FF6B00] font-bold' : isDark ? 'hover:text-white' : 'hover:text-[#141210]'
        } ${className}`}
        title={`Sort by ${label} (${isActive && sortDirection === 'asc' ? 'Ascending' : 'Descending'})`}
      >
        <div className={`flex items-center gap-1.5 ${className.includes('text-center') ? 'justify-center' : ''}`}>
          <span>{label}</span>
          <span className="inline-flex items-center">
            {isActive ? (
              sortDirection === 'asc' ? (
                <ArrowUp className="size-3 text-[#FF6B00]" />
              ) : (
                <ArrowDown className="size-3 text-[#FF6B00]" />
              )
            ) : (
              <ArrowUpDown className="size-3 opacity-30 group-hover:opacity-80 transition-opacity" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-[#0C0A09] text-zinc-100' : 'bg-[#EAE4D9] text-[#141210]'
      } font-sans selection:bg-[#FF6B00] selection:text-white antialiased relative overflow-x-hidden transition-colors duration-200`}
    >
      {/* Background Warm Tactile Grid Texture (Off-white / Sand) */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 ${isDark ? 'opacity-15' : 'opacity-65'}`}
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, #1F1C18 1px, transparent 1px), linear-gradient(to bottom, #1F1C18 1px, transparent 1px)'
            : 'linear-gradient(to right, #D8D0C3 1px, transparent 1px), linear-gradient(to bottom, #D8D0C3 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Main Container matching selector #root > div > div.relative.z-10.max-w-[1440px].mx-auto... */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        
        {/* Top Header Section */}
        <header className="space-y-3">
          {/* Top Pill Nav */}
          <div
            className={`rounded-full ${
              isDark ? 'bg-[#141210] border-white/10' : 'bg-[#DFD8CC] border-[#D0C6B8] shadow-sm'
            } border px-5 py-2.5 shadow-xl flex items-center justify-between gap-4 transition-colors duration-200`}
          >
            {/* Brand / Logo */}
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FFA34D] p-0.5 shadow-md shadow-orange-500/25 flex items-center justify-center shrink-0">
                <div
                  className={`size-full ${
                    isDark ? 'bg-[#0C0A09]' : 'bg-[#EAE4D9]'
                  } rounded-full flex items-center justify-center`}
                >
                  <Briefcase className="size-4 text-[#FF6B00]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-base font-black tracking-tight ${
                    isDark ? 'text-white' : 'text-[#141210]'
                  } flex items-center gap-2`}
                >
                  NextRole
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-orange-500/15 text-[#D95300] dark:text-orange-400 border border-orange-500/25 font-bold">
                    Analytics SOTA
                  </span>
                </span>
                <span
                  className={`hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                    isDark
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                  title="Powerful Local-First Cache + Live Supabase Sync active"
                >
                  <ShieldCheck className="size-3 text-emerald-500" /> Local First · Cloud Synced
                </span>
              </div>
            </div>

            {/* Segmented Pill Tabs */}
            <nav
              className={`hidden md:flex items-center gap-1.5 p-1 rounded-full border text-xs font-medium transition-colors ${
                isDark ? 'bg-[#0C0A09] border-white/10' : 'bg-[#D3CABB] border-[#C4B9A9]'
              }`}
            >
              {[
                { id: 'all', label: 'All Roles', count: stats.total },
                {
                  id: 'new_roles',
                  label: newWithinDays === 0 ? 'New Today' : `New (≤${newWithinDays}d)`,
                  count: stats.newRolesCount,
                  dot: 'bg-orange-500'
                },
                { id: 'deadline_soon', label: 'Closing Soon', count: stats.deadlineSoon, dot: 'bg-amber-500' },
                { id: 'deadline_passed', label: 'Passed', count: stats.deadlinePassed, dot: 'bg-rose-500' },
                { id: 'applied', label: 'Applied', count: stats.applied }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'new_roles' && newWithinDays === 0) setAppearedFilter('today');
                      else setAppearedFilter('all');
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                      isActive
                        ? isDark
                          ? 'bg-white text-black font-bold shadow-md'
                          : 'bg-[#141210] text-white font-bold shadow-sm'
                        : isDark
                        ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                        : 'text-[#4A443B] hover:text-[#141210] hover:bg-[#E2DDD1]'
                    }`}
                  >
                    {tab.dot && <span className={`size-1.5 rounded-full ${tab.dot}`} />}
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? isDark
                              ? 'bg-black/15 text-black font-bold'
                              : 'bg-white/20 text-white font-bold'
                            : isDark
                            ? 'bg-white/10 text-zinc-300'
                            : 'bg-[#C7BEAD] text-[#141210] font-semibold'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons: Analytics Toggle, Off-white/Dark Theme Toggle, Refresh (Export button REMOVED) */}
            <div className="flex items-center gap-2">
              {/* Analytics Insights Toggle in Header */}
              <button
                onClick={() => setShowAnalyticsDeck((prev) => !prev)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs ${
                  showAnalyticsDeck
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                    : isDark
                    ? 'bg-[#1C1A17] hover:bg-[#2A2621] text-zinc-300 border-white/10'
                    : 'bg-[#ECE5DA] hover:bg-[#E2DDD1] text-[#141210] border-[#D0C6B8]'
                }`}
                title="Toggle deep charts, funnel velocity & skills analytics"
              >
                <BarChart3 className="size-3.5 text-[#FF6B00] group-hover:scale-110 transition" />
                <span className="hidden sm:inline">Analytics</span>
                {showAnalyticsDeck ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>

              {/* Theme Toggle (Offwhite / Dark) */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full border transition flex items-center justify-center ${
                  isDark
                    ? 'bg-[#1C1A17] hover:bg-[#2A2621] text-amber-400 border-white/10'
                    : 'bg-[#ECE5DA] hover:bg-[#E2DDD1] text-[#141210] border-[#D0C6B8]'
                }`}
                title={isDark ? 'Switch to Warm Off-White Sand Theme' : 'Switch to Dark Theme'}
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-[#141210]" />}
              </button>

              {/* Force Refresh & Sync */}
              <button
                onClick={() => fetchJobs(true)}
                className={`p-2 rounded-full border transition ${
                  isDark
                    ? 'bg-[#1C1A17] hover:bg-[#2A2621] text-zinc-300 border-white/10'
                    : 'bg-[#ECE5DA] hover:bg-[#E2DDD1] text-[#4A443B] hover:text-[#141210] border-[#D0C6B8]'
                }`}
                title="Force refresh live database & update cache"
              >
                <RefreshCw className={`size-4 text-[#FF6B00] ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Executive Metric KPI Strip in Header */}
          <div
            className={`rounded-2xl ${
              isDark ? 'bg-[#141210] border-white/10' : 'bg-[#DFD8CC] border-[#D0C6B8] shadow-2xs'
            } border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors`}
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-medium">
              <span className="flex items-center gap-1.5 font-bold">
                <Briefcase className="size-3.5 text-[#FF6B00]" />
                <span>{stats.total} Opportunities</span>
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3.5" />
                <span>{stats.active} Active</span>
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1.5 text-[#5C554B] dark:text-zinc-400">
                <Sparkles className="size-3.5 text-orange-500" />
                <span>{stats.newRolesCount} New (≤{newWithinDays}d)</span>
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Hourglass className="size-3.5" />
                <span>{stats.deadlineSoon} Closing Soon</span>
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <CalendarX className="size-3.5" />
                <span>{stats.deadlinePassed} Passed</span>
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1.5 text-[#FF6B00] font-semibold">
                <CheckCircle2 className="size-3.5" />
                <span>{stats.applied} Applied ({stats.appliedRate}%)</span>
              </span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                <Mail className="size-3.5" />
                <span>{stats.withEmail} Direct Emails</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[11px] ${
                  isDark ? 'text-zinc-500' : 'text-[#787064]'
                } font-mono flex items-center gap-1`}
              >
                <Database className="size-3 text-[#FF6B00]" />
                {dataSource === 'supabase' ? 'Supabase Live' : dataSource === 'cache' ? 'Cached Local-First' : 'Catalog'}
              </span>
            </div>
          </div>
        </header>

        {/* Collapsible Full Analytics Insights Deck */}
        {showAnalyticsDeck && (
          <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Top Analytics Row (Velocity Funnel + Positions Card) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Card 1: Applications & Velocity */}
              <div
                className={`lg:col-span-8 rounded-[24px] ${
                  isDark ? 'bg-[#161412] border-white/10' : 'bg-[#F5EFE6] border-[#D9D0C3] shadow-sm'
                } border p-6 flex flex-col justify-between transition-colors`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#141210]'}`}>
                      Application Velocity & Monthly Funnel
                    </h3>
                    <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'}`}>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#FF6B00]" />
                        Live Roles ({stats.total})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#141210] dark:bg-zinc-400" />
                        Applied ({stats.applied})
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs ${
                      isDark ? 'text-zinc-400 bg-[#1F1C19] border-white/10' : 'text-[#4A443B] bg-[#ECE5DA] border-[#D0C6B8]'
                    } border rounded-full px-3 py-1 font-medium`}
                  >
                    Sep 2026
                  </span>
                </div>

                {/* Vertical Pill Bar Chart */}
                <div className="relative pt-6 pb-2">
                  <div
                    className={`absolute top-0 left-[58%] -translate-x-1/2 z-20 ${
                      isDark ? 'bg-white text-black border-zinc-200' : 'bg-[#141210] text-white border-stone-700'
                    } text-xs font-semibold rounded-xl px-3 py-1.5 shadow-2xl border flex flex-col items-start gap-0.5`}
                  >
                    <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                      Sep, 2026
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#FF6B00]" /> {stats.total} Roles Live
                    </span>
                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-700' : 'text-stone-300'}`}>
                      <span className="size-2 rounded-full bg-amber-400" /> {stats.applied} Applied ({stats.appliedRate}%)
                    </span>
                  </div>

                  <div
                    className={`flex items-end justify-between gap-3 h-44 px-2 border-b ${
                      isDark ? 'border-white/5' : 'border-[#D9D0C3]'
                    }`}
                  >
                    {stats.chartBars.map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div
                          className="w-full max-w-[38px] rounded-full overflow-hidden transition-all duration-300 relative"
                          style={{ height: bar.height }}
                        >
                          <div
                            className={`w-full h-full rounded-full transition-all group-hover:brightness-125 ${
                              bar.highlighted
                                ? 'bg-gradient-to-t from-[#FF6B00] via-[#F97316] to-[#FDBA74] shadow-md shadow-orange-500/25'
                                : isDark
                                ? 'bg-gradient-to-t from-orange-950/70 via-orange-600/40 to-orange-500/20'
                                : 'bg-gradient-to-t from-orange-600/60 via-orange-400/40 to-orange-300/20'
                            }`}
                            style={{
                              backgroundImage:
                                'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 8px)'
                            }}
                          />
                        </div>
                        <span
                          className={`text-[11px] font-medium transition ${
                            bar.highlighted
                              ? isDark
                                ? 'bg-white text-black rounded-full px-2 py-0.5 font-bold'
                                : 'bg-[#141210] text-white rounded-full px-2 py-0.5 font-bold'
                              : isDark
                              ? 'text-zinc-500 group-hover:text-zinc-300'
                              : 'text-[#5C554B] group-hover:text-[#141210]'
                          }`}
                        >
                          {bar.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Conversion & Health Card */}
              <div
                className={`lg:col-span-4 rounded-[24px] ${
                  isDark ? 'bg-[#161412] border-white/10' : 'bg-[#F5EFE6] border-[#D9D0C3] shadow-sm'
                } border p-6 flex flex-col justify-between transition-colors`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'} uppercase tracking-wider`}>
                      Pipeline Health
                    </span>
                    <span className="text-xs text-[#FF6B00] flex items-center gap-1 font-mono font-bold">
                      100% SOTA Verified
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-3">
                    <span className={`text-4xl font-black ${isDark ? 'text-white' : 'text-[#141210]'} tracking-tight`}>
                      {stats.total}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-xs font-semibold">
                      <TrendingUp className="size-3" /> {stats.active} Active
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div
                    className={`p-3 rounded-2xl ${
                      isDark ? 'bg-[#1F1C19] border-white/5' : 'bg-[#ECE5DA] border-[#D9D0C3]'
                    } border`}
                  >
                    <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'} font-medium`}>
                      Direct Apply
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold text-[#FF6B00]">{stats.withDirectApply}</span>
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-2xl ${
                      isDark ? 'bg-[#1F1C19] border-white/5' : 'bg-[#ECE5DA] border-[#D9D0C3]'
                    } border`}
                  >
                    <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'} font-medium`}>
                      Closing Soon (≤3d)
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold text-amber-500">{stats.deadlineSoon}</span>
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                        Urgent
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-3 p-3 rounded-2xl ${
                    isDark ? 'bg-[#1F1C19] border-white/5' : 'bg-[#ECE5DA] border-[#D9D0C3]'
                  } border flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-sky-500" />
                    <span className={`text-xs ${isDark ? 'text-zinc-300' : 'text-[#4A443B]'} font-medium`}>
                      Direct HR Contact Emails
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isDark ? 'text-white bg-sky-500/10 border-sky-500/20' : 'text-sky-800 bg-sky-100 border-sky-200'
                    } px-2 py-0.5 rounded-full border`}
                  >
                    {stats.withEmail} roles
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Analytics Row (Categories + Experience + Skills) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Card 3: Categories Breakdown */}
              <div
                className={`md:col-span-5 rounded-[24px] ${
                  isDark ? 'bg-[#161412] border-white/10' : 'bg-[#F5EFE6] border-[#D9D0C3] shadow-sm'
                } border p-5 flex flex-col justify-between transition-colors`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-[#FF6B00]" />
                    <h4 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#141210]'}`}>
                      Role Categories
                    </h4>
                  </div>
                  {categoryFilter !== 'all' && (
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`text-[11px] ${isDark ? 'text-zinc-400 hover:text-white' : 'text-[#5C554B] hover:text-[#141210]'} underline`}
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                <div className="space-y-2 my-2">
                  {stats.categoriesSorted.map(([cat, count]) => {
                    const pct = Math.round((count / (stats.total || 1)) * 100);
                    const isSelected = categoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(isSelected ? 'all' : cat)}
                        className={`w-full p-2.5 rounded-xl border transition-all flex flex-col gap-1 text-left ${
                          isSelected
                            ? 'bg-orange-500/15 border-orange-500 text-orange-600 font-bold'
                            : isDark
                            ? 'bg-[#1F1C19] border-white/5 hover:border-white/20 text-zinc-300'
                            : 'bg-[#ECE5DA] border-[#D9D0C3] hover:border-stone-400 text-[#4A443B]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className={`font-semibold ${isSelected ? (isDark ? 'text-white' : 'text-[#141210]') : ''}`}>
                            {cat}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`font-mono ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'}`}>{count} roles</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                isSelected
                                  ? 'bg-[#FF6B00] text-white font-bold'
                                  : isDark
                                  ? 'bg-white/10 text-zinc-300'
                                  : 'bg-[#D3CABB] text-[#141210]'
                              }`}
                            >
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-[#D8D0C3]'}`}>
                          <div
                            className={`h-full rounded-full ${isSelected ? 'bg-[#FF6B00]' : isDark ? 'bg-zinc-600' : 'bg-stone-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 4: Experience Level Breakdown */}
              <div
                className={`md:col-span-3 rounded-[24px] ${
                  isDark ? 'bg-[#161412] border-white/10' : 'bg-[#F5EFE6] border-[#D9D0C3] shadow-sm'
                } border p-5 flex flex-col justify-between transition-colors`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-4 text-purple-400" />
                      <h4 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#141210]'}`}>
                        Experience
                      </h4>
                    </div>
                    {experienceFilter !== 'all' && (
                      <button
                        onClick={() => setExperienceFilter('all')}
                        className={`text-[11px] ${isDark ? 'text-zinc-400 hover:text-white' : 'text-[#5C554B] hover:text-[#141210]'} underline`}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {Object.entries(stats.experienceCounts).map(([exp, count]) => {
                      const isSelected = experienceFilter === exp;
                      return (
                        <button
                          key={exp}
                          onClick={() => setExperienceFilter(isSelected ? 'all' : exp)}
                          className={`w-full p-2.5 rounded-xl border transition text-left flex items-center justify-between ${
                            isSelected
                              ? isDark
                                ? 'bg-white/15 border-white text-white font-bold'
                                : 'bg-[#141210] border-[#141210] text-white font-bold'
                              : isDark
                              ? 'bg-[#1F1C19] border-white/5 hover:border-white/15'
                              : 'bg-[#ECE5DA] border-[#D9D0C3] hover:border-stone-400'
                          }`}
                        >
                          <span className="text-xs font-semibold">{exp}</span>
                          <span
                            className={`text-xs font-bold font-mono ${
                              isSelected && !isDark ? 'text-white' : isDark ? 'text-white' : 'text-[#141210]'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`p-2.5 mt-3 rounded-xl ${
                    isDark ? 'bg-[#1F1C19] border-white/5' : 'bg-[#ECE5DA] border-[#D9D0C3]'
                  } border flex items-center justify-between text-xs`}
                >
                  <span className={isDark ? 'text-zinc-400' : 'text-[#5C554B]'}>Work Mode:</span>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-emerald-600 font-semibold">{stats.remote} Rem</span>
                    <span className="opacity-40">/</span>
                    <span className="text-sky-600 font-semibold">{stats.onsite} Ons</span>
                  </div>
                </div>
              </div>

              {/* Card 5: In-Demand Skills Leaderboard */}
              <div
                className={`md:col-span-4 rounded-[24px] ${
                  isDark ? 'bg-[#161412] border-white/10' : 'bg-[#F5EFE6] border-[#D9D0C3] shadow-sm'
                } border p-5 flex flex-col justify-between transition-colors`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-4 text-orange-500" />
                      <h4 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#141210]'}`}>
                        In-Demand Skills
                      </h4>
                    </div>
                    {selectedSkill && (
                      <button
                        onClick={() => setSelectedSkill('')}
                        className="text-[11px] text-orange-500 hover:underline flex items-center gap-1"
                      >
                        Clear: {selectedSkill} <X className="size-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {stats.topSkills.map(([skill, count]) => {
                      const isSelected = selectedSkill.toLowerCase() === skill.toLowerCase();
                      return (
                        <button
                          key={skill}
                          onClick={() => setSelectedSkill(isSelected ? '' : skill)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#FF6B00] text-white font-bold border-[#FF6B00] shadow-sm'
                              : isDark
                              ? 'bg-[#1F1C19] border-white/10 text-zinc-300 hover:text-white'
                              : 'bg-[#ECE5DA] border-[#D0C6B8] text-[#4A443B] hover:text-[#141210] hover:bg-[#E2DDD1]'
                          }`}
                        >
                          <span>{skill}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                              isSelected
                                ? 'bg-black/20 text-white font-bold'
                                : isDark
                                ? 'bg-white/10 text-zinc-400'
                                : 'bg-[#D3CABB] text-[#141210]'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`mt-3 pt-2.5 border-t ${
                    isDark ? 'border-white/5 text-zinc-400' : 'border-[#D9D0C3] text-[#5C554B]'
                  } flex items-center justify-between text-xs`}
                >
                  <span>Filter: {selectedSkill ? `"${selectedSkill}"` : 'None'}</span>
                  <span className="text-[#FF6B00] font-semibold">100% Pure English</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Control Bar */}
        <div
          className={`rounded-[22px] ${
            isDark ? 'bg-[#161412] border-white/10' : 'bg-[#F5EFE6] border-[#D9D0C3] shadow-sm'
          } border p-3.5 shadow-xl space-y-3 transition-colors`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* Search Input with quick clear */}
            <div className="relative w-full lg:w-96">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 ${
                  isDark ? 'text-zinc-400' : 'text-[#787064]'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, skills, email, company, salary..."
                className={`w-full pl-11 pr-10 py-2 rounded-full border text-xs focus:outline-none focus:border-[#FF6B00] transition ${
                  isDark
                    ? 'bg-[#1F1C19] border-white/10 text-white placeholder-zinc-500'
                    : 'bg-[#EBE5DB] border-[#D5CCC0] text-[#141210] placeholder-[#787064] focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-zinc-400 hover:text-white' : 'text-[#787064] hover:text-[#141210]'
                  }`}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filter and Taxonomy Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              {/* Custom Days Stepper */}
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                  isDark ? 'bg-[#1F1C19] border-white/10 text-zinc-300' : 'bg-[#EBE5DB] border-[#D5CCC0] text-[#141210]'
                }`}
                title="Set custom number of days to consider a role 'New'"
              >
                <Sparkles className="size-3 text-[#FF6B00]" />
                <span className="text-[11px]">New if ≤</span>
                <div className="flex items-center gap-1 font-mono">
                  <button
                    onClick={() => updateNewWithinDays(newWithinDays - 1)}
                    className={`size-4.5 rounded flex items-center justify-center font-bold text-xs ${
                      isDark ? 'hover:bg-white/10' : 'hover:bg-[#D5CCC0]'
                    }`}
                    title="Decrease days"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-[#FF6B00]">{newWithinDays}</span>
                  <button
                    onClick={() => updateNewWithinDays(newWithinDays + 1)}
                    className={`size-4.5 rounded flex items-center justify-center font-bold text-xs ${
                      isDark ? 'hover:bg-white/10' : 'hover:bg-[#D5CCC0]'
                    }`}
                    title="Increase days"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#787064]">days</span>
              </div>

              {/* Appeared Date Filter Dropdown */}
              <select
                value={appearedFilter}
                onChange={(e) => setAppearedFilter(e.target.value)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold focus:outline-none focus:border-[#FF6B00] transition cursor-pointer ${
                  appearedFilter !== 'all'
                    ? 'border-[#FF6B00] text-[#D95300] bg-orange-500/10'
                    : isDark
                    ? 'bg-[#1F1C19] border-white/10 text-white'
                    : 'bg-[#EBE5DB] border-[#D5CCC0] text-[#141210]'
                }`}
                title="Filter by job appearance date"
              >
                <option value="all">📅 All Dates ({stats.total})</option>
                <option value="today">✨ Appeared Today ({stats.appearedTodayCount})</option>
                <option value="2026-09-08">📆 Appeared 08 Sep (46)</option>
              </select>

              {/* Category Dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium focus:outline-none focus:border-[#FF6B00] transition cursor-pointer ${
                  isDark ? 'bg-[#1F1C19] border-white/10 text-white' : 'bg-[#EBE5DB] border-[#D5CCC0] text-[#141210]'
                }`}
              >
                <option value="all">📂 All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Experience Dropdown */}
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium focus:outline-none focus:border-[#FF6B00] transition cursor-pointer ${
                  isDark ? 'bg-[#1F1C19] border-white/10 text-white' : 'bg-[#EBE5DB] border-[#D5CCC0] text-[#141210]'
                }`}
              >
                <option value="all">🎓 All Experience</option>
                {availableExperiences.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              {/* Work Mode Dropdown */}
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium focus:outline-none focus:border-[#FF6B00] transition cursor-pointer ${
                  isDark ? 'bg-[#1F1C19] border-white/10 text-white' : 'bg-[#EBE5DB] border-[#D5CCC0] text-[#141210]'
                }`}
              >
                <option value="all">🌐 All Modes</option>
                <option value="Remote">🌐 Remote</option>
                <option value="Onsite">🏢 Onsite</option>
                <option value="Hybrid">⚡ Hybrid</option>
              </select>
            </div>
          </div>

          {/* Quick Action Toggles Row: Hide Applied, Hide Passed, Has HR Email */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#D9D0C3]/60 dark:border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[11px] font-semibold ${
                  isDark ? 'text-zinc-400' : 'text-[#787064]'
                } flex items-center gap-1`}
              >
                <Filter className="size-3 text-[#FF6B00]" /> Quick Toggles:
              </span>

              {/* Hide Applied Toggle Button */}
              <button
                type="button"
                onClick={() => setHideApplied((prev) => !prev)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                  hideApplied
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-xs'
                    : isDark
                    ? 'bg-[#1F1C19] text-zinc-300 border-white/10 hover:text-white'
                    : 'bg-[#EBE5DB] text-[#4A443B] border-[#D5CCC0] hover:text-[#141210]'
                }`}
                title="Toggle to hide roles you already marked as Applied"
              >
                {hideApplied ? <CheckSquare className="size-3.5" /> : <EyeOff className="size-3.5 opacity-60" />}
                <span>Hide Applied ({stats.applied})</span>
              </button>

              {/* Hide Passed / Expired Toggle Button */}
              <button
                type="button"
                onClick={() => setHidePassed((prev) => !prev)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                  hidePassed
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : isDark
                    ? 'bg-[#1F1C19] text-zinc-300 border-white/10 hover:text-white'
                    : 'bg-[#EBE5DB] text-[#4A443B] border-[#D5CCC0] hover:text-[#141210]'
                }`}
                title="Toggle to hide expired or delisted roles"
              >
                {hidePassed ? <CheckSquare className="size-3.5" /> : <CalendarX className="size-3.5 opacity-60" />}
                <span>Hide Passed ({stats.deadlinePassed})</span>
              </button>

              {/* Has Direct Email Toggle Button */}
              <button
                type="button"
                onClick={() => setHasEmailFilter((prev) => !prev)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                  hasEmailFilter
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : isDark
                    ? 'bg-[#1F1C19] text-zinc-300 border-white/10 hover:text-white'
                    : 'bg-[#EBE5DB] text-[#4A443B] border-[#D5CCC0] hover:text-[#141210]'
                }`}
                title="Filter only jobs with contact email"
              >
                <Mail className="size-3.5" />
                <span>Direct HR Email ({stats.withEmail})</span>
              </button>
            </div>

            {/* Active Filters Summary Chips */}
            {(categoryFilter !== 'all' ||
              experienceFilter !== 'all' ||
              selectedSkill ||
              hasEmailFilter ||
              modeFilter !== 'all' ||
              appearedFilter !== 'all' ||
              hideApplied ||
              hidePassed ||
              searchQuery) && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setExperienceFilter('all');
                    setSelectedSkill('');
                    setHasEmailFilter(false);
                    setModeFilter('all');
                    setAppearedFilter('all');
                    setHideApplied(false);
                    setHidePassed(false);
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-rose-500 hover:underline font-semibold"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Data Table with STRIPE COLOR FOR READABILITY & All-Column Sorting */}
        <section
          className={`rounded-[24px] ${
            isDark ? 'bg-[#161412] border-white/10' : 'bg-[#F5EFE6] border-[#D9D0C3] shadow-sm'
          } border overflow-hidden shadow-2xl transition-colors`}
        >
          {/* Table Header Controls */}
          <div
            className={`px-5 py-3 border-b ${
              isDark ? 'border-white/10' : 'border-[#D9D0C3]'
            } flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#141210]'}`}>
                Opportunities & Direct Applications
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                  isDark ? 'bg-white/10 text-zinc-300' : 'bg-[#ECE5DA] text-[#4A443B]'
                }`}
              >
                {filteredJobs.length} of {stats.total} roles shown
              </span>
            </div>
            <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'}`}>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="size-2 rounded-full bg-[#FF6B00]" /> Striped rows · Colorized company badges · 2x Hover Zoom · Saved in Local Cache
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="size-8 text-[#FF6B00] animate-spin mx-auto" />
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'}`}>Loading live opportunities...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center space-y-3 px-4">
              <AlertCircle className="size-8 text-rose-400 mx-auto" />
              <p className="text-sm text-rose-500">{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-20 text-center space-y-3 px-4">
              <div className="size-12 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 flex items-center justify-center mx-auto">
                <Calendar className="size-6" />
              </div>
              <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#141210]'}`}>
                {activeTab === 'new_roles' || appearedFilter === 'today'
                  ? `No roles found within ≤${newWithinDays} day(s)`
                  : 'No jobs match your selected filters'}
              </p>
              <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'}`}>
                {activeTab === 'new_roles' || appearedFilter === 'today'
                  ? `All active roles appeared on 08 Sep 2026. Increase the "New if ≤" threshold to 1 or more days to view them.`
                  : 'Try switching tabs or clearing filters above to view active opportunities.'}
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    updateNewWithinDays(1);
                    setActiveTab('new_roles');
                    setAppearedFilter('all');
                  }}
                  className="px-4 py-2 rounded-full bg-[#FF6B00] hover:bg-[#E55F00] text-white text-xs font-bold shadow-sm transition"
                >
                  Set New to ≤1 day (46 roles)
                </button>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setAppearedFilter('all');
                    setHideApplied(false);
                    setHidePassed(false);
                    setCategoryFilter('all');
                    setExperienceFilter('all');
                    setSelectedSkill('');
                    setHasEmailFilter(false);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-full border text-xs font-medium transition ${
                    isDark ? 'border-white/10 hover:bg-white/5 text-zinc-300' : 'border-[#D5CCC0] hover:bg-[#EBE5DB] text-[#141210]'
                  }`}
                >
                  View All Roles
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                {/* Table Header with ALL-COLUMN SORTING */}
                <thead
                  className={`${
                    isDark ? 'bg-[#12100E] border-white/10 text-zinc-400' : 'bg-[#E5DEC9] border-[#D0C6B8] text-[#4A443B]'
                  } border-b uppercase tracking-wider font-semibold text-[11px]`}
                >
                  <tr>
                    {renderSortHeader('index', '# · Done', 'w-14 min-w-[56px] text-center')}
                    {renderSortHeader('title', 'Role & Categorisation', 'min-w-[190px]')}
                    {renderSortHeader('company', 'Company', 'min-w-[150px]')}
                    {renderSortHeader('skills', 'Skills (All Shown)', 'min-w-[210px]')}
                    {renderSortHeader('mode', 'Mode', 'w-24 min-w-[90px]')}
                    {renderSortHeader('salary', 'Salary', 'w-[84px] min-w-[76px] text-center')}
                    {renderSortHeader('email', 'Email', 'w-24 min-w-[85px] text-center')}
                    {renderSortHeader('deadline', 'Deadline', 'w-[105px] min-w-[95px]')}
                    <th className="px-3 py-3 text-right w-[145px] min-w-[140px]">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-[#D9D0C3]/60'}`}>
                  {filteredJobs.map((job, rowIdx) => {
                    const isNewBadge = job.daysOld <= newWithinDays;
                    const isStriped = rowIdx % 2 === 1;
                    const companyTheme = getCompanyTheme(job.company, isDark);
                    const isOstad = isOstadLink(job.direct_apply_url);

                    return (
                      <tr
                        key={job.live_url}
                        className={`min-h-[82px] transition-colors group relative ${
                          job.applied
                            ? isDark
                              ? 'bg-orange-500/[0.12] hover:bg-orange-500/20 border-l-4 border-l-[#FF6B00]'
                              : 'bg-orange-500/10 hover:bg-orange-500/15 border-l-4 border-l-[#FF6B00]'
                            : isStriped
                            ? isDark
                              ? 'bg-[#181613] hover:bg-[#23201B]'
                              : 'bg-[#ECE5D8] hover:bg-[#DFD7CA]'
                            : isDark
                            ? 'bg-[#12100E] hover:bg-[#1E1B18]'
                            : 'bg-[#FDFBF7] hover:bg-[#EFE9DF]'
                        }`}
                      >
                        {/* Column 1: Combined Numbering & Applied Checkbox */}
                        <td className="px-2.5 py-3 text-center align-middle w-14 min-w-[56px]">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleApplied(job.live_url)}
                              className={`inline-flex items-center justify-center p-1 rounded-lg transition ${
                                isDark ? 'hover:bg-white/10' : 'hover:bg-[#DFD8CC]'
                              }`}
                              title={job.applied ? 'Mark as Unapplied' : 'Mark as Applied'}
                            >
                              {job.applied ? (
                                <CheckSquare className="size-4.5 text-[#FF6B00]" />
                              ) : (
                                <Square
                                  className={`size-4.5 ${
                                    isDark ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-stone-400 group-hover:text-[#141210]'
                                  } transition`}
                                />
                              )}
                            </button>
                            <span className={`font-mono text-[10px] font-bold ${isDark ? 'text-zinc-500' : 'text-[#787064]'}`}>
                              #{job.originalIndex}
                            </span>
                          </div>
                        </td>

                        {/* Column 2: Job Title & Categorisation (MULTI-ROW) */}
                        <td className="px-3 py-3 align-middle min-w-[190px]">
                          <div className="flex flex-col justify-center gap-1.5 py-0.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                onClick={() => handleOpenJd(job)}
                                className={`text-left font-semibold text-xs leading-snug break-words ${
                                  isDark ? 'text-white hover:text-[#FF6B00]' : 'text-[#141210] hover:text-[#FF6B00]'
                                } transition`}
                                title={job.title}
                              >
                                {job.title}
                              </button>
                              {isNewBadge && (
                                <span
                                  className="px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-orange-500/15 text-[#D95300] dark:text-orange-400 border border-orange-500/25 shrink-0"
                                  title={`Discovered ${job.daysOld} day(s) ago`}
                                >
                                  {job.daysOld === 0 ? 'Today' : `${job.daysOld}d`}
                                </span>
                              )}
                            </div>

                            {/* Category & Experience Badges */}
                            <div className="flex flex-wrap items-center gap-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${
                                  isDark
                                    ? 'bg-[#1F1C19] text-orange-300 border-orange-500/20'
                                    : 'bg-[#ECE5DA] text-[#4A443B] border-[#D5CCC0]'
                                }`}
                              >
                                {job.category || 'Engineering'}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${
                                  isDark
                                    ? 'bg-[#1F1C19] text-purple-300 border-purple-500/20'
                                    : 'bg-purple-50 text-purple-700 border-purple-200'
                                }`}
                              >
                                {job.experience_level || 'Mid Level'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Column 3: Company (COLORISED SAME COMPANY + 2X HOVER ZOOM) */}
                        <td className="px-3 py-3 min-w-[150px] align-middle overflow-visible relative">
                          <div className="flex items-start sm:items-center gap-2.5 overflow-visible">
                            <CompanyAvatar company={job.company} logo={job.company_logo} size="sm" isDark={isDark} />
                            <div className="flex flex-col gap-1 overflow-visible">
                              <button
                                onClick={() => setSearchQuery(job.company)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all duration-200 text-left cursor-pointer group/comp hover:scale-[1.03] shadow-2xs ${companyTheme.badge}`}
                                title={`Filter all jobs from ${job.company}`}
                              >
                                <span className={`size-1.5 rounded-full shrink-0 ${companyTheme.dot}`} />
                                <span className="truncate max-w-[140px]">{job.company || 'Confidential'}</span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Column 4: Skills (MULTI-ROW with wrap) */}
                        <td className="px-3 py-3 min-w-[210px] align-middle">
                          <div className="flex flex-wrap items-center gap-1 py-1" title={job.skillsList.join(', ')}>
                            {job.skillsList.map((s, sIdx) => {
                              const isSelected = selectedSkill.toLowerCase() === s.toLowerCase();
                              return (
                                <button
                                  key={sIdx}
                                  onClick={() => setSelectedSkill(isSelected ? '' : s)}
                                  className={`px-2 py-0.5 rounded text-[9.5px] font-medium transition shrink-0 ${
                                    isSelected
                                      ? 'bg-[#FF6B00] text-white font-bold shadow-xs'
                                      : isDark
                                      ? 'bg-white/5 hover:bg-white/15 text-zinc-300 border border-white/5 hover:border-white/20'
                                      : 'bg-[#ECE5DA] hover:bg-[#E2DDD1] text-[#4A443B] border border-[#D5CCC0] hover:border-stone-400'
                                  }`}
                                  title={`Filter by skill: ${s}`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                            {job.skillsList.length === 0 && (
                              <span className={`text-[10px] italic ${isDark ? 'text-zinc-600' : 'text-[#787064]'}`}>
                                General
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Column 5: Mode & Type */}
                        <td className="px-3 py-3 whitespace-nowrap align-middle w-24 min-w-[90px]">
                          <div className="space-y-0.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium text-[9px] ${
                                job.remote_onsite === 'Remote'
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : job.remote_onsite === 'Hybrid'
                                  ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                                  : 'bg-sky-500/10 text-sky-600 border border-sky-500/20'
                              }`}
                            >
                              {job.remote_onsite}
                            </span>
                            <div className={`text-[9px] ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'}`}>
                              {job.employment_type}
                            </div>
                          </div>
                        </td>

                        {/* Column 6: Compact Salary Column */}
                        <td className="px-2 py-3 text-center whitespace-nowrap w-[84px] min-w-[76px] align-middle">
                          {(() => {
                            const compact = formatCompactSalary(job.salary);
                            const isUnstated = compact === '—';
                            const isNegotiable = compact === 'Negotiable' || compact === 'Competitive' || compact === 'Policy';
                            return (
                              <span
                                className={`inline-block font-mono text-[9.5px] font-semibold px-1.5 py-0.5 rounded border transition-colors ${
                                  isUnstated
                                    ? isDark
                                      ? 'text-zinc-600 border-transparent font-sans'
                                      : 'text-stone-400 border-transparent font-sans'
                                    : isNegotiable
                                    ? isDark
                                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 text-[8.5px]'
                                      : 'bg-amber-50 text-amber-700 border-amber-200 text-[8.5px]'
                                    : isDark
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                                title={job.salary || 'Not specified'}
                              >
                                {compact}
                              </span>
                            );
                          })()}
                        </td>

                        {/* Column 7: Compact Contact Email Column */}
                        <td className="px-2.5 py-3 whitespace-nowrap text-center align-middle w-24 min-w-[85px]">
                          {job.email ? (
                            <div className="inline-flex items-center justify-center gap-1">
                              <a
                                href={`mailto:${job.email}`}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-medium transition ${
                                  isDark
                                    ? 'bg-sky-500/10 border-sky-500/20 text-sky-300 hover:bg-sky-500/20'
                                    : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
                                }`}
                                title={`Send email to: ${job.email}`}
                              >
                                <Mail className="size-2.5 text-sky-500 shrink-0" />
                                <span className="max-w-[55px] truncate">{job.email.split('@')[0]}</span>
                              </a>
                              <button
                                onClick={(e) => handleCopyEmail(e, job.email)}
                                className={`p-0.5 rounded-full border transition ${
                                  isDark
                                    ? 'border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white'
                                    : 'border-[#D0C6B8] hover:bg-[#DFD8CC] text-[#5C554B]'
                                }`}
                                title={`Copy ${job.email}`}
                              >
                                {copiedEmail === job.email ? (
                                  <Check className="size-2.5 text-[#FF6B00]" />
                                ) : (
                                  <Copy className="size-2.5 opacity-70" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className={`text-xs font-mono ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>—</span>
                          )}
                        </td>

                        {/* Column 8: Deadline & Status */}
                        <td className="px-3 py-3 whitespace-nowrap align-middle w-[105px] min-w-[95px]">
                          <div className="space-y-0.5">
                            <div
                              className={`flex items-center gap-1 font-medium text-[10.5px] ${
                                isDark ? 'text-zinc-200' : 'text-[#141210]'
                              }`}
                            >
                              <Calendar className={`size-3 ${isDark ? 'text-zinc-400' : 'text-[#787064]'} shrink-0`} />
                              <span className="font-mono">{job.deadline_display || formatMonth3Ltr(job.deadline)}</span>
                            </div>
                            {job.isDelisted ? (
                              <span
                                className="inline-flex items-center gap-1 text-[8.5px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded-full"
                                title={`Delisted from board at: ${job.disappeared_datetime}`}
                              >
                                <CalendarX className="size-2.5" /> Delisted
                              </span>
                            ) : job.isDeadlinePassed ? (
                              <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded-full">
                                <CalendarX className="size-2.5" /> Expired
                              </span>
                            ) : job.isDeadlineSoon ? (
                              <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded-full">
                                <Hourglass className="size-2.5" /> Soon (≤3d)
                              </span>
                            ) : (
                              <span className={`text-[8.5px] ${isDark ? 'text-zinc-500' : 'text-[#787064]'}`}>Active</span>
                            )}
                          </div>
                        </td>

                        {/* Column 9: Actions (AUTO SEARCH IF OSTAD LINK, REMOVED PORTAL LINK BTN) */}
                        <td className="px-3 py-3 text-right whitespace-nowrap align-middle w-[145px] min-w-[140px]">
                          <div className="flex flex-col items-end justify-center gap-1.5">
                            {/* Row 1: Primary Action (Auto Search if Ostad, else Direct Apply) + Targeted JD */}
                            <div className="flex items-center gap-1 justify-end">
                              {isOstad ? (
                                /* When apply link is from Ostad, use Auto Search instead */
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent(
                                    `${job.title} ${job.company}`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6B00] hover:bg-[#E55F00] text-white transition text-[10px] font-bold shadow-xs shadow-orange-500/20 active:scale-95"
                                  title={`Ostad internal posting: Auto search online for: "${job.title} ${job.company}"`}
                                >
                                  <Search className="size-2.5 text-white" />
                                  Auto Search
                                </a>
                              ) : (
                                /* External Direct Apply */
                                <a
                                  href={job.direct_apply_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => markAsApplied(job.live_url)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6B00] hover:bg-[#E55F00] text-white transition text-[10px] font-bold shadow-xs shadow-orange-500/20 active:scale-95"
                                  title={`Direct application link: ${job.direct_apply_url} (Auto-marks as Applied)`}
                                >
                                  Direct Apply
                                  <ArrowUpRight className="size-2.5 text-white" />
                                </a>
                              )}

                              {/* Targeted JD Button */}
                              <button
                                onClick={() => handleOpenJd(job)}
                                className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full border transition text-[10px] font-semibold ${
                                  isDark
                                    ? 'bg-white/5 hover:bg-white/10 text-zinc-200 border-white/10'
                                    : 'bg-[#ECE5DA] hover:bg-[#E2DDD1] text-[#4A443B] border-[#D5CCC0]'
                                }`}
                                title="Read targeted English JD (Cached locally)"
                              >
                                <FileText className="size-2.5 text-[#FF6B00]" />
                                JD
                              </button>

                              {/* Original portal link button REMOVED per user request */}
                            </div>

                            {/* Row 2: Secondary Action (Direct Email if present, or secondary Auto Search if primary was Direct Apply) */}
                            {job.email ? (
                              <a
                                href={`mailto:${job.email}`}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border transition ${
                                  isDark
                                    ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border-sky-500/20'
                                    : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200 shadow-2xs'
                                }`}
                                title={`Direct email to: ${job.email}`}
                              >
                                <Mail className="size-2 text-sky-500" />
                                <span>Direct Email</span>
                              </a>
                            ) : !isOstad ? (
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(
                                  `${job.title} ${job.company}`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border transition ${
                                  isDark
                                    ? 'bg-[#1C1A17] hover:bg-[#26231F] text-zinc-300 hover:text-white border-white/10 hover:border-[#FF6B00]/40'
                                    : 'bg-[#ECE5DA] hover:bg-[#E2DDD1] text-[#4A443B] hover:text-[#141210] border-[#D5CCC0] hover:border-[#FF6B00]/50 shadow-2xs'
                                }`}
                                title={`Auto-search online for: "${job.title} ${job.company}"`}
                              >
                                <Search className="size-2 text-[#FF6B00]" />
                                <span>Auto Search</span>
                              </a>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Slide-over Targeted JD Drawer */}
      {selectedJd && (
        <div
          onClick={() => setSelectedJd(null)}
          className="fixed inset-0 z-50 flex justify-end bg-black/80 transition-opacity cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl cursor-default ${
              isDark ? 'bg-[#161412] text-white border-white/10' : 'bg-[#F5EFE6] text-[#141210] border-[#D9D0C3]'
            } border-l h-full flex flex-col shadow-2xl transition-colors`}
          >
            {/* Drawer Header */}
            <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-[#D9D0C3]'} flex items-start justify-between gap-4`}>
              <div className="flex items-start gap-3">
                <CompanyAvatar company={selectedJd.company} logo={selectedJd.company_logo} size="lg" isDark={isDark} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        selectedJd.remote_onsite === 'Remote'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-sky-500/10 text-sky-600 border border-sky-500/20'
                      }`}
                    >
                      {selectedJd.remote_onsite}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'} font-medium`}>
                      · {selectedJd.category}
                    </span>
                    <span className="text-xs text-purple-500 font-medium">· {selectedJd.experience_level}</span>
                    <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'}`}>
                      · Deadline: {selectedJd.deadline_display || formatMonth3Ltr(selectedJd.deadline)}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold mt-1.5 leading-snug ${isDark ? 'text-white' : 'text-[#141210]'}`}>
                    {selectedJd.title}
                  </h3>
                  <div className={`flex flex-wrap items-center gap-3 mt-1.5 text-xs ${isDark ? 'text-zinc-400' : 'text-[#4A443B]'}`}>
                    {/* Colorized company tag */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border font-bold ${
                        getCompanyTheme(selectedJd.company, isDark).badge
                      }`}
                    >
                      <span className={`size-1.5 rounded-full ${getCompanyTheme(selectedJd.company, isDark).dot}`} />
                      {selectedJd.company}
                    </span>
                    {selectedJd.salary && selectedJd.salary !== 'Not specified' && (
                      <span className="font-mono">💰 {selectedJd.salary}</span>
                    )}
                    {selectedJd.email && (
                      <span className="flex items-center gap-1 text-sky-500">
                        <Mail className="size-3.5" />
                        <a href={`mailto:${selectedJd.email}`} className="hover:underline">
                          {selectedJd.email}
                        </a>
                      </span>
                    )}
                  </div>

                  {/* Skills tags in drawer */}
                  {selectedJd.skillsList && selectedJd.skillsList.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {selectedJd.skillsList.map((s, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            isDark
                              ? 'bg-white/5 border-white/10 text-zinc-300'
                              : 'bg-[#ECE5DA] border-[#D5CCC0] text-[#4A443B]'
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedJd(null)}
                className={`p-2 rounded-full border transition shrink-0 ${
                  isDark
                    ? 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border-white/10'
                    : 'bg-[#ECE5DA] text-[#5C554B] hover:text-[#141210] hover:bg-[#E2DDD1] border-[#D5CCC0]'
                }`}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Quick Action Bar inside Drawer */}
            <div
              className={`px-6 py-3.5 ${
                isDark ? 'bg-[#12100E] border-white/10' : 'bg-[#DFD8CC] border-[#D0C6B8]'
              } border-b flex flex-wrap items-center justify-between gap-2`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleApplied(selectedJd.live_url)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
                    selectedJd.applied
                      ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20 font-bold'
                      : isDark
                      ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                      : 'bg-white hover:bg-[#ECE5DA] text-[#141210] border border-[#D0C6B8] shadow-2xs'
                  }`}
                >
                  {selectedJd.applied ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
                  {selectedJd.applied ? 'Applied' : 'Mark as Applied'}
                </button>

                {selectedJd.email && (
                  <a
                    href={`mailto:${selectedJd.email}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-sky-500/10 text-sky-600 border border-sky-500/30 hover:bg-sky-500/20 transition"
                  >
                    <Send className="size-3.5" />
                    Mail HR
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJd}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-zinc-200 border-white/10'
                      : 'bg-white hover:bg-[#ECE5DA] text-[#4A443B] border-[#D0C6B8]'
                  }`}
                  title="Copy English JD text"
                >
                  {copiedJd ? <Check className="size-3.5 text-[#FF6B00]" /> : <Copy className="size-3.5" />}
                  {copiedJd ? 'Copied' : 'Copy JD'}
                </button>

                {/* If Ostad, primary action is Auto Search, else Direct Apply */}
                {isOstadLink(selectedJd.direct_apply_url) ? (
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `${selectedJd.title} ${selectedJd.company}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#FF6B00] text-white hover:bg-[#E55F00] transition shadow-md shadow-orange-500/20 active:scale-95"
                    title="Auto search web for role and company"
                  >
                    <Search className="size-3.5 text-white" />
                    Auto Search
                  </a>
                ) : (
                  <a
                    href={selectedJd.direct_apply_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => markAsApplied(selectedJd.live_url)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#FF6B00] text-white hover:bg-[#E55F00] transition shadow-md shadow-orange-500/20 active:scale-95"
                    title="Open direct apply and mark role as Applied"
                  >
                    Direct Apply
                    <ArrowUpRight className="size-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Drawer Body (Clean English Targeted JD - Cached locally) */}
            <div
              className={`flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap ${
                isDark
                  ? 'text-zinc-200 selection:bg-[#FF6B00] selection:text-white'
                  : 'text-[#141210] bg-[#ECE5DA] selection:bg-orange-200 selection:text-[#141210]'
              }`}
            >
              {jdLoading ? (
                <div className="py-24 text-center space-y-2">
                  <RefreshCw className="size-6 text-[#FF6B00] animate-spin mx-auto" />
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#5C554B]'}`}>
                    Loading targeted English JD...
                  </p>
                </div>
              ) : (
                jdContent || 'No description text cached yet.'
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`border-t ${
          isDark ? 'border-white/5 text-zinc-600' : 'border-[#D9D0C3] text-[#787064]'
        } py-5 text-center text-xs transition-colors`}
      >
        NextRole · Pure English SOTA Job Analytics Engine · Powerful Local-First Cache · Cloud Synced
      </footer>
    </div>
  );
}
