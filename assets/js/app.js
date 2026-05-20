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

const isLocalFrontend = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const configuredApiBaseUrl = (appData.apiBaseUrl || 'http://127.0.0.1:8001/api').replace(/\/$/, '');
// Keep local frontends pointed at a stable service address even when the frontend port changes.
const localApiBaseUrl = 'http://127.0.0.1:8001/api';
const apiBaseUrl = isLocalFrontend ? localApiBaseUrl : configuredApiBaseUrl;
const authStorageKey = 'ledgerlift.auth.session';
const publicPages = new Set(['dashboard', 'login']);

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
            'Demo accounts are useful for walkthroughs but should not enter real credit committees.',
        ],
        actions: [
            { title: 'Inspect credit view', detail: 'Use the credit engine page to explain the scoring logic behind the MVP.', href: '?page=credit', cta: 'Open credit engine' },
            { title: 'Review best live profiles', detail: 'Open the live registry and focus on businesses with the strongest completeness scores.', href: '?page=businesses', cta: 'Open business registry' },
        ],
    },
    field_agent: {
        workspaceTitle: 'Field agent workspace',
        workspaceDescription: 'Register new shops quickly, keep demo mode available for showcases, and follow up on incomplete business profiles.',
        notes: [
            'Use demo mode when the business has no working TIN but the team still needs a full product demo.',
            'Collect mobile money numbers and revenue bands early because they improve the profile score quickly.',
            'Review recent live registrations daily and close the biggest completeness gaps first.',
        ],
        actions: [
            { title: 'Register a new shop', detail: 'Open the onboarding flow and capture the next business into the pilot.', href: '?page=registration', cta: 'Open registration' },
            { title: 'Review incomplete profiles', detail: 'Use the live registry to identify businesses that still need TIN or revenue details.', href: '?page=businesses', cta: 'Open business registry' },
        ],
    },
};

