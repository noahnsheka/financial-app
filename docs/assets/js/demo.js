const pages = {
    dashboard: {
        label: 'Dashboard',
        eyebrow: 'Government pilot overview',
        title: 'Informal business intelligence for Uganda',
        description: 'Monitor small-shop cash flow, stock pressure, and credit readiness in one place before turning the pilot into a production platform.',
    },
    businesses: {
        label: 'Businesses',
        eyebrow: 'Field operations registry',
        title: 'Review businesses at the individual shop level',
        description: 'Search the pilot registry, compare risk indicators, and spot which businesses are keeping reliable digital records.',
    },
    registration: {
        label: 'Registration',
        eyebrow: 'Business onboarding',
        title: 'Register new informal businesses into the pilot',
        description: 'Capture shop details, mobile money references, and TIN data in one place using a database-exported snapshot of the live platform structure.',
    },
    login: {
        label: 'Login',
        eyebrow: 'Access portal',
        title: 'Preview the role-based flows',
        description: 'The GitHub Pages build shows snapshot content. Use the local stack for real sign-in and writes.',
        nav: false,
    },
    workspace: {
        label: 'Workspace',
        eyebrow: 'Role workspace',
        title: 'Preview the role-based control room',
        description: 'This static build can render a database-backed owner workspace preview, but save actions stay disabled here.',
        nav: false,
    },
    credit: {
        label: 'Credit Engine',
        eyebrow: 'Loan readiness model',
        title: 'Translate shop records into lender-ready credit signals',
        description: 'Combine payment consistency, stock discipline, and operating resilience into a score that lenders and government programs can understand.',
    },
    government: {
        label: 'Government View',
        eyebrow: 'Policy and oversight',
        title: 'Surface where intervention will matter most',
        description: 'Use aggregated district-level patterns to decide where compliance support, digital onboarding, or financing programs should go next.',
    },
};

const defaultBootstrap = {
    registrationForm: {
        districts: [],
        sectors: [],
        revenueBands: [],
    },
    scoreBreakdown: [],
    loanPrograms: [],
    heroStats: [],
    metrics: [],
    collections: {
        labels: [],
        mobileMoney: [],
        cash: [],
        supplierPayments: [],
    },
    inventoryMix: {
        labels: [],
        values: [],
    },
    scoreTrend: {
        labels: [],
        values: [],
    },
    districtPerformance: {
        labels: [],
        scores: [],
    },
    stockAlerts: [],
    watchlist: [],
    interventions: [],
};

const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildHref = (pageKey) => (pageKey === 'dashboard' ? './' : `?page=${encodeURIComponent(pageKey)}`);

