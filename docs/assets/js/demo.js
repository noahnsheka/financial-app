const pages = {
    dashboard: {
        label: 'Dashboard',
        eyebrow: 'Showcase mode',
        title: 'Informal business intelligence for Uganda',
        description: 'Explore LedgerLift Uganda as a shareable walkthrough built for presentations, testing, and stakeholder demos.',
        ctas: [
            { label: 'Register business', page: 'registration', kind: 'primary' },
            { label: 'View registry', page: 'businesses', kind: 'secondary' },
        ],
    },
    businesses: {
        label: 'Businesses',
        eyebrow: 'Registry explorer',
        title: 'Review business registrations in the showcase',
        description: 'Review sample business registrations and use the search and profile tools during presentations.',
        ctas: [
            { label: 'Add registration', page: 'registration', kind: 'primary' },
            { label: 'Open workspace', page: 'workspace', kind: 'secondary' },
        ],
    },
    registration: {
        label: 'Registration',
        eyebrow: 'Demo onboarding',
        title: 'Register new informal businesses for the showcase',
        description: 'Capture onboarding records, keep TIN optional for demo accounts, and show the future tax-verification path clearly.',
        ctas: [
            { label: 'View businesses', page: 'businesses', kind: 'primary' },
            { label: 'Open login', page: 'login', kind: 'secondary' },
        ],
    },
    credit: {
        label: 'Credit',
        eyebrow: 'Readiness model',
        title: 'Translate operating data into lender-facing signals',
        description: 'Review score breakdowns, loan channels, and lender-friendly business profiles during the showcase.',
        ctas: [
            { label: 'View strong profiles', page: 'businesses', kind: 'primary' },
            { label: 'Open workspace', page: 'workspace', kind: 'secondary' },
        ],
    },
    government: {
        label: 'Government',
        eyebrow: 'Policy view',
        title: 'Surface where intervention matters most',
        description: 'Use this showcase to walk government audiences through district performance, watchlists, and next-step interventions.',
        ctas: [
            { label: 'Review districts', page: 'government', kind: 'primary' },
            { label: 'Open registry', page: 'businesses', kind: 'secondary' },
        ],
    },
    login: {
        label: 'Login',
        eyebrow: 'Demo access',
        title: 'Sign in with seeded demo accounts',
        description: 'Use seeded credentials to demonstrate role-based access and guided workspaces.',
        ctas: [
            { label: 'Use demo accounts', page: 'login', kind: 'primary' },
            { label: 'Open workspace', page: 'workspace', kind: 'secondary' },
        ],
    },
    workspace: {
        label: 'Workspace',
        eyebrow: 'Role control room',
        title: 'Open a role-based demo workspace',
        description: 'After signing in, the showcase tailors the workspace to government, lender, or field-agent stories using the same seeded records.',
        ctas: [
            { label: 'Go to login', page: 'login', kind: 'primary' },
            { label: 'Open registry', page: 'businesses', kind: 'secondary' },
        ],
    },
};

const demoData = {
    heroStats: [
        { label: 'Districts in pilot', value: '12' },
        { label: 'Loan-ready shops', value: '61%' },
        { label: 'Daily mobile money sync', value: '85%' },
        { label: 'Showcase ready', value: '100%' },
    ],
    registrationForm: {
        districts: ['Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Mbarara', 'Gulu', 'Mbale'],
        sectors: ['Groceries', 'Beverages', 'Household goods', 'Pharmacy', 'Fresh produce', 'Airtime and utilities', 'Mixed retail'],
        revenueBands: ['Below UGX 1M', 'UGX 1M - 3M', 'UGX 3M - 6M', 'UGX 6M - 10M', 'Above UGX 10M'],
    },
    demoAccounts: [
        {
            displayName: 'NITA Pilot Officer',
            username: 'gov.officer',
            password: 'GovDemo123!',
            role: 'government',
            roleLabel: 'Government officer',
            note: 'Use this account for policy and oversight walkthroughs.',
        },
        {
            displayName: 'Microfinance Partner',
            username: 'lender.partner',
            password: 'LenderDemo123!',
            role: 'lender',
            roleLabel: 'Lender',
            note: 'Use this account for first-loan and credit-readiness demos.',
        },
        {
            displayName: 'Field Agent Kampala',
            username: 'field.agent',
            password: 'FieldDemo123!',
            role: 'field_agent',
            roleLabel: 'Field agent',
            note: 'Use this account to onboard shops without a live TIN in showcase mode.',
        },
    ],
    seededBusinesses: [
        {
            id: 'seed-001',
            business_name: 'Amina Retail Hub',
            owner_name: 'Amina Nankya',
            phone_number: '+256700100001',
            mobile_money_number: '+256700100001',
            tin_number: '1002003001',
            district: 'Kampala',
            sector: 'Groceries',
            location_description: 'Kisenyi market lane',
            stock_focus: 'Sugar, flour, soap',
            monthly_revenue_band: 'UGX 6M - 10M',
            employee_count: 4,
            is_demo_account: false,
            created_at: '2026-05-18T08:30:00Z',
        },
        {
            id: 'seed-002',
            business_name: 'Kasana Home Store',
            owner_name: 'Ronald Kasana',
            phone_number: '+256700100002',
            mobile_money_number: '+256700100002',
            tin_number: '1002003002',
            district: 'Wakiso',
            sector: 'Household goods',
            location_description: 'Bwebajja trading center',
            stock_focus: 'Cleaning supplies and cooking oil',
            monthly_revenue_band: 'UGX 3M - 6M',
            employee_count: 3,
            is_demo_account: false,
            created_at: '2026-05-17T09:20:00Z',
        },
        {
            id: 'seed-003',
            business_name: 'Jinja Lakeside Shop',
            owner_name: 'Sarah Nabulime',
            phone_number: '+256700100003',
            mobile_money_number: '+256700100003',
            tin_number: '',
            district: 'Jinja',
            sector: 'Beverages',
            location_description: 'Near Jinja main street',
            stock_focus: 'Soft drinks and bottled water',
            monthly_revenue_band: 'UGX 3M - 6M',
            employee_count: 2,
            is_demo_account: false,
            created_at: '2026-05-16T12:10:00Z',
        },
        {
            id: 'seed-004',
            business_name: 'Mbarara Market Corner',
            owner_name: 'Brian Turyasingura',
            phone_number: '+256700100004',
            mobile_money_number: '',
            tin_number: '',
            district: 'Mbarara',
            sector: 'Mixed retail',
            location_description: 'Central market row B',
            stock_focus: 'Dry goods and packaged foods',
            monthly_revenue_band: 'UGX 6M - 10M',
            employee_count: 4,
            is_demo_account: false,
            created_at: '2026-05-15T14:45:00Z',
        },
        {
            id: 'seed-005',
            business_name: 'Northern Fresh Point',
            owner_name: 'Grace Acen',
            phone_number: '+256700100005',
            mobile_money_number: '+256700100005',
            tin_number: '',
            district: 'Gulu',
            sector: 'Fresh produce',
            location_description: 'Near Gulu taxi park',
            stock_focus: 'Produce and cold drinks',
            monthly_revenue_band: 'UGX 1M - 3M',
            employee_count: 2,
            is_demo_account: true,
            created_at: '2026-05-14T10:05:00Z',
        },
        {
            id: 'seed-006',
            business_name: 'Mukono Digital Kiosk',
            owner_name: 'Isaac Ssembajja',
            phone_number: '+256700100006',
            mobile_money_number: '+256700100006',
            tin_number: '1002003006',
            district: 'Mukono',
            sector: 'Airtime and utilities',
            location_description: 'Mukono town center',
            stock_focus: 'Airtime, data, utility collections',
            monthly_revenue_band: 'UGX 1M - 3M',
            employee_count: 1,
            is_demo_account: false,
            created_at: '2026-05-13T11:00:00Z',
        },
    ],
    collections: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        mobileMoney: [22, 28, 31, 34, 39, 45],
        cash: [18, 17, 16, 14, 13, 11],
        supplierPayments: [11, 13, 14, 16, 19, 21],
    },
    inventoryMix: {
        labels: ['Groceries', 'Beverages', 'Airtime', 'Household'],
        values: [44, 24, 18, 14],
    },
    scoreTrend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        values: [62, 65, 68, 71, 73, 77],
    },
    districtPerformance: {
        labels: ['Kampala', 'Wakiso', 'Mbarara', 'Gulu', 'Jinja'],
        scores: [74, 71, 69, 67, 72],
    },
    stockAlerts: [
        { business: 'Amina Retail Hub', district: 'Kampala', category: 'Sugar and flour', days: '3 days of stock left', severity: 'Critical' },
        { business: 'Kasana Home Store', district: 'Wakiso', category: 'Soap and cooking oil', days: '5 days of stock left', severity: 'High' },
        { business: 'Northern Fresh Point', district: 'Gulu', category: 'Soft drinks', days: '7 days of stock left', severity: 'Watch' },
    ],
    scoreBreakdown: [
        { name: 'Payment consistency', weight: '35%', description: 'Measures how stable daily inflows are across mobile money and repeat customer activity.' },
        { name: 'Stock discipline', weight: '25%', description: 'Rewards predictable restocking behavior and flags recurring shortages that hurt turnover.' },
        { name: 'Operating resilience', weight: '20%', description: 'Looks at how a shop handles supplier payments, slow weeks, and category concentration risk.' },
        { name: 'Record completeness', weight: '20%', description: 'Checks whether sales, expenses, and inventory events are captured often enough to trust the score.' },
    ],
    loanPrograms: [
        { provider: 'Growth Window', size: 'UGX 2M to 10M', requirement: 'Score 70+, 90 days of clean records', status: 'Open for pilot' },
        { provider: 'Inventory Bridge', size: 'UGX 500k to 3M', requirement: 'High stock turnover and low shrinkage', status: 'Partner review' },
        { provider: 'Women in Trade Fund', size: 'UGX 1M to 6M', requirement: 'Verified owner, score 68+, digital history', status: 'Priority channel' },
    ],
    districtInsights: [
        { district: 'Kampala', businesses: 92, avgScore: 74, digitization: '88%', priority: 'Scale lender onboarding' },
        { district: 'Wakiso', businesses: 57, avgScore: 71, digitization: '81%', priority: 'Support stock visibility' },
        { district: 'Mbarara', businesses: 34, avgScore: 69, digitization: '73%', priority: 'Improve supplier reconciliation' },
        { district: 'Gulu', businesses: 28, avgScore: 67, digitization: '69%', priority: 'Field training on record capture' },
        { district: 'Jinja', businesses: 37, avgScore: 72, digitization: '79%', priority: 'Expand digital tax support' },
    ],
    watchlist: [
        { title: 'Repeated stock-outs in fast-moving goods', detail: 'Forty-nine businesses report shortages in sugar, soap, or drinks more than twice per month.' },
        { title: 'Cash leakage in mixed-payment shops', detail: 'Cash sales are still under-reported in shops where mobile money already exceeds half of total volume.' },
        { title: 'Slow adoption outside core urban corridors', detail: 'Northern and western districts need more field-agent support before score quality will be comparable.' },
    ],
    interventions: [
        { title: 'Digitize supplier records', detail: 'Start with soap, sugar, and beverage suppliers so the score can trust inventory replenishment patterns.' },
        { title: 'Target women-led shops', detail: 'The pilot dataset already shows strong repayment discipline when digital sales logs are complete.' },
        { title: 'Deploy tax and licensing support', detail: 'A lightweight compliance module can help government teams move strong performers into formal growth programs.' },
    ],
};

