const appData = window.finTrackData || {};

if (window.Chart) {
    Chart.defaults.font.family = "'Public Sans', sans-serif";
    Chart.defaults.color = '#645346';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 10;
}

const palette = {
    forest: '#111111',
    forestSoft: 'rgba(17, 17, 17, 0.12)',
    sage: '#c81f25',
    amber: '#f4d017',
    amberSoft: 'rgba(244, 208, 23, 0.22)',
    clay: '#d32228',
    grid: 'rgba(17, 17, 17, 0.1)',
};

const createChart = (id, configuration) => {
    const element = document.getElementById(id);

    if (!element || !window.Chart) {
        return null;
    }

    return new Chart(element, configuration);
};

const initializeCharts = () => {
    createChart('revenueTrendChart', {
        type: 'line',
        data: {
            labels: appData.collections?.labels || [],
            datasets: [
                {
                    label: 'Mobile money volume',
                    data: appData.collections?.mobileMoney || [],
                    borderColor: palette.forest,
                    backgroundColor: palette.forestSoft,
                    borderWidth: 3,
                    tension: 0.35,
                    fill: true,
                },
                {
                    label: 'Cash volume',
                    data: appData.collections?.cash || [],
                    borderColor: palette.amber,
                    backgroundColor: palette.amberSoft,
                    borderWidth: 2,
                    tension: 0.35,
                    fill: false,
                },
                {
                    label: 'Supplier payments',
                    data: appData.collections?.supplierPayments || [],
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
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: palette.grid,
                    },
                    ticks: {
                        callback: (value) => `UGX ${value}M`,
                    },
                },
            },
        },
    });

    createChart('inventoryMixChart', {
        type: 'doughnut',
        data: {
            labels: appData.inventoryMix?.labels || [],
            datasets: [
                {
                    data: appData.inventoryMix?.values || [],
                    backgroundColor: [palette.forest, palette.amber, palette.sage, palette.clay],
                    borderWidth: 0,
                    hoverOffset: 6,
                },
            ],
        },
        options: {
            cutout: '64%',
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

    createChart('repaymentTrendChart', {
        type: 'line',
        data: {
            labels: appData.scoreTrend?.labels || [],
            datasets: [
                {
                    label: 'Average credit readiness',
                    data: appData.scoreTrend?.values || [],
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
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    min: 50,
                    max: 85,
                    grid: {
                        color: palette.grid,
                    },
                },
            },
        },
    });

    createChart('districtScoreChart', {
        type: 'bar',
        data: {
            labels: appData.districtPerformance?.labels || [],
            datasets: [
                {
                    label: 'Average score',
                    data: appData.districtPerformance?.scores || [],
                    backgroundColor: [palette.forest, palette.sage, palette.amber, palette.clay, palette.forest],
                    borderRadius: 12,
                    maxBarThickness: 48,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: palette.grid,
                    },
                },
            },
        },
    });
};

const currentPage = document.body.dataset.page || 'dashboard';
const mainContent = document.querySelector('main');
const searchInput = document.querySelector('[data-business-search]');
const businessCounter = document.querySelector('[data-business-count]');
const emptyState = document.querySelector('[data-business-empty]');
const businessList = document.querySelector('[data-business-list]');
const businessSyncStatus = document.querySelector('[data-business-sync-status]');
const topBusinesses = document.querySelector('[data-top-businesses]');
const registrationForm = document.querySelector('[data-registration-form]');
const registrationMessage = document.querySelector('[data-registration-message]');
const serviceStatus = document.querySelector('[data-service-status]');
const registrationFeed = document.querySelector('[data-registration-feed]');
const submitButton = document.querySelector('[data-submit-button]');
const demoToggle = document.querySelector('[data-demo-toggle]');
const demoNote = document.querySelector('[data-demo-note]');
const loginForm = document.querySelector('[data-login-form]');
const loginMessage = document.querySelector('[data-login-message]');
const loginSubmit = document.querySelector('[data-login-submit]');
const registerForm = document.querySelector('[data-register-form]');
const registerMessage = document.querySelector('[data-register-message]');
const registerSubmit = document.querySelector('[data-register-submit]');
const demoCredentialButtons = Array.from(document.querySelectorAll('[data-demo-credential]'));
const authStatus = document.querySelector('[data-auth-status]');
const loginLink = document.querySelector('[data-login-link]');
const workspaceLink = document.querySelector('[data-workspace-link]');
const logoutButton = document.querySelector('[data-logout-button]');
const workspaceContainer = document.querySelector('[data-role-workspace]');
const workspaceTitle = document.querySelector('[data-workspace-title]');
const workspaceDescription = document.querySelector('[data-workspace-description]');
const authSessionStatus = document.querySelector('[data-auth-session-status]');
const roleMetrics = document.querySelector('[data-role-metrics]');
const roleActions = document.querySelector('[data-role-actions]');
const currentUserCard = document.querySelector('[data-current-user-card]');
const roleNotes = document.querySelector('[data-role-notes]');
const dashboardPrimaryCta = document.querySelector('[data-dashboard-primary-cta]');
const dashboardSecondaryCta = document.querySelector('[data-dashboard-secondary-cta]');
const creditLiveMetrics = document.querySelector('[data-credit-live-metrics]');
const creditShortlist = document.querySelector('[data-credit-shortlist]');
const creditRegistrationContent = document.querySelector('[data-credit-registration-content]');
const governmentCategories = document.querySelector('[data-government-categories]');
const governmentDistrictCount = document.querySelector('[data-government-district-count]');
const governmentDistrictTable = document.querySelector('[data-government-district-table]');
const governmentInterventions = document.querySelector('[data-government-interventions]');

const isLocalFrontend = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const configuredApiBaseUrl = (appData.apiBaseUrl || 'http://127.0.0.1:8001/api').replace(/\/$/, '');
// Keep local frontends pointed at a stable service address even when the frontend port changes.
const localApiBaseUrl = 'http://127.0.0.1:8001/api';
const apiBaseUrl = isLocalFrontend ? localApiBaseUrl : configuredApiBaseUrl;
const authStorageKey = 'ledgerlift.auth.session';
const publicPages = new Set(['dashboard', 'login', 'credit', 'government']);
const officialRoles = new Set(['government', 'lender', 'field_agent']);
let ownerWorkspaceCharts = [];
const ugxFormatter = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
});

const roleBlueprints = {
    government: {
        workspaceTitle: 'Government oversight workspace',
        workspaceDescription: 'Prioritize districts, track TIN-ready businesses, and decide where onboarding and financing support should go next.',
        notes: [
            'Focus on TIN-ready businesses when preparing a government support shortlist.',
            'Use only authenticated live records when preparing policy reporting and support shortlists.',
            'Watch districts with low profile scores because they need field support before lender rollout.',
        ],
        actions: [
            { title: 'Review government signals', detail: 'Open the district-level policy view and check which areas need support first.', href: '?page=government', cta: 'Open government view' },
            { title: 'Check live registry quality', detail: 'Scan new registrations and spot missing TINs or incomplete profile data.', href: '?page=businesses', cta: 'Open business registry' },
        ],
    },
    lender: {
        workspaceTitle: 'Lender partner workspace',
        workspaceDescription: 'Find businesses with strong digital evidence and identify the first cohort for small working-capital products.',
        notes: [
            'Use strong profile scores as an initial filter before introducing real underwriting logic.',
            'TIN-ready profiles are better candidates for formal loan pipelines.',
            'Exclude high-risk or weakly evidenced profiles until the operating data improves.',
        ],
        actions: [
            { title: 'Inspect credit view', detail: 'Use the credit engine page to explain the scoring logic behind the MVP.', href: '?page=credit', cta: 'Open credit engine' },
            { title: 'Review best live profiles', detail: 'Open the live registry and focus on businesses with the strongest completeness scores.', href: '?page=businesses', cta: 'Open business registry' },
        ],
    },
    field_agent: {
        workspaceTitle: 'Field agent workspace',
        workspaceDescription: 'Register new shops quickly, keep the captured data accurate, and follow up on incomplete business profiles.',
        notes: [
            'TIN is still optional for the MVP, but complete tax and identity details make the record more useful later.',
            'Collect mobile money numbers and revenue bands early because they improve the profile score quickly.',
            'Review recent live registrations daily and close the biggest completeness gaps first.',
        ],
        actions: [
            { title: 'Register a new shop', detail: 'Open the onboarding flow and capture the next business into the pilot.', href: '?page=registration', cta: 'Open registration' },
            { title: 'Review incomplete profiles', detail: 'Use the live registry to identify businesses that still need TIN or revenue details.', href: '?page=businesses', cta: 'Open business registry' },
        ],
    },
    business_owner: {
        workspaceTitle: 'Business owner workspace',
        workspaceDescription: 'Track your linked business profile, review how complete the record is, and save adjustments that stay with your account.',
        notes: [
            'Keep contact numbers, revenue band, and stock focus current so your business profile stays useful between sessions.',
            'Add location and operating notes whenever something changes in the business so future reviews use accurate information.',
            'Saved adjustments are written back to your linked business profile and will be available the next time you sign in.',
        ],
        actions: [],
    },
};

const guestGateCopy = {
    title: 'Sign in or create an account to unlock the live platform',
    description: 'LedgerLift Uganda helps officials review business readiness and gives business owners a private workspace for their own linked account. Live registry views, registration tools, and owner workspaces stay locked until a user signs in.',
    highlights: [
        'Business onboarding with optional TIN capture for evolving tax verification.',
        'Credit-readiness signals built from payment history, stock detail, and record quality.',
        'Separate official and business-owner workspaces once the user signs in.',
    ],
};

