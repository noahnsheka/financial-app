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
        description: 'Use seeded credentials or create a business-owner account to demonstrate role-based access and guided workspaces.',
        ctas: [
            { label: 'Use demo accounts', page: 'login', kind: 'primary' },
            { label: 'Open workspace', page: 'workspace', kind: 'secondary' },
        ],
    },
    workspace: {
        label: 'Workspace',
        eyebrow: 'Role control room',
        title: 'Open a role-based demo workspace',
        description: 'After signing in, the showcase tailors the workspace to government, lender, field-agent, or business-owner stories using the same seeded records.',
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
        {
            displayName: 'Paul Ssenfuka',
            username: 'paul.owner',
            password: 'OwnerDemo123!',
            role: 'business_owner',
            roleLabel: 'Business owner',
            note: 'Use this account to walk through the owner workspace, stock tracker, and credit intake.',
            businessId: 'seed-owner-001',
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
        {
            id: 'seed-owner-001',
            business_name: 'Wakiso Home Goods',
            owner_name: 'Paul Ssenfuka',
            phone_number: '+256700000202',
            mobile_money_number: '+256700000202',
            tin_number: '1002003004',
            district: 'Wakiso',
            sector: 'Household goods',
            location_description: 'Bwebajja trading center',
            stock_focus: 'Cleaning supplies, cooking oil, tissue packs',
            monthly_revenue_band: 'UGX 6M - 10M',
            inventory_value_estimate: 2800000,
            average_monthly_profit: 980000,
            average_monthly_mobile_money: 4700000,
            receipt_count: 14,
            receipt_value_total: 4200000,
            employee_count: 4,
            is_demo_account: false,
            account_username: 'paul.owner',
            created_at: '2026-05-19T10:20:00Z',
            updated_at: '2026-05-21T08:45:00Z',
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
    businessEdits: 'ledgerlift.pages.businessEdits',
    ownerWorkspace: 'ledgerlift.pages.ownerWorkspace',
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
    business_owner: {
        workspaceTitle: 'Business owner workspace',
        workspaceDescription: 'Log daily stock, review live business graphs, organize documents, and prepare a credit pack from one owner dashboard.',
        notes: [
            'Keep stock movement current every day so the monthly report stays believable.',
            'Track the documents lenders and compliance teams will ask for before a financing conversation.',
            'Use the front-end credit intake as a working draft before backend underwriting is wired in.',
        ],
        actions: [],
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

const publicPages = new Set(['dashboard', 'login', 'credit', 'government']);

const getSession = () => readStorage(storageKeys.session, null);
const saveSession = (user) => writeStorage(storageKeys.session, { user });
const clearSession = () => window.localStorage.removeItem(storageKeys.session);
const getStoredRegistrations = () => readStorage(storageKeys.registrations, []);
const saveStoredRegistrations = (registrations) => writeStorage(storageKeys.registrations, registrations);
const getStoredAccounts = () => readStorage(storageKeys.accounts, []);
const saveStoredAccounts = (accounts) => writeStorage(storageKeys.accounts, accounts);
const getDemoAccounts = () => [...demoData.demoAccounts, ...getStoredAccounts()];
const getStoredBusinessEdits = () => readStorage(storageKeys.businessEdits, {});
const saveStoredBusinessEdits = (edits) => writeStorage(storageKeys.businessEdits, edits);

const ugxFormatter = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
});

const revenueBandMidpoints = {
    'Below UGX 1M': 500000,
    'UGX 1M - 3M': 2000000,
    'UGX 3M - 6M': 4500000,
    'UGX 6M - 10M': 8000000,
    'Above UGX 10M': 12000000,
};

const toNumber = (value) => {
    const parsed = Number.parseFloat(String(value ?? '0').replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
};

const clampScoreValue = (value) => Math.max(0, Math.min(100, Math.round(toNumber(value))));

const averageValue = (values) => values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

const formatCurrencyUGX = (value) => ugxFormatter.format(toNumber(value));

const formatSignedCurrencyUGX = (value) => {
    const numericValue = toNumber(value);
    return `${numericValue >= 0 ? '+' : '-'}${formatCurrencyUGX(Math.abs(numericValue))}`;
};

const formatWorkspaceDate = (value) => {
    if (!value) {
        return 'Not yet saved';
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
        ? 'Not yet saved'
        : parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const buildRelativeIsoDate = (daysAgo = 0) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
};

const buildFutureIsoDate = (monthsAhead = 0) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setMonth(date.getMonth() + monthsAhead);
    return date.toISOString().slice(0, 10);
};

const buildTrailingMonthLabels = () => Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    return date.toLocaleDateString(undefined, { month: 'short' });
});

const getOwnerWorkspaceItems = (business) => {
    const parsedItems = String(business?.stock_focus || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return parsedItems.length ? parsedItems : ['Fast movers', 'Core groceries', 'Seasonal stock'];
};

const buildOwnerSeedMonthlySales = (business) => {
    const labels = buildTrailingMonthLabels();
    const revenueBase = Math.max(
        toNumber(business?.average_monthly_mobile_money) + toNumber(business?.average_monthly_profit),
        toNumber(business?.inventory_value_estimate),
        1800000,
    );

    return labels.map((label, index) => {
        const multiplier = 0.8 + (index * 0.07);
        const revenue = Math.round((revenueBase * multiplier) / 1000) * 1000;
        return {
            id: `seed-sales-${label.toLowerCase()}`,
            label,
            revenue,
            expenses: Math.round(revenue * 0.68),
            orders: 84 + (index * 12),
        };
    });
};

const buildOwnerSeedStockEntries = (business) => {
    const items = getOwnerWorkspaceItems(business);
    const priceHint = Math.max(
        Math.round(Math.max(toNumber(business?.average_monthly_profit) / 45, 2500) / 100) * 100,
        2500,
    );

    return items.slice(0, 3).map((item, index) => ({
        id: `seed-stock-${index}`,
        date: buildRelativeIsoDate(2 - index),
        item_name: item,
        category: business?.sector || 'Retail',
        unit: 'units',
        on_hand: Math.max(8, 38 - (index * 7)),
        received: 12 + (index * 4),
        sold: 7 + (index * 3),
        reorder_level: 12 + (index * 2),
        selling_price: priceHint,
    }));
};

const buildOwnerSeedDocuments = (business) => [
    {
        id: 'seed-doc-licence',
        name: 'Trading licence',
        type: 'Compliance',
        reference: `${String(business?.district || 'BUS').slice(0, 3).toUpperCase()}-2026-114`,
        due_date: buildFutureIsoDate(1),
        status: 'Ready',
    },
    {
        id: 'seed-doc-finance',
        name: 'Mobile money statement',
        type: 'Finance',
        reference: 'Last 90 days',
        due_date: buildFutureIsoDate(0),
        status: 'Ready',
    },
    {
        id: 'seed-doc-tax',
        name: 'TIN and tax summary',
        type: 'Tax',
        reference: business?.tin_number || 'Pending TIN capture',
        due_date: '',
        status: business?.tin_number ? 'Ready' : 'Pending',
    },
];

const buildOwnerSeedCreditProfile = (business, monthlySales) => {
    const averageMonthlyRevenue = averageValue(monthlySales.map((entry) => toNumber(entry.revenue)));

    return {
        requested_amount: Math.max(350000, Math.round((averageMonthlyRevenue * 0.35) / 1000) * 1000),
        loan_purpose: `Increase ${getOwnerWorkspaceItems(business)[0].toLowerCase()} stock depth`,
        repayment_window: '6 months',
        bookkeeping_score: clampScoreValue((business?.receipt_trust_score || 0) || 72),
        supplier_score: clampScoreValue((business?.consistency_score || 0) || 74),
        collateral_notes: 'Inventory, receipt trail, and mobile-money record available for review.',
        registration_status: 'Draft front-end intake',
    };
};

const normalizeOwnerWorkspaceData = (value, business) => {
    const seedMonthlySales = buildOwnerSeedMonthlySales(business);
    const seed = {
        stockEntries: buildOwnerSeedStockEntries(business),
        monthlySales: seedMonthlySales,
        documents: buildOwnerSeedDocuments(business),
        creditProfile: buildOwnerSeedCreditProfile(business, seedMonthlySales),
    };

    return {
        stockEntries: Array.isArray(value?.stockEntries) && value.stockEntries.length > 0
            ? value.stockEntries
            : seed.stockEntries,
        monthlySales: Array.isArray(value?.monthlySales) && value.monthlySales.length > 0
            ? value.monthlySales
            : seed.monthlySales,
        documents: Array.isArray(value?.documents) && value.documents.length > 0
            ? value.documents
            : seed.documents,
        creditProfile: {
            ...seed.creditProfile,
            ...(value?.creditProfile || {}),
        },
    };
};

const getOwnerWorkspaceData = (business) => {
    if (!business?.id) {
        return normalizeOwnerWorkspaceData({}, business || {});
    }

    const store = readStorage(storageKeys.ownerWorkspace, {});
    const normalized = normalizeOwnerWorkspaceData(store[business.id], business);
    writeStorage(storageKeys.ownerWorkspace, { ...store, [business.id]: normalized });
    return normalized;
};

const updateOwnerWorkspaceData = (business, updater) => {
    if (!business?.id) {
        return null;
    }

    const store = readStorage(storageKeys.ownerWorkspace, {});
    const current = normalizeOwnerWorkspaceData(store[business.id], business);
    const nextValue = typeof updater === 'function'
        ? updater(current)
        : { ...current, ...updater };
    const normalized = normalizeOwnerWorkspaceData(nextValue, business);

    writeStorage(storageKeys.ownerWorkspace, { ...store, [business.id]: normalized });
    return normalized;
};

const saveBusinessEdit = (businessId, updates) => {
    const edits = getStoredBusinessEdits();
    const nextEdit = {
        ...(edits[businessId] || {}),
        ...updates,
        updated_at: new Date().toISOString(),
    };

    saveStoredBusinessEdits({
        ...edits,
        [businessId]: nextEdit,
    });

    return nextEdit;
};

const getLatestOwnerStockEntries = (stockEntries) => {
    const seenItems = new Set();

    return [...stockEntries]
        .sort((left, right) => String(right.date || '').localeCompare(String(left.date || '')))
        .filter((entry) => {
            const key = String(entry.item_name || '').trim().toLowerCase();

            if (!key || seenItems.has(key)) {
                return false;
            }

            seenItems.add(key);
            return true;
        });
};

const buildOwnerCreditPreview = (business, ownerData, latestStock, averageRevenue, readyDocuments) => {
    const inventoryDiscipline = latestStock.length
        ? Math.round(averageValue(
            latestStock.map((entry) => (toNumber(entry.on_hand) > toNumber(entry.reorder_level) ? 88 : 54)),
        ))
        : 55;
    const documentCoverage = ownerData.documents.length
        ? Math.round((readyDocuments / ownerData.documents.length) * 100)
        : 0;
    const requestedAmount = toNumber(ownerData.creditProfile.requested_amount);
    const revenueCoverage = averageRevenue > 0 ? requestedAmount / averageRevenue : 0;
    const affordability = averageRevenue > 0
        ? clampScoreValue(100 - Math.max(0, (revenueCoverage - 0.45) * 120))
        : 40;

    const score = clampScoreValue(
        ((business.credit_score || 0) * 0.3)
        + ((business.profile_score || 0) * 0.15)
        + (documentCoverage * 0.15)
        + (inventoryDiscipline * 0.15)
        + (clampScoreValue(ownerData.creditProfile.bookkeeping_score) * 0.1)
        + (clampScoreValue(ownerData.creditProfile.supplier_score) * 0.1)
        + (affordability * 0.05),
    );

    const band = score >= 82
        ? 'Investor-ready'
        : score >= 70
            ? 'Growth-ready'
            : score >= 58
                ? 'Needs more evidence'
                : 'Early-stage';

    const note = band === 'Investor-ready'
        ? 'The current operating evidence is strong enough for a lender-facing conversation.'
        : band === 'Growth-ready'
            ? 'The credit pack is close. Keep stock updates and business documents current to move higher.'
            : band === 'Needs more evidence'
                ? 'Add stronger stock history, recent documents, and bookkeeping discipline before external review.'
                : 'Build a fuller operating history before starting a lender discussion.';

    return {
        score,
        band,
        note,
        documentCoverage,
        affordability,
        inventoryDiscipline,
    };
};

const buildOwnerWorkspaceAnalytics = (business, ownerData) => {
    const latestStock = getLatestOwnerStockEntries(ownerData.stockEntries || []);
    const lowStockCount = latestStock.filter((entry) => toNumber(entry.on_hand) <= toNumber(entry.reorder_level)).length;
    const totalOnHand = latestStock.reduce((sum, entry) => sum + toNumber(entry.on_hand), 0);
    const weeklyUnitsSold = (ownerData.stockEntries || [])
        .filter((entry) => {
            const entryDate = new Date(entry.date);
            const today = new Date();
            const diffInDays = (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
            return Number.isFinite(diffInDays) && diffInDays <= 7;
        })
        .reduce((sum, entry) => sum + toNumber(entry.sold), 0);
    const totalRevenue = (ownerData.monthlySales || []).reduce((sum, entry) => sum + toNumber(entry.revenue), 0);
    const averageRevenue = averageValue((ownerData.monthlySales || []).map((entry) => toNumber(entry.revenue)));
    const grossMargin = Math.round(averageValue(
        (ownerData.monthlySales || []).map((entry) => {
            const revenue = toNumber(entry.revenue);
            return revenue > 0 ? ((revenue - toNumber(entry.expenses)) / revenue) * 100 : 0;
        }),
    ));
    const bestMonth = (ownerData.monthlySales || []).reduce((best, entry) => (
        toNumber(entry.revenue) > toNumber(best.revenue) ? entry : best
    ), ownerData.monthlySales?.[0] || { label: 'N/A', revenue: 0 });
    const firstMonth = ownerData.monthlySales?.[0];
    const lastMonth = ownerData.monthlySales?.[ownerData.monthlySales.length - 1];
    const salesMomentum = firstMonth && lastMonth
        ? toNumber(lastMonth.revenue) - toNumber(firstMonth.revenue)
        : 0;
    const readyDocuments = (ownerData.documents || []).filter((document) => ['ready', 'submitted', 'verified', 'active'].includes(String(document.status || '').trim().toLowerCase())).length;
    const creditPreview = buildOwnerCreditPreview(business, ownerData, latestStock, averageRevenue, readyDocuments);

    return {
        latestStock,
        lowStockCount,
        totalOnHand,
        weeklyUnitsSold,
        totalRevenue,
        grossMargin,
        bestMonth,
        currentMonth: lastMonth || { label: 'This month', revenue: 0, orders: 0, expenses: 0 },
        salesMomentum,
        readyDocuments,
        documentCount: ownerData.documents?.length || 0,
        creditPreview,
    };
};

const getOwnerBusiness = (user, businesses) => businesses.find((business) => String(business.id) === String(user?.business_id || ''))
    || businesses.find((business) => String(business.account_username || '').toLowerCase() === String(user?.username || '').toLowerCase())
    || null;

const buildOwnerGuidance = (business, analytics) => [
    (business.profile_score || 0) >= 80
        ? 'The business record is already strong. Keep it current whenever stock or contact details change.'
        : 'The business profile is improving, but more detail will make it easier for lenders and support teams to review.',
    analytics.creditPreview.note,
    analytics.lowStockCount > 0
        ? `${analytics.lowStockCount} stock lines are already at or below the reorder level.`
        : 'Tracked stock is currently above the reorder level.',
    analytics.readyDocuments < analytics.documentCount
        ? 'Finish the remaining business documents so the credit pack is complete before review.'
        : 'The document pack is ready enough for a lender or compliance check-in.',
].slice(0, 4);

const guestGateCopy = {
    title: 'Sign in or create an account to unlock the showcase details',
    description: 'LedgerLift Uganda helps teams onboard informal businesses, assess readiness for credit, and give business owners a workspace for stock, documents, and sales tracking. Detailed registry, registration, and workspace views stay locked until a user signs in, while credit and government pages remain available for read-only walkthroughs.',
    highlights: [
        'Capture onboarding records with optional TIN detail for future verification.',
        'Open role-based workspaces for field, lender, oversight, and business-owner stories.',
        'Move from a public product overview into the live showcase journey after access.',
    ],
};

const deriveBusiness = (record) => {
    const tinNumber = String(record.tin_number || '').trim();
    const ninNumber = String(record.nin_number || '').trim().toUpperCase();
    const isDemoAccount = Boolean(record.is_demo_account);
    const inventoryValueEstimate = toNumber(record.inventory_value_estimate);
    const averageMonthlyProfit = toNumber(record.average_monthly_profit);
    const averageMonthlyMobileMoney = toNumber(record.average_monthly_mobile_money);
    const receiptCount = Math.max(0, Number(record.receipt_count || 0));
    const receiptValueTotal = toNumber(record.receipt_value_total);
    const revenueBandMidpoint = revenueBandMidpoints[record.monthly_revenue_band] || Math.max(averageMonthlyMobileMoney + averageMonthlyProfit, inventoryValueEstimate, 2000000);
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

    const receiptCoverage = revenueBandMidpoint > 0
        ? Math.min(100, Math.round((receiptValueTotal / revenueBandMidpoint) * 100))
        : 0;
    const mobileMoneyCoverage = revenueBandMidpoint > 0
        ? Math.min(100, Math.round((averageMonthlyMobileMoney / revenueBandMidpoint) * 100))
        : 0;
    const receiptTrustScore = clampScoreValue((receiptCount * 6) + (receiptCoverage * 0.35) + (averageMonthlyMobileMoney > 0 ? 18 : 0));
    const consistencyScore = clampScoreValue((profileScore * 0.4) + (mobileMoneyCoverage * 0.25) + (receiptCoverage * 0.2) + (inventoryValueEstimate > 0 ? 10 : 0) + (averageMonthlyProfit > 0 ? 5 : 0));
    const creditScore = clampScoreValue((profileScore * 0.38) + (receiptTrustScore * 0.24) + (consistencyScore * 0.2) + (tinNumber ? 8 : 0) + (ninNumber ? 10 : 0));
    const creditLabel = creditScore >= 82
        ? 'Investor-ready'
        : creditScore >= 70
            ? 'Growth-ready'
            : creditScore >= 58
                ? 'Needs more evidence'
                : 'Early-stage';
    const fraudRiskLevel = consistencyScore >= 75 ? 'low' : consistencyScore >= 58 ? 'watch' : 'high';
    const ninVerificationStatus = ninNumber ? 'pending' : 'not_submitted';
    const ninVerificationStatusLabel = ninNumber ? 'Pending NIN review' : 'NIN not submitted';
    const creditRegistrationStatus = record.credit_registration_status || (creditScore >= 68 ? 'eligible' : 'not_started');
    const creditRegistrationStatusLabel = {
        not_started: 'Not started',
        eligible: 'Eligible for registration',
        submitted: 'Registration submitted',
        verified: 'Registration verified',
    }[creditRegistrationStatus] || 'Not started';
    const creditSignalGaps = [
        !tinNumber ? 'Add a TIN to keep the tax and compliance path open.' : '',
        !record.stock_focus ? 'Add a stock focus so the owner dashboard can explain what the business trades in.' : '',
        averageMonthlyMobileMoney <= 0 ? 'Capture monthly mobile money volume to improve the confidence of the score.' : '',
        receiptCount < 5 ? 'Add more receipt evidence so the business has a stronger operating trail.' : '',
    ].filter(Boolean);

    return {
        ...record,
        nin_number: ninNumber,
        tin_number: tinNumber,
        is_demo_account: isDemoAccount,
        profile_score: profileScore,
        profile_label: profileLabel,
        tax_lookup_status: taxLookupStatus,
        tax_lookup_status_label: taxLookupStatusLabel,
        inventory_value_estimate: inventoryValueEstimate,
        average_monthly_profit: averageMonthlyProfit,
        average_monthly_mobile_money: averageMonthlyMobileMoney,
        receipt_count: receiptCount,
        receipt_value_total: receiptValueTotal,
        receipt_trust_score: receiptTrustScore,
        consistency_score: consistencyScore,
        credit_score: creditScore,
        credit_label: creditLabel,
        fraud_risk_level: fraudRiskLevel,
        nin_verification_status: ninVerificationStatus,
        nin_verification_status_label: ninVerificationStatusLabel,
        credit_registration_status: creditRegistrationStatus,
        credit_registration_status_label: creditRegistrationStatusLabel,
        credit_readiness_score: clampScoreValue((profileScore * 0.55) + (receiptTrustScore * 0.2) + (consistencyScore * 0.25)),
        is_credit_ready: creditScore >= 68 && profileScore >= 65,
        credit_signal_gaps: creditSignalGaps,
        account_username: record.account_username || '',
        revenue_band_midpoint: revenueBandMidpoint,
        nin_verification_notes: ninNumber ? 'Front-end only registration waiting for backend verification.' : '',
        account_mode: isDemoAccount ? 'Demo' : 'Live',
        created_at: record.created_at || new Date().toISOString(),
        updated_at: record.updated_at || record.created_at || new Date().toISOString(),
    };
};

const getBusinesses = () => {
    const businessEdits = getStoredBusinessEdits();
    const combined = [...demoData.seededBusinesses, ...getStoredRegistrations()]
        .map((record) => deriveBusiness({
            ...record,
            ...(businessEdits[record.id] || {}),
        }))
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));

    return combined;
};

const getTopBusinesses = (businesses, limit = 3) => [...businesses]
    .sort((left, right) => (right.credit_score || right.profile_score) - (left.credit_score || left.profile_score))
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
    business_id: account.businessId || '',
    requires_tin: false,
    notes: account.note,
    recommended_page: {
        government: 'government',
        lender: 'credit',
        field_agent: 'registration',
        business_owner: 'workspace',
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
                <p class='text-muted mb-4'>Signed-in users can open the registry, registration tools, and the role workspace. Read-only credit and government pages stay available from the main navigation.</p>
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
                        <h2 class='h4 mb-1'>Sign in as an official or business owner</h2>
                        <p class='text-muted mb-0'>Use seeded credentials or the owner sign-up flow to open the right workspace story for the showcase.</p>
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
                        <h2 class='h4 mb-1'>Create a business owner account</h2>
                        <p class='text-muted mb-0'>This form creates the owner login and links it to a business profile so the user lands straight in the owner workspace.</p>
                    </div>
                    <span class='pill-note pill-note-success align-self-start'>Business owner access</span>
                </div>

                <form class='row g-3' data-register-form>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_display_name'>Display name</label>
                        <input class='form-control' id='register_display_name' name='display_name' type='text' placeholder='Amina Nankya' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_username'>Username</label>
                        <input class='form-control' id='register_username' name='username' type='text' placeholder='amina.owner' required>
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
                        <hr class='my-1'>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_business_name'>Business name</label>
                        <input class='form-control' id='register_business_name' name='business_name' type='text' placeholder='Amina Retail Hub' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_phone_number'>Phone number</label>
                        <input class='form-control' id='register_phone_number' name='phone_number' type='text' placeholder='+256700000000' required>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_mobile_money_number'>Mobile money number</label>
                        <input class='form-control' id='register_mobile_money_number' name='mobile_money_number' type='text' placeholder='Optional if same as phone number'>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_tin_number'>TIN number</label>
                        <input class='form-control' id='register_tin_number' name='tin_number' type='text' placeholder='Optional for now'>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_district'>District</label>
                        <select class='form-select' id='register_district' name='district' required>
                            <option value=''>Choose a district</option>
                            ${demoData.registrationForm.districts.map((district) => `<option value='${escapeHtml(district)}'>${escapeHtml(district)}</option>`).join('')}
                        </select>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_sector'>Business sector</label>
                        <select class='form-select' id='register_sector' name='sector' required>
                            <option value=''>Choose a sector</option>
                            ${demoData.registrationForm.sectors.map((sector) => `<option value='${escapeHtml(sector)}'>${escapeHtml(sector)}</option>`).join('')}
                        </select>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_monthly_revenue_band'>Monthly revenue band</label>
                        <select class='form-select' id='register_monthly_revenue_band' name='monthly_revenue_band'>
                            <option value=''>Select revenue band</option>
                            ${demoData.registrationForm.revenueBands.map((band) => `<option value='${escapeHtml(band)}'>${escapeHtml(band)}</option>`).join('')}
                        </select>
                    </div>
                    <div class='col-md-6'>
                        <label class='form-label' for='register_employee_count'>Employee count</label>
                        <input class='form-control' id='register_employee_count' name='employee_count' type='number' min='1' value='1'>
                    </div>
                    <div class='col-12'>
                        <label class='form-label' for='register_stock_focus'>Primary stock focus</label>
                        <input class='form-control' id='register_stock_focus' name='stock_focus' type='text' placeholder='Sugar, soap, beverages'>
                    </div>
                    <div class='col-12'>
                        <label class='form-label' for='register_location_description'>Location description</label>
                        <input class='form-control' id='register_location_description' name='location_description' type='text' placeholder='Trading center, market lane, or village cluster'>
                    </div>
                    <div class='col-12'>
                        <label class='form-label' for='register_notes'>Notes</label>
                        <textarea class='form-control' id='register_notes' name='notes' rows='3' placeholder='Add anything useful for the business owner workspace, such as supplier patterns or growth plans.'></textarea>
                    </div>
                    <div class='col-12'>
                        <div class='form-status' data-register-message></div>
                    </div>
                    <div class='col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center'>
                        <button class='btn btn-outline-success btn-lg px-4' type='submit'>Create owner account</button>
                        <small class='text-muted'>The new owner signs in immediately and lands in the business workspace with stock, graphs, documents, and credit tools.</small>
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
                <div class='business-card mb-3'>
                    <strong class='d-block mb-2'>Field agent</strong>
                    <p class='mb-0 text-muted'>Business onboarding, demo-mode registrations, and follow-up on incomplete profiles.</p>
                </div>
                <div class='business-card'>
                    <strong class='d-block mb-2'>Business owner</strong>
                    <p class='mb-0 text-muted'>Daily stock input, live business graphs, monthly sales reporting, documents, and front-end credit registration.</p>
                </div>
            </article>
        </div>
    </section>
`;

const ownerWorkspaceTemplate = (user, businesses) => {
    const business = getOwnerBusiness(user, businesses);

    if (!business) {
        return `
            <section class='row g-3'>
                <div class='col-lg-8'>
                    <article class='panel h-100'>
                        <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                            <div>
                                <p class='section-kicker mb-2'>Business owner workspace</p>
                                <h2 class='h3 mb-2'>No linked business profile yet</h2>
                                <p class='text-muted mb-0'>This owner account is signed in, but no business record is linked yet. Create the owner through the account form so the workspace has something to manage.</p>
                            </div>
                            <span class='pill-note pill-note-muted align-self-start'>Owner setup required</span>
                        </div>
                        <a class='btn btn-outline-success btn-sm' href='#login'>Create owner-linked account</a>
                    </article>
                </div>
            </section>
        `;
    }

    const ownerData = getOwnerWorkspaceData(business);
    const analytics = buildOwnerWorkspaceAnalytics(business, ownerData);
    const ownerNotes = buildOwnerGuidance(business, analytics);

    return `
        <section class='row g-3'>
            <div class='col-lg-8'>
                <article class='panel h-100'>
                    <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                        <div>
                            <p class='section-kicker mb-2'>Business owner workspace</p>
                            <h2 class='h3 mb-2'>${escapeHtml(business.business_name)}</h2>
                            <p class='text-muted mb-0'>Log daily stock, review live graphs, prepare a monthly report, and organize the documents and credit pack for the business.</p>
                        </div>
                        <span class='pill-note pill-note-success align-self-start'>Signed in as Business owner</span>
                    </div>

                    <div class='row g-3 mb-3'>
                        <div class='col-sm-6 col-xl-3'>
                            <div class='metric-tile h-100'>
                                <span class='section-kicker mb-2'>Stock lines tracked</span>
                                <strong>${escapeHtml(String(analytics.latestStock.length))}</strong>
                                <p class='text-muted mb-0'>${escapeHtml(String(analytics.lowStockCount))} below reorder level</p>
                            </div>
                        </div>
                        <div class='col-sm-6 col-xl-3'>
                            <div class='metric-tile h-100'>
                                <span class='section-kicker mb-2'>Sales this month</span>
                                <strong>${escapeHtml(formatCurrencyUGX(analytics.currentMonth.revenue))}</strong>
                                <p class='text-muted mb-0'>${escapeHtml(String(Math.round(toNumber(analytics.currentMonth.orders))))} ticketed units sold</p>
                            </div>
                        </div>
                        <div class='col-sm-6 col-xl-3'>
                            <div class='metric-tile h-100'>
                                <span class='section-kicker mb-2'>Document pack</span>
                                <strong>${escapeHtml(`${analytics.readyDocuments}/${analytics.documentCount}`)}</strong>
                                <p class='text-muted mb-0'>Ready or submitted business files</p>
                            </div>
                        </div>
                        <div class='col-sm-6 col-xl-3'>
                            <div class='metric-tile h-100'>
                                <span class='section-kicker mb-2'>Credit preview</span>
                                <strong>${escapeHtml(`${analytics.creditPreview.score}/100`)}</strong>
                                <p class='text-muted mb-0'>${escapeHtml(analytics.creditPreview.band)}</p>
                            </div>
                        </div>
                    </div>

                    <div class='row g-3'>
                        <div class='col-md-6'>
                            <div class='business-card action-card d-flex flex-column'>
                                <strong class='d-block mb-2'>View the wider registry</strong>
                                <p class='mb-3 text-muted'>Check how this business compares with the rest of the showcase portfolio.</p>
                                <a class='btn btn-outline-success btn-sm align-self-start' href='#businesses'>Open business registry</a>
                            </div>
                        </div>
                        <div class='col-md-6'>
                            <div class='business-card action-card d-flex flex-column'>
                                <strong class='d-block mb-2'>Open the credit story</strong>
                                <p class='mb-3 text-muted'>Use the credit page to explain how the owner pack will feed lender conversations.</p>
                                <a class='btn btn-outline-success btn-sm align-self-start' href='#credit'>Open credit page</a>
                            </div>
                        </div>
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
                        <div class='small mb-1'><strong>Linked business:</strong> ${escapeHtml(business.business_name)}</div>
                        <div class='small mb-1'><strong>NIN status:</strong> ${escapeHtml(business.nin_verification_status_label)}</div>
                        <div class='small mb-1'><strong>Credit registration:</strong> ${escapeHtml(business.credit_registration_status_label)}</div>
                        <div class='small mb-3'><strong>Last saved:</strong> ${escapeHtml(formatWorkspaceDate(business.updated_at))}</div>
                        <a class='btn btn-outline-success btn-sm' href='#businesses'>View my business profile</a>
                    </div>
                </article>

                <article class='panel'>
                    <p class='section-kicker mb-2'>Owner guidance</p>
                    <h2 class='h4 mb-3'>What to work on next</h2>
                    <div class='registration-feed'>
                        ${ownerNotes.map((note) => `<div class='feed-item'><p class='mb-0 text-muted'>${escapeHtml(note)}</p></div>`).join('')}
                    </div>
                </article>
            </div>

            <div class='col-xl-7'>
                <article class='panel owner-stock-panel h-100'>
                    <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                        <div>
                            <p class='section-kicker mb-2'>Daily stock input</p>
                            <h2 class='h4 mb-1'>Capture inventory movement day by day</h2>
                            <p class='text-muted mb-0'>Each entry refreshes the stock chart and updates the current monthly report.</p>
                        </div>
                        <span class='pill-note ${analytics.lowStockCount === 0 ? 'pill-note-success' : 'pill-note-danger'} align-self-start'>${analytics.lowStockCount === 0 ? 'Stock healthy' : `${analytics.lowStockCount} reorder alerts`}</span>
                    </div>
                    <div class='workspace-detail-grid mb-4'>
                        <div class='workspace-detail-item'><span>Tracked items</span><strong>${escapeHtml(String(analytics.latestStock.length))}</strong></div>
                        <div class='workspace-detail-item'><span>Units on hand</span><strong>${escapeHtml(String(Math.round(analytics.totalOnHand)))}</strong></div>
                        <div class='workspace-detail-item'><span>7-day sold</span><strong>${escapeHtml(String(Math.round(analytics.weeklyUnitsSold)))}</strong></div>
                        <div class='workspace-detail-item'><span>Receipt trust</span><strong>${escapeHtml(`${business.receipt_trust_score || 0}/100`)}</strong></div>
                    </div>
                    <form class='row g-3' data-owner-stock-form data-business-id='${escapeHtml(String(business.id))}'>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_stock_date'>Entry date</label>
                            <input class='form-control' id='owner_stock_date' name='date' type='date' value='${buildRelativeIsoDate(0)}' required>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_stock_item_name'>Stock item</label>
                            <input class='form-control' id='owner_stock_item_name' name='item_name' type='text' placeholder='Sugar, soap, cooking oil' required>
                        </div>
                        <div class='col-md-4'>
                            <label class='form-label' for='owner_stock_category'>Category</label>
                            <input class='form-control' id='owner_stock_category' name='category' type='text' value='${escapeHtml(business.sector || 'Retail')}'>
                        </div>
                        <div class='col-md-4'>
                            <label class='form-label' for='owner_stock_unit'>Unit</label>
                            <input class='form-control' id='owner_stock_unit' name='unit' type='text' value='units'>
                        </div>
                        <div class='col-md-4'>
                            <label class='form-label' for='owner_stock_selling_price'>Selling price per unit (UGX)</label>
                            <input class='form-control' id='owner_stock_selling_price' name='selling_price' type='number' min='0' step='100' value='${Math.max(2500, Math.round(Math.max(toNumber(business.average_monthly_profit) / 45, 2500) / 100) * 100)}'>
                        </div>
                        <div class='col-md-4'>
                            <label class='form-label' for='owner_stock_on_hand'>Current stock on hand</label>
                            <input class='form-control' id='owner_stock_on_hand' name='on_hand' type='number' min='0' value='0' required>
                        </div>
                        <div class='col-md-4'>
                            <label class='form-label' for='owner_stock_received'>Units received today</label>
                            <input class='form-control' id='owner_stock_received' name='received' type='number' min='0' value='0'>
                        </div>
                        <div class='col-md-4'>
                            <label class='form-label' for='owner_stock_sold'>Units sold today</label>
                            <input class='form-control' id='owner_stock_sold' name='sold' type='number' min='0' value='0'>
                        </div>
                        <div class='col-md-4'>
                            <label class='form-label' for='owner_stock_reorder_level'>Reorder level</label>
                            <input class='form-control' id='owner_stock_reorder_level' name='reorder_level' type='number' min='0' value='12'>
                        </div>
                        <div class='col-12'>
                            <div class='form-status' data-owner-stock-message></div>
                        </div>
                        <div class='col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center'>
                            <button class='btn btn-warning btn-lg px-4' type='submit'>Save stock entry</button>
                            <small class='text-muted'>This tracker is front-end only for now, but the graphs update immediately.</small>
                        </div>
                    </form>
                    <div class='table-responsive mt-4'>
                        <table class='table align-middle mb-0'>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Date</th>
                                    <th>On hand</th>
                                    <th>Sold</th>
                                    <th>Reorder</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(ownerData.stockEntries || []).slice(0, 6).map((entry) => `
                                    <tr>
                                        <td>
                                            <strong class='d-block'>${escapeHtml(entry.item_name || 'Unnamed item')}</strong>
                                            <span class='text-muted small'>${escapeHtml(entry.category || 'Retail')} · ${escapeHtml(entry.unit || 'units')}</span>
                                        </td>
                                        <td>${escapeHtml(formatWorkspaceDate(entry.date))}</td>
                                        <td>${escapeHtml(String(Math.round(toNumber(entry.on_hand))))}</td>
                                        <td>${escapeHtml(String(Math.round(toNumber(entry.sold))))}</td>
                                        <td>${escapeHtml(String(Math.round(toNumber(entry.reorder_level))))}</td>
                                        <td><span class='pill-note ${toNumber(entry.on_hand) <= toNumber(entry.reorder_level) ? 'pill-note-danger' : 'pill-note-success'}'>${toNumber(entry.on_hand) <= toNumber(entry.reorder_level) ? 'Reorder soon' : 'Healthy'}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>

            <div class='col-xl-5'>
                <article class='panel owner-report-panel h-100'>
                    <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                        <div>
                            <p class='section-kicker mb-2'>Live graphs and monthly report</p>
                            <h2 class='h4 mb-1'>Read business movement as you record it</h2>
                            <p class='text-muted mb-0'>Stock levels and sales trend are refreshed from the same owner workspace data.</p>
                        </div>
                        <span class='pill-note pill-note-muted align-self-start'>Front-end analytics</span>
                    </div>
                    <div class='chart-frame chart-frame-wide mb-4'>
                        <canvas id='ownerStockPositionChart'></canvas>
                    </div>
                    <div class='chart-frame chart-frame-tall mb-4'>
                        <canvas id='ownerSalesTrendChart'></canvas>
                    </div>
                    <div class='workspace-detail-grid'>
                        <div class='workspace-detail-item'><span>This month sales</span><strong>${escapeHtml(formatCurrencyUGX(analytics.currentMonth.revenue))}</strong></div>
                        <div class='workspace-detail-item'><span>This month orders</span><strong>${escapeHtml(String(Math.round(toNumber(analytics.currentMonth.orders))))}</strong></div>
                        <div class='workspace-detail-item'><span>6-month sales</span><strong>${escapeHtml(formatCurrencyUGX(analytics.totalRevenue))}</strong></div>
                        <div class='workspace-detail-item'><span>Average margin</span><strong>${escapeHtml(`${analytics.grossMargin}%`)}</strong></div>
                        <div class='workspace-detail-item'><span>Best month</span><strong>${escapeHtml(`${analytics.bestMonth.label} · ${formatCurrencyUGX(analytics.bestMonth.revenue)}`)}</strong></div>
                        <div class='workspace-detail-item'><span>Momentum</span><strong>${escapeHtml(formatSignedCurrencyUGX(analytics.salesMomentum))}</strong></div>
                    </div>
                    <div class='registration-feed mt-4'>
                        <div class='feed-item'><p class='mb-0 text-muted'>This week the workspace has tracked ${escapeHtml(String(Math.round(analytics.weeklyUnitsSold)))} units sold and ${escapeHtml(String(analytics.lowStockCount))} stock lines below the reorder threshold.</p></div>
                        <div class='feed-item'><p class='mb-0 text-muted'>Use the latest month graph before lender conversations so the business story stays current.</p></div>
                    </div>
                </article>
            </div>

            <div class='col-lg-6'>
                <article class='panel owner-document-panel h-100'>
                    <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                        <div>
                            <p class='section-kicker mb-2'>Business documents</p>
                            <h2 class='h4 mb-1'>Track the files needed for compliance and credit</h2>
                            <p class='text-muted mb-0'>Add references for licences, statements, and business papers so the owner pack feels complete.</p>
                        </div>
                        <span class='pill-note pill-note-muted align-self-start'>Front-end tracker</span>
                    </div>
                    <form class='row g-3' data-owner-document-form data-business-id='${escapeHtml(String(business.id))}'>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_document_name'>Document name</label>
                            <input class='form-control' id='owner_document_name' name='name' type='text' placeholder='Trading licence' required>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_document_type'>Document type</label>
                            <input class='form-control' id='owner_document_type' name='type' type='text' placeholder='Compliance, Finance, Tax'>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_document_reference'>Reference</label>
                            <input class='form-control' id='owner_document_reference' name='reference' type='text' placeholder='Reference number or note'>
                        </div>
                        <div class='col-md-3'>
                            <label class='form-label' for='owner_document_due_date'>Due date</label>
                            <input class='form-control' id='owner_document_due_date' name='due_date' type='date'>
                        </div>
                        <div class='col-md-3'>
                            <label class='form-label' for='owner_document_status'>Status</label>
                            <select class='form-select' id='owner_document_status' name='status'>
                                <option value='Pending'>Pending</option>
                                <option value='Ready'>Ready</option>
                                <option value='Submitted'>Submitted</option>
                            </select>
                        </div>
                        <div class='col-12'>
                            <div class='form-status' data-owner-document-message></div>
                        </div>
                        <div class='col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center'>
                            <button class='btn btn-outline-success btn-lg px-4' type='submit'>Add document reference</button>
                            <small class='text-muted'>This stores document metadata only. File uploads can be added when the backend is ready.</small>
                        </div>
                    </form>
                    <div class='registration-feed mt-4'>
                        ${(ownerData.documents || []).slice(0, 5).map((document) => `
                            <div class='feed-item'>
                                <div class='d-flex justify-content-between gap-3 mb-2'>
                                    <strong>${escapeHtml(document.name || 'Untitled document')}</strong>
                                    <span class='pill-note ${['ready', 'submitted', 'verified', 'active'].includes(String(document.status || '').toLowerCase()) ? 'pill-note-success' : 'pill-note-muted'}'>${escapeHtml(document.status || 'Pending')}</span>
                                </div>
                                <div class='text-muted small mb-1'>${escapeHtml(document.type || 'General')} · ${escapeHtml(document.reference || 'No reference yet')}</div>
                                <div class='text-muted small'>${document.due_date ? `Due ${escapeHtml(formatWorkspaceDate(document.due_date))}` : 'No due date recorded'}</div>
                            </div>
                        `).join('')}
                    </div>
                </article>
            </div>

            <div class='col-lg-6'>
                <article class='panel owner-credit-intake-panel h-100'>
                    <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                        <div>
                            <p class='section-kicker mb-2'>Credit score registration</p>
                            <h2 class='h4 mb-1'>Capture a front-end lender intake</h2>
                            <p class='text-muted mb-0'>This is a front-end only pre-check for now. It lets the owner build a working credit pack before backend underwriting arrives.</p>
                        </div>
                        <span class='pill-note pill-note-success align-self-start'>${escapeHtml(`${analytics.creditPreview.score}/100 preview`)}</span>
                    </div>
                    <div class='workspace-detail-grid mb-4'>
                        <div class='workspace-detail-item'><span>Credit band</span><strong>${escapeHtml(analytics.creditPreview.band)}</strong></div>
                        <div class='workspace-detail-item'><span>Document coverage</span><strong>${escapeHtml(`${analytics.creditPreview.documentCoverage}%`)}</strong></div>
                        <div class='workspace-detail-item'><span>Inventory discipline</span><strong>${escapeHtml(`${analytics.creditPreview.inventoryDiscipline}%`)}</strong></div>
                        <div class='workspace-detail-item'><span>Registration status</span><strong>${escapeHtml(business.credit_registration_status_label)}</strong></div>
                    </div>
                    <form class='row g-3' data-owner-credit-form data-business-id='${escapeHtml(String(business.id))}'>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_credit_nin_number'>Owner NIN</label>
                            <input class='form-control' id='owner_credit_nin_number' name='nin_number' type='text' maxlength='14' value='${escapeHtml(business.nin_number || '')}' placeholder='CM1234567890AB'>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_credit_requested_amount'>Requested amount (UGX)</label>
                            <input class='form-control' id='owner_credit_requested_amount' name='requested_amount' type='number' min='0' step='1000' value='${Math.round(toNumber(ownerData.creditProfile.requested_amount))}' required>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_credit_repayment_window'>Repayment window</label>
                            <input class='form-control' id='owner_credit_repayment_window' name='repayment_window' type='text' value='${escapeHtml(ownerData.creditProfile.repayment_window || '6 months')}'>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_credit_supplier_score'>Supplier confidence</label>
                            <input class='form-control' id='owner_credit_supplier_score' name='supplier_score' type='number' min='0' max='100' value='${clampScoreValue(ownerData.creditProfile.supplier_score)}'>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_credit_bookkeeping_score'>Bookkeeping score</label>
                            <input class='form-control' id='owner_credit_bookkeeping_score' name='bookkeeping_score' type='number' min='0' max='100' value='${clampScoreValue(ownerData.creditProfile.bookkeeping_score)}'>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_credit_loan_purpose'>Loan purpose</label>
                            <input class='form-control' id='owner_credit_loan_purpose' name='loan_purpose' type='text' value='${escapeHtml(ownerData.creditProfile.loan_purpose || '')}' placeholder='Expand stock depth, refrigeration, supplier payments'>
                        </div>
                        <div class='col-12'>
                            <label class='form-label' for='owner_credit_collateral_notes'>Collateral or supporting notes</label>
                            <textarea class='form-control' id='owner_credit_collateral_notes' name='collateral_notes' rows='3' placeholder='Inventory, guarantor, mobile-money trail, supplier support'>${escapeHtml(ownerData.creditProfile.collateral_notes || '')}</textarea>
                        </div>
                        <div class='col-12'>
                            <div class='form-status' data-owner-credit-message></div>
                        </div>
                        <div class='col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center'>
                            <button class='btn btn-warning btn-lg px-4' type='submit'>Save credit registration</button>
                            <small class='text-muted'>Saved only in this browser for now. Backend underwriting can plug into the same panel later.</small>
                        </div>
                    </form>
                    <div class='feed-item mt-4'>
                        <strong class='d-block mb-2'>Status note</strong>
                        <p class='mb-0 text-muted'>${escapeHtml(analytics.creditPreview.note)}</p>
                    </div>
                </article>
            </div>

            <div class='col-12'>
                <article class='panel owner-edit-panel h-100'>
                    <div class='d-flex flex-column flex-md-row justify-content-between gap-3 mb-3'>
                        <div>
                            <p class='section-kicker mb-2'>Owner adjustments</p>
                            <h2 class='h4 mb-1'>Update the linked business profile</h2>
                            <p class='text-muted mb-0'>Saved changes stay attached to this owner business in the showcase so the next sign-in starts from the latest state.</p>
                        </div>
                        <span class='pill-note pill-note-muted align-self-start'>Saved to showcase storage</span>
                    </div>
                    <form class='row g-3' data-owner-business-form data-business-id='${escapeHtml(String(business.id))}'>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_business_name'>Business name</label>
                            <input class='form-control' id='owner_business_name' name='business_name' type='text' value='${escapeHtml(business.business_name || '')}' required>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_phone_number'>Phone number</label>
                            <input class='form-control' id='owner_phone_number' name='phone_number' type='text' value='${escapeHtml(business.phone_number || '')}' required>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_mobile_money_number'>Mobile money number</label>
                            <input class='form-control' id='owner_mobile_money_number' name='mobile_money_number' type='text' value='${escapeHtml(business.mobile_money_number || '')}'>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_tin_number'>TIN number</label>
                            <input class='form-control' id='owner_tin_number' name='tin_number' type='text' value='${escapeHtml(business.tin_number || '')}'>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_district'>District</label>
                            <input class='form-control' id='owner_district' name='district' type='text' value='${escapeHtml(business.district || '')}' required>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_sector'>Business sector</label>
                            <input class='form-control' id='owner_sector' name='sector' type='text' value='${escapeHtml(business.sector || '')}' required>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_monthly_revenue_band'>Monthly revenue band</label>
                            <input class='form-control' id='owner_monthly_revenue_band' name='monthly_revenue_band' type='text' value='${escapeHtml(business.monthly_revenue_band || '')}' placeholder='UGX 3M - 6M'>
                        </div>
                        <div class='col-md-6'>
                            <label class='form-label' for='owner_employee_count'>Employee count</label>
                            <input class='form-control' id='owner_employee_count' name='employee_count' type='number' min='1' value='${Math.max(1, Number(business.employee_count || 1))}'>
                        </div>
                        <div class='col-12'>
                            <label class='form-label' for='owner_location_description'>Location description</label>
                            <input class='form-control' id='owner_location_description' name='location_description' type='text' value='${escapeHtml(business.location_description || '')}' placeholder='Trading center or market location'>
                        </div>
                        <div class='col-12'>
                            <label class='form-label' for='owner_stock_focus'>Stock focus</label>
                            <input class='form-control' id='owner_stock_focus' name='stock_focus' type='text' value='${escapeHtml(business.stock_focus || '')}' placeholder='Fast-moving goods, groceries, household goods'>
                        </div>
                        <div class='col-12'>
                            <label class='form-label' for='owner_notes'>Operating notes</label>
                            <textarea class='form-control' id='owner_notes' name='notes' rows='3' placeholder='Add useful operating notes for your next workspace session.'>${escapeHtml(business.notes || '')}</textarea>
                        </div>
                        <div class='col-12'>
                            <div class='form-status' data-owner-business-message></div>
                        </div>
                        <div class='col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center'>
                            <button class='btn btn-outline-success btn-lg px-4' type='submit'>Save business adjustments</button>
                            <small class='text-muted'>These changes stay with the owner-linked business record in the browser-backed showcase.</small>
                        </div>
                    </form>
                </article>
            </div>
        </section>
    `;
};

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

    if (session.user.role === 'business_owner') {
        return ownerWorkspaceTemplate(session.user, businesses);
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
        const businessName = String(formData.get('business_name') || '').trim();
        const phoneNumber = String(formData.get('phone_number') || '').trim();
        const mobileMoneyNumber = String(formData.get('mobile_money_number') || '').trim();
        const tinNumber = String(formData.get('tin_number') || '').trim();
        const district = String(formData.get('district') || '').trim();
        const sector = String(formData.get('sector') || '').trim();
        const monthlyRevenueBand = String(formData.get('monthly_revenue_band') || '').trim();
        const employeeCount = Math.max(1, Number(formData.get('employee_count') || 1));
        const stockFocus = String(formData.get('stock_focus') || '').trim();
        const locationDescription = String(formData.get('location_description') || '').trim();
        const notes = String(formData.get('notes') || '').trim();

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

        if (!businessName || !phoneNumber || !district || !sector) {
            showFormMessage('[data-register-message]', 'error', 'Business name, phone number, district, and sector are required for the owner workspace.');
            return;
        }

        const businessId = `browser-owner-${Date.now()}`;
        const timestamp = new Date().toISOString();
        const account = {
            displayName,
            username,
            password,
            role: 'business_owner',
            roleLabel: 'Business owner',
            note: 'Self-created owner showcase account.',
            businessId,
        };

        const business = {
            id: businessId,
            business_name: businessName,
            owner_name: displayName,
            phone_number: phoneNumber,
            mobile_money_number: mobileMoneyNumber,
            tin_number: tinNumber,
            district,
            sector,
            monthly_revenue_band: monthlyRevenueBand,
            employee_count: employeeCount,
            stock_focus: stockFocus,
            location_description: locationDescription,
            notes,
            is_demo_account: false,
            account_username: username,
            created_at: timestamp,
            updated_at: timestamp,
        };

        const storedAccounts = getStoredAccounts();
        storedAccounts.unshift(account);
        saveStoredAccounts(storedAccounts);
        const registrations = getStoredRegistrations();
        registrations.unshift(business);
        saveStoredRegistrations(registrations);
        saveSession(buildSessionUser(account));
        setFlash('workspace', 'success', `Account created for ${displayName}.`);
        setCurrentPage('workspace');
    });
};