const storageKeys = {
    session: 'ledgerlift.pages.session',
    registrations: 'ledgerlift.pages.registrations',
    accounts: 'ledgerlift.pages.accounts',
    flash: 'ledgerlift.pages.flash',
};

const palette = {
    forest: '#111111',
    forestSoft: 'rgba(17, 17, 17, 0.12)',
    sage: '#c81f25',
    amber: '#f4d017',
    amberSoft: 'rgba(244, 208, 23, 0.22)',
    clay: '#d32228',
    grid: 'rgba(17, 17, 17, 0.1)',
};

const roleBlueprints = {
    government: {
        workspaceTitle: 'Government oversight workspace',
        workspaceDescription: 'Prioritize districts, track TIN-ready businesses, and decide where onboarding and financing support should go next.',
        notes: [
            'Focus on TIN-ready businesses when preparing a government support shortlist.',
            'Use demo accounts only for showcase activity and keep them out of policy reporting.',
            'Watch districts with low profile scores because they need field support before lender rollout.',
        ],
        actions: [
            { title: 'Review government signals', detail: 'Open the district-level policy view and check which areas need support first.', href: '#government', cta: 'Open government view' },
            { title: 'Check live registry quality', detail: 'Scan new registrations and spot missing TINs or incomplete profile data.', href: '#businesses', cta: 'Open business registry' },
        ],
    },
    lender: {
        workspaceTitle: 'Lender partner workspace',
        workspaceDescription: 'Find businesses with strong digital evidence and identify the first cohort for small working-capital products.',
        notes: [
            'Use strong profile scores as an initial filter before introducing real underwriting logic.',
            'TIN-ready profiles are better candidates for formal loan pipelines.',
            'Demo accounts are useful for walkthroughs but should not enter real credit committees.',
        ],
        actions: [
            { title: 'Inspect credit view', detail: 'Use the credit engine page to explain the scoring logic behind the MVP.', href: '#credit', cta: 'Open credit engine' },
            { title: 'Review best live profiles', detail: 'Open the live registry and focus on businesses with the strongest completeness scores.', href: '#businesses', cta: 'Open business registry' },
        ],
    },
    field_agent: {
        workspaceTitle: 'Field agent workspace',
        workspaceDescription: 'Register new shops quickly, keep demo mode available for showcases, and follow up on incomplete business profiles.',
        notes: [
            'Use demo mode when the business has no working TIN but the team still needs a full product demo.',
            'Collect mobile money numbers and revenue bands early because they improve the profile score quickly.',
            'Review recent registrations and close the biggest completeness gaps first.',
        ],
        actions: [
            { title: 'Register a new shop', detail: 'Open the onboarding flow and capture the next business into the pilot.', href: '#registration', cta: 'Open registration' },
            { title: 'Review incomplete profiles', detail: 'Use the live registry to identify businesses that still need TIN or revenue details.', href: '#businesses', cta: 'Open business registry' },
        ],
    },
};

let chartInstances = [];

const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const readStorage = (key, fallback) => {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        return fallback;
    }
};

const writeStorage = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

const setFlash = (page, tone, message) => {
    window.sessionStorage.setItem(storageKeys.flash, JSON.stringify({ page, tone, message }));
};

const consumeFlash = (page) => {
    try {
        const raw = window.sessionStorage.getItem(storageKeys.flash);
        if (!raw) {
            return null;
        }

        const flash = JSON.parse(raw);
        if (flash.page !== page) {
            return null;
        }

        window.sessionStorage.removeItem(storageKeys.flash);
        return flash;
    } catch (error) {
        window.sessionStorage.removeItem(storageKeys.flash);
        return null;
    }
};

const getCurrentPage = () => {
    const route = window.location.hash.replace('#', '') || 'dashboard';
    return pages[route] ? route : 'dashboard';
};

const setCurrentPage = (page) => {
    window.location.hash = `#${page}`;
};

const getSession = () => readStorage(storageKeys.session, null);
const saveSession = (user) => writeStorage(storageKeys.session, { user });
const clearSession = () => window.localStorage.removeItem(storageKeys.session);
const getStoredRegistrations = () => readStorage(storageKeys.registrations, []);
const saveStoredRegistrations = (registrations) => writeStorage(storageKeys.registrations, registrations);
const getStoredAccounts = () => readStorage(storageKeys.accounts, []);
const saveStoredAccounts = (accounts) => writeStorage(storageKeys.accounts, accounts);
const getDemoAccounts = () => [...demoData.demoAccounts, ...getStoredAccounts()];

const guestGateCopy = {
    title: 'Sign in or create an account to unlock the showcase details',
    description: 'LedgerLift Uganda helps teams onboard informal businesses, assess readiness for credit, and decide where support should go next. Detailed registry, credit, government, and workspace views stay locked until a user signs in.',
    highlights: [
        'Capture onboarding records with optional TIN detail for future verification.',
        'Open role-based workspaces for field, lender, and oversight stories.',
        'Move from a public product overview into the live showcase journey after access.',
    ],
};