const getStoredSession = () => {
    try {
        const raw = window.localStorage.getItem(authStorageKey);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
};

const storeSession = (user) => {
    window.localStorage.setItem(authStorageKey, JSON.stringify({ user }));
};

const clearSession = () => {
    window.localStorage.removeItem(authStorageKey);
};

const setStatusChip = (element, message, tone = 'muted') => {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `pill-note pill-note-${tone} align-self-start`;
};

const formatTaxStatus = (value) => String(value || '').replace(/_/g, ' ');

const getBusinessRows = () => Array.from(document.querySelectorAll('[data-business-row]'));

const updateBusinessEmptyState = (visibleCount) => {
    if (businessCounter) {
        businessCounter.textContent = String(visibleCount);
    }

    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
};

const filterBusinessRows = () => {
    const rows = getBusinessRows();

    if (!searchInput || rows.length === 0) {
        updateBusinessEmptyState(rows.length);
        return;
    }

    const query = searchInput.value.trim().toLowerCase();
    let visibleRows = 0;

    rows.forEach((row) => {
        const matches = (row.dataset.search || '').includes(query);
        row.classList.toggle('d-none', !matches);

        if (matches) {
            visibleRows += 1;
        }
    });

    updateBusinessEmptyState(visibleRows);
};

const updateAuthNavigation = (session) => {
    const user = session?.user || null;

    document.body.classList.toggle('is-authenticated', Boolean(user));

    if (authStatus) {
        authStatus.textContent = user ? `${user.display_name} · ${user.role_label}` : '';
        authStatus.classList.toggle('d-none', !user);
    }

    if (loginLink) {
        loginLink.classList.toggle('d-none', Boolean(user));
    }

    if (workspaceLink) {
        workspaceLink.classList.toggle('d-none', !user);
    }

    if (logoutButton) {
        logoutButton.classList.toggle('d-none', !user);
    }
};

const renderGuestAccessWall = () => {
    if (!mainContent) {
        return;
    }

    mainContent.innerHTML = `
        <section class="row g-4">
            <div class="col-xl-8">
                <article class="panel h-100">
                    <p class="section-kicker mb-2">Platform overview</p>
                    <h2 class="h3 mb-3">${guestGateCopy.title}</h2>
                    <p class="text-muted mb-4">${guestGateCopy.description}</p>
                    <div class="registration-feed">
                        ${guestGateCopy.highlights
                            .map((highlight) => `
                                <div class="feed-item">
                                    <strong class="d-block mb-2">What you unlock after access</strong>
                                    <p class="mb-0 text-muted">${highlight}</p>
                                </div>
                            `)
                            .join('')}
                    </div>
                </article>
            </div>
            <div class="col-xl-4">
                <article class="panel h-100">
                    <p class="section-kicker mb-2">Next step</p>
                    <h2 class="h4 mb-3">Continue with account access</h2>
                    <p class="text-muted mb-4">Signed-in users can open the live registry, registration tools, and the role workspace. Read-only credit and government pages stay available from the main navigation.</p>
                    <div class="d-grid gap-3">
                        <a class="btn btn-warning btn-lg" href="?page=login">Log in</a>
                        <a class="btn btn-outline-success btn-lg" href="?page=login#register-account">Create account</a>
                    </div>
                </article>
            </div>
        </section>
    `;
};

const updateDashboardHeroActions = (session) => {
    if (!dashboardPrimaryCta || !dashboardSecondaryCta) {
        return;
    }

    if (session?.user) {
        if (session.user.role === 'business_owner') {
            dashboardPrimaryCta.textContent = 'Open my workspace';
            dashboardPrimaryCta.href = '?page=workspace';
            dashboardSecondaryCta.textContent = 'View my business profile';
            dashboardSecondaryCta.href = '?page=businesses';
            return;
        }

        dashboardPrimaryCta.textContent = 'Register business';
        dashboardPrimaryCta.href = '?page=registration';
        dashboardSecondaryCta.textContent = 'Review businesses';
        dashboardSecondaryCta.href = '?page=businesses';
        return;
    }

    dashboardPrimaryCta.textContent = 'Log in';
    dashboardPrimaryCta.href = '?page=login';
    dashboardSecondaryCta.textContent = 'Create account';
    dashboardSecondaryCta.href = '?page=login#register-account';
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

const toNumber = (value) => {
    const parsed = Number.parseFloat(String(value ?? '0').replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
};

const averageRounded = (values) => values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;

const formatCurrencyUGX = (value) => ugxFormatter.format(toNumber(value));

const formatSignedCurrencyUGX = (value) => {
    const numericValue = toNumber(value);
    return `${numericValue >= 0 ? '+' : '-'}${formatCurrencyUGX(Math.abs(numericValue))}`;
};

const escapeMarkup = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clampScoreValue = (value) => Math.max(0, Math.min(100, Math.round(toNumber(value))));

const averageValue = (values) => values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

const buildRelativeIsoDate = (daysAgo = 0) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
};

const formatMonthLabel = (value) => {
    const parsed = new Date(`${String(value || '').trim()}T00:00:00`);
    return Number.isNaN(parsed.getTime())
        ? String(value || '').trim()
        : parsed.toLocaleDateString(undefined, { month: 'short' });
};

const getOwnerWorkspaceItems = (business) => {
    const parsedItems = String(business?.stock_focus || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return parsedItems.length ? parsedItems : ['core stock'];
};

const buildOwnerDefaultCreditProfile = (business) => ({
    requested_amount: '0.00',
    loan_purpose: `Increase ${getOwnerWorkspaceItems(business)[0].toLowerCase()} stock depth`,
    repayment_window: '',
    bookkeeping_score: clampScoreValue(business?.receipt_trust_score || 0),
    supplier_score: clampScoreValue(business?.consistency_score || 0),
    collateral_notes: '',
    registration_status: '',
    updated_at: '',
});

const normalizeOwnerWorkspaceData = (business) => {
    const workspace = business?.workspace && typeof business.workspace === 'object'
        ? business.workspace
        : {};
    const defaultCreditProfile = buildOwnerDefaultCreditProfile(business);
    const stockEntries = Array.isArray(workspace.stock_entries)
        ? workspace.stock_entries.map((entry) => ({
            id: String(entry.id || '').trim(),
            date: String(entry.date || '').trim(),
            item_name: String(entry.item_name || '').trim(),
            category: String(entry.category || '').trim(),
            unit: String(entry.unit || '').trim() || 'units',
            on_hand: Math.max(0, Math.round(toNumber(entry.on_hand))),
            received: Math.max(0, Math.round(toNumber(entry.received))),
            sold: Math.max(0, Math.round(toNumber(entry.sold))),
            reorder_level: Math.max(0, Math.round(toNumber(entry.reorder_level))),
            selling_price: toNumber(entry.selling_price),
        }))
        : [];
    const monthlySales = Array.isArray(workspace.monthly_sales)
        ? workspace.monthly_sales
            .map((entry) => ({
                id: String(entry.id || '').trim(),
                month_start: String(entry.month_start || '').trim(),
                label: String(entry.label || '').trim() || formatMonthLabel(entry.month_start),
                revenue: toNumber(entry.revenue),
                expenses: toNumber(entry.expenses),
                orders: Math.max(0, Math.round(toNumber(entry.orders))),
                mobile_money: toNumber(entry.mobile_money),
                cash_sales: toNumber(entry.cash_sales),
                supplier_payments: toNumber(entry.supplier_payments),
                readiness_score: clampScoreValue(entry.readiness_score),
            }))
            .sort((left, right) => String(left.month_start || '').localeCompare(String(right.month_start || '')))
        : [];
    const documents = Array.isArray(workspace.documents)
        ? workspace.documents.map((entry) => ({
            id: String(entry.id || '').trim(),
            name: String(entry.name || '').trim(),
            type: String(entry.type || '').trim(),
            reference: String(entry.reference || '').trim(),
            due_date: String(entry.due_date || '').trim(),
            status: String(entry.status || '').trim() || 'Pending',
        }))
        : [];
    const creditDraft = workspace.credit_draft && typeof workspace.credit_draft === 'object'
        ? workspace.credit_draft
        : {};

    return {
        stockEntries: stockEntries.sort((left, right) => String(right.date || '').localeCompare(String(left.date || ''))),
        monthlySales,
        documents,
        creditProfile: {
            ...defaultCreditProfile,
            ...creditDraft,
            requested_amount: String(creditDraft.requested_amount || defaultCreditProfile.requested_amount),
            loan_purpose: String(creditDraft.loan_purpose || defaultCreditProfile.loan_purpose),
            repayment_window: String(creditDraft.repayment_window || defaultCreditProfile.repayment_window),
            bookkeeping_score: clampScoreValue(creditDraft.bookkeeping_score ?? defaultCreditProfile.bookkeeping_score),
            supplier_score: clampScoreValue(creditDraft.supplier_score ?? defaultCreditProfile.supplier_score),
            collateral_notes: String(creditDraft.collateral_notes || defaultCreditProfile.collateral_notes),
            registration_status: String(creditDraft.registration_status || defaultCreditProfile.registration_status),
            updated_at: String(creditDraft.updated_at || defaultCreditProfile.updated_at),
        },
    };
};

const getOwnerWorkspaceData = (business) => normalizeOwnerWorkspaceData(business || {});

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
    const totalOrders = (ownerData.monthlySales || []).reduce((sum, entry) => sum + toNumber(entry.orders), 0);
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
        totalOrders,
        averageRevenue,
        grossMargin,
        bestMonth,
        currentMonth: lastMonth || { label: 'This month', revenue: 0, orders: 0, expenses: 0 },
        salesMomentum,
        readyDocuments,
        documentCount: ownerData.documents?.length || 0,
        creditPreview,
    };
};

const destroyOwnerWorkspaceCharts = () => {
    ownerWorkspaceCharts.forEach((chart) => chart.destroy());
    ownerWorkspaceCharts = [];
};

const createOwnerWorkspaceChart = (id, configuration) => {
    const chart = createChart(id, configuration);

    if (chart) {
        ownerWorkspaceCharts.push(chart);
    }
};

const renderOwnerWorkspaceCharts = (ownerData, analytics) => {
    destroyOwnerWorkspaceCharts();

    if (!window.Chart) {
        return;
    }

    if (analytics.latestStock.length > 0) {
        createOwnerWorkspaceChart('ownerStockPositionChart', {
            type: 'bar',
            data: {
                labels: analytics.latestStock.map((entry) => entry.item_name),
                datasets: [
                    {
                        label: 'Stock on hand',
                        data: analytics.latestStock.map((entry) => toNumber(entry.on_hand)),
                        backgroundColor: palette.forest,
                        borderRadius: 10,
                        maxBarThickness: 42,
                    },
                    {
                        label: 'Reorder level',
                        data: analytics.latestStock.map((entry) => toNumber(entry.reorder_level)),
                        backgroundColor: palette.amber,
                        borderRadius: 10,
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
        createOwnerWorkspaceChart('ownerSalesTrendChart', {
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
};

const formatRiskLabel = (level) => {
    if (level === 'low') {
        return 'Low risk';
    }

    if (level === 'watch') {
        return 'Watch list';
    }

    return 'High risk';
};

const riskToneClass = (level) => {
    if (level === 'low') {
        return 'pill-note-success';
    }

    if (level === 'watch') {
        return 'pill-note-muted';
    }

    return 'pill-note-danger';
};

const groupBusinessesByDistrict = (businesses) => businesses.reduce((accumulator, business) => {
    const district = business.district || 'Unknown';

    if (!accumulator[district]) {
        accumulator[district] = [];
    }

    accumulator[district].push(business);
    return accumulator;
}, {});

const renderWorkspaceMetricTiles = (metrics) => metrics
    .map((metric) => `
        <div class="col-sm-6 col-xl-3">
            <div class="metric-tile h-100">
                <span class="section-kicker mb-2">${metric.label}</span>
                <strong>${metric.value}</strong>
                <p class="text-muted mb-0">${metric.detail}</p>
            </div>
        </div>
    `)
    .join('');

const getOwnerBusiness = (user, businesses) => {
    const businessId = user?.business?.id;
    const liveBusiness = Array.isArray(businesses)
        ? businesses.find((business) => business.id === businessId) || businesses[0] || null
        : null;

    if (!liveBusiness) {
        return user?.business || null;
    }

    return {
        ...(user?.business || {}),
        ...liveBusiness,
        workspace: liveBusiness.workspace || user?.business?.workspace || {},
    };
};

const upsertBusiness = (businesses, nextBusiness) => {
    if (!nextBusiness) {
        return Array.isArray(businesses) ? businesses : [];
    }

    const currentBusinesses = Array.isArray(businesses) ? businesses : [];
    const hasMatch = currentBusinesses.some((business) => business.id === nextBusiness.id);

    return hasMatch
        ? currentBusinesses.map((business) => (business.id === nextBusiness.id ? nextBusiness : business))
        : [nextBusiness, ...currentBusinesses];
};

const rerenderOwnerWorkspace = async (session, businesses, nextBusiness) => {
    const refreshedBusinesses = await loadBusinesses();
    const nextBusinesses = refreshedBusinesses.length > 0
        ? refreshedBusinesses
        : upsertBusiness(businesses, nextBusiness);
    const resolvedBusiness = nextBusinesses.find((business) => business.id === nextBusiness?.id)
        || nextBusiness
        || getOwnerBusiness(session?.user, nextBusinesses);
    const nextSession = {
        user: {
            ...session.user,
            business: resolvedBusiness || null,
        },
    };

    storeSession(nextSession.user);
    renderWorkspace(nextSession, nextBusinesses);
    return nextSession;
};

const buildOwnerGuidance = (business) => {
    const guidance = [];

    if (business.credit_registration_status === 'verified') {
        guidance.push('Your NIN-backed credit registration is verified. Keep the operating record current while the credit review proceeds.');
    } else if (business.credit_registration_status === 'submitted') {
        guidance.push('Your NIN-backed credit registration is already in progress. Track the reference and verification note in the credit registration panel.');
    } else if (business.is_credit_ready) {
        guidance.push('Your business is operationally credit ready. Submit the NIN-backed registration step next so the identity workflow can begin.');
    }

    if ((business.profile_score || 0) >= 80) {
        guidance.push('Your business record is already strong. Keep it current whenever contact details, stock focus, or revenue patterns change.');
    } else if ((business.profile_score || 0) >= 65) {
        guidance.push('Your business profile is growing, but a few more details will make it easier for officials or lenders to review confidently.');
    } else {
        guidance.push('Your business profile still needs more operational detail before it presents a strong digital picture. Start with the missing items below.');
    }

    if (Array.isArray(business.credit_signal_gaps) && business.credit_signal_gaps.length > 0) {
        guidance.push(...business.credit_signal_gaps);
    }

    if (!business.tin_number) {
        guidance.push('Add or confirm a TIN when available so the profile is ready for future formal tax verification.');
    }

    if (!business.mobile_money_number) {
        guidance.push('Add the business mobile money number so the profile reflects how the business actually receives payments.');
    }

    if (!business.location_description) {
        guidance.push('Describe the trading location more clearly so the business can be identified accurately by support teams.');
    }

    if (!business.stock_focus) {
        guidance.push('Add the main stock focus to show what the business sells and where future credit or supply support may matter most.');
    }

    if (!business.monthly_revenue_band) {
        guidance.push('Choose the closest monthly revenue band so the dashboard can reflect the current scale of the business.');
    }

    return guidance.slice(0, 4);
};

const renderOfficialBusinessDetailPanel = (businesses) => {
    const visibleBusinesses = businesses.slice(0, 3);

    return `
        <div class="col-12">
            <article class="business-card workspace-detail-card h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">Detailed business visibility</p>
                        <strong class="d-block mb-2">Registry spotlight</strong>
                        <p class="text-muted mb-0">Officials can review full profile details for the most relevant businesses directly from the workspace.</p>
                    </div>
                    <span class="pill-note pill-note-muted align-self-start">${visibleBusinesses.length} profiles shown</span>
                </div>
                ${visibleBusinesses.length === 0
                    ? '<p class="text-muted mb-0">No business records are available right now.</p>'
                    : visibleBusinesses.map((business) => `
                        <div class="workspace-business-detail">
                            <div class="d-flex flex-column flex-lg-row justify-content-between gap-2 mb-3">
                                <div>
                                    <strong class="d-block mb-1">${business.business_name}</strong>
                                    <span class="text-muted small">${business.owner_name} · ${business.sector} · ${business.district}</span>
                                </div>
                                <div class="d-flex flex-wrap gap-2 align-items-start">
                                    <span class="status-pill ${business.tax_lookup_status === 'ready_for_lookup' ? 'status-pill-watch' : business.tax_lookup_status === 'demo_bypass' ? 'status-pill-high' : 'status-pill-low'}">${business.tax_lookup_status_label}</span>
                                    <span class="pill-note ${riskToneClass(business.fraud_risk_level)}">${formatRiskLabel(business.fraud_risk_level)}</span>
                                </div>
                            </div>
                            <div class="workspace-detail-grid">
                                <div class="workspace-detail-item"><span>Phone</span><strong>${business.phone_number || 'Not provided'}</strong></div>
                                <div class="workspace-detail-item"><span>Mobile money</span><strong>${business.mobile_money_number || 'Not provided'}</strong></div>
                                <div class="workspace-detail-item"><span>TIN</span><strong>${business.tin_number || 'Not provided'}</strong></div>
                                <div class="workspace-detail-item"><span>NIN status</span><strong>${business.nin_verification_status_label || 'Not submitted'}</strong></div>
                                <div class="workspace-detail-item"><span>Revenue band</span><strong>${business.monthly_revenue_band || 'Pending capture'}</strong></div>
                                <div class="workspace-detail-item"><span>Employees</span><strong>${business.employee_count || 1}</strong></div>
                                <div class="workspace-detail-item"><span>Credit score</span><strong>${business.credit_score || 0}/100 · ${business.credit_label || 'Pending'}</strong></div>
                                <div class="workspace-detail-item"><span>Receipts</span><strong>${business.receipt_count || 0} receipts</strong></div>
                                <div class="workspace-detail-item"><span>Updated</span><strong>${formatWorkspaceDate(business.updated_at)}</strong></div>
                                <div class="workspace-detail-item workspace-detail-item-wide"><span>Location</span><strong>${business.location_description || 'No location details on file.'}</strong></div>
                                <div class="workspace-detail-item workspace-detail-item-wide"><span>Stock focus</span><strong>${business.stock_focus || 'No stock focus on file.'}</strong></div>
                                <div class="workspace-detail-item workspace-detail-item-wide"><span>Notes</span><strong>${business.notes || 'No operating notes recorded yet.'}</strong></div>
                            </div>
                        </div>
                    `).join('')}
            </article>
        </div>
    `;
};

const showOwnerWorkspaceMessage = (message, tone) => {
    const ownerMessage = workspaceContainer?.querySelector('[data-owner-business-message]');

    if (!ownerMessage) {
        return;
    }

    ownerMessage.textContent = message;
    ownerMessage.className = `form-status form-status-${tone} is-visible`;
};

const showOwnerStockMessage = (message, tone) => {
    const stockMessage = workspaceContainer?.querySelector('[data-owner-stock-message]');

    if (!stockMessage) {
        return;
    }

    stockMessage.textContent = message;
    stockMessage.className = `form-status form-status-${tone} is-visible`;
};

const showOwnerDocumentMessage = (message, tone) => {
    const documentMessage = workspaceContainer?.querySelector('[data-owner-document-message]');

    if (!documentMessage) {
        return;
    }

    documentMessage.textContent = message;
    documentMessage.className = `form-status form-status-${tone} is-visible`;
};

const showOwnerCreditIntakeMessage = (message, tone) => {
    const creditIntakeMessage = workspaceContainer?.querySelector('[data-owner-credit-intake-message]');

    if (!creditIntakeMessage) {
        return;
    }

    creditIntakeMessage.textContent = message;
    creditIntakeMessage.className = `form-status form-status-${tone} is-visible`;
};

const showCreditRegistrationMessage = (message, tone) => {
    const registrationMessage = document.querySelector('[data-credit-registration-message]');

    if (!registrationMessage) {
        return;
    }

    registrationMessage.textContent = message;
    registrationMessage.className = `form-status form-status-${tone} is-visible`;
};

const buildCreditRegistrationPanel = (business) => {
    if (!business) {
        return `
            <article class="panel owner-credit-panel h-100">
                <p class="section-kicker mb-2">Credit registration</p>
                <strong class="d-block mb-2">No linked business profile yet</strong>
                <p class="mb-0 text-muted">A linked live business is required before the owner can start NIN-backed credit registration.</p>
            </article>
        `;
    }

    if (!business.is_credit_ready) {
        return `
            <article class="panel owner-credit-panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                    <div>
                        <p class="section-kicker mb-2">Credit registration</p>
                        <strong class="d-block mb-2">Build more evidence before NIN submission</strong>
                        <p class="text-muted mb-0">This business is not operationally credit ready yet, so the NIN-backed registration step is still locked.</p>
                    </div>
                    <span class="pill-note pill-note-muted align-self-start">${business.credit_readiness_score || 0}/100 readiness</span>
                </div>
                <div class="registration-feed">
                    ${(business.credit_signal_gaps || ['Add more operating evidence to unlock the credit registration step.'])
                        .slice(0, 4)
                        .map((gap) => `<div class="feed-item"><p class="mb-0 text-muted">${gap}</p></div>`)
                        .join('')}
                </div>
            </article>
        `;
    }

    if (['submitted', 'verified'].includes(business.credit_registration_status)) {
        return `
            <article class="panel owner-credit-panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                    <div>
                        <p class="section-kicker mb-2">Credit registration</p>
                        <strong class="d-block mb-2">NIN-backed registration is in progress</strong>
                        <p class="text-muted mb-0">The business has already entered the identity workflow for credit onboarding.</p>
                    </div>
                    <span class="pill-note ${business.credit_registration_status === 'verified' ? 'pill-note-success' : 'pill-note-muted'} align-self-start">${business.credit_registration_status_label}</span>
                </div>
                <div class="workspace-detail-grid">
                    <div class="workspace-detail-item"><span>NIN</span><strong>${business.nin_number || 'Not submitted'}</strong></div>
                    <div class="workspace-detail-item"><span>NIN status</span><strong>${business.nin_verification_status_label || 'Pending review'}</strong></div>
                    <div class="workspace-detail-item"><span>Reference</span><strong>${business.credit_registration_reference || 'Pending generation'}</strong></div>
                    <div class="workspace-detail-item"><span>Submitted</span><strong>${formatWorkspaceDate(business.credit_registration_submitted_at)}</strong></div>
                </div>
                <div class="feed-item mt-3">
                    <strong class="d-block mb-2">Verification note</strong>
                    <p class="mb-0 text-muted">${business.nin_verification_notes || 'Verification is underway.'}</p>
                </div>
            </article>
        `;
    }

    return `
        <article class="panel owner-credit-panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Credit registration</p>
                    <strong class="d-block mb-2">Submit the owner NIN for the next step</strong>
                    <p class="text-muted mb-0">This business is ready for a NIN-backed credit registration. The NIN is used for the configured NIRA or NITA verification path.</p>
                </div>
                <span class="pill-note pill-note-success align-self-start">${business.credit_score || 0}/100 credit</span>
            </div>
            <form class="row g-3" data-credit-registration-form data-business-id="${business.id}">
                <div class="col-md-6">
                    <label class="form-label" for="credit_registration_nin">Owner NIN</label>
                    <input class="form-control" id="credit_registration_nin" name="nin_number" type="text" maxlength="14" value="${business.nin_number || ''}" placeholder="CM1234567890AB" required>
                </div>
                <div class="col-md-6">
                    <div class="workspace-detail-item h-100">
                        <span>Why this appears now</span>
                        <strong>${business.credit_readiness_score || 0}/100 readiness and ${business.receipt_trust_score || 0}/100 receipt trust</strong>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-status" data-credit-registration-message></div>
                </div>
                <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center">
                    <button class="btn btn-warning btn-lg px-4" type="submit" data-credit-registration-submit>Submit NIN registration</button>
                    <small class="text-muted">Only credit-ready live businesses can enter this registration step.</small>
                </div>
            </form>
        </article>
    `;
};

const bindOwnerBusinessForm = (session) => {
    const ownerForm = workspaceContainer?.querySelector('[data-owner-business-form]');

    if (!ownerForm || ownerForm.dataset.bound === 'true') {
        return;
    }

    ownerForm.dataset.bound = 'true';
    ownerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(ownerForm);
        const businessId = ownerForm.dataset.businessId;
        const payload = {
            business_name: String(formData.get('business_name') || '').trim(),
            phone_number: String(formData.get('phone_number') || '').trim(),
            mobile_money_number: String(formData.get('mobile_money_number') || '').trim(),
            tin_number: String(formData.get('tin_number') || '').trim(),
            district: String(formData.get('district') || '').trim(),
            sector: String(formData.get('sector') || '').trim(),
            location_description: String(formData.get('location_description') || '').trim(),
            stock_focus: String(formData.get('stock_focus') || '').trim(),
            monthly_revenue_band: String(formData.get('monthly_revenue_band') || '').trim(),
            employee_count: String(formData.get('employee_count') || '1').trim(),
            inventory_value_estimate: String(formData.get('inventory_value_estimate') || '0').trim(),
            average_monthly_profit: String(formData.get('average_monthly_profit') || '0').trim(),
            average_monthly_mobile_money: String(formData.get('average_monthly_mobile_money') || '0').trim(),
            receipt_count: String(formData.get('receipt_count') || '0').trim(),
            receipt_value_total: String(formData.get('receipt_value_total') || '0').trim(),
            notes: String(formData.get('notes') || '').trim(),
        };
        const ownerSubmit = ownerForm.querySelector('[data-owner-business-submit]');

        if (ownerSubmit) {
            ownerSubmit.disabled = true;
            ownerSubmit.textContent = 'Saving adjustments...';
        }

        try {
            const result = await fetchJson(`/businesses/${businessId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const nextSession = { user: { ...session.user, business: result.business } };
            storeSession(nextSession.user);
            const refreshedBusinesses = await loadBusinesses();
            renderWorkspace(nextSession, refreshedBusinesses);
            showOwnerWorkspaceMessage('Business adjustments saved successfully.', 'success');
        } catch (error) {
            showOwnerWorkspaceMessage(error.message || 'Unable to save your business adjustments right now.', 'error');
        } finally {
            if (ownerSubmit) {
                ownerSubmit.disabled = false;
                ownerSubmit.textContent = 'Save adjustments';
            }
        }
    });
};

const bindOwnerStockForm = (session, businesses, business) => {
    const stockForm = workspaceContainer?.querySelector('[data-owner-stock-form]');

    if (!stockForm || stockForm.dataset.bound === 'true') {
        return;
    }

    stockForm.dataset.bound = 'true';
    stockForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(stockForm);
        const itemName = String(formData.get('item_name') || '').trim();
        const submitButton = stockForm.querySelector('button[type="submit"]');

        if (!itemName) {
            showOwnerStockMessage('Add the stock item name before saving the entry.', 'error');
            return;
        }

        const payload = {
            date: String(formData.get('date') || buildRelativeIsoDate(0)).trim(),
            item_name: itemName,
            category: String(formData.get('category') || '').trim() || business.sector || 'Retail',
            unit: String(formData.get('unit') || '').trim() || 'units',
            on_hand: Math.max(0, Math.round(toNumber(formData.get('on_hand')))),
            received: Math.max(0, Math.round(toNumber(formData.get('received')))),
            sold: Math.max(0, Math.round(toNumber(formData.get('sold')))),
            reorder_level: Math.max(0, Math.round(toNumber(formData.get('reorder_level')))),
            selling_price: Math.max(0, toNumber(formData.get('selling_price'))),
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving stock entry...';
        }

        try {
            const result = await fetchJson(`/businesses/${business.id}/stock-entries/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            await rerenderOwnerWorkspace(session, businesses, result.business);
            showOwnerStockMessage(result.message || 'Stock entry saved. The charts and monthly report were refreshed.', 'success');
        } catch (error) {
            showOwnerStockMessage(error.message || 'Unable to save the stock entry right now.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Save stock entry';
            }
        }
    });
};

const bindOwnerDocumentForm = (session, businesses, business) => {
    const documentForm = workspaceContainer?.querySelector('[data-owner-document-form]');

    if (!documentForm || documentForm.dataset.bound === 'true') {
        return;
    }

    documentForm.dataset.bound = 'true';
    documentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(documentForm);
        const name = String(formData.get('name') || '').trim();
        const submitButton = documentForm.querySelector('button[type="submit"]');

        if (!name) {
            showOwnerDocumentMessage('Document name is required.', 'error');
            return;
        }

        const payload = {
            name,
            type: String(formData.get('type') || '').trim() || 'General',
            reference: String(formData.get('reference') || '').trim(),
            due_date: String(formData.get('due_date') || '').trim(),
            status: String(formData.get('status') || '').trim() || 'Pending',
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving document...';
        }

        try {
            const result = await fetchJson(`/businesses/${business.id}/documents/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            await rerenderOwnerWorkspace(session, businesses, result.business);
            showOwnerDocumentMessage(result.message || 'Document tracker updated for this business.', 'success');
        } catch (error) {
            showOwnerDocumentMessage(error.message || 'Unable to save the document right now.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Add document reference';
            }
        }
    });
};

const bindOwnerCreditIntakeForm = (session, businesses, business) => {
    const creditIntakeForm = workspaceContainer?.querySelector('[data-owner-credit-intake-form]');

    if (!creditIntakeForm || creditIntakeForm.dataset.bound === 'true') {
        return;
    }

    creditIntakeForm.dataset.bound = 'true';
    creditIntakeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(creditIntakeForm);
        const requestedAmount = Math.max(0, Math.round(toNumber(formData.get('requested_amount'))));
        const submitButton = creditIntakeForm.querySelector('button[type="submit"]');

        if (requestedAmount <= 0) {
            showOwnerCreditIntakeMessage('Requested amount must be greater than zero.', 'error');
            return;
        }

        const payload = {
            requested_amount: requestedAmount,
            loan_purpose: String(formData.get('loan_purpose') || '').trim(),
            repayment_window: String(formData.get('repayment_window') || '').trim() || '6 months',
            bookkeeping_score: clampScoreValue(formData.get('bookkeeping_score')),
            supplier_score: clampScoreValue(formData.get('supplier_score')),
            collateral_notes: String(formData.get('collateral_notes') || '').trim(),
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving credit draft...';
        }

        try {
            const result = await fetchJson(`/businesses/${business.id}/credit-draft/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            await rerenderOwnerWorkspace(session, businesses, result.business);
            showOwnerCreditIntakeMessage(result.message || 'Credit draft saved and the preview score was recalculated.', 'success');
        } catch (error) {
            showOwnerCreditIntakeMessage(error.message || 'Unable to save the credit draft right now.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Save credit intake';
            }
        }
    });
};

const bindCreditRegistrationForm = (session) => {
    const creditForm = document.querySelector('[data-credit-registration-form]');

    if (!creditForm || creditForm.dataset.bound === 'true') {
        return;
    }

    creditForm.dataset.bound = 'true';
    creditForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(creditForm);
        const businessId = creditForm.dataset.businessId;
        const submitButton = creditForm.querySelector('[data-credit-registration-submit]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting NIN...';
        }

        try {
            const result = await fetchJson(`/businesses/${businessId}/credit-registration/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nin_number: String(formData.get('nin_number') || '').trim(),
                }),
            });

            const nextSession = { user: { ...session.user, business: result.business } };
            storeSession(nextSession.user);
            const refreshedBusinesses = await loadBusinesses();
            renderWorkspace(nextSession, refreshedBusinesses);
            renderCreditPage(nextSession, refreshedBusinesses);
            showCreditRegistrationMessage(result.verification?.notes || 'Credit registration submitted.', 'success');
        } catch (error) {
            showCreditRegistrationMessage(error.message || 'Unable to submit the NIN registration right now.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit NIN registration';
            }
        }
    });
};

const fetchJson = async (path, options = {}) => {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        credentials: 'include',
        ...options,
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || 'The request failed.');
    }

    return payload;
};

const fetchCurrentSession = async () => {
    try {
        const payload = await fetchJson('/auth/me/', {
            credentials: 'include',
        });

        if (payload.user) {
            storeSession(payload.user);
            return payload;
        }

        clearSession();
        return null;
    } catch (error) {
        clearSession();
        return null;
    }
};

const hydrateSession = async () => {
    const storedSession = getStoredSession();

    if (!storedSession?.user && publicPages.has(currentPage)) {
        updateAuthNavigation(null);
        return null;
    }

    const liveSession = await fetchCurrentSession();

    if (liveSession?.user) {
        updateAuthNavigation(liveSession);
        return liveSession;
    }

    updateAuthNavigation(null);
    return null;
};

const renderTopBusinesses = (businesses) => {
    if (!topBusinesses) {
        return;
    }

    if (!Array.isArray(businesses) || businesses.length === 0) {
        topBusinesses.textContent = 'No live registrations yet. Add businesses from the registration page to populate this list.';
        return;
    }

    const strongest = [...businesses]
        .sort((left, right) => (right.credit_score || 0) - (left.credit_score || 0))
        .slice(0, 3);

    topBusinesses.innerHTML = strongest
        .map((business) => `
            <div class="feed-item">
                <strong>${business.business_name}</strong>
                <div class="text-muted small mb-2">${business.owner_name} · ${business.district}</div>
                <div class="feed-meta">
                    <span>${business.credit_score || 0}/100 ${business.credit_label || 'Pending'}</span>
                    <span>${formatRiskLabel(business.fraud_risk_level)}</span>
                </div>
            </div>
        `)
        .join('');
};

const renderBusinessRows = (businesses) => {
    if (!businessList) {
        return;
    }

    if (!Array.isArray(businesses) || businesses.length === 0) {
        businessList.innerHTML = `
            <tr>
                <td colspan="6" class="text-muted">No live registrations yet. Use the registration page to add the first business.</td>
            </tr>
        `;
        updateBusinessEmptyState(0);
        return;
    }

    businessList.innerHTML = businesses
        .map((business) => {
            const searchValue = [
                business.business_name,
                business.owner_name,
                business.district,
                business.sector,
                business.monthly_revenue_band,
                business.tin_number,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return `
                <tr data-business-row data-search="${searchValue}">
                    <td>
                        <strong class="d-block">${business.business_name}</strong>
                        <span class="text-muted small">${business.owner_name}</span>
                    </td>
                    <td>${business.district}</td>
                    <td>${business.sector}</td>
                    <td>${business.monthly_revenue_band || 'Pending capture'}</td>
                    <td>
                        <div class="small fw-semibold mb-1">${business.profile_score}/100 · ${business.profile_label}</div>
                        <div class="text-muted small mb-2">Credit ${business.credit_score || 0}/100 · ${business.credit_label || 'Pending'}</div>
                        <div class="progress score-progress">
                            <div class="progress-bar" role="progressbar" style="width: ${business.credit_score || 0}%" aria-valuenow="${business.credit_score || 0}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                    <td>
                        <span class="status-pill ${business.tax_lookup_status === 'ready_for_lookup' ? 'status-pill-watch' : business.tax_lookup_status === 'demo_bypass' ? 'status-pill-high' : 'status-pill-low'}">${business.tax_lookup_status_label}</span>
                        <div class="text-muted small mt-2">${business.nin_verification_status_label || 'NIN not submitted'}</div>
                        <div class="text-muted small">${formatRiskLabel(business.fraud_risk_level)}</div>
                    </td>
                </tr>
            `;
        })
        .join('');

    filterBusinessRows();
};

const loadBusinesses = async () => {
    try {
        const payload = await fetchJson('/businesses/');
        const businesses = payload.results || [];
        const scope = payload.scope || 'official';

        renderBusinessRows(businesses);
        renderTopBusinesses(businesses);

        if (scope === 'owned' && businesses.length === 0) {
            if (businessList) {
                businessList.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-muted">No linked business profile is available for this owner account yet.</td>
                    </tr>
                `;
            }

            if (topBusinesses) {
                topBusinesses.textContent = 'No linked business profile is available for this owner account yet.';
            }

            setStatusChip(businessSyncStatus, 'Owner profile pending', 'danger');
            updateBusinessEmptyState(0);
            return businesses;
        }

        setStatusChip(
            businessSyncStatus,
            scope === 'owned' ? 'Business profile ready' : 'Live registry ready',
            'success',
        );

        return businesses;
    } catch (error) {
        if (businessList) {
            businessList.innerHTML = `
                <tr>
                    <td colspan="6" class="text-muted">Unable to load registrations right now. Refresh once the service is available.</td>
                </tr>
            `;
        }

        if (topBusinesses) {
            topBusinesses.textContent = 'Unable to load registrations right now.';
        }

        setStatusChip(businessSyncStatus, 'Service unavailable', 'danger');
        updateBusinessEmptyState(0);
        return [];
    }
};

const updateServiceStatus = (message, tone = 'muted') => {
    if (!serviceStatus) {
        return;
    }

    serviceStatus.textContent = message;
    serviceStatus.className = `pill-note pill-note-${tone} align-self-start`;
};

const showRegistrationMessage = (message, tone) => {
    if (!registrationMessage) {
        return;
    }

    registrationMessage.textContent = message;
    registrationMessage.className = `form-status form-status-${tone} is-visible`;
};

const syncDemoNote = () => {
    if (!demoToggle || !demoNote) {
        return;
    }

    demoNote.textContent = demoToggle.checked
        ? 'This registration will proceed without a TIN and will remain outside future tax-readiness checks until the identifier is added.'
        : 'TIN remains optional for the MVP, but records without a TIN will stay pending for future tax verification.';
};

const renderRecentRegistrations = (results) => {
    if (!registrationFeed) {
        return;
    }

    if (!Array.isArray(results) || results.length === 0) {
        registrationFeed.textContent = 'No live registrations yet. Save a business to see it appear here.';
        return;
    }

    registrationFeed.innerHTML = results
        .slice(0, 4)
        .map((business) => `
            <div class="feed-item">
                <strong>${business.business_name}</strong>
                <div class="text-muted small">${business.owner_name} • ${business.sector}</div>
                <div class="feed-meta">
                    <span>${business.district}</span>
                    <span>${business.credit_score || 0}/100 credit</span>
                </div>
            </div>
        `)
        .join('');
};

const loadRecentRegistrations = async () => {
    if (!registrationFeed) {
        return;
    }

    try {
        const payload = await fetchJson('/businesses/');
        renderRecentRegistrations(payload.results || []);
    } catch (error) {
        registrationFeed.textContent = 'Unable to load registrations right now. Refresh once the service is available.';
    }
};

const loadServiceStatus = async () => {
    if (!serviceStatus) {
        return;
    }

    try {
        const payload = await fetchJson('/health/');
        updateServiceStatus('Service ready', 'success');
    } catch (error) {
        updateServiceStatus('Service unavailable', 'danger');
    }
};

const buildGovernmentAnalytics = (businesses) => {
    const readyBusinesses = businesses.filter((business) => business.is_credit_ready);
    const verifiedNin = businesses.filter((business) => business.nin_verification_status === 'verified');
    const pendingNin = businesses.filter((business) => business.nin_verification_status === 'pending');
    const highRisk = businesses.filter((business) => business.fraud_risk_level === 'high');
    const watchRisk = businesses.filter((business) => business.fraud_risk_level === 'watch');
    const submittedCredit = businesses.filter((business) => ['submitted', 'verified'].includes(business.credit_registration_status));
    const avgCredit = averageRounded(businesses.map((business) => business.credit_score || 0));
    const avgReceiptTrust = averageRounded(businesses.map((business) => business.receipt_trust_score || 0));
    const avgConsistency = averageRounded(businesses.map((business) => business.consistency_score || 0));
    const avgMobileMoneyCoverage = averageRounded(
        businesses.map((business) => {
            const revenueMidpoint = toNumber(business.revenue_band_midpoint);

            if (revenueMidpoint <= 0) {
                return 0;
            }

            return Math.min(100, Math.round((toNumber(business.average_monthly_mobile_money) / revenueMidpoint) * 100));
        }),
    );

    const categories = [
        {
            title: 'Formalization pipeline',
            detail: 'Which businesses are closest to moving into formal credit and compliance workflows.',
            metrics: [
                { label: 'Credit-ready businesses', value: `${readyBusinesses.length}/${businesses.length || 0}` },
                { label: 'Submitted registrations', value: String(submittedCredit.length) },
                { label: 'TIN-ready businesses', value: String(businesses.filter((business) => business.tax_lookup_status === 'ready_for_lookup').length) },
            ],
        },
        {
            title: 'Identity assurance',
            detail: 'How many businesses have enough owner identity evidence for government-backed finance programmes.',
            metrics: [
                { label: 'Verified NIN', value: `${verifiedNin.length}/${businesses.length || 0}` },
                { label: 'Pending NIN checks', value: String(pendingNin.length) },
                { label: 'Ready but no NIN', value: String(readyBusinesses.filter((business) => !business.nin_number).length) },
            ],
        },
        {
            title: 'Fraud and data integrity',
            detail: 'Signals that suggest follow-up verification before public support or credit is approved.',
            metrics: [
                { label: 'High-risk businesses', value: String(highRisk.length) },
                { label: 'Watch-list businesses', value: String(watchRisk.length) },
                { label: 'Average consistency', value: `${avgConsistency}/100` },
            ],
        },
        {
            title: 'Receipt discipline',
            detail: 'Receipt coverage helps officials judge whether business records are trustworthy enough for lending and grants.',
            metrics: [
                { label: 'Average receipt trust', value: `${avgReceiptTrust}/100` },
                { label: '10+ receipts logged', value: String(businesses.filter((business) => (business.receipt_count || 0) >= 10).length) },
                { label: 'Low-receipt businesses', value: String(businesses.filter((business) => (business.receipt_count || 0) < 5).length) },
            ],
        },
        {
            title: 'Digital payments and tax',
            detail: 'Useful for deciding where digital-finance and formal tax support should be targeted first.',
            metrics: [
                { label: 'Average credit score', value: `${avgCredit}/100` },
                { label: 'Avg mobile-money coverage', value: `${avgMobileMoneyCoverage}%` },
                { label: 'Tax-ready businesses', value: String(businesses.filter((business) => business.tax_lookup_status === 'ready_for_lookup').length) },
            ],
        },
    ];

    const districts = Object.entries(groupBusinessesByDistrict(businesses))
        .map(([district, districtBusinesses]) => {
            const districtReady = districtBusinesses.filter((business) => business.is_credit_ready).length;
            const districtHighRisk = districtBusinesses.filter((business) => business.fraud_risk_level === 'high').length;
            const districtVerifiedNin = districtBusinesses.filter((business) => business.nin_verification_status === 'verified').length;
            const averageDistrictCredit = averageRounded(districtBusinesses.map((business) => business.credit_score || 0));
            let priority = 'Maintain the current support level';

            if (districtHighRisk >= 2) {
                priority = 'Field verification and fraud review';
            } else if (districtReady >= 2) {
                priority = 'Open lender onboarding for ready businesses';
            } else if (districtVerifiedNin < Math.ceil(districtBusinesses.length / 2)) {
                priority = 'Push NIN capture and identity checks';
            } else if (averageDistrictCredit < 65) {
                priority = 'Bookkeeping and receipt support';
            }

            return {
                district,
                businesses: districtBusinesses.length,
                averageCredit: averageDistrictCredit,
                creditReady: districtReady,
                priority,
            };
        })
        .sort((left, right) => right.averageCredit - left.averageCredit);

    const interventions = [
        {
            title: 'Focus NIN capture on credit-ready businesses',
            detail: `${readyBusinesses.filter((business) => !business.nin_number).length} ready businesses still need a NIN-backed registration step before identity assurance is complete.`,
        },
        {
            title: 'Target districts with fraud-watch concentration',
            detail: `${highRisk.length + watchRisk.length} businesses are on a fraud watch path because their stock, profit, mobile money, and receipt figures do not align closely enough.`,
        },
        {
            title: 'Expand receipt digitization support',
            detail: `${businesses.filter((business) => (business.receipt_count || 0) < 5).length} businesses still lack enough receipt evidence to support trustworthy lending or grant decisions.`,
        },
    ];

    return { categories, districts, interventions };
};

const renderCreditPage = (session, businesses) => {
    if (!creditLiveMetrics && !creditShortlist && !creditRegistrationContent) {
        return;
    }

    if (!session?.user) {
        if (creditLiveMetrics) {
            creditLiveMetrics.innerHTML = '<div class="col-12 text-muted">Sign in to load live credit analytics.</div>';
        }

        if (creditShortlist) {
            creditShortlist.textContent = 'Sign in to load the live credit shortlist.';
        }

        if (creditRegistrationContent) {
            creditRegistrationContent.innerHTML = '<p class="mb-0 text-muted">Sign in as a business owner to open the NIN-backed credit registration step when a business becomes ready.</p>';
        }

        return;
    }

    if (creditLiveMetrics) {
        creditLiveMetrics.innerHTML = renderWorkspaceMetricTiles([
            { label: 'Average credit score', value: `${averageRounded(businesses.map((business) => business.credit_score || 0))}/100`, detail: 'Live score after receipts, fraud checks, and identity trust are considered.' },
            { label: 'Credit-ready businesses', value: String(businesses.filter((business) => business.is_credit_ready).length), detail: 'Operationally ready to move into NIN-backed registration.' },
            { label: 'Verified NIN', value: String(businesses.filter((business) => business.nin_verification_status === 'verified').length), detail: 'Businesses whose owners have passed identity verification.' },
            { label: 'Fraud watch', value: String(businesses.filter((business) => business.fraud_risk_level !== 'low').length), detail: 'Businesses that need closer verification before a facility is offered.' },
        ]);
    }

    if (creditShortlist) {
        if (!Array.isArray(businesses) || businesses.length === 0) {
            creditShortlist.textContent = 'No live businesses are available for credit analysis yet.';
        } else {
            creditShortlist.innerHTML = [...businesses]
                .sort((left, right) => (right.credit_score || 0) - (left.credit_score || 0))
                .slice(0, 4)
                .map((business) => `
                    <div class="feed-item">
                        <strong class="d-block mb-2">${business.business_name}</strong>
                        <div class="text-muted small mb-2">${business.owner_name} · ${business.district}</div>
                        <div class="d-flex justify-content-between text-muted small mb-1"><span>Credit</span><span>${business.credit_score || 0}/100</span></div>
                        <div class="d-flex justify-content-between text-muted small mb-1"><span>Receipts</span><span>${business.receipt_count || 0}</span></div>
                        <div class="d-flex justify-content-between text-muted small"><span>Fraud watch</span><span>${formatRiskLabel(business.fraud_risk_level)}</span></div>
                    </div>
                `)
                .join('');
        }
    }

    if (creditRegistrationContent) {
        if (session.user.role === 'business_owner') {
            creditRegistrationContent.innerHTML = buildCreditRegistrationPanel(getOwnerBusiness(session.user, businesses));
            bindCreditRegistrationForm(session);
        } else {
            creditRegistrationContent.innerHTML = '<p class="mb-0 text-muted">Signed-in officials can review credit analytics here. The NIN registration form only appears for the linked business owner account.</p>';
        }
    }
};

const renderGovernmentPage = (session, businesses) => {
    if (!governmentCategories && !governmentDistrictTable && !governmentInterventions) {
        return;
    }

    if (!session?.user || !officialRoles.has(session.user.role)) {
        if (governmentCategories) {
            governmentCategories.textContent = 'Sign in with an official account to load the live government categories.';
        }

        if (governmentDistrictCount) {
            governmentDistrictCount.textContent = 'Official access required';
        }

        if (governmentDistrictTable) {
            governmentDistrictTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-muted">Official sign-in is required to view the live district analytics.</td>
                </tr>
            `;
        }

        if (governmentInterventions) {
            governmentInterventions.innerHTML = '<div class="col-12 text-muted">Official sign-in is required to view live intervention guidance.</div>';
        }

        return;
    }

    const analytics = buildGovernmentAnalytics(businesses);

    if (governmentCategories) {
        governmentCategories.innerHTML = analytics.categories
            .map((category) => `
                <div class="feed-item">
                    <strong class="d-block mb-2">${category.title}</strong>
                    <p class="text-muted mb-3">${category.detail}</p>
                    ${category.metrics
                        .map((metric) => `
                            <div class="d-flex justify-content-between text-muted small mb-2">
                                <span>${metric.label}</span>
                                <span>${metric.value}</span>
                            </div>
                        `)
                        .join('')}
                </div>
            `)
            .join('');
    }

    if (governmentDistrictCount) {
        governmentDistrictCount.textContent = `${analytics.districts.length} districts live`;
    }

    if (governmentDistrictTable) {
        governmentDistrictTable.innerHTML = analytics.districts
            .map((district) => `
                <tr>
                    <td>${district.district}</td>
                    <td>${district.businesses}</td>
                    <td>${district.averageCredit}/100</td>
                    <td>${district.creditReady}</td>
                    <td>${district.priority}</td>
                </tr>
            `)
            .join('');
    }

    if (governmentInterventions) {
        governmentInterventions.innerHTML = analytics.interventions
            .map((intervention) => `
                <div class="col-md-4">
                    <div class="business-card h-100">
                        <strong class="d-block mb-2">${intervention.title}</strong>
                        <p class="mb-0 text-muted">${intervention.detail}</p>
                    </div>
                </div>
            `)
            .join('');
    }
};

const renderWorkspace = (session, businesses) => {
    if (!workspaceContainer) {
        return;
    }

    const user = session?.user;

    if (!user) {
        setStatusChip(authSessionStatus, 'Not signed in', 'danger');

        if (workspaceTitle) {
            workspaceTitle.textContent = 'Sign in to open a role workspace';
        }

        if (workspaceDescription) {
            workspaceDescription.textContent = 'Sign in with a live account to unlock role-specific tasks, live business metrics, and the correct dashboard links.';
        }

        if (currentUserCard) {
            currentUserCard.innerHTML = `
                <strong class="d-block mb-2">Not signed in</strong>
                <p class="mb-3 text-muted">Authenticate with a live account to view a role-specific workspace.</p>
                <a class="btn btn-outline-success btn-sm" href="?page=login">Go to login</a>
            `;
        }

        if (roleNotes) {
            roleNotes.textContent = 'Role-specific notes will appear here after sign-in.';
        }

        return;
    }

    const blueprint = roleBlueprints[user.role] || roleBlueprints.field_agent;
    const isOfficial = officialRoles.has(user.role);
    const totalBusinesses = businesses.length;
    const tinReadyCount = businesses.filter((business) => business.tax_lookup_status === 'ready_for_lookup').length;
    const strongProfiles = businesses.filter((business) => (business.profile_score || 0) >= 75).length;
    const creditReadyCount = businesses.filter((business) => business.is_credit_ready).length;
    const ownerLinkedCount = businesses.filter((business) => Boolean(business.account_username)).length;
    const highRiskCount = businesses.filter((business) => business.fraud_risk_level === 'high').length;
    const averageScore = totalBusinesses
        ? Math.round(businesses.reduce((sum, business) => sum + (business.profile_score || 0), 0) / totalBusinesses)
        : 0;

    const metricsByRole = {
        government: [
            { label: 'Registered businesses', value: String(totalBusinesses), detail: 'All live registrations currently visible.' },
            { label: 'TIN-ready businesses', value: String(tinReadyCount), detail: 'Profiles ready for future URA lookup.' },
            { label: 'Credit-ready businesses', value: String(creditReadyCount), detail: 'Profiles already strong enough for lender-facing follow-up.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Completeness level across the current registry.' },
        ],
        lender: [
            { label: 'Strong profiles', value: String(strongProfiles), detail: 'Businesses above the current readiness threshold.' },
            { label: 'Credit-ready businesses', value: String(creditReadyCount), detail: 'Best candidates for formal credit pilots.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Use this as a quick registry quality signal.' },
            { label: 'High-risk flagged', value: String(highRiskCount), detail: 'Records that need stronger evidence before lender review.' },
        ],
        field_agent: [
            { label: 'Businesses onboarded', value: String(totalBusinesses), detail: 'Current businesses captured in the registry.' },
            { label: 'Profiles missing TIN', value: String(Math.max(totalBusinesses - tinReadyCount, 0)), detail: 'Follow up when formalization is appropriate.' },
            { label: 'Owner-linked profiles', value: String(ownerLinkedCount), detail: 'Business records already attached to a live owner account.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Completeness level of the captured business records.' },
        ],
    };

    const renderOfficialWorkspace = () => {
        if (workspaceTitle) {
            workspaceTitle.textContent = blueprint.workspaceTitle;
        }

        if (workspaceDescription) {
            workspaceDescription.textContent = blueprint.workspaceDescription;
        }

        if (roleMetrics) {
            roleMetrics.innerHTML = renderWorkspaceMetricTiles(metricsByRole[user.role] || metricsByRole.field_agent);
        }

        if (roleActions) {
            const actionCards = blueprint.actions
                .map((action) => `
                    <div class="col-md-6">
                        <div class="business-card action-card d-flex flex-column">
                            <strong class="d-block mb-2">${action.title}</strong>
                            <p class="mb-3 text-muted">${action.detail}</p>
                            <a class="btn btn-outline-success btn-sm align-self-start" href="${action.href}">${action.cta}</a>
                        </div>
                    </div>
                `)
                .join('');

            roleActions.innerHTML = `${actionCards}${renderOfficialBusinessDetailPanel(businesses)}`;
        }

        if (currentUserCard) {
            currentUserCard.innerHTML = `
                <strong class="d-block mb-2">${user.display_name}</strong>
                <div class="small mb-1"><strong>Username:</strong> ${user.username}</div>
                <div class="small mb-1"><strong>Role:</strong> ${user.role_label}</div>
                <div class="small mb-1"><strong>TIN required:</strong> ${user.requires_tin ? 'Yes' : 'No'}</div>
                <div class="small mb-3"><strong>Visible businesses:</strong> ${totalBusinesses}</div>
                <a class="btn btn-outline-success btn-sm" href="?page=${user.recommended_page}">Open recommended page</a>
            `;
        }

        if (roleNotes) {
            roleNotes.innerHTML = blueprint.notes
                .map((note) => `<div class="feed-item"><p class="mb-0 text-muted">${note}</p></div>`)
                .join('');
        }
    };

    const renderBusinessOwnerWorkspace = () => {
        const business = getOwnerBusiness(user, businesses);

        destroyOwnerWorkspaceCharts();

        if (workspaceTitle) {
            workspaceTitle.textContent = blueprint.workspaceTitle;
        }

        if (workspaceDescription) {
            workspaceDescription.textContent = business
                ? `Track ${business.business_name}, log daily stock, review live graphs, and keep a lender-ready business pack in one workspace.`
                : blueprint.workspaceDescription;
        }

        if (!business) {
            if (roleMetrics) {
                roleMetrics.innerHTML = renderWorkspaceMetricTiles([
                    { label: 'Linked business', value: '0', detail: 'No business profile is attached to this owner account yet.' },
                    { label: 'Profile score', value: '0/100', detail: 'A score appears once a business record is linked.' },
                    { label: 'Tax status', value: 'Pending', detail: 'A business profile is required before tax readiness can be tracked.' },
                    { label: 'Saved updates', value: '0', detail: 'Owner adjustments will appear once a linked profile exists.' },
                ]);
            }

            if (roleActions) {
                roleActions.innerHTML = `
                    <div class="col-12">
                        <article class="panel owner-edit-panel">
                            <p class="section-kicker mb-2">Owner setup required</p>
                            <strong class="d-block mb-2">No linked business profile yet</strong>
                            <p class="text-muted mb-0">This business-owner account is signed in correctly, but no business record is attached yet. Ask the programme team to link the account or create the owner through the registration flow.</p>
                        </article>
                    </div>
                `;
            }

            if (currentUserCard) {
                currentUserCard.innerHTML = `
                    <strong class="d-block mb-2">${user.display_name}</strong>
                    <div class="small mb-1"><strong>Username:</strong> ${user.username}</div>
                    <div class="small mb-1"><strong>Role:</strong> ${user.role_label}</div>
                    <div class="small mb-3"><strong>Linked business:</strong> Not assigned</div>
                    <a class="btn btn-outline-success btn-sm" href="?page=login#register-account">Create owner-linked profile</a>
                `;
            }

            if (roleNotes) {
                roleNotes.innerHTML = blueprint.notes
                    .map((note) => `<div class="feed-item"><p class="mb-0 text-muted">${note}</p></div>`)
                    .join('');
            }

            return;
        }

        const ownerData = getOwnerWorkspaceData(business);
        const analytics = buildOwnerWorkspaceAnalytics(business, ownerData);
        const creditPreview = analytics.creditPreview;
        const ownerGuidance = [
            ...buildOwnerGuidance(business),
            creditPreview.note,
            analytics.lowStockCount > 0
                ? `${analytics.lowStockCount} stock lines are at or below the reorder level and need attention.`
                : 'All tracked stock lines are currently above the reorder level.',
            analytics.readyDocuments < analytics.documentCount
                ? `Finish the remaining business documents so the credit pack is complete before review.`
                : 'The current document pack is complete enough for a lender or compliance check-in.',
        ].slice(0, 5);

        if (roleMetrics) {
            roleMetrics.innerHTML = renderWorkspaceMetricTiles([
                { label: 'Stock lines tracked', value: String(analytics.latestStock.length), detail: `${analytics.lowStockCount} below reorder level` },
                { label: 'Sales this month', value: formatCurrencyUGX(analytics.currentMonth.revenue), detail: `${Math.round(toNumber(analytics.currentMonth.orders))} ticketed units sold` },
                { label: 'Document pack', value: `${analytics.readyDocuments}/${analytics.documentCount}`, detail: 'Ready or submitted business files' },
                { label: 'Credit preview', value: `${creditPreview.score}/100`, detail: creditPreview.band },
            ]);
        }

        if (roleActions) {
            roleActions.innerHTML = `
                <div class="col-12">
                    <article class="business-card owner-overview-card h-100">
                        <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
                            <div>
                                <p class="section-kicker mb-2">My business snapshot</p>
                                <strong class="d-block mb-2">${escapeMarkup(business.business_name)}</strong>
                                <p class="text-muted mb-0">${escapeMarkup(business.owner_name)} · ${escapeMarkup(business.sector)} · ${escapeMarkup(business.district)}</p>
                            </div>
                            <span class="pill-note ${business.profile_score >= 75 ? 'pill-note-success' : 'pill-note-muted'} align-self-start">${business.profile_label}</span>
                        </div>
                        <div class="workspace-detail-grid owner-summary-grid">
                            <div class="workspace-detail-item"><span>Profile score</span><strong>${business.profile_score}/100 · ${business.profile_label}</strong></div>
                            <div class="workspace-detail-item"><span>Current credit</span><strong>${business.credit_score || 0}/100 · ${business.credit_label || 'Pending review'}</strong></div>
                            <div class="workspace-detail-item"><span>Phone</span><strong>${escapeMarkup(business.phone_number || 'Not provided')}</strong></div>
                            <div class="workspace-detail-item"><span>Mobile money</span><strong>${escapeMarkup(business.mobile_money_number || 'Not provided')}</strong></div>
                            <div class="workspace-detail-item"><span>TIN</span><strong>${escapeMarkup(business.tin_number || 'Not provided')}</strong></div>
                            <div class="workspace-detail-item"><span>NIN status</span><strong>${escapeMarkup(business.nin_verification_status_label || 'Not submitted')}</strong></div>
                            <div class="workspace-detail-item"><span>Employees</span><strong>${business.employee_count || 1}</strong></div>
                            <div class="workspace-detail-item"><span>Last sync</span><strong>${formatWorkspaceDate(business.updated_at)}</strong></div>
                            <div class="workspace-detail-item workspace-detail-item-wide"><span>Location</span><strong>${escapeMarkup(business.location_description || 'No location details on file yet.')}</strong></div>
                            <div class="workspace-detail-item workspace-detail-item-wide"><span>Stock focus</span><strong>${escapeMarkup(business.stock_focus || 'No stock focus recorded yet.')}</strong></div>
                        </div>
                    </article>
                </div>
                <div class="col-xl-7">
                    <article class="panel owner-stock-panel h-100">
                        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                            <div>
                                <p class="section-kicker mb-2">Daily stock input</p>
                                <strong class="d-block mb-2">Log inventory movement for the business</strong>
                                <p class="text-muted mb-0">Each stock entry updates the owner charts and pushes the current monthly report forward.</p>
                            </div>
                            <span class="pill-note ${analytics.lowStockCount === 0 ? 'pill-note-success' : 'pill-note-danger'} align-self-start">${analytics.lowStockCount === 0 ? 'Stock healthy' : `${analytics.lowStockCount} reorder alerts`}</span>
                        </div>
                        <div class="workspace-detail-grid mb-4">
                            <div class="workspace-detail-item"><span>Tracked items</span><strong>${analytics.latestStock.length}</strong></div>
                            <div class="workspace-detail-item"><span>Units on hand</span><strong>${Math.round(analytics.totalOnHand)}</strong></div>
                            <div class="workspace-detail-item"><span>7-day sold</span><strong>${Math.round(analytics.weeklyUnitsSold)}</strong></div>
                            <div class="workspace-detail-item"><span>Receipt trust</span><strong>${business.receipt_trust_score || 0}/100</strong></div>
                        </div>
                        <form class="row g-3" data-owner-stock-form data-business-id="${business.id}">
                            <div class="col-md-6">
                                <label class="form-label" for="owner_stock_date">Entry date</label>
                                <input class="form-control" id="owner_stock_date" name="date" type="date" value="${buildRelativeIsoDate(0)}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_stock_item_name">Stock item</label>
                                <input class="form-control" id="owner_stock_item_name" name="item_name" type="text" placeholder="Sugar, soap, cooking oil" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label" for="owner_stock_category">Category</label>
                                <input class="form-control" id="owner_stock_category" name="category" type="text" value="${escapeMarkup(business.sector || 'Retail')}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label" for="owner_stock_unit">Unit</label>
                                <input class="form-control" id="owner_stock_unit" name="unit" type="text" value="units">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label" for="owner_stock_selling_price">Selling price per unit (UGX)</label>
                                <input class="form-control" id="owner_stock_selling_price" name="selling_price" type="number" min="0" step="100" value="${Math.max(2500, Math.round(Math.max(toNumber(business.average_monthly_profit) / 45, 2500) / 100) * 100)}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label" for="owner_stock_on_hand">Current stock on hand</label>
                                <input class="form-control" id="owner_stock_on_hand" name="on_hand" type="number" min="0" value="0" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label" for="owner_stock_received">Units received today</label>
                                <input class="form-control" id="owner_stock_received" name="received" type="number" min="0" value="0">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label" for="owner_stock_sold">Units sold today</label>
                                <input class="form-control" id="owner_stock_sold" name="sold" type="number" min="0" value="0">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label" for="owner_stock_reorder_level">Reorder level</label>
                                <input class="form-control" id="owner_stock_reorder_level" name="reorder_level" type="number" min="0" value="12">
                            </div>
                            <div class="col-12">
                                <div class="form-status" data-owner-stock-message></div>
                            </div>
                            <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center owner-form-footer">
                                <button class="btn btn-warning btn-lg px-4" type="submit">Save stock entry</button>
                                <small class="text-muted">This saves directly to the database-backed owner workspace and refreshes the charts immediately.</small>
                            </div>
                        </form>
                        <div class="table-responsive mt-4 owner-stock-table">
                            <table class="table align-middle mb-0">
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
                                    ${(ownerData.stockEntries || []).length > 0
                                        ? (ownerData.stockEntries || [])
                                            .slice(0, 6)
                                            .map((entry) => `
                                                <tr>
                                                    <td>
                                                        <strong class="d-block">${escapeMarkup(entry.item_name || 'Unnamed item')}</strong>
                                                        <span class="text-muted small">${escapeMarkup(entry.category || 'Retail')} · ${escapeMarkup(entry.unit || 'units')}</span>
                                                    </td>
                                                    <td>${formatWorkspaceDate(entry.date)}</td>
                                                    <td>${Math.round(toNumber(entry.on_hand))}</td>
                                                    <td>${Math.round(toNumber(entry.sold))}</td>
                                                    <td>${Math.round(toNumber(entry.reorder_level))}</td>
                                                    <td><span class="pill-note ${toNumber(entry.on_hand) <= toNumber(entry.reorder_level) ? 'pill-note-danger' : 'pill-note-success'}">${toNumber(entry.on_hand) <= toNumber(entry.reorder_level) ? 'Reorder soon' : 'Healthy'}</span></td>
                                                </tr>
                                            `)
                                            .join('')
                                        : `
                                            <tr>
                                                <td colspan="6" class="text-muted">No stock entries saved yet. Add the first daily stock update to start the live charts.</td>
                                            </tr>
                                        `}
                                </tbody>
                            </table>
                        </div>
                    </article>
                </div>
                <div class="col-xl-5">
                    <article class="panel owner-report-panel h-100">
                        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                            <div>
                                <p class="section-kicker mb-2">Live graphs and monthly report</p>
                                <strong class="d-block mb-2">Read business movement as you record it</strong>
                                <p class="text-muted mb-0">Stock levels and sales trend are refreshed from the same owner workspace data.</p>
                            </div>
                            <span class="pill-note pill-note-muted align-self-start">Database-backed analytics</span>
                        </div>
                        <div class="chart-frame chart-frame-wide mb-4 owner-chart-frame">
                            <canvas id="ownerStockPositionChart"></canvas>
                        </div>
                        <div class="chart-frame chart-frame-tall mb-4 owner-chart-frame">
                            <canvas id="ownerSalesTrendChart"></canvas>
                        </div>
                        <div class="workspace-detail-grid">
                            <div class="workspace-detail-item"><span>This month sales</span><strong>${formatCurrencyUGX(analytics.currentMonth.revenue)}</strong></div>
                            <div class="workspace-detail-item"><span>This month orders</span><strong>${Math.round(toNumber(analytics.currentMonth.orders))}</strong></div>
                            <div class="workspace-detail-item"><span>6-month sales</span><strong>${formatCurrencyUGX(analytics.totalRevenue)}</strong></div>
                            <div class="workspace-detail-item"><span>Average margin</span><strong>${analytics.grossMargin}%</strong></div>
                            <div class="workspace-detail-item"><span>Best month</span><strong>${escapeMarkup(analytics.bestMonth.label)} · ${formatCurrencyUGX(analytics.bestMonth.revenue)}</strong></div>
                            <div class="workspace-detail-item"><span>Momentum</span><strong>${formatSignedCurrencyUGX(analytics.salesMomentum)}</strong></div>
                        </div>
                        <div class="registration-feed mt-4 owner-report-feed">
                            <div class="feed-item"><p class="mb-0 text-muted">This month the workspace has tracked ${Math.round(analytics.weeklyUnitsSold)} units sold and ${analytics.lowStockCount} stock lines below the reorder threshold.</p></div>
                            <div class="feed-item"><p class="mb-0 text-muted">Use the latest month graph before lender conversations so the business story stays current.</p></div>
                        </div>
                    </article>
                </div>
                <div class="col-lg-6">
                    <article class="panel owner-document-panel h-100">
                        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                            <div>
                                <p class="section-kicker mb-2">Business documents</p>
                                <strong class="d-block mb-2">Track the files needed for compliance and credit</strong>
                                <p class="text-muted mb-0">Add references for licences, statements, and business papers so the owner pack feels complete.</p>
                            </div>
                            <span class="pill-note pill-note-muted align-self-start">Database-backed tracker</span>
                        </div>
                        <form class="row g-3" data-owner-document-form data-business-id="${business.id}">
                            <div class="col-md-6">
                                <label class="form-label" for="owner_document_name">Document name</label>
                                <input class="form-control" id="owner_document_name" name="name" type="text" placeholder="Trading licence" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_document_type">Document type</label>
                                <input class="form-control" id="owner_document_type" name="type" type="text" placeholder="Compliance, Finance, Tax">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_document_reference">Reference</label>
                                <input class="form-control" id="owner_document_reference" name="reference" type="text" placeholder="Reference number or note">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label" for="owner_document_due_date">Due date</label>
                                <input class="form-control" id="owner_document_due_date" name="due_date" type="date">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label" for="owner_document_status">Status</label>
                                <select class="form-select" id="owner_document_status" name="status">
                                    <option value="Pending">Pending</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Submitted">Submitted</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <div class="form-status" data-owner-document-message></div>
                            </div>
                            <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center owner-form-footer">
                                <button class="btn btn-outline-success btn-lg px-4" type="submit">Add document reference</button>
                                <small class="text-muted">This stores document metadata only. File uploads can be added when the backend is ready.</small>
                            </div>
                        </form>
                        <div class="registration-feed mt-4 owner-document-feed">
                            ${(ownerData.documents || []).length > 0
                                ? (ownerData.documents || [])
                                    .slice(0, 5)
                                    .map((document) => `
                                        <div class="feed-item">
                                            <div class="d-flex justify-content-between gap-3 mb-2">
                                                <strong>${escapeMarkup(document.name || 'Untitled document')}</strong>
                                                <span class="pill-note ${['ready', 'submitted', 'verified', 'active'].includes(String(document.status || '').toLowerCase()) ? 'pill-note-success' : 'pill-note-muted'}">${escapeMarkup(document.status || 'Pending')}</span>
                                            </div>
                                            <div class="text-muted small mb-1">${escapeMarkup(document.type || 'General')} · ${escapeMarkup(document.reference || 'No reference yet')}</div>
                                            <div class="text-muted small">${document.due_date ? `Due ${formatWorkspaceDate(document.due_date)}` : 'No due date recorded'}</div>
                                        </div>
                                    `)
                                    .join('')
                                : '<div class="feed-item"><p class="mb-0 text-muted">No document references saved yet. Add the first compliance or finance record for this business.</p></div>'}
                        </div>
                    </article>
                </div>
                <div class="col-lg-6">
                    <article class="panel owner-credit-intake-panel h-100">
                        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                            <div>
                                <p class="section-kicker mb-2">Credit score registration</p>
                                <strong class="d-block mb-2">Capture a lender intake draft</strong>
                                <p class="text-muted mb-0">This draft is saved with the business workspace so the same credit pack appears on the next sign-in.</p>
                            </div>
                            <span class="pill-note pill-note-success align-self-start">${creditPreview.score}/100 preview</span>
                        </div>
                        <div class="workspace-detail-grid mb-4">
                            <div class="workspace-detail-item"><span>Credit band</span><strong>${escapeMarkup(creditPreview.band)}</strong></div>
                            <div class="workspace-detail-item"><span>Document coverage</span><strong>${creditPreview.documentCoverage}%</strong></div>
                            <div class="workspace-detail-item"><span>Inventory discipline</span><strong>${creditPreview.inventoryDiscipline}%</strong></div>
                            <div class="workspace-detail-item"><span>Affordability</span><strong>${creditPreview.affordability}%</strong></div>
                        </div>
                        <form class="row g-3" data-owner-credit-intake-form data-business-id="${business.id}">
                            <div class="col-md-6">
                                <label class="form-label" for="owner_credit_requested_amount">Requested amount (UGX)</label>
                                <input class="form-control" id="owner_credit_requested_amount" name="requested_amount" type="number" min="0" step="1000" value="${Math.round(toNumber(ownerData.creditProfile.requested_amount))}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_credit_repayment_window">Repayment window</label>
                                <input class="form-control" id="owner_credit_repayment_window" name="repayment_window" type="text" value="${escapeMarkup(ownerData.creditProfile.repayment_window || '6 months')}">
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="owner_credit_loan_purpose">Loan purpose</label>
                                <input class="form-control" id="owner_credit_loan_purpose" name="loan_purpose" type="text" value="${escapeMarkup(ownerData.creditProfile.loan_purpose || '')}" placeholder="Expand stock depth, refrigeration, supplier payments">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_credit_bookkeeping_score">Bookkeeping score</label>
                                <input class="form-control" id="owner_credit_bookkeeping_score" name="bookkeeping_score" type="number" min="0" max="100" value="${clampScoreValue(ownerData.creditProfile.bookkeeping_score)}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_credit_supplier_score">Supplier confidence</label>
                                <input class="form-control" id="owner_credit_supplier_score" name="supplier_score" type="number" min="0" max="100" value="${clampScoreValue(ownerData.creditProfile.supplier_score)}">
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="owner_credit_collateral_notes">Collateral or supporting notes</label>
                                <textarea class="form-control" id="owner_credit_collateral_notes" name="collateral_notes" rows="3" placeholder="Inventory, guarantor, mobile-money trail, supplier support">${escapeMarkup(ownerData.creditProfile.collateral_notes || '')}</textarea>
                            </div>
                            <div class="col-12">
                                <div class="form-status" data-owner-credit-intake-message></div>
                            </div>
                            <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center owner-form-footer">
                                <button class="btn btn-warning btn-lg px-4" type="submit">Save credit intake</button>
                                <small class="text-muted">Saved to the business workspace and recalculated from the latest live stock, sales, and document data.</small>
                            </div>
                        </form>
                    </article>
                </div>
                <div class="col-lg-6">
                    ${buildCreditRegistrationPanel(business)}
                </div>
                <div class="col-12">
                    <article class="panel owner-edit-panel h-100">
                        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                            <div>
                                <p class="section-kicker mb-2">Owner adjustments</p>
                                <strong class="d-block mb-2">Update the linked business profile</strong>
                                <p class="text-muted mb-0">Saved changes persist to your business account so the next sign-in starts with the latest data.</p>
                            </div>
                            <span class="pill-note pill-note-muted align-self-start">Saved to account</span>
                        </div>
                        <form class="row g-3" data-owner-business-form data-business-id="${business.id}">
                            <div class="col-md-6">
                                <label class="form-label" for="owner_business_name">Business name</label>
                                <input class="form-control" id="owner_business_name" name="business_name" type="text" value="${escapeMarkup(business.business_name || '')}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_phone_number">Phone number</label>
                                <input class="form-control" id="owner_phone_number" name="phone_number" type="text" value="${escapeMarkup(business.phone_number || '')}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_mobile_money_number">Mobile money number</label>
                                <input class="form-control" id="owner_mobile_money_number" name="mobile_money_number" type="text" value="${escapeMarkup(business.mobile_money_number || '')}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_tin_number">TIN number</label>
                                <input class="form-control" id="owner_tin_number" name="tin_number" type="text" value="${escapeMarkup(business.tin_number || '')}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_district">District</label>
                                <input class="form-control" id="owner_district" name="district" type="text" value="${escapeMarkup(business.district || '')}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_sector">Business sector</label>
                                <input class="form-control" id="owner_sector" name="sector" type="text" value="${escapeMarkup(business.sector || '')}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_monthly_revenue_band">Monthly revenue band</label>
                                <input class="form-control" id="owner_monthly_revenue_band" name="monthly_revenue_band" type="text" value="${escapeMarkup(business.monthly_revenue_band || '')}" placeholder="UGX 2M - 6M">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_employee_count">Employee count</label>
                                <input class="form-control" id="owner_employee_count" name="employee_count" type="number" min="1" value="${business.employee_count || 1}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_inventory_value_estimate">Inventory value estimate (UGX)</label>
                                <input class="form-control" id="owner_inventory_value_estimate" name="inventory_value_estimate" type="number" min="0" step="0.01" value="${business.inventory_value_estimate || 0}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_average_monthly_profit">Average monthly profit (UGX)</label>
                                <input class="form-control" id="owner_average_monthly_profit" name="average_monthly_profit" type="number" min="0" step="0.01" value="${business.average_monthly_profit || 0}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_average_monthly_mobile_money">Average monthly mobile money (UGX)</label>
                                <input class="form-control" id="owner_average_monthly_mobile_money" name="average_monthly_mobile_money" type="number" min="0" step="0.01" value="${business.average_monthly_mobile_money || 0}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="owner_receipt_count">Receipt count</label>
                                <input class="form-control" id="owner_receipt_count" name="receipt_count" type="number" min="0" value="${business.receipt_count || 0}">
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="owner_receipt_value_total">Receipt value total (UGX)</label>
                                <input class="form-control" id="owner_receipt_value_total" name="receipt_value_total" type="number" min="0" step="0.01" value="${business.receipt_value_total || 0}">
                                <div class="form-text">These fields drive the fraud checks and lift the credit percentage when the evidence is internally consistent.</div>
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="owner_location_description">Location description</label>
                                <input class="form-control" id="owner_location_description" name="location_description" type="text" value="${escapeMarkup(business.location_description || '')}" placeholder="Trading centre or market location">
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="owner_stock_focus">Stock focus</label>
                                <input class="form-control" id="owner_stock_focus" name="stock_focus" type="text" value="${escapeMarkup(business.stock_focus || '')}" placeholder="Fast-moving goods, groceries, farm supplies">
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="owner_notes">Operating notes</label>
                                <textarea class="form-control" id="owner_notes" name="notes" rows="3" placeholder="Add useful operational notes for your next session.">${escapeMarkup(business.notes || '')}</textarea>
                            </div>
                            <div class="col-12">
                                <div class="form-status" data-owner-business-message></div>
                            </div>
                            <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center owner-form-footer">
                                <button class="btn btn-warning btn-lg px-4" type="submit" data-owner-business-submit>Save adjustments</button>
                                <small class="text-muted">These changes stay attached to your business profile after logout and appear again the next time you sign in.</small>
                            </div>
                        </form>
                    </article>
                </div>
            `;
        }

        if (currentUserCard) {
            currentUserCard.innerHTML = `
                <strong class="d-block mb-2">${escapeMarkup(user.display_name)}</strong>
                <div class="small mb-1"><strong>Username:</strong> ${escapeMarkup(user.username)}</div>
                <div class="small mb-1"><strong>Role:</strong> ${escapeMarkup(user.role_label)}</div>
                <div class="small mb-1"><strong>Linked business:</strong> ${escapeMarkup(business.business_name)}</div>
                <div class="small mb-1"><strong>Credit preview:</strong> ${creditPreview.score}/100 · ${escapeMarkup(creditPreview.band)}</div>
                <div class="small mb-1"><strong>Document pack:</strong> ${analytics.readyDocuments}/${analytics.documentCount} ready</div>
                <div class="small mb-1"><strong>Reorder alerts:</strong> ${analytics.lowStockCount}</div>
                <div class="small mb-3"><strong>Last saved:</strong> ${formatWorkspaceDate(business.updated_at)}</div>
                <a class="btn btn-outline-success btn-sm" href="?page=businesses">View my business profile</a>
            `;
        }

        if (roleNotes) {
            roleNotes.innerHTML = ownerGuidance
                .map((note) => `<div class="feed-item"><p class="mb-0 text-muted">${note}</p></div>`)
                .join('');
        }

        renderOwnerWorkspaceCharts(ownerData, analytics);
        bindOwnerBusinessForm(session);
        bindOwnerStockForm(session, businesses, business);
        bindOwnerDocumentForm(session, businesses, business);
        bindOwnerCreditIntakeForm(session, businesses, business);
        bindCreditRegistrationForm(session);
    };

    setStatusChip(authSessionStatus, 'Signed in', 'success');

    if (isOfficial) {
        renderOfficialWorkspace();
        return;
    }

    renderBusinessOwnerWorkspace();
};

const showLoginMessage = (message, tone) => {
    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;
    loginMessage.className = `form-status form-status-${tone} is-visible`;
};

const showRegisterMessage = (message, tone) => {
    if (!registerMessage) {
        return;
    }

    registerMessage.textContent = message;
    registerMessage.className = `form-status form-status-${tone} is-visible`;
};

if (searchInput) {
    searchInput.addEventListener('input', filterBusinessRows);
}

if (registrationForm) {
    syncDemoNote();
    loadServiceStatus();
    loadRecentRegistrations();

    if (demoToggle) {
        demoToggle.addEventListener('change', syncDemoNote);
    }

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const payload = {
            business_name: formData.get('business_name'),
            owner_name: formData.get('owner_name'),
            phone_number: formData.get('phone_number'),
            mobile_money_number: formData.get('mobile_money_number'),
            district: formData.get('district'),
            sector: formData.get('sector'),
            tin_number: formData.get('tin_number'),
            monthly_revenue_band: formData.get('monthly_revenue_band'),
            stock_focus: formData.get('stock_focus'),
            employee_count: formData.get('employee_count'),
            inventory_value_estimate: formData.get('inventory_value_estimate'),
            average_monthly_profit: formData.get('average_monthly_profit'),
            average_monthly_mobile_money: formData.get('average_monthly_mobile_money'),
            receipt_count: formData.get('receipt_count'),
            receipt_value_total: formData.get('receipt_value_total'),
            location_description: formData.get('location_description'),
            notes: formData.get('notes'),
            is_demo_account: Boolean(formData.get('is_demo_account')),
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving...';
        }

        try {
            const response = await fetch(`${apiBaseUrl}/businesses/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                const fieldSummary = Array.isArray(result.fields) ? ` ${result.fields.join(', ')}` : '';
                throw new Error(`${result.error || 'Unable to save registration.'}${fieldSummary}`.trim());
            }

            showRegistrationMessage('Business registration saved successfully.', 'success');
            registrationForm.reset();
            syncDemoNote();
            loadRecentRegistrations();
            loadServiceStatus();
        } catch (error) {
            showRegistrationMessage(error.message || 'Unable to save registration right now.', 'error');
            loadServiceStatus();
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Save registration';
            }
        }
    });
}

if (loginForm) {
    demoCredentialButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const username = button.dataset.username || '';
            const password = button.dataset.password || '';
            const usernameInput = loginForm.querySelector('[name="username"]');
            const passwordInput = loginForm.querySelector('[name="password"]');

            if (usernameInput) {
                usernameInput.value = username;
            }

            if (passwordInput) {
                passwordInput.value = password;
            }

            showLoginMessage('Credentials inserted. Submit to sign in.', 'success');
        });
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const payload = {
            username: String(formData.get('username') || '').trim(),
            password: String(formData.get('password') || ''),
        };

        if (loginSubmit) {
            loginSubmit.disabled = true;
            loginSubmit.textContent = 'Signing in...';
        }

        try {
            const result = await fetchJson('/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            storeSession(result.user);
            updateAuthNavigation(result);
            showLoginMessage(`Signed in as ${result.user.display_name}. Redirecting to the workspace...`, 'success');
            window.location.href = '?page=workspace';
        } catch (error) {
            showLoginMessage(error.message || 'Unable to sign in with the provided credentials.', 'error');
        } finally {
            if (loginSubmit) {
                loginSubmit.disabled = false;
                loginSubmit.textContent = 'Sign in';
            }
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const payload = {
            display_name: String(formData.get('display_name') || '').trim(),
            username: String(formData.get('username') || '').trim(),
            password: String(formData.get('password') || ''),
            confirm_password: String(formData.get('confirm_password') || ''),
            business_name: String(formData.get('business_name') || '').trim(),
            phone_number: String(formData.get('phone_number') || '').trim(),
            mobile_money_number: String(formData.get('mobile_money_number') || '').trim(),
            tin_number: String(formData.get('tin_number') || '').trim(),
            district: String(formData.get('district') || '').trim(),
            sector: String(formData.get('sector') || '').trim(),
            monthly_revenue_band: String(formData.get('monthly_revenue_band') || '').trim(),
            employee_count: String(formData.get('employee_count') || '1').trim(),
            inventory_value_estimate: String(formData.get('inventory_value_estimate') || '0').trim(),
            average_monthly_profit: String(formData.get('average_monthly_profit') || '0').trim(),
            average_monthly_mobile_money: String(formData.get('average_monthly_mobile_money') || '0').trim(),
            receipt_count: String(formData.get('receipt_count') || '0').trim(),
            receipt_value_total: String(formData.get('receipt_value_total') || '0').trim(),
            stock_focus: String(formData.get('stock_focus') || '').trim(),
            location_description: String(formData.get('location_description') || '').trim(),
            notes: String(formData.get('notes') || '').trim(),
        };

        if (registerSubmit) {
            registerSubmit.disabled = true;
            registerSubmit.textContent = 'Creating...';
        }

        try {
            const result = await fetchJson('/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            storeSession(result.user);
            updateAuthNavigation(result);
            showRegisterMessage(`Business owner account created for ${result.user.display_name}. Redirecting to the workspace...`, 'success');
            registerForm.reset();
            window.location.href = '?page=workspace';
        } catch (error) {
            showRegisterMessage(error.message || 'Unable to create an account right now.', 'error');
        } finally {
            if (registerSubmit) {
                registerSubmit.disabled = false;
                registerSubmit.textContent = 'Create account';
            }
        }
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await fetchJson('/auth/logout/', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            // The local session should still clear even if the service is unavailable.
        }

        clearSession();
        updateAuthNavigation(null);

        if (currentPage === 'workspace') {
            window.location.href = '?page=login';
        }
    });
}

const initializeApp = async () => {
    const session = await hydrateSession();

    updateDashboardHeroActions(session);

    if (!session?.user && !publicPages.has(currentPage)) {
        window.location.replace('index.php');
        return;
    }

    if (session?.user?.role === 'business_owner' && currentPage === 'registration') {
        window.location.replace('?page=workspace');
        return;
    }

    if (!session?.user && currentPage === 'dashboard') {
        renderGuestAccessWall();
        document.body.classList.remove('auth-pending');
        return;
    }

    if (loginForm && session?.user) {
        showLoginMessage(`Already signed in as ${session.user.display_name}. You can continue to the workspace.`, 'success');
    }

    initializeCharts();

    const shouldLoadBusinesses = Boolean(
        businessList
        || workspaceContainer
        || creditLiveMetrics
        || creditShortlist
        || creditRegistrationContent
        || governmentCategories
        || governmentDistrictTable
        || governmentInterventions,
    );
    const businesses = shouldLoadBusinesses ? await loadBusinesses() : [];

    if (workspaceContainer) {
        renderWorkspace(session, businesses);
    }

    renderCreditPage(session, businesses);
    renderGovernmentPage(session, businesses);

    document.body.classList.remove('auth-pending');
};

initializeApp();