const guestGateCopy = {
    title: 'Sign in or create an account to unlock the live platform',
    description: 'LedgerLift Uganda helps teams onboard informal businesses, monitor credit readiness, and focus support where it matters most. Live registry views, score insights, and role workspaces stay locked until a user signs in.',
    highlights: [
        'Business onboarding with optional TIN capture for evolving tax verification.',
        'Credit-readiness signals built from payment history, stock detail, and record quality.',
        'Government and lender workspaces for program oversight and first-loan decisions.',
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
                    <p class="text-muted mb-4">Only signed-in users can open the live registry, credit insights, government view, registration tools, and the role workspace.</p>
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
        .sort((left, right) => (right.profile_score || 0) - (left.profile_score || 0))
        .slice(0, 3);

    topBusinesses.innerHTML = strongest
        .map((business) => `
            <div class="feed-item">
                <strong>${business.business_name}</strong>
                <div class="text-muted small mb-2">${business.owner_name} · ${business.district}</div>
                <div class="feed-meta">
                    <span>${business.profile_score}/100 ${business.profile_label}</span>
                    <span>${business.account_mode}</span>
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
                        <div class="small fw-semibold mb-2">${business.profile_score}/100 · ${business.profile_label}</div>
                        <div class="progress score-progress">
                            <div class="progress-bar" role="progressbar" style="width: ${business.profile_score}%" aria-valuenow="${business.profile_score}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                    <td>
                        <span class="status-pill ${business.tax_lookup_status === 'ready_for_lookup' ? 'status-pill-watch' : business.tax_lookup_status === 'demo_bypass' ? 'status-pill-high' : 'status-pill-low'}">${business.tax_lookup_status_label}</span>
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

        renderBusinessRows(businesses);
        renderTopBusinesses(businesses);
        setStatusChip(businessSyncStatus, 'Live registry ready', 'success');

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
        ? 'Demo mode is active. The business can be registered without a TIN and will be marked as a showcase account.'
        : 'Demo accounts can be created without a TIN so the team can showcase onboarding and credit flows before the tax integration is live.';
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
                    <span>${business.tax_lookup_status.replace(/_/g, ' ')}</span>
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
            workspaceDescription.textContent = 'Use one of the seeded demo accounts to unlock role-specific tasks, live business metrics, and the correct dashboard links.';
        }

        if (currentUserCard) {
            currentUserCard.innerHTML = `
                <strong class="d-block mb-2">Not signed in</strong>
                <p class="mb-3 text-muted">Authenticate with a seeded account to view a role-specific workspace.</p>
                <a class="btn btn-outline-success btn-sm" href="?page=login">Go to login</a>
            `;
        }

        if (roleNotes) {
            roleNotes.textContent = 'Role-specific notes will appear here after sign-in.';
        }

        return;
    }

    const blueprint = roleBlueprints[user.role] || roleBlueprints.field_agent;
    const totalBusinesses = businesses.length;
    const tinReadyCount = businesses.filter((business) => business.tax_lookup_status === 'ready_for_lookup').length;
    const demoCount = businesses.filter((business) => business.is_demo_account).length;
    const strongProfiles = businesses.filter((business) => (business.profile_score || 0) >= 75).length;
    const averageScore = totalBusinesses
        ? Math.round(businesses.reduce((sum, business) => sum + (business.profile_score || 0), 0) / totalBusinesses)
        : 0;

    const metricsByRole = {
        government: [
            { label: 'Registered businesses', value: String(totalBusinesses), detail: 'All live registrations currently visible.' },
            { label: 'TIN-ready businesses', value: String(tinReadyCount), detail: 'Profiles ready for future URA lookup.' },
            { label: 'Demo accounts', value: String(demoCount), detail: 'Showcase registrations kept separate from live activity.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Completeness level across the current registry.' },
        ],
        lender: [
            { label: 'Strong profiles', value: String(strongProfiles), detail: 'Businesses above the current readiness threshold.' },
            { label: 'TIN-ready businesses', value: String(tinReadyCount), detail: 'Best candidates for formal credit pilots.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Use this as a quick registry quality signal.' },
            { label: 'Live businesses', value: String(totalBusinesses - demoCount), detail: 'Records that are not marked as demo-only.' },
        ],
        field_agent: [
            { label: 'Businesses onboarded', value: String(totalBusinesses), detail: 'Current businesses captured in the registry.' },
            { label: 'Profiles missing TIN', value: String(totalBusinesses - tinReadyCount - demoCount), detail: 'Follow up when formalization is appropriate.' },
            { label: 'Demo registrations', value: String(demoCount), detail: 'Useful for product demos before tax verification goes live.' },
            { label: 'Average profile score', value: `${averageScore}/100`, detail: 'Completeness level of the captured business records.' },
        ],
    };

    if (workspaceTitle) {
        workspaceTitle.textContent = blueprint.workspaceTitle;
    }

    if (workspaceDescription) {
        workspaceDescription.textContent = blueprint.workspaceDescription;
    }

    setStatusChip(authSessionStatus, 'Signed in', 'success');

    if (roleMetrics) {
        roleMetrics.innerHTML = metricsByRole[user.role]
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
    }

    if (roleActions) {
        roleActions.innerHTML = blueprint.actions
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
    }

    if (currentUserCard) {
        currentUserCard.innerHTML = `
            <strong class="d-block mb-2">${user.display_name}</strong>
            <div class="small mb-1"><strong>Username:</strong> ${user.username}</div>
            <div class="small mb-1"><strong>Role:</strong> ${user.role_label}</div>
            <div class="small mb-3"><strong>TIN required:</strong> ${user.requires_tin ? 'Yes' : 'No'}</div>
            <a class="btn btn-outline-success btn-sm" href="?page=${user.recommended_page}">Open recommended page</a>
        `;
    }

    if (roleNotes) {
        roleNotes.innerHTML = blueprint.notes
            .map((note) => `<div class="feed-item"><p class="mb-0 text-muted">${note}</p></div>`)
            .join('');
    }
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
            showRegisterMessage(`Account created for ${result.user.display_name}. Redirecting to the workspace...`, 'success');
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

    if (!session?.user && currentPage === 'dashboard') {
        renderGuestAccessWall();
        document.body.classList.remove('auth-pending');
        return;
    }

    if (loginForm && session?.user) {
        showLoginMessage(`Already signed in as ${session.user.display_name}. You can continue to the workspace.`, 'success');
    }

    initializeCharts();

    const businesses = businessList || workspaceContainer ? await loadBusinesses() : [];

    if (workspaceContainer) {
        renderWorkspace(session, businesses);
    }

    document.body.classList.remove('auth-pending');
};

initializeApp();