const deriveBusiness = (record) => {
    const tinNumber = String(record.tin_number || '').trim();
    const isDemoAccount = Boolean(record.is_demo_account);
    let profileScore = 40;

    profileScore += record.mobile_money_number ? 12 : 0;
    profileScore += tinNumber ? 18 : 0;
    profileScore += record.stock_focus ? 10 : 0;
    profileScore += record.monthly_revenue_band ? 8 : 0;
    profileScore += record.location_description ? 7 : 0;
    profileScore += Math.min(Number(record.employee_count || 1), 5);
    profileScore += isDemoAccount ? 0 : 5;
    profileScore = Math.min(profileScore, 100);

    let profileLabel = 'Emerging';
    if (profileScore >= 80) {
        profileLabel = 'Strong';
    } else if (profileScore >= 65) {
        profileLabel = 'Growing';
    }

    const taxLookupStatus = isDemoAccount ? 'demo_bypass' : tinNumber ? 'ready_for_lookup' : 'not_provided';
    const taxLookupStatusLabel = {
        not_provided: 'TIN not provided',
        ready_for_lookup: 'Ready for tax lookup',
        demo_bypass: 'Demo account bypass',
    }[taxLookupStatus];

    return {
        ...record,
        tin_number: tinNumber,
        is_demo_account: isDemoAccount,
        profile_score: profileScore,
        profile_label: profileLabel,
        tax_lookup_status: taxLookupStatus,
        tax_lookup_status_label: taxLookupStatusLabel,
        account_mode: isDemoAccount ? 'Demo' : 'Live',
        created_at: record.created_at || new Date().toISOString(),
    };
};

const getBusinesses = () => {
    const combined = [...demoData.seededBusinesses, ...getStoredRegistrations()]
        .map(deriveBusiness)
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));

    return combined;
};

const getTopBusinesses = (businesses, limit = 3) => [...businesses]
    .sort((left, right) => right.profile_score - left.profile_score)
    .slice(0, limit);

const buildDashboardMetrics = (businesses) => {
    const demoCount = businesses.filter((business) => business.is_demo_account).length;
    const tinReady = businesses.filter((business) => business.tax_lookup_status === 'ready_for_lookup').length;
    const averageScore = businesses.length
        ? Math.round(businesses.reduce((sum, business) => sum + business.profile_score, 0) / businesses.length)
        : 0;

    return [
        { label: 'Tracked businesses', value: String(businesses.length), delta: `${demoCount} demo-ready accounts`, icon: 'shop-window', tone: 'forest' },
        { label: 'Mobile money capture', value: 'UGX 182M', delta: 'Client-side seeded volume', icon: 'phone', tone: 'amber' },
        { label: 'Average profile score', value: `${averageScore} / 100`, delta: `${tinReady} businesses ready for TIN lookup`, icon: 'bar-chart-line', tone: 'sage' },
        { label: 'Inventory risk', value: '17 alerts', delta: 'Static watchlist for demos', icon: 'boxes', tone: 'clay' },
    ];
};

const buildSessionUser = (account) => ({
    username: account.username,
    display_name: account.displayName,
    role: account.role,
    role_label: account.roleLabel,
    requires_tin: false,
    notes: account.note,
    recommended_page: {
        government: 'government',
        lender: 'credit',
        field_agent: 'registration',
    }[account.role] || 'dashboard',
});

const guestAccessTemplate = () => `
    <section class='row g-3'>
        <div class='col-xl-8'>
            <article class='panel h-100'>
                <p class='section-kicker mb-2'>Platform overview</p>
                <h2 class='h3 mb-3'>${escapeHtml(guestGateCopy.title)}</h2>
                <p class='text-muted mb-4'>${escapeHtml(guestGateCopy.description)}</p>
                <div class='registration-feed'>
                    ${guestGateCopy.highlights.map((highlight) => `
                        <div class='feed-item'>
                            <strong class='d-block mb-2'>What opens after access</strong>
                            <p class='mb-0 text-muted'>${escapeHtml(highlight)}</p>
                        </div>
                    `).join('')}
                </div>
            </article>
        </div>
        <div class='col-xl-4'>
            <article class='panel h-100'>
                <p class='section-kicker mb-2'>Next step</p>
                <h2 class='h4 mb-3'>Continue with account access</h2>
                <p class='text-muted mb-4'>Only signed-in users can open the registry, credit insights, government view, registration tools, and the role workspace.</p>
                <div class='d-grid gap-3'>
                    <a class='btn btn-warning btn-lg' href='#login'>Log in</a>
                    <a class='btn btn-outline-success btn-lg' href='#login'>Create account</a>
                </div>
            </article>
        </div>
    </section>
`;

const renderHeroStats = () => demoData.heroStats.map((stat) => `
    <div class='col-6'>
        <div class='stat-chip h-100'>
            <strong>${escapeHtml(stat.value)}</strong>
            <span>${escapeHtml(stat.label)}</span>
        </div>
    </div>
`).join('');

const renderMetricCards = (metrics) => metrics.map((metric) => `
    <div class='col-sm-6 col-xl-3'>
        <article class='panel metric-card h-100'>
            <div class='d-flex justify-content-between align-items-start gap-3 mb-3'>
                <div>
                    <p class='section-kicker mb-2'>${escapeHtml(metric.label)}</p>
                    <h2 class='metric-value mb-2'>${escapeHtml(metric.value)}</h2>
                    <p class='metric-delta mb-0'>${escapeHtml(metric.delta)}</p>
                </div>
                <span class='metric-icon metric-icon-${escapeHtml(metric.tone)}'>
                    <i class='bi bi-${escapeHtml(metric.icon)}'></i>
                </span>
            </div>
        </article>
    </div>
`).join('');

const renderBusinessRow = (business) => {
    const searchValue = [
        business.business_name,
        business.owner_name,
        business.district,
        business.sector,
        business.monthly_revenue_band,
        business.tin_number,
    ].filter(Boolean).join(' ').toLowerCase();

    const tone = business.tax_lookup_status === 'ready_for_lookup'
        ? 'watch'
        : business.tax_lookup_status === 'demo_bypass'
            ? 'high'
            : 'low';

    return `
        <tr data-business-row data-search='${escapeHtml(searchValue)}'>
            <td>
                <strong class='d-block'>${escapeHtml(business.business_name)}</strong>
                <span class='text-muted small'>${escapeHtml(business.owner_name)}</span>
            </td>
            <td>${escapeHtml(business.district)}</td>
            <td>${escapeHtml(business.sector)}</td>
            <td>${escapeHtml(business.monthly_revenue_band || 'Pending capture')}</td>
            <td>
                <div class='small fw-semibold mb-2'>${escapeHtml(String(business.profile_score))}/100 · ${escapeHtml(business.profile_label)}</div>
                <div class='progress score-progress'>
                    <div class='progress-bar' role='progressbar' style='width: ${business.profile_score}%' aria-valuenow='${business.profile_score}' aria-valuemin='0' aria-valuemax='100'></div>
                </div>
            </td>
            <td>
                <span class='status-pill status-pill-${tone}'>${escapeHtml(business.tax_lookup_status_label)}</span>
            </td>
        </tr>
    `;
};

const renderFeedItem = (business) => `
    <div class='feed-item'>
        <strong>${escapeHtml(business.business_name)}</strong>
        <div class='text-muted small mb-2'>${escapeHtml(business.owner_name)} · ${escapeHtml(business.district)}</div>
        <div class='feed-meta'>
            <span>${escapeHtml(String(business.profile_score))}/100 ${escapeHtml(business.profile_label)}</span>
            <span>${escapeHtml(business.account_mode)}</span>
        </div>
    </div>
`;