const bindOwnerWorkspace = (session, businesses) => {
    if (!session?.user || session.user.role !== 'business_owner') {
        return;
    }

    const business = getOwnerBusiness(session.user, businesses);

    if (!business) {
        return;
    }

    const businessForm = document.querySelector('[data-owner-business-form]');
    const stockForm = document.querySelector('[data-owner-stock-form]');
    const documentForm = document.querySelector('[data-owner-document-form]');
    const creditForm = document.querySelector('[data-owner-credit-form]');

    if (businessForm && businessForm.dataset.bound !== 'true') {
        businessForm.dataset.bound = 'true';
        businessForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(businessForm);
            const businessName = String(formData.get('business_name') || '').trim();
            const phoneNumber = String(formData.get('phone_number') || '').trim();
            const district = String(formData.get('district') || '').trim();
            const sector = String(formData.get('sector') || '').trim();

            if (!businessName || !phoneNumber || !district || !sector) {
                showFormMessage('[data-owner-business-message]', 'error', 'Business name, phone number, district, and sector are required.');
                return;
            }

            saveBusinessEdit(business.id, {
                business_name: businessName,
                owner_name: business.owner_name || session.user.display_name,
                phone_number: phoneNumber,
                mobile_money_number: String(formData.get('mobile_money_number') || '').trim(),
                tin_number: String(formData.get('tin_number') || '').trim(),
                district,
                sector,
                monthly_revenue_band: String(formData.get('monthly_revenue_band') || '').trim(),
                employee_count: Math.max(1, Number(formData.get('employee_count') || 1)),
                location_description: String(formData.get('location_description') || '').trim(),
                stock_focus: String(formData.get('stock_focus') || '').trim(),
                notes: String(formData.get('notes') || '').trim(),
            });

            renderApp();
            showFormMessage('[data-owner-business-message]', 'success', 'Business profile updated.');
        });
    }

    if (stockForm && stockForm.dataset.bound !== 'true') {
        stockForm.dataset.bound = 'true';
        stockForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(stockForm);
            const itemName = String(formData.get('item_name') || '').trim();

            if (!itemName) {
                showFormMessage('[data-owner-stock-message]', 'error', 'Add the stock item name before saving the entry.');
                return;
            }

            const sold = Math.max(0, Math.round(toNumber(formData.get('sold'))));
            const sellingPrice = Math.max(0, toNumber(formData.get('selling_price')));

            updateOwnerWorkspaceData(business, (current) => {
                const monthlySales = [...(current.monthlySales || [])];

                if (monthlySales.length > 0) {
                    const lastIndex = monthlySales.length - 1;
                    const currentMonth = monthlySales[lastIndex];
                    monthlySales[lastIndex] = {
                        ...currentMonth,
                        revenue: Math.round(toNumber(currentMonth.revenue) + (sold * sellingPrice)),
                        orders: Math.round(toNumber(currentMonth.orders) + sold),
                    };
                }

                return {
                    ...current,
                    stockEntries: [
                        {
                            id: `stock-${Date.now()}`,
                            date: String(formData.get('date') || buildRelativeIsoDate(0)).trim(),
                            item_name: itemName,
                            category: String(formData.get('category') || '').trim() || business.sector || 'Retail',
                            unit: String(formData.get('unit') || '').trim() || 'units',
                            on_hand: Math.max(0, Math.round(toNumber(formData.get('on_hand')))),
                            received: Math.max(0, Math.round(toNumber(formData.get('received')))),
                            sold,
                            reorder_level: Math.max(0, Math.round(toNumber(formData.get('reorder_level')))),
                            selling_price: sellingPrice,
                        },
                        ...(current.stockEntries || []),
                    ].slice(0, 24),
                    monthlySales,
                };
            });

            renderApp();
            showFormMessage('[data-owner-stock-message]', 'success', 'Stock entry saved and the owner charts were refreshed.');
        });
    }

    if (documentForm && documentForm.dataset.bound !== 'true') {
        documentForm.dataset.bound = 'true';
        documentForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(documentForm);
            const name = String(formData.get('name') || '').trim();

            if (!name) {
                showFormMessage('[data-owner-document-message]', 'error', 'Document name is required.');
                return;
            }

            updateOwnerWorkspaceData(business, (current) => ({
                ...current,
                documents: [
                    {
                        id: `doc-${Date.now()}`,
                        name,
                        type: String(formData.get('type') || '').trim() || 'General',
                        reference: String(formData.get('reference') || '').trim(),
                        due_date: String(formData.get('due_date') || '').trim(),
                        status: String(formData.get('status') || '').trim() || 'Pending',
                    },
                    ...(current.documents || []),
                ].slice(0, 10),
            }));

            renderApp();
            showFormMessage('[data-owner-document-message]', 'success', 'Document tracker updated.');
        });
    }

    if (creditForm && creditForm.dataset.bound !== 'true') {
        creditForm.dataset.bound = 'true';
        creditForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(creditForm);
            const requestedAmount = Math.max(0, Math.round(toNumber(formData.get('requested_amount'))));

            if (requestedAmount <= 0) {
                showFormMessage('[data-owner-credit-message]', 'error', 'Requested amount must be greater than zero.');
                return;
            }

            const ninNumber = String(formData.get('nin_number') || '').trim().toUpperCase();
            const registrationStatus = ninNumber
                ? 'submitted'
                : business.is_credit_ready ? 'eligible' : 'not_started';

            saveBusinessEdit(business.id, {
                nin_number: ninNumber,
                credit_registration_status: registrationStatus,
                credit_registration_reference: ninNumber ? `LL-${String(Date.now()).slice(-6)}` : '',
                credit_registration_submitted_at: ninNumber ? new Date().toISOString() : '',
            });

            updateOwnerWorkspaceData(business, (current) => ({
                ...current,
                creditProfile: {
                    ...(current.creditProfile || {}),
                    requested_amount: requestedAmount,
                    repayment_window: String(formData.get('repayment_window') || '').trim() || '6 months',
                    supplier_score: clampScoreValue(formData.get('supplier_score')),
                    bookkeeping_score: clampScoreValue(formData.get('bookkeeping_score')),
                    loan_purpose: String(formData.get('loan_purpose') || '').trim(),
                    collateral_notes: String(formData.get('collateral_notes') || '').trim(),
                    registration_status: 'Front-end intake updated',
                },
            }));

            renderApp();
            showFormMessage('[data-owner-credit-message]', 'success', 'Credit registration draft saved and the owner score was recalculated.');
        });
    }
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