const renderOptions = (values, placeholder) => [
    `<option value="">${escapeHtml(placeholder)}</option>`,
    ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`),
].join('');

const renderMetricCards = (metrics) => metrics.map((metric) => `
    <div class="col-sm-6 col-xl-3">
        <article class="panel metric-card h-100">
            <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">${escapeHtml(metric.label)}</p>
                    <h2 class="metric-value mb-2">${escapeHtml(metric.value)}</h2>
                    <p class="metric-delta mb-0">${escapeHtml(metric.delta)}</p>
                </div>
                <span class="metric-icon metric-icon-${escapeHtml(metric.tone)}">
                    <i class="bi bi-${escapeHtml(metric.icon)}"></i>
                </span>
            </div>
        </article>
    </div>
`).join('');

const buildDashboardView = (data) => `
    <section class="row g-3 mb-3">
        ${renderMetricCards(data.metrics || [])}
    </section>

    <section class="row g-3 mb-3">
        <div class="col-lg-8">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">Revenue signal</p>
                        <h2 class="h4 mb-1">Mobile money is becoming the core evidence trail</h2>
                        <p class="text-muted mb-0">The strongest shops are shifting toward digital payment capture while supplier activity grows in parallel.</p>
                    </div>
                    <span class="pill-note align-self-start">6-month trend</span>
                </div>
                <div class="chart-frame chart-frame-wide">
                    <canvas id="revenueTrendChart"></canvas>
                </div>
            </article>
        </div>

        <div class="col-lg-4">
            <article class="panel h-100">
                <p class="section-kicker mb-2">Inventory mix</p>
                <h2 class="h4 mb-1">Fast-moving categories driving the pilot</h2>
                <p class="text-muted mb-3">Groceries and beverages dominate the earliest onboarding wave, which makes stock monitoring a core risk control.</p>
                <div class="chart-frame chart-frame-tall">
                    <canvas id="inventoryMixChart"></canvas>
                </div>
            </article>
        </div>
    </section>

    <section class="row g-3">
        <div class="col-lg-7">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">Stock watch</p>
                        <h2 class="h4 mb-1">Businesses that need immediate follow-up</h2>
                        <p class="text-muted mb-0">Low inventory visibility will weaken both score quality and business continuity unless field teams intervene early.</p>
                    </div>
                    <span class="pill-note align-self-start">${(data.stockAlerts || []).length} open alerts</span>
                </div>

                <div class="table-responsive">
                    <table class="table align-middle mb-0">
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
                            ${(data.stockAlerts || []).map((alert) => `
                                <tr>
                                    <td>${escapeHtml(alert.business)}</td>
                                    <td>${escapeHtml(alert.district)}</td>
                                    <td>${escapeHtml(alert.category)}</td>
                                    <td>${escapeHtml(alert.days)}</td>
                                    <td><span class="status-pill status-pill-${escapeHtml(String(alert.severity || '').toLowerCase())}">${escapeHtml(alert.severity)}</span></td>
                                </tr>
                            `).join('') || '<tr><td colspan="5" class="text-muted">No current stock alerts in the exported snapshot.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </article>
        </div>

        <div class="col-lg-5">
            <article class="panel h-100">
                <p class="section-kicker mb-2">What to do next</p>
                <h2 class="h4 mb-3">MVP operating checklist</h2>
                <ul class="list-check">
                    <li>Capture mobile money references and supplier payments in one ledger so the score is based on verified activity.</li>
                    <li>Flag stock-outs before they hurt revenue patterns, because missing inventory data quickly becomes missing credit evidence.</li>
                    <li>Segment shops by district and sector so government teams can target support where adoption is weakest.</li>
                    <li>Use the strongest digital histories to pilot small working-capital loans before expanding nationally.</li>
                </ul>
            </article>
        </div>
    </section>
`;

const buildBusinessesView = () => `
    <section class="row g-4">
        <div class="col-lg-8">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                    <div>
                        <p class="section-kicker mb-2">Registry explorer</p>
                        <h2 class="h4 mb-1">Browse live business registrations</h2>
                        <p class="text-muted mb-0"><span data-business-count>0</span> businesses currently visible in the registry.</p>
                    </div>
                    <div class="d-flex flex-column flex-sm-row gap-2 align-items-stretch">
                        <span class="pill-note pill-note-muted" data-business-sync-status>Loading exported registry snapshot...</span>
                        <a class="btn btn-outline-success btn-lg" href="?page=registration">New registration</a>
                        <div class="search-panel">
                            <input type="search" class="form-control form-control-lg" data-business-search placeholder="Search by business, district, or sector">
                        </div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table align-middle mb-0">
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
                            <tr>
                                <td colspan="6" class="text-muted">Loading registrations...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="empty-state mt-4" data-business-empty>
                    No businesses in the exported snapshot match the current search.
                </div>
            </article>
        </div>

        <div class="col-lg-4">
            <article class="panel mb-4">
                <p class="section-kicker mb-2">Readiness markers</p>
                <h2 class="h4 mb-4">What this MVP tracks per shop</h2>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2">Profile and credit score</strong>
                    <p class="mb-0 text-muted">The registry separates completeness from lender-facing credit percentage so officials can see who is documented and who is actually ready.</p>
                </div>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2">Identity and fraud watch</strong>
                    <p class="mb-0 text-muted">NIN verification state, receipt trust, and consistency checks help flag businesses that need extra review before finance is offered.</p>
                </div>
                <div class="business-card">
                    <strong class="d-block mb-2">Operating evidence</strong>
                    <p class="mb-0 text-muted">Receipt totals, profit reporting, stock values, and mobile money feed the risk and readiness analytics.</p>
                </div>
            </article>

            <article class="panel">
                <p class="section-kicker mb-2">Best profiles</p>
                <h2 class="h4 mb-4">Top registrations right now</h2>
                <div class="registration-feed" data-top-businesses>
                    Loading the strongest registrations...
                </div>
            </article>
        </div>
    </section>
`;

const buildRegistrationView = (data) => `
    <section class="row g-4">
        <div class="col-lg-8">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                    <div>
                        <p class="section-kicker mb-2">Onboarding form</p>
                        <h2 class="h4 mb-1">Capture the business details needed for the MVP</h2>
                        <p class="text-muted mb-0">This static page uses a database-exported snapshot for preview only. Save actions are disabled here.</p>
                    </div>
                    <span class="pill-note pill-note-muted align-self-start" data-service-status>Snapshot mode</span>
                </div>

                <form class="row g-3" data-registration-form>
                    <div class="col-md-6">
                        <label class="form-label" for="business_name">Business name</label>
                        <input class="form-control" id="business_name" name="business_name" type="text" placeholder="Amina Retail Hub" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="owner_name">Owner name</label>
                        <input class="form-control" id="owner_name" name="owner_name" type="text" placeholder="Amina Nankya" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="phone_number">Phone number</label>
                        <input class="form-control" id="phone_number" name="phone_number" type="text" placeholder="+256700000000" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="mobile_money_number">Mobile money number</label>
                        <input class="form-control" id="mobile_money_number" name="mobile_money_number" type="text" placeholder="Optional if same as phone number">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="district">District</label>
                        <select class="form-select" id="district" name="district" required>
                            ${renderOptions(data.registrationForm?.districts || [], 'Choose a district')}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="sector">Business sector</label>
                        <select class="form-select" id="sector" name="sector" required>
                            ${renderOptions(data.registrationForm?.sectors || [], 'Choose a sector')}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="tin_number">TIN number</label>
                        <input class="form-control" id="tin_number" name="tin_number" type="text" placeholder="Optional for the MVP" data-tin-input>
                        <div class="form-text">When provided, the record is marked as ready for future tax verification.</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="monthly_revenue_band">Monthly revenue band</label>
                        <select class="form-select" id="monthly_revenue_band" name="monthly_revenue_band">
                            ${renderOptions(data.registrationForm?.revenueBands || [], 'Select revenue band')}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="stock_focus">Primary stock focus</label>
                        <input class="form-control" id="stock_focus" name="stock_focus" type="text" placeholder="Sugar, soap, beverages">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="employee_count">Employee count</label>
                        <input class="form-control" id="employee_count" name="employee_count" type="number" min="1" value="1">
                    </div>
                    <div class="col-12">
                        <hr class="my-1">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="inventory_value_estimate">Inventory value estimate (UGX)</label>
                        <input class="form-control" id="inventory_value_estimate" name="inventory_value_estimate" type="number" min="0" step="0.01" placeholder="2500000">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="average_monthly_profit">Average monthly profit (UGX)</label>
                        <input class="form-control" id="average_monthly_profit" name="average_monthly_profit" type="number" min="0" step="0.01" placeholder="680000">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="average_monthly_mobile_money">Average monthly mobile money (UGX)</label>
                        <input class="form-control" id="average_monthly_mobile_money" name="average_monthly_mobile_money" type="number" min="0" step="0.01" placeholder="2400000">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="receipt_count">Receipt count</label>
                        <input class="form-control" id="receipt_count" name="receipt_count" type="number" min="0" value="0">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="receipt_value_total">Receipt value total (UGX)</label>
                        <input class="form-control" id="receipt_value_total" name="receipt_value_total" type="number" min="0" step="0.01" placeholder="1800000">
                        <div class="form-text">Receipts, profit, stock value, and mobile money totals feed the fraud checks and credit-readiness percentage.</div>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="location_description">Location description</label>
                        <input class="form-control" id="location_description" name="location_description" type="text" placeholder="Trading center, market lane, or village cluster">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="notes">Notes</label>
                        <textarea class="form-control" id="notes" name="notes" rows="4" placeholder="Add anything useful for the pilot, such as supplier relationships, seasonal issues, or tax follow-up needs."></textarea>
                    </div>
                    <div class="col-12">
                        <div class="form-status" data-registration-message></div>
                    </div>
                    <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center">
                        <button class="btn btn-warning btn-lg px-4" type="submit" data-submit-button>Save registration</button>
                        <small class="text-muted">Open the local stack to write a real registration into the database.</small>
                    </div>
                </form>
            </article>
        </div>

        <div class="col-lg-4">
            <article class="panel mb-4">
                <p class="section-kicker mb-2">Verification strategy</p>
                <h2 class="h4 mb-4">Keep the tax and identity lookup path open</h2>
                <ul class="list-check compact-list mb-0">
                    <li>Allow TIN collection now, even if live verification is added later.</li>
                    <li>When a business becomes credit ready, capture the owner NIN for the NIRA or NITA verification flow.</li>
                    <li>Keep the business profile current because every saved record feeds oversight and owner dashboards.</li>
                </ul>
            </article>

            <article class="panel mb-4">
                <p class="section-kicker mb-2">Data integrity</p>
                <h2 class="h4 mb-4">Snapshot rules on Pages</h2>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2">Backed by the local DB export</strong>
                    <p class="mb-0 text-muted">The public pages use JSON snapshots exported from the Django database, not hand-written placeholder objects.</p>
                </div>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2">Read-only on GitHub Pages</strong>
                    <p class="mb-0 text-muted">Sign-in and save actions remain disabled here until the live deployment host is reachable again.</p>
                </div>
                <div class="business-card">
                    <strong class="d-block mb-2">Full flow locally</strong>
                    <p class="mb-0 text-muted">Run the PHP frontend and Django API together from the repository root for live auth and updates.</p>
                </div>
            </article>

            <article class="panel">
                <p class="section-kicker mb-2">Recent submissions</p>
                <h2 class="h4 mb-4">Latest registrations in the registry</h2>
                <div class="registration-feed" data-registration-feed>
                    Loading exported registrations...
                </div>
            </article>
        </div>
    </section>
`;

const buildLoginView = (data) => `
    <section class="row g-4">
        <div class="col-lg-7">
            <article class="panel mb-4">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                    <div>
                        <p class="section-kicker mb-2">Secure entry</p>
                        <h2 class="h4 mb-1">Sign in as an official or business owner</h2>
                        <p class="text-muted mb-0">GitHub Pages is running in snapshot mode, so these forms are disabled here even though the role flows are still previewable.</p>
                    </div>
                    <span class="pill-note pill-note-muted align-self-start">Snapshot preview</span>
                </div>

                <form class="row g-3" data-login-form>
                    <div class="col-md-6">
                        <label class="form-label" for="login_username">Username</label>
                        <input class="form-control" id="login_username" name="username" type="text" placeholder="gov.officer" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="login_password">Password</label>
                        <input class="form-control" id="login_password" name="password" type="password" placeholder="Enter your password" required>
                    </div>
                    <div class="col-12">
                        <div class="form-status" data-login-message></div>
                    </div>
                    <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center">
                        <button class="btn btn-warning btn-lg px-4" type="submit" data-login-submit>Sign in</button>
                        <small class="text-muted">Use the local stack for real authentication. Pages only renders preview content from DB snapshots.</small>
                    </div>
                </form>
            </article>

            <article class="panel" id="register-account">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                    <div>
                        <p class="section-kicker mb-2">Create access</p>
                        <h2 class="h4 mb-1">Create a business owner account</h2>
                        <p class="text-muted mb-0">The structure matches the live flow, but the write path is disabled on GitHub Pages.</p>
                    </div>
                    <span class="pill-note pill-note-muted align-self-start">Business owner access</span>
                </div>

                <form class="row g-3" data-register-form>
                    <div class="col-md-6">
                        <label class="form-label" for="register_display_name">Display name</label>
                        <input class="form-control" id="register_display_name" name="display_name" type="text" placeholder="Amina Nankya" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_username">Username</label>
                        <input class="form-control" id="register_username" name="username" type="text" placeholder="amina.agent" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_password">Password</label>
                        <input class="form-control" id="register_password" name="password" type="password" placeholder="Choose a secure password" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_confirm_password">Confirm password</label>
                        <input class="form-control" id="register_confirm_password" name="confirm_password" type="password" placeholder="Repeat your password" required>
                    </div>
                    <div class="col-12"><hr class="my-1"></div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_business_name">Business name</label>
                        <input class="form-control" id="register_business_name" name="business_name" type="text" placeholder="Wakiso Home Goods" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_phone_number">Business phone number</label>
                        <input class="form-control" id="register_phone_number" name="phone_number" type="text" placeholder="+256700000000" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_mobile_money_number">Mobile money number</label>
                        <input class="form-control" id="register_mobile_money_number" name="mobile_money_number" type="text" placeholder="Optional if same as phone number">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_tin_number">TIN number</label>
                        <input class="form-control" id="register_tin_number" name="tin_number" type="text" placeholder="Optional for now">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_district">District</label>
                        <select class="form-select" id="register_district" name="district" required>
                            ${renderOptions(data.registrationForm?.districts || [], 'Choose a district')}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_sector">Business sector</label>
                        <select class="form-select" id="register_sector" name="sector" required>
                            ${renderOptions(data.registrationForm?.sectors || [], 'Choose a sector')}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_monthly_revenue_band">Monthly revenue band</label>
                        <select class="form-select" id="register_monthly_revenue_band" name="monthly_revenue_band">
                            ${renderOptions(data.registrationForm?.revenueBands || [], 'Select revenue band')}
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_employee_count">Employee count</label>
                        <input class="form-control" id="register_employee_count" name="employee_count" type="number" min="1" value="1">
                    </div>
                    <div class="col-12"><hr class="my-1"></div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_inventory_value_estimate">Inventory value estimate (UGX)</label>
                        <input class="form-control" id="register_inventory_value_estimate" name="inventory_value_estimate" type="number" min="0" step="0.01" placeholder="Optional">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_average_monthly_profit">Average monthly profit (UGX)</label>
                        <input class="form-control" id="register_average_monthly_profit" name="average_monthly_profit" type="number" min="0" step="0.01" placeholder="Optional">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_average_monthly_mobile_money">Average monthly mobile money (UGX)</label>
                        <input class="form-control" id="register_average_monthly_mobile_money" name="average_monthly_mobile_money" type="number" min="0" step="0.01" placeholder="Optional">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="register_receipt_count">Receipt count</label>
                        <input class="form-control" id="register_receipt_count" name="receipt_count" type="number" min="0" value="0">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="register_receipt_value_total">Receipt value total (UGX)</label>
                        <input class="form-control" id="register_receipt_value_total" name="receipt_value_total" type="number" min="0" step="0.01" placeholder="Optional">
                        <div class="form-text">Optional evidence fields. The owner can still add or adjust them later inside the workspace.</div>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="register_stock_focus">Primary stock focus</label>
                        <input class="form-control" id="register_stock_focus" name="stock_focus" type="text" placeholder="Sugar, flour, beverages">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="register_location_description">Location description</label>
                        <input class="form-control" id="register_location_description" name="location_description" type="text" placeholder="Trading centre, market lane, or village cluster">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="register_notes">Business notes</label>
                        <textarea class="form-control" id="register_notes" name="notes" rows="3" placeholder="Add anything useful for the first owner dashboard, such as suppliers, repayment plans, or seasonal patterns."></textarea>
                    </div>
                    <div class="col-12">
                        <div class="form-status" data-register-message></div>
                    </div>
                    <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center">
                        <button class="btn btn-outline-success btn-lg px-4" type="submit" data-register-submit>Create owner account</button>
                        <small class="text-muted">Run the real stack locally to submit a business-owner account and linked profile.</small>
                    </div>
                </form>
            </article>
        </div>

        <div class="col-lg-5">
            <article class="panel mb-4">
                <p class="section-kicker mb-2">Preview paths</p>
                <h2 class="h4 mb-4">Open role-specific snapshot pages</h2>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2">Official analytics</strong>
                    <p class="mb-3 text-muted">Use the exported government and credit snapshots to review the current DB-backed portfolio state.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-outline-success btn-sm" href="?page=government">Government preview</a>
                        <a class="btn btn-outline-success btn-sm" href="?page=credit">Credit preview</a>
                    </div>
                </div>
                <div class="business-card">
                    <strong class="d-block mb-2">Owner workspace preview</strong>
                    <p class="mb-3 text-muted">The owner workspace page renders a read-only preview from the linked owner snapshot exported out of the database.</p>
                    <a class="btn btn-warning btn-sm" href="?page=workspace">Open owner workspace</a>
                </div>
            </article>

            <article class="panel">
                <p class="section-kicker mb-2">Role routing</p>
                <h2 class="h4 mb-4">What each account should see</h2>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2">Government officer</strong>
                    <p class="mb-0 text-muted">District-level oversight, TIN-ready business counts, and intervention priorities.</p>
                </div>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2">Lender</strong>
                    <p class="mb-0 text-muted">Credit-readiness signals, top profiles, and businesses ready for small-ticket facilities.</p>
                </div>
                <div class="business-card mb-3">
                    <strong class="d-block mb-2">Field agent</strong>
                    <p class="mb-0 text-muted">Business onboarding, TIN follow-up, and closure of incomplete profiles.</p>
                </div>
                <div class="business-card">
                    <strong class="d-block mb-2">Business owner</strong>
                    <p class="mb-0 text-muted">A private business-health view, linked profile details, and editable account adjustments when the live backend is available.</p>
                </div>
            </article>
        </div>
    </section>
`;

const buildCreditView = (data) => `
    <section class="row g-3 mb-3">
        ${(data.scoreBreakdown || []).map((signal) => `
            <div class="col-md-6 col-xl-3">
                <article class="panel h-100">
                    <p class="section-kicker mb-2">${escapeHtml(signal.weight)}</p>
                    <h2 class="h5 mb-3">${escapeHtml(signal.name)}</h2>
                    <p class="text-muted mb-0">${escapeHtml(signal.description)}</p>
                </article>
            </div>
        `).join('')}
    </section>

    <section class="row g-3 mb-3">
        <div class="col-lg-7">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">Credit trend</p>
                        <h2 class="h4 mb-1">The score improves as records become more complete</h2>
                        <p class="text-muted mb-0">This chart is powered by the exported live bootstrap snapshot.</p>
                    </div>
                    <span class="pill-note align-self-start">6-week model view</span>
                </div>
                <div class="chart-frame chart-frame-wide">
                    <canvas id="repaymentTrendChart"></canvas>
                </div>
            </article>
        </div>

        <div class="col-lg-5">
            <article class="panel h-100">
                <p class="section-kicker mb-2">Lender channels</p>
                <h2 class="h4 mb-3">Sample facilities for the MVP</h2>
                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Ticket size</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(data.loanPrograms || []).map((program) => `
                                <tr>
                                    <td>
                                        <strong class="d-block">${escapeHtml(program.provider)}</strong>
                                        <span class="text-muted small">${escapeHtml(program.requirement)}</span>
                                    </td>
                                    <td>${escapeHtml(program.size)}</td>
                                    <td><span class="pill-note">${escapeHtml(program.status)}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </article>
        </div>
    </section>

    <section class="row g-3 mb-3">
        <div class="col-lg-7">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">Live readiness analytics</p>
                        <h2 class="h4 mb-1">Signals that drive the credit percentage</h2>
                        <p class="text-muted mb-0">This page renders from an authenticated official snapshot exported out of the database.</p>
                    </div>
                    <span class="pill-note align-self-start">Snapshot analytics</span>
                </div>
                <div class="row g-3" data-credit-live-metrics>
                    <div class="col-12 text-muted">Loading credit analytics...</div>
                </div>
            </article>
        </div>

        <div class="col-lg-5">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">Credit-ready businesses</p>
                        <h2 class="h4 mb-1">Who could move into the next facility cohort</h2>
                        <p class="text-muted mb-0">This shortlist updates from the exported registry snapshot.</p>
                    </div>
                    <span class="pill-note align-self-start">Snapshot shortlist</span>
                </div>
                <div class="registration-feed" data-credit-shortlist>
                    Loading the credit shortlist...
                </div>
            </article>
        </div>
    </section>

    <section class="row g-3">
        <div class="col-lg-12">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">Credit-ready registration</p>
                        <h2 class="h4 mb-1">NIN-backed registration for the next step</h2>
                        <p class="text-muted mb-0">The static build can preview this panel, but submission stays disabled until the live API is reachable.</p>
                    </div>
                    <span class="pill-note align-self-start">Owner action preview</span>
                </div>
                <div data-credit-registration-content>
                    Loading the current credit registration preview...
                </div>
            </article>
        </div>
    </section>
`;

const buildGovernmentView = (data) => `
    <section class="row g-3 mb-3">
        <div class="col-lg-7">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">District performance</p>
                        <h2 class="h4 mb-1">Average score by pilot district</h2>
                        <p class="text-muted mb-0">This snapshot helps government teams see where digital record quality is strong enough for financing and formalization programs.</p>
                    </div>
                    <span class="pill-note align-self-start">Pilot benchmark</span>
                </div>
                <div class="chart-frame chart-frame-wide">
                    <canvas id="districtScoreChart"></canvas>
                </div>
            </article>
        </div>

        <div class="col-lg-5">
            <article class="panel h-100">
                <p class="section-kicker mb-2">Policy watchlist</p>
                <h2 class="h4 mb-3">Signals that need action</h2>
                ${(data.watchlist || []).map((item) => `
                    <div class="watchlist-item">
                        <strong class="d-block mb-2">${escapeHtml(item.title)}</strong>
                        <p class="mb-0 text-muted">${escapeHtml(item.detail)}</p>
                    </div>
                `).join('')}
            </article>
        </div>
    </section>

    <section class="row g-3">
        <div class="col-lg-4">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">Government categories</p>
                        <h2 class="h4 mb-1">Useful live analytics for Uganda oversight</h2>
                        <p class="text-muted mb-0">These categories break the registry into practical signals for formalization, fraud watch, identity assurance, and programme rollout.</p>
                    </div>
                </div>
                <div class="registration-feed" data-government-categories>
                    Loading exported government categories...
                </div>
            </article>
        </div>

        <div class="col-lg-8">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                    <div>
                        <p class="section-kicker mb-2">District registry</p>
                        <h2 class="h4 mb-1">District readiness and fraud watch</h2>
                        <p class="text-muted mb-0">Use this table to decide which districts need verification support, digital onboarding, or lender engagement next.</p>
                    </div>
                    <span class="pill-note align-self-start" data-government-district-count>Loading snapshot</span>
                </div>

                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>District</th>
                                <th>Businesses</th>
                                <th>Average credit</th>
                                <th>Credit ready</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody data-government-district-table>
                            <tr>
                                <td colspan="5" class="text-muted">Loading district analytics...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>
        </div>
    </section>

    <section class="row g-3 mt-0">
        <div class="col-lg-12">
            <article class="panel h-100">
                <p class="section-kicker mb-2">Recommended interventions</p>
                <h2 class="h4 mb-3">Actions the government team can take next</h2>
                <div class="row g-3" data-government-interventions>
                    <div class="col-12 text-muted">Loading intervention guidance...</div>
                </div>
            </article>
        </div>
    </section>
`;

const buildWorkspaceView = () => `
    <section class="row g-4" data-role-workspace>
        <div class="col-lg-8">
            <article class="panel h-100">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                    <div>
                        <p class="section-kicker mb-2">Role workspace</p>
                        <h2 class="h3 mb-2" data-workspace-title>Loading workspace preview</h2>
                        <p class="text-muted mb-0" data-workspace-description>Rendering the current owner snapshot exported from the Django database.</p>
                    </div>
                    <span class="pill-note pill-note-muted align-self-start" data-auth-session-status>Loading snapshot...</span>
                </div>

                <div class="row g-3 mb-4" data-role-metrics>
                    <div class="col-sm-6 col-xl-3">
                        <div class="metric-tile">
                            <span class="section-kicker mb-2">Loading</span>
                            <strong>--</strong>
                        </div>
                    </div>
                </div>

                <div class="row g-3" data-role-actions>
                    <div class="col-md-6">
                        <div class="business-card h-100">
                            <strong class="d-block mb-2">Workspace preview</strong>
                            <p class="mb-3 text-muted">A database-backed owner snapshot will render here once the shared runtime finishes loading.</p>
                        </div>
                    </div>
                </div>
            </article>
        </div>

        <div class="col-lg-4">
            <article class="panel mb-4">
                <p class="section-kicker mb-2">Current access</p>
                <h2 class="h4 mb-4">Snapshot account</h2>
                <div class="auth-profile-card" data-current-user-card>
                    <strong class="d-block mb-2">Loading account</strong>
                    <p class="mb-3 text-muted">Snapshot access details are loading.</p>
                </div>
            </article>

            <article class="panel">
                <p class="section-kicker mb-2">Role notes</p>
                <h2 class="h4 mb-4">Operating guidance</h2>
                <div class="registration-feed" data-role-notes>
                    Loading role-specific notes...
                </div>
            </article>
        </div>
    </section>
`;

const buildMainView = (pageKey, data) => {
    switch (pageKey) {
    case 'businesses':
        return buildBusinessesView();
    case 'registration':
        return buildRegistrationView(data);
    case 'login':
        return buildLoginView(data);
    case 'workspace':
        return buildWorkspaceView();
    case 'credit':
        return buildCreditView(data);
    case 'government':
        return buildGovernmentView(data);
    case 'dashboard':
    default:
        return buildDashboardView(data);
    }
};

const fetchJsonFile = async (path, fallback) => {
    try {
        const response = await fetch(path, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`Unable to load ${path}`);
        }

        return await response.json();
    } catch (error) {
        return fallback;
    }
};

const resolvePage = () => {
    const requestedPage = new URLSearchParams(window.location.search).get('page') || 'dashboard';

    if (Object.prototype.hasOwnProperty.call(pages, requestedPage)) {
        return { activePage: requestedPage, notFound: false };
    }

    return { activePage: 'dashboard', notFound: true };
};

const buildAppData = async () => {
    const [bootstrap, officialBusinesses, ownerBusinesses, ownerSession, officialSession] = await Promise.all([
        fetchJsonFile('./assets/data/bootstrap.json', defaultBootstrap),
        fetchJsonFile('./assets/data/businesses.json', { results: [] }),
        fetchJsonFile('./assets/data/owner-businesses.json', { results: [] }),
        fetchJsonFile('./assets/data/owner-session.json', null),
        fetchJsonFile('./assets/data/official-session.json', null),
    ]);

    return {
        appName: 'LedgerLift Uganda',
        tagline: 'Credit-ready records for informal businesses',
        apiBaseUrl: 'https://ledgerlift-uganda-api.onrender.com/api',
        staticMode: true,
        registrationForm: bootstrap.registrationForm || defaultBootstrap.registrationForm,
        demoAccounts: [],
        heroStats: bootstrap.heroStats || [],
        metrics: bootstrap.metrics || [],
        collections: bootstrap.collections || defaultBootstrap.collections,
        inventoryMix: bootstrap.inventoryMix || defaultBootstrap.inventoryMix,
        scoreTrend: bootstrap.scoreTrend || defaultBootstrap.scoreTrend,
        districtPerformance: bootstrap.districtPerformance || defaultBootstrap.districtPerformance,
        stockAlerts: bootstrap.stockAlerts || [],
        businesses: Array.isArray(officialBusinesses.results) ? officialBusinesses.results : [],
        ownerBusinesses: Array.isArray(ownerBusinesses.results) ? ownerBusinesses.results : [],
        scoreBreakdown: bootstrap.scoreBreakdown || [],
        loanPrograms: bootstrap.loanPrograms || [],
        districtInsights: [],
        watchlist: bootstrap.watchlist || [],
        interventions: bootstrap.interventions || [],
        ownerSession,
        officialSession,
    };
};

const loadSharedRuntime = () => {
    const script = document.createElement('script');
    script.src = './assets/js/app.js';
    document.body.appendChild(script);
};

const renderShell = (appData, activePage, notFound) => {
    const root = document.getElementById('appRoot');
    const pageConfig = pages[activePage];
    const primaryNavKeys = ['dashboard', 'businesses', 'registration'];
    const primaryPages = Object.entries(pages).filter(([pageKey, config]) => (config.nav ?? true) && primaryNavKeys.includes(pageKey));
    const secondaryPages = Object.entries(pages).filter(([pageKey, config]) => (config.nav ?? true) && !primaryNavKeys.includes(pageKey));
    const sidebarButtonClass = secondaryPages.some(([pageKey]) => pageKey === activePage) ? 'btn-warning text-dark' : 'btn-outline-dark';
    const heroSection = activePage === 'dashboard'
        ? `
            <section class="hero-panel mb-3">
                <div class="row align-items-center g-3">
                    <div class="col-lg-7">
                        <span class="eyebrow">${escapeHtml(pageConfig.eyebrow)}</span>
                        <h1 class="display-6 fw-semibold text-white mb-3">${escapeHtml(pageConfig.title)}</h1>
                        <p class="lead text-white-50 mb-3 hero-copy">${escapeHtml(pageConfig.description)}</p>
                        <div class="d-flex flex-wrap gap-3">
                            <a class="btn btn-warning px-4" href="?page=login" data-dashboard-primary-cta>Log in</a>
                            <a class="btn btn-outline-light px-4" href="?page=login#register-account" data-dashboard-secondary-cta>Create account</a>
                        </div>
                    </div>

                    <div class="col-lg-5">
                        <div class="hero-card">
                            <p class="section-kicker mb-3">Pilot pulse</p>
                            <div class="row g-3">
                                ${(appData.heroStats || []).map((stat) => `
                                    <div class="col-6">
                                        <div class="stat-chip h-100">
                                            <strong>${escapeHtml(stat.value)}</strong>
                                            <span>${escapeHtml(stat.label)}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="hero-note mt-3">
                                <strong class="d-block mb-2">Snapshot source</strong>
                                <p class="mb-0 text-muted">This Pages build is using JSON exported from the local Django database, so the public metrics are still grounded in the current registry snapshot.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `
        : '';

    document.title = `${pageConfig.label} | ${appData.appName}`;
    document.body.dataset.page = activePage;

    root.innerHTML = `
        <div class="container-fluid py-3 py-lg-4 position-relative app-shell">
            <header class="mb-3">
                <nav class="navbar navbar-expand-lg app-navbar px-3 px-lg-4 py-3">
                    <a class="navbar-brand d-flex align-items-center gap-3" href="./">
                        <span class="brand-mark">LL</span>
                        <span class="brand-meta">
                            <strong class="d-block text-dark brand-name">${escapeHtml(appData.appName)}</strong>
                            <small class="text-muted brand-tagline">${escapeHtml(appData.tagline)}</small>
                        </span>
                    </a>

                    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#appNav" aria-controls="appNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="appNav">
                        <div class="navbar-nav primary-nav ms-auto gap-lg-2">
                            ${primaryPages.map(([pageKey, config]) => `
                                <a class="nav-link app-nav-link ${activePage === pageKey ? 'active' : ''}" href="${buildHref(pageKey)}">${escapeHtml(config.label)}</a>
                            `).join('')}
                        </div>

                        <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 ms-lg-3 pt-3 pt-lg-0 auth-nav-actions">
                            <button class="btn ${sidebarButtonClass} btn-sm px-3 nav-sidebar-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#appSidebar" aria-controls="appSidebar">
                                More
                            </button>
                            <a class="btn btn-outline-success btn-sm px-3" href="?page=login" data-login-link>Login</a>
                            <button class="btn btn-link btn-sm px-2 text-decoration-none d-none" type="button" data-logout-button>Logout</button>
                        </div>
                    </div>
                </nav>

                <div class="offcanvas offcanvas-end nav-sidebar" tabindex="-1" id="appSidebar" aria-labelledby="appSidebarLabel">
                    <div class="offcanvas-header px-3 px-lg-4">
                        <div>
                            <p class="section-kicker mb-2">More navigation</p>
                            <h2 class="h5 mb-0" id="appSidebarLabel">Additional sections</h2>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body px-3 px-lg-4">
                        <div class="nav-sidebar-session">
                            <span class="auth-chip d-none" data-auth-status></span>
                            <a class="btn btn-warning btn-sm px-3 d-none" href="?page=workspace" data-workspace-link>Workspace</a>
                        </div>
                        <div class="nav-sidebar-list">
                            ${secondaryPages.map(([pageKey, config]) => `
                                <a class="nav-sidebar-link ${activePage === pageKey ? 'active' : ''}" href="${buildHref(pageKey)}">
                                    <span class="fw-semibold d-block">${escapeHtml(config.label)}</span>
                                    <small class="text-muted">${escapeHtml(config.eyebrow)}</small>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </header>

            <section class="alert alert-warning border-0 shadow-sm mb-3">
                <strong>GitHub Pages snapshot mode.</strong> This frontend is rendering from database-exported JSON files. Read-only previews are available here, but real sign-in and save actions require the local stack or a repaired live deployment.
            </section>

            ${heroSection}

            <main class="pb-4">
                ${notFound ? '<div class="alert alert-warning border-0 shadow-sm mb-4">The section you requested does not exist yet. Showing the dashboard instead.</div>' : ''}
                ${buildMainView(activePage, appData)}
            </main>

            <footer class="app-footer py-4">
                <div class="app-footer-card">
                    <div class="app-footer-grid">
                        <div>
                            <p class="section-kicker mb-2">Platform service</p>
                            <strong class="app-footer-heading d-block mb-2">LedgerLift Uganda Pilot</strong>
                            <p class="mb-0">Digital support for business onboarding, credit-readiness review, and public-sector monitoring workflows.</p>
                        </div>
                        <div>
                            <p class="section-kicker mb-2">Snapshot source</p>
                            <p class="mb-1">Exported from the local Django database.</p>
                            <p class="mb-0">Use <strong>run-local.ps1</strong> from the repository root for the full live flow.</p>
                        </div>
                        <div>
                            <p class="section-kicker mb-2">Use and support</p>
                            <p class="mb-1">Read-only Pages preview.</p>
                            <p class="mb-0">For access or operational support, use the live local stack while the public deployment host is unavailable.</p>
                        </div>
                    </div>
                    <div class="app-footer-divider"></div>
                    <p class="app-footer-note mb-0">Information submitted through the live service should be handled in line with applicable privacy, records-management, and audit requirements.</p>
                </div>
            </footer>
        </div>
    `;
};

const initializeStaticFrontend = async () => {
    const { activePage, notFound } = resolvePage();
    const appData = await buildAppData();

    window.finTrackData = appData;
    renderShell(appData, activePage, notFound);
    loadSharedRuntime();
};

initializeStaticFrontend();