const dashboardTemplate = (businesses) => `
    <section class='row g-3 mb-3'>
        ${renderMetricCards(buildDashboardMetrics(businesses))}
    </section>

    <section class='row g-3 mb-3'>
        <div class='col-lg-8'>
            <article class='panel h-100'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>Revenue signal</p>
                        <h2 class='h4 mb-1'>Mobile money is becoming the core evidence trail</h2>
                        <p class='text-muted mb-0'>The strongest shops are shifting toward digital payment capture while supplier activity grows in parallel.</p>
                    </div>
                    <span class='pill-note align-self-start'>6-month trend</span>
                </div>
                <div class='chart-frame chart-frame-wide'>
                    <canvas id='revenueTrendChart'></canvas>
                </div>
            </article>
        </div>

        <div class='col-lg-4'>
            <article class='panel h-100'>
                <p class='section-kicker mb-2'>Inventory mix</p>
                <h2 class='h4 mb-1'>Fast-moving categories driving the pilot</h2>
                <p class='text-muted mb-3'>Groceries and beverages dominate the earliest onboarding wave, which makes stock monitoring a core risk control.</p>
                <div class='chart-frame chart-frame-tall'>
                    <canvas id='inventoryMixChart'></canvas>
                </div>
            </article>
        </div>
    </section>

    <section class='row g-3'>
        <div class='col-lg-7'>
            <article class='panel h-100'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>Stock watch</p>
                        <h2 class='h4 mb-1'>Businesses that need immediate follow-up</h2>
                        <p class='text-muted mb-0'>Low inventory visibility will weaken both score quality and business continuity unless field teams intervene early.</p>
                    </div>
                    <span class='pill-note align-self-start'>${demoData.stockAlerts.length} open alerts</span>
                </div>
                <div class='table-responsive'>
                    <table class='table align-middle mb-0'>
                        <thead>
                            <tr>
                                <th>Business</th>
                                <th>District</th>
                                <th>Category</th>
                                <th>Coverage</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${demoData.stockAlerts.map((alert) => `
                                <tr>
                                    <td>${escapeHtml(alert.business)}</td>
                                    <td>${escapeHtml(alert.district)}</td>
                                    <td>${escapeHtml(alert.category)}</td>
                                    <td>${escapeHtml(alert.days)}</td>
                                    <td><span class='status-pill status-pill-${escapeHtml(alert.severity.toLowerCase())}'>${escapeHtml(alert.severity)}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </article>
        </div>

        <div class='col-lg-5'>
            <article class='panel h-100'>
                <p class='section-kicker mb-2'>What to do next</p>
                <h2 class='h4 mb-3'>MVP operating checklist</h2>
                <ul class='list-check'>
                    <li>Capture mobile money references and supplier payments in one ledger so the score is based on verified activity.</li>
                    <li>Flag stock-outs before they hurt revenue patterns, because missing inventory data quickly becomes missing credit evidence.</li>
                    <li>Segment shops by district and sector so government teams can target support where adoption is weakest.</li>
                    <li>Use the strongest digital histories to pilot small working-capital loans before expanding nationally.</li>
                </ul>
            </article>
        </div>
    </section>
`;

const businessesTemplate = (businesses) => `
    <section class='row g-3'>
        <div class='col-lg-8'>
            <article class='panel h-100'>
                <div class='d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>Registry explorer</p>
                        <h2 class='h4 mb-1'>Browse registrations in the showcase</h2>
                        <p class='text-muted mb-0'><span data-business-count>${businesses.length}</span> businesses are visible in this showcase.</p>
                    </div>
                    <div class='d-flex flex-column flex-sm-row gap-2 align-items-stretch'>
                        <span class='pill-note pill-note-muted'>Showcase mode</span>
                        <a class='btn btn-outline-success btn-lg' href='#registration'>New registration</a>
                        <div class='search-panel'>
                            <input type='search' class='form-control form-control-lg' data-business-search placeholder='Search by business, district, or sector'>
                        </div>
                    </div>
                </div>

                <div class='table-responsive'>
                    <table class='table align-middle mb-0'>
                        <thead>
                            <tr>
                                <th>Business</th>
                                <th>District</th>
                                <th>Sector</th>
                                <th>Revenue band</th>
                                <th>Profile</th>
                                <th>Tax status</th>
                            </tr>
                        </thead>
                        <tbody data-business-list>
                            ${businesses.map(renderBusinessRow).join('')}
                        </tbody>
                    </table>
                </div>

                <div class='empty-state mt-3' data-business-empty>No businesses match the current search.</div>
            </article>
        </div>

        <div class='col-lg-4'>
            <article class='panel mb-3'>
                <p class='section-kicker mb-2'>Readiness markers</p>
                <h2 class='h4 mb-3'>What this demo tracks per shop</h2>
                <div class='business-card mb-3'>
                    <strong class='d-block mb-2'>Profile score</strong>
                    <p class='mb-0 text-muted'>A completeness score built from mobile money capture, stock detail, location detail, and TIN readiness.</p>
                </div>
                <div class='business-card mb-3'>
                    <strong class='d-block mb-2'>Tax lookup status</strong>
                    <p class='mb-0 text-muted'>Businesses with TIN data are marked as ready for future URA lookup, while demo accounts remain usable for showcase flows.</p>
                </div>
                <div class='business-card'>
                    <strong class='d-block mb-2'>Demo record set</strong>
                    <p class='mb-0 text-muted'>New registrations stay available throughout the showcase so the team can demonstrate the full flow.</p>
                </div>
            </article>

            <article class='panel'>
                <p class='section-kicker mb-2'>Top profiles</p>
                <h2 class='h4 mb-3'>Strongest businesses in this demo</h2>
                <div class='registration-feed'>
                    ${getTopBusinesses(businesses).map(renderFeedItem).join('')}
                </div>
            </article>
        </div>
    </section>
`;

const registrationTemplate = (businesses, flash) => `
    <section class='row g-3'>
        <div class='col-lg-8'>
            <article class='panel h-100'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>Onboarding form</p>
                        <h2 class='h4 mb-1'>Capture business details for the demo</h2>
                        <p class='text-muted mb-0'>TIN stays optional, demo mode stays open, and every registration is ready for quick showcase flows.</p>
                    </div>
                    <span class='pill-note pill-note-success align-self-start'>Showcase mode</span>
                </div>

                <form class='row g-3' data-registration-form>
                    <div class='col-md-6'>
                        <label class='form-label' for='business_name'>Business name</label>
                        <input class='form-control' id='business_name' name='business_name' type='text' placeholder='Amina Retail Hub' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='owner_name'>Owner name</label>
                        <input class='form-control' id='owner_name' name='owner_name' type='text' placeholder='Amina Nankya' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='phone_number'>Phone number</label>
                        <input class='form-control' id='phone_number' name='phone_number' type='text' placeholder='+256700000000' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='mobile_money_number'>Mobile money number</label>
                        <input class='form-control' id='mobile_money_number' name='mobile_money_number' type='text' placeholder='Optional if same as phone number'>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='district'>District</label>
                        <select class='form-select' id='district' name='district' required>
                            <option value=''>Choose a district</option>
                            ${demoData.registrationForm.districts.map((district) => `<option value='${escapeHtml(district)}'>${escapeHtml(district)}</option>`).join('')}
                        </select>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='sector'>Business sector</label>
                        <select class='form-select' id='sector' name='sector' required>
                            <option value=''>Choose a sector</option>
                            ${demoData.registrationForm.sectors.map((sector) => `<option value='${escapeHtml(sector)}'>${escapeHtml(sector)}</option>`).join('')}
                        </select>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='tin_number'>TIN number</label>
                        <input class='form-control' id='tin_number' name='tin_number' type='text' placeholder='Optional for the demo'>
                        <div class='form-text'>Leave blank for demo onboarding. When provided, the record becomes ready for future tax verification.</div>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='monthly_revenue_band'>Monthly revenue band</label>
                        <select class='form-select' id='monthly_revenue_band' name='monthly_revenue_band'>
                            <option value=''>Select revenue band</option>
                            ${demoData.registrationForm.revenueBands.map((band) => `<option value='${escapeHtml(band)}'>${escapeHtml(band)}</option>`).join('')}
                        </select>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='stock_focus'>Primary stock focus</label>
                        <input class='form-control' id='stock_focus' name='stock_focus' type='text' placeholder='Sugar, soap, beverages'>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='employee_count'>Employee count</label>
                        <input class='form-control' id='employee_count' name='employee_count' type='number' min='1' value='1'>
                    </div>
                    <div class='col-12'>
                        <label class='form-label' for='location_description'>Location description</label>
                        <input class='form-control' id='location_description' name='location_description' type='text' placeholder='Trading center, market lane, or village cluster'>
                    </div>
                    <div class='col-12'>
                        <label class='form-label' for='notes'>Notes</label>
                        <textarea class='form-control' id='notes' name='notes' rows='4' placeholder='Add anything useful for the pilot, such as supplier relationships, seasonal issues, or tax follow-up needs.'></textarea>
                    </div>
                    <div class='col-12'>
                        <div class='demo-switch'>
                            <div class='form-check form-switch mb-2'>
                                <input class='form-check-input' id='is_demo_account' name='is_demo_account' type='checkbox' data-demo-toggle>
                                <label class='form-check-label fw-semibold' for='is_demo_account'>Register as a demo account</label>
                            </div>
                            <p class='mb-0 text-muted small' data-demo-note>Demo accounts can be created without a TIN so the team can showcase onboarding and credit flows before the tax integration is live.</p>
                        </div>
                    </div>
                    <div class='col-12'>
                        <div class='form-status ${flash ? `form-status-${escapeHtml(flash.tone)} is-visible` : ''}' data-registration-message>${flash ? escapeHtml(flash.message) : ''}</div>
                    </div>
                    <div class='col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center'>
                        <button class='btn btn-warning btn-lg px-4' type='submit'>Save registration</button>
                        <small class='text-muted'>New registrations appear immediately in this showcase.</small>
                    </div>
                </form>
            </article>
        </div>

        <div class='col-lg-4'>
            <article class='panel mb-3'>
                <p class='section-kicker mb-2'>TIN strategy</p>
                <h2 class='h4 mb-3'>Keep the tax lookup path open</h2>
                <ul class='list-check compact-list mb-0'>
                    <li>Allow TIN collection now, even if live verification is added later.</li>
                    <li>Use demo mode when you need a clean showcase account without waiting for tax validation.</li>
                    <li>Prioritize valid TINs for businesses that are most likely to move into formal loan programs first.</li>
                </ul>
            </article>

            <article class='panel mb-3'>
                <p class='section-kicker mb-2'>Demo accounts</p>
                <h2 class='h4 mb-3'>Seeded identities for presentations</h2>
                ${demoData.demoAccounts.map((account) => `
                    <div class='business-card mb-3'>
                        <div class='d-flex justify-content-between align-items-start gap-3 mb-3'>
                            <div>
                                <strong class='d-block'>${escapeHtml(account.displayName)}</strong>
                                <span class='text-muted small'>${escapeHtml(account.roleLabel)}</span>
                            </div>
                            <span class='pill-note'>No TIN required</span>
                        </div>
                        <div class='small mb-1'><strong>Username:</strong> ${escapeHtml(account.username)}</div>
                        <div class='small mb-2'><strong>Password:</strong> ${escapeHtml(account.password)}</div>
                        <p class='mb-0 text-muted small'>${escapeHtml(account.note)}</p>
                    </div>
                `).join('')}
            </article>

            <article class='panel'>
                <p class='section-kicker mb-2'>Recent submissions</p>
                <h2 class='h4 mb-3'>Newest registrations in this showcase</h2>
                <div class='registration-feed'>
                    ${businesses.slice(0, 4).map(renderFeedItem).join('')}
                </div>
            </article>
        </div>
    </section>