const bindSidebarNavigation = () => {
    const sidebarElement = document.querySelector('#demoSidebar');

    if (!sidebarElement || !window.bootstrap?.Offcanvas) {
        return;
    }

    const sidebar = bootstrap.Offcanvas.getOrCreateInstance(sidebarElement);

    sidebarElement.querySelectorAll('[data-nav-link]').forEach((link) => {
        if (link.dataset.sidebarBound === 'true') {
            return;
        }

        link.dataset.sidebarBound = 'true';
        link.addEventListener('click', () => {
            sidebar.hide();
        });
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

const initCharts = (page, session, businesses) => {
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

    if (page === 'workspace' && session?.user?.role === 'business_owner') {
        const business = getOwnerBusiness(session.user, businesses);

        if (!business) {
            return;
        }

        const ownerData = getOwnerWorkspaceData(business);
        const analytics = buildOwnerWorkspaceAnalytics(business, ownerData);

        if (analytics.latestStock.length > 0) {
            createChart('ownerStockPositionChart', {
                type: 'bar',
                data: {
                    labels: analytics.latestStock.map((entry) => entry.item_name),
                    datasets: [
                        {
                            label: 'Stock on hand',
                            data: analytics.latestStock.map((entry) => toNumber(entry.on_hand)),
                            backgroundColor: palette.forest,
                            borderRadius: 8,
                            maxBarThickness: 42,
                        },
                        {
                            label: 'Reorder level',
                            data: analytics.latestStock.map((entry) => toNumber(entry.reorder_level)),
                            backgroundColor: palette.amber,
                            borderRadius: 8,
                            maxBarThickness: 42,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true, grid: { color: palette.grid } },
                    },
                },
            });
        }

        if ((ownerData.monthlySales || []).length > 0) {
            createChart('ownerSalesTrendChart', {
                type: 'line',
                data: {
                    labels: ownerData.monthlySales.map((entry) => entry.label),
                    datasets: [
                        {
                            label: 'Revenue',
                            data: ownerData.monthlySales.map((entry) => toNumber(entry.revenue)),
                            borderColor: palette.forest,
                            backgroundColor: palette.forestSoft,
                            borderWidth: 3,
                            tension: 0.35,
                            fill: true,
                        },
                        {
                            label: 'Expenses',
                            data: ownerData.monthlySales.map((entry) => toNumber(entry.expenses)),
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
                            ticks: {
                                callback: (value) => `UGX ${Math.round(toNumber(value) / 1000000)}M`,
                            },
                        },
                    },
                },
            });
        }
    }
};

const renderApp = () => {
    const session = getSession();
    const page = getCurrentPage();
    const businesses = getBusinesses();
    const root = document.querySelector('[data-page-root]');

    if (!session?.user && !publicPages.has(page)) {
        setCurrentPage('dashboard');
        return;
    }

    if (session?.user?.role === 'business_owner' && page === 'registration') {
        setCurrentPage('workspace');
        return;
    }

    updateHero(page, session);
    updateNavigation(page, session);
    bindShellActions();
    bindSidebarNavigation();

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

    if (page === 'workspace' && session?.user?.role === 'business_owner') {
        bindOwnerWorkspace(session, businesses);
    }

    if (session?.user) {
        initCharts(page, session, businesses);
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