`;

const creditTemplate = (businesses) => `
    <section class='row g-3 mb-3'>
        ${demoData.scoreBreakdown.map((signal) => `
            <div class='col-md-6 col-xl-3'>
                <article class='panel h-100'>
                    <p class='section-kicker mb-2'>${escapeHtml(signal.weight)}</p>
                    <h2 class='h5 mb-3'>${escapeHtml(signal.name)}</h2>
                    <p class='text-muted mb-0'>${escapeHtml(signal.description)}</p>
                </article>
            </div>
        `).join('')}
    </section>

    <section class='row g-3 mb-3'>
        <div class='col-lg-7'>
            <article class='panel h-100'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>Credit trend</p>
                        <h2 class='h4 mb-1'>The score improves as records become more complete</h2>
                        <p class='text-muted mb-0'>This chart gives a fixed reference point while the business profiles and walkthrough remain interactive.</p>
                    </div>
                    <span class='pill-note align-self-start'>6-week model view</span>
                </div>
                <div class='chart-frame chart-frame-wide'>
                    <canvas id='repaymentTrendChart'></canvas>
                </div>
            </article>
        </div>

        <div class='col-lg-5'>
            <article class='panel h-100'>
                <p class='section-kicker mb-2'>Lender channels</p>
                <h2 class='h4 mb-3'>Sample facilities for the MVP</h2>
                <div class='table-responsive'>
                    <table class='table align-middle mb-0'>
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Ticket size</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${demoData.loanPrograms.map((program) => `
                                <tr>
                                    <td>
                                        <strong class='d-block'>${escapeHtml(program.provider)}</strong>
                                        <span class='text-muted small'>${escapeHtml(program.requirement)}</span>
                                    </td>
                                    <td>${escapeHtml(program.size)}</td>
                                    <td><span class='pill-note'>${escapeHtml(program.status)}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </article>
        </div>
    </section>

    <section class='row g-3'>
        <div class='col-lg-12'>
            <article class='panel'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>Early applicants</p>
                        <h2 class='h4 mb-1'>Businesses that could move into a first loan cohort</h2>
                        <p class='text-muted mb-0'>These cards update from the same registration set used across the showcase.</p>
                    </div>
                    <span class='pill-note align-self-start'>Pilot shortlist</span>
                </div>
                <div class='row g-3'>
                    ${getTopBusinesses(businesses).map((business) => `
                        <div class='col-md-6 col-xl-4'>
                            <div class='business-card h-100'>
                                <div class='d-flex justify-content-between align-items-start gap-3 mb-3'>
                                    <div>
                                        <strong class='d-block mb-1'>${escapeHtml(business.business_name)}</strong>
                                        <span class='text-muted small'>${escapeHtml(business.sector)} in ${escapeHtml(business.district)}</span>
                                    </div>
                                    <span class='metric-icon metric-icon-forest small-icon'>
                                        <i class='bi bi-shield-check'></i>
                                    </span>
                                </div>
                                <div class='d-flex justify-content-between text-muted small mb-2'>
                                    <span>Revenue band</span>
                                    <span>${escapeHtml(business.monthly_revenue_band || 'Pending')}</span>
                                </div>
                                <div class='d-flex justify-content-between text-muted small mb-2'>
                                    <span>Account mode</span>
                                    <span>${escapeHtml(business.account_mode)}</span>
                                </div>
                                <div class='d-flex justify-content-between text-muted small mb-3'>
                                    <span>Tax status</span>
                                    <span>${escapeHtml(business.tax_lookup_status_label)}</span>
                                </div>
                                <div class='progress score-progress mb-2'>
                                    <div class='progress-bar' role='progressbar' style='width: ${business.profile_score}%' aria-valuenow='${business.profile_score}' aria-valuemin='0' aria-valuemax='100'></div>
                                </div>
                                <div class='small fw-semibold'>${escapeHtml(String(business.profile_score))}/100 ${escapeHtml(business.profile_label)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </article>
        </div>
    </section>
`;

const governmentTemplate = () => `
    <section class='row g-3 mb-3'>
        <div class='col-lg-7'>
            <article class='panel h-100'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>District performance</p>
                        <h2 class='h4 mb-1'>Average score by pilot district</h2>
                        <p class='text-muted mb-0'>This view stays fixed for demos so teams can focus on the policy story during presentations.</p>
                    </div>
                    <span class='pill-note align-self-start'>Pilot benchmark</span>
                </div>
                <div class='chart-frame chart-frame-wide'>
                    <canvas id='districtScoreChart'></canvas>
                </div>
            </article>
        </div>

        <div class='col-lg-5'>
            <article class='panel h-100'>
                <p class='section-kicker mb-2'>Policy watchlist</p>
                <h2 class='h4 mb-3'>Signals that need action</h2>
                ${demoData.watchlist.map((item) => `
                    <div class='watchlist-item'>
                        <strong class='d-block mb-2'>${escapeHtml(item.title)}</strong>
                        <p class='mb-0 text-muted'>${escapeHtml(item.detail)}</p>
                    </div>
                `).join('')}
            </article>
        </div>
    </section>

    <section class='row g-3'>
        <div class='col-lg-8'>
            <article class='panel h-100'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>District registry</p>
                        <h2 class='h4 mb-1'>Where the pilot is performing today</h2>
                        <p class='text-muted mb-0'>Use this static district table during demos to explain how the product guides support, onboarding, and financing decisions.</p>
                    </div>
                    <span class='pill-note align-self-start'>${demoData.districtInsights.length} districts visible</span>
                </div>
                <div class='table-responsive'>
                    <table class='table align-middle mb-0'>
                        <thead>
                            <tr>
                                <th>District</th>
                                <th>Businesses</th>
                                <th>Average score</th>
                                <th>Digitization</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${demoData.districtInsights.map((district) => `
                                <tr>
                                    <td>${escapeHtml(district.district)}</td>
                                    <td>${escapeHtml(String(district.businesses))}</td>
                                    <td>${escapeHtml(String(district.avgScore))}/100</td>
                                    <td>${escapeHtml(district.digitization)}</td>
                                    <td>${escapeHtml(district.priority)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </article>
        </div>

        <div class='col-lg-4'>
            <article class='panel h-100'>
                <p class='section-kicker mb-2'>Recommended interventions</p>
                <h2 class='h4 mb-3'>How to expand the program</h2>
                ${demoData.interventions.map((intervention) => `
                    <div class='business-card mb-3'>
                        <strong class='d-block mb-2'>${escapeHtml(intervention.title)}</strong>
                        <p class='mb-0 text-muted'>${escapeHtml(intervention.detail)}</p>
                    </div>
                `).join('')}
            </article>
        </div>
    </section>
`;

const loginTemplate = (session, flash) => `
    <section class='row g-3'>
        <div class='col-lg-7'>
            <article class='panel mb-3'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>Secure entry</p>
                        <h2 class='h4 mb-1'>Sign in with a seeded demo account</h2>
                        <p class='text-muted mb-0'>Use seeded credentials to demonstrate role-based access during the showcase.</p>
                    </div>
                    <span class='pill-note pill-note-success align-self-start'>Role access</span>
                </div>

                <form class='row g-3' data-login-form>
                    <div class='col-md-6'>
                        <label class='form-label' for='login_username'>Username</label>
                        <input class='form-control' id='login_username' name='username' type='text' placeholder='gov.officer' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='login_password'>Password</label>
                        <input class='form-control' id='login_password' name='password' type='password' placeholder='GovDemo123!' required>
                    </div>
                    <div class='col-12'>
                        <div class='form-status ${flash ? `form-status-${escapeHtml(flash.tone)} is-visible` : ''}' data-login-message>${flash ? escapeHtml(flash.message) : ''}</div>
                    </div>
                    <div class='col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center'>
                        <button class='btn btn-warning btn-lg px-4' type='submit'>Sign in</button>
                        <small class='text-muted'>Current status: ${session?.user ? `signed in as ${escapeHtml(session.user.display_name)}` : 'not signed in'}</small>
                    </div>
                </form>
            </article>

            <article class='panel' id='register-account'>
                <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                    <div>
                        <p class='section-kicker mb-2'>Create access</p>
                        <h2 class='h4 mb-1'>Create an account for the showcase</h2>
                        <p class='text-muted mb-0'>New self-created accounts start with field access so the user can open the protected showcase pages after sign-in.</p>
                    </div>
                    <span class='pill-note pill-note-success align-self-start'>Field access by default</span>
                </div>

                <form class='row g-3' data-register-form>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_display_name'>Display name</label>
                        <input class='form-control' id='register_display_name' name='display_name' type='text' placeholder='Amina Nankya' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_username'>Username</label>
                        <input class='form-control' id='register_username' name='username' type='text' placeholder='amina.agent' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_password'>Password</label>
                        <input class='form-control' id='register_password' name='password' type='password' placeholder='Choose a secure password' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_confirm_password'>Confirm password</label>
                        <input class='form-control' id='register_confirm_password' name='confirm_password' type='password' placeholder='Repeat your password' required>
                    </div>
                    <div class='col-12'>
                        <div class='form-status' data-register-message></div>
                    </div>
                    <div class='col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center'>
                        <button class='btn btn-outline-success btn-lg px-4' type='submit'>Create account</button>
                        <small class='text-muted'>The new account signs in immediately and opens the protected showcase pages.</small>
                    </div>
                </form>
            </article>
        </div>

        <div class='col-lg-5'>
            <article class='panel mb-3'>
                <p class='section-kicker mb-2'>Quick fill</p>
                <h2 class='h4 mb-3'>Use the seeded demo identities</h2>
                <div class='registration-feed'>
                    ${demoData.demoAccounts.map((account) => `
                        <div class='feed-item'>
                            <strong class='d-block mb-2'>${escapeHtml(account.displayName)}</strong>
                            <div class='text-muted small mb-2'>${escapeHtml(account.roleLabel)}</div>
                            <div class='small mb-1'><strong>Username:</strong> ${escapeHtml(account.username)}</div>
                            <div class='small mb-3'><strong>Password:</strong> ${escapeHtml(account.password)}</div>
                            <button class='btn btn-outline-success btn-sm' type='button' data-use-account='${escapeHtml(account.username)}'>Use this account</button>
                        </div>
                    `).join('')}
                </div>
            </article>

            <article class='panel'>
                <p class='section-kicker mb-2'>Role routing</p>
                <h2 class='h4 mb-3'>What each account should see</h2>
                <div class='business-card mb-3'>
                    <strong class='d-block mb-2'>Government officer</strong>
                    <p class='mb-0 text-muted'>District-level oversight, TIN-ready business counts, and intervention priorities.</p>
                </div>
                <div class='business-card mb-3'>
                    <strong class='d-block mb-2'>Lender</strong>
                    <p class='mb-0 text-muted'>Credit-readiness signals, top profiles, and businesses ready for small-ticket facilities.</p>
                </div>
                <div class='business-card'>
                    <strong class='d-block mb-2'>Field agent</strong>
                    <p class='mb-0 text-muted'>Business onboarding, demo-mode registrations, and follow-up on incomplete profiles.</p>
                </div>
            </article>
        </div>
    </section>
`;

const workspaceTemplate = (session, businesses) => {
    if (!session?.user) {
        return `
            <section class='row g-3'>
                <div class='col-lg-8'>
                    <article class='panel h-100'>
                        <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                            <div>
                                <p class='section-kicker mb-2'>Role workspace</p>
                                <h2 class='h3 mb-2'>Sign in to open a role workspace</h2>
                                <p class='text-muted mb-0'>Use one of the seeded demo accounts to unlock role-specific tasks, live business metrics, and the correct dashboard links.</p>
                            </div>
                            <span class='pill-note pill-note-danger align-self-start'>No session</span>
                        </div>
                        <div class='business-card'>
                            <strong class='d-block mb-2'>No active session</strong>
                            <p class='mb-3 text-muted'>Open the login page and authenticate with a seeded role account to load your action cards.</p>
                            <a class='btn btn-outline-success btn-sm' href='#login'>Go to login</a>
                        </div>
                    </article>
                </div>
            </section>
        `;
    }

    const user = session.user;
    const blueprint = roleBlueprints[user.role] || roleBlueprints.field_agent;
    const totalBusinesses = businesses.length;
    const tinReadyCount = businesses.filter((business) => business.tax_lookup_status === 'ready_for_lookup').length;
    const demoCount = businesses.filter((business) => business.is_demo_account).length;
    const strongProfiles = businesses.filter((business) => business.profile_score >= 75).length;
    const averageScore = totalBusinesses
        ? Math.round(businesses.reduce((sum, business) => sum + business.profile_score, 0) / totalBusinesses)
        : 0;

    const metricsByRole = {
        government: [
            { label: 'Registered businesses', value: String(totalBusinesses), detail: 'All visible registrations in this showcase.' },
            { label: 'TIN-ready businesses', value: String(tinReadyCount), detail: 'Profiles ready for future URA lookup.' },
            { label: 'Demo accounts', value: String(demoCount), detail: 'Showcase registrations kept separate from live activity.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Completeness level across the current registry.' },
        ],
        lender: [
            { label: 'Strong profiles', value: String(strongProfiles), detail: 'Businesses above the readiness threshold.' },
            { label: 'TIN-ready businesses', value: String(tinReadyCount), detail: 'Best candidates for formal credit pilots.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Quick quality signal for the demo registry.' },
            { label: 'Live businesses', value: String(totalBusinesses - demoCount), detail: 'Records that are not marked as demo-only.' },
        ],
        field_agent: [
            { label: 'Businesses onboarded', value: String(totalBusinesses), detail: 'Current businesses captured in the registry.' },
            { label: 'Profiles missing TIN', value: String(totalBusinesses - tinReadyCount - demoCount), detail: 'Follow up when formalization is appropriate.' },
            { label: 'Demo registrations', value: String(demoCount), detail: 'Useful for showcase flows before tax verification.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Completeness of captured business records.' },
        ],
    };

    return `
        <section class='row g-3'>
            <div class='col-lg-8'>
                <article class='panel h-100'>
                    <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                        <div>
                            <p class='section-kicker mb-2'>Role workspace</p>
                            <h2 class='h3 mb-2'>${escapeHtml(blueprint.workspaceTitle)}</h2>
                            <p class='text-muted mb-0'>${escapeHtml(blueprint.workspaceDescription)}</p>
                        </div>
                        <span class='pill-note pill-note-success align-self-start'>Signed in as ${escapeHtml(user.role_label)}</span>
                    </div>

                    <div class='row g-3 mb-3'>
                        ${metricsByRole[user.role].map((metric) => `
                            <div class='col-sm-6 col-xl-3'>
                                <div class='metric-tile h-100'>
                                    <span class='section-kicker mb-2'>${escapeHtml(metric.label)}</span>
                                    <strong>${escapeHtml(metric.value)}</strong>
                                    <p class='text-muted mb-0'>${escapeHtml(metric.detail)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class='row g-3'>
                        ${blueprint.actions.map((action) => `
                            <div class='col-md-6'>
                                <div class='business-card action-card d-flex flex-column'>
                                    <strong class='d-block mb-2'>${escapeHtml(action.title)}</strong>
                                    <p class='mb-3 text-muted'>${escapeHtml(action.detail)}</p>
                                    <a class='btn btn-outline-success btn-sm align-self-start' href='${escapeHtml(action.href)}'>${escapeHtml(action.cta)}</a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </article>
            </div>

            <div class='col-lg-4'>
                <article class='panel mb-3'>
                    <p class='section-kicker mb-2'>Current access</p>
                    <h2 class='h4 mb-3'>Signed-in account</h2>
                    <div class='auth-profile-card'>
                        <strong class='d-block mb-2'>${escapeHtml(user.display_name)}</strong>
                        <div class='small mb-1'><strong>Username:</strong> ${escapeHtml(user.username)}</div>
                        <div class='small mb-1'><strong>Role:</strong> ${escapeHtml(user.role_label)}</div>
                        <div class='small mb-3'><strong>TIN required:</strong> No</div>
                        <a class='btn btn-outline-success btn-sm' href='#${escapeHtml(user.recommended_page)}'>Open recommended page</a>
                    </div>
                </article>

                <article class='panel'>
                    <p class='section-kicker mb-2'>Role notes</p>
                    <h2 class='h4 mb-3'>Operating guidance</h2>
                    <div class='registration-feed'>
                        ${blueprint.notes.map((note) => `<div class='feed-item'><p class='mb-0 text-muted'>${escapeHtml(note)}</p></div>`).join('')}
                    </div>
                </article>
            </div>
        </section>
    `;
};

const renderPage = (page, businesses, session) => {
    const flash = consumeFlash(page);

    switch (page) {
        case 'dashboard':
            return dashboardTemplate(businesses);
        case 'businesses':
            return businessesTemplate(businesses);
        case 'registration':
            return registrationTemplate(businesses, flash);
        case 'credit':
            return creditTemplate(businesses);
        case 'government':
            return governmentTemplate();
        case 'login':
            return loginTemplate(session, flash);
        case 'workspace':
            return workspaceTemplate(session, businesses);
        default:
            return dashboardTemplate(businesses);
    }
};

const updateHero = (page, session) => {
    const hero = pages[page] || pages.dashboard;
    const heroPanel = document.querySelector('[data-hero-panel]');
    const eyebrow = document.querySelector('[data-hero-eyebrow]');
    const title = document.querySelector('[data-hero-title]');
    const description = document.querySelector('[data-hero-description]');
    const actions = document.querySelector('[data-hero-actions]');
    const stats = document.querySelector('[data-hero-stats]');

    if (heroPanel) {
        heroPanel.classList.toggle('d-none', page !== 'dashboard');
    }

    if (eyebrow) {
        eyebrow.textContent = hero.eyebrow;
    }

    if (title) {
        title.textContent = hero.title;
    }

    if (description) {
        description.textContent = hero.description;
    }

    if (actions) {
        const heroActions = !session?.user && page === 'dashboard'
            ? [
                { label: 'Log in', page: 'login', kind: 'primary' },
                { label: 'Create account', page: 'login', kind: 'secondary' },
            ]
            : hero.ctas;

        actions.innerHTML = heroActions.map((action) => `
            <a class='btn ${action.kind === 'primary' ? 'btn-warning' : 'btn-outline-light'} px-4' href='#${escapeHtml(action.page)}'>${escapeHtml(action.label)}</a>
        `).join('');
    }

    if (stats) {
        stats.innerHTML = renderHeroStats();
    }
};

const updateNavigation = (page, session) => {
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
        link.classList.toggle('active', link.dataset.navLink === page);
    });

    const overflowButton = document.querySelector('[data-nav-overflow-button]');
    const overflowPages = new Set(['credit', 'government']);

    if (overflowButton) {
        const isOverflowPage = overflowPages.has(page);
        overflowButton.classList.toggle('btn-warning', isOverflowPage);
        overflowButton.classList.toggle('text-dark', isOverflowPage);
        overflowButton.classList.toggle('btn-outline-dark', !isOverflowPage);
    }

    const authStatus = document.querySelector('[data-auth-status]');
    const loginLink = document.querySelector('[data-login-link]');
    const workspaceLink = document.querySelector('[data-workspace-link]');
    const logoutButton = document.querySelector('[data-logout-button]');

    if (session?.user) {
        if (authStatus) {
            authStatus.textContent = `${session.user.display_name} · ${session.user.role_label}`;
            authStatus.classList.remove('d-none');
        }

        if (loginLink) {
            loginLink.classList.add('d-none');
        }

        if (workspaceLink) {
            workspaceLink.classList.remove('d-none');
        }

        if (logoutButton) {
            logoutButton.classList.remove('d-none');
        }
    } else {
        if (authStatus) {
            authStatus.textContent = '';
            authStatus.classList.add('d-none');
        }

        if (loginLink) {
            loginLink.classList.remove('d-none');
        }

        if (workspaceLink) {
            workspaceLink.classList.add('d-none');
        }

        if (logoutButton) {
            logoutButton.classList.add('d-none');
        }
    }
};

const showFormMessage = (selector, tone, message) => {
    const element = document.querySelector(selector);
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `form-status form-status-${tone} is-visible`;
};

const syncDemoNote = () => {
    const toggle = document.querySelector('[data-demo-toggle]');
    const note = document.querySelector('[data-demo-note]');

    if (!toggle || !note) {
        return;
    }

    note.textContent = toggle.checked
        ? 'Demo mode is active. This business can be registered without a TIN and will be marked as a showcase account.'
        : 'Demo accounts can be created without a TIN so the team can showcase onboarding and credit flows before the tax integration is live.';
};

const filterBusinesses = () => {
    const input = document.querySelector('[data-business-search]');
    const rows = Array.from(document.querySelectorAll('[data-business-row]'));
    const count = document.querySelector('[data-business-count]');
    const emptyState = document.querySelector('[data-business-empty]');

    if (!input || rows.length === 0) {
        return;
    }

    const query = input.value.trim().toLowerCase();
    let visibleRows = 0;

    rows.forEach((row) => {
        const matches = (row.dataset.search || '').includes(query);
        row.classList.toggle('d-none', !matches);
        if (matches) {
            visibleRows += 1;
        }
    });

    if (count) {
        count.textContent = String(visibleRows);
    }

    if (emptyState) {
        emptyState.style.display = visibleRows === 0 ? 'block' : 'none';
    }
};

const bindBusinessesPage = () => {
    const input = document.querySelector('[data-business-search]');
    if (input) {
        input.addEventListener('input', filterBusinesses);
        filterBusinesses();
    }
};

const bindRegistrationPage = () => {
    const form = document.querySelector('[data-registration-form]');
    const toggle = document.querySelector('[data-demo-toggle]');

    syncDemoNote();

    if (toggle) {
        toggle.addEventListener('change', syncDemoNote);
    }

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const employeeCount = Math.max(1, Number(formData.get('employee_count') || 1));
        const business = {
            id: `browser-${Date.now()}`,
            business_name: String(formData.get('business_name') || '').trim(),
            owner_name: String(formData.get('owner_name') || '').trim(),
            phone_number: String(formData.get('phone_number') || '').trim(),
            mobile_money_number: String(formData.get('mobile_money_number') || '').trim(),
            tin_number: String(formData.get('tin_number') || '').trim(),
            district: String(formData.get('district') || '').trim(),
            sector: String(formData.get('sector') || '').trim(),
            location_description: String(formData.get('location_description') || '').trim(),
            stock_focus: String(formData.get('stock_focus') || '').trim(),
            monthly_revenue_band: String(formData.get('monthly_revenue_band') || '').trim(),
            employee_count: employeeCount,
            is_demo_account: Boolean(formData.get('is_demo_account')),
            notes: String(formData.get('notes') || '').trim(),
            created_at: new Date().toISOString(),
        };

        const registrations = getStoredRegistrations();
        registrations.unshift(business);
        saveStoredRegistrations(registrations);
        setFlash('registration', 'success', 'Business registration saved to the showcase registry.');
        renderApp();
    });
};

const bindLoginPage = () => {
    const form = document.querySelector('[data-login-form]');
    const registerForm = document.querySelector('[data-register-form]');
    const usernameInput = document.querySelector('#login_username');
    const passwordInput = document.querySelector('#login_password');

    document.querySelectorAll('[data-use-account]').forEach((button) => {
        button.addEventListener('click', () => {
            const account = getDemoAccounts().find((item) => item.username === button.dataset.useAccount);
            if (!account || !usernameInput || !passwordInput) {
                return;
            }

            usernameInput.value = account.username;
            passwordInput.value = account.password;
            showFormMessage('[data-login-message]', 'success', 'Credentials inserted. Submit to sign in.');
        });
    });

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const username = String(formData.get('username') || '').trim();
        const password = String(formData.get('password') || '');
        const account = getDemoAccounts().find((item) => item.username === username && item.password === password);

        if (!account) {
            showFormMessage('[data-login-message]', 'error', 'Invalid demo username or password. Use one of the seeded credentials on this page.');
            return;
        }

        saveSession(buildSessionUser(account));
        setFlash('workspace', 'success', `Signed in as ${account.displayName}.`);
        setCurrentPage('workspace');
    });

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const displayName = String(formData.get('display_name') || '').trim();
        const username = String(formData.get('username') || '').trim();
        const password = String(formData.get('password') || '');
        const confirmPassword = String(formData.get('confirm_password') || '');

        if (displayName.length < 3 || username.length < 3) {
            showFormMessage('[data-register-message]', 'error', 'Display name and username must each be at least 3 characters long.');
            return;
        }

        if (password.length < 8) {
            showFormMessage('[data-register-message]', 'error', 'Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            showFormMessage('[data-register-message]', 'error', 'Password confirmation does not match.');
            return;
        }

        const usernameTaken = getDemoAccounts().some((account) => account.username.toLowerCase() === username.toLowerCase());
        if (usernameTaken) {
            showFormMessage('[data-register-message]', 'error', 'That username is already in use.');
            return;
        }

        const account = {
            displayName,
            username,
            password,
            role: 'field_agent',
            roleLabel: 'Field agent',
            note: 'Self-created showcase account.',
        };

        const storedAccounts = getStoredAccounts();
        storedAccounts.unshift(account);
        saveStoredAccounts(storedAccounts);
        saveSession(buildSessionUser(account));
        setFlash('workspace', 'success', `Account created for ${displayName}.`);
        setCurrentPage('workspace');
    });
};

const bindShellActions = () => {
    const logoutButton = document.querySelector('[data-logout-button]');
    if (!logoutButton || logoutButton.dataset.bound === 'true') {
        return;
    }

    logoutButton.dataset.bound = 'true';
    logoutButton.addEventListener('click', () => {
        clearSession();
        setFlash('login', 'success', 'Signed out of the demo session.');
        setCurrentPage('login');
    });
};

const destroyCharts = () => {
    chartInstances.forEach((chart) => chart.destroy());
    chartInstances = [];
};

const createChart = (id, configuration) => {
    const element = document.getElementById(id);
    if (!element || !window.Chart) {
        return;
    }

    chartInstances.push(new Chart(element, configuration));
};

const initCharts = (page) => {
    destroyCharts();

    if (!window.Chart) {
        return;
    }

    Chart.defaults.font.family = "'Public Sans', sans-serif";
    Chart.defaults.color = '#645346';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 10;

    if (page === 'dashboard') {
        createChart('revenueTrendChart', {
            type: 'line',
            data: {
                labels: demoData.collections.labels,
                datasets: [
                    {
                        label: 'Mobile money volume',
                        data: demoData.collections.mobileMoney,
                        borderColor: palette.forest,
                        backgroundColor: palette.forestSoft,
                        borderWidth: 3,
                        tension: 0.35,
                        fill: true,
                    },
                    {
                        label: 'Cash volume',
                        data: demoData.collections.cash,
                        borderColor: palette.amber,
                        backgroundColor: palette.amberSoft,
                        borderWidth: 2,
                        tension: 0.35,
                        fill: false,
                    },
                    {
                        label: 'Supplier payments',
                        data: demoData.collections.supplierPayments,
                        borderColor: palette.clay,
                        borderWidth: 2,
                        tension: 0.35,
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        grid: { color: palette.grid },
                        ticks: { callback: (value) => `UGX ${value}M` },
                    },
                },
            },
        });

        createChart('inventoryMixChart', {
            type: 'doughnut',
            data: {
                labels: demoData.inventoryMix.labels,
                datasets: [
                    {
                        data: demoData.inventoryMix.values,
                        backgroundColor: [palette.forest, palette.amber, palette.sage, palette.clay],
                        borderWidth: 0,
                        hoverOffset: 6,
                    },
                ],
            },
            options: {
                cutout: '64%',
                plugins: {
                    legend: { position: 'bottom' },
                },
            },
        });
    }

    if (page === 'credit') {
        createChart('repaymentTrendChart', {
            type: 'line',
            data: {
                labels: demoData.scoreTrend.labels,
                datasets: [
                    {
                        label: 'Average credit readiness',
                        data: demoData.scoreTrend.values,
                        borderColor: palette.forest,
                        backgroundColor: 'rgba(15, 92, 70, 0.08)',
                        pointBackgroundColor: palette.amber,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        borderWidth: 3,
                        tension: 0.35,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        min: 50,
                        max: 85,
                        grid: { color: palette.grid },
                    },
                },
            },
        });
    }

    if (page === 'government') {
        createChart('districtScoreChart', {
            type: 'bar',
            data: {
                labels: demoData.districtPerformance.labels,
                datasets: [
                    {
                        label: 'Average score',
                        data: demoData.districtPerformance.scores,
                        backgroundColor: [palette.forest, palette.sage, palette.amber, palette.clay, palette.forest],
                        borderRadius: 8,
                        maxBarThickness: 42,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: palette.grid },
                    },
                },
            },
        });
    }
};

const renderApp = () => {
    const session = getSession();
    const page = getCurrentPage();
    const businesses = getBusinesses();
    const root = document.querySelector('[data-page-root]');

    if (!session?.user && page !== 'dashboard' && page !== 'login') {
        setCurrentPage('dashboard');
        return;
    }

    updateHero(page, session);
    updateNavigation(page, session);
    bindShellActions();

    if (root) {
        root.innerHTML = !session?.user && page === 'dashboard'
            ? guestAccessTemplate()
            : renderPage(page, businesses, session);
    }

    if (page === 'businesses') {
        bindBusinessesPage();
    }

    if (page === 'registration') {
        bindRegistrationPage();
    }

    if (page === 'login') {
        bindLoginPage();
    }

    if (session?.user) {
        initCharts(page);
    } else {
        destroyCharts();
    }
};

window.addEventListener('hashchange', renderApp);
window.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
        window.location.hash = '#dashboard';
    }

    renderApp();
});