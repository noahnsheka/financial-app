<section class="row g-4">
    <div class="col-lg-8">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Onboarding form</p>
                    <h2 class="h4 mb-1">Capture the business details needed for the MVP</h2>
                    <p class="text-muted mb-0">Every registration now lands directly in the database and contributes to the live dashboards, scoring, and owner workspace.</p>
                </div>
                <span class="pill-note pill-note-muted align-self-start" data-service-status>Checking service...</span>
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
                        <option value="">Choose a district</option>
                        <?php foreach ($data['registrationForm']['districts'] as $district): ?>
                            <option value="<?php echo e($district); ?>"><?php echo e($district); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label" for="sector">Business sector</label>
                    <select class="form-select" id="sector" name="sector" required>
                        <option value="">Choose a sector</option>
                        <?php foreach ($data['registrationForm']['sectors'] as $sector): ?>
                            <option value="<?php echo e($sector); ?>"><?php echo e($sector); ?></option>
                        <?php endforeach; ?>
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
                        <option value="">Select revenue band</option>
                        <?php foreach ($data['registrationForm']['revenueBands'] as $band): ?>
                            <option value="<?php echo e($band); ?>"><?php echo e($band); ?></option>
                        <?php endforeach; ?>
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
                    <div class="form-text">Receipts, profit, stock value, and mobile money totals now feed the fraud checks and credit-readiness percentage.</div>
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
                    <small class="text-muted">Saved registrations appear in the live registry and recent submissions feed.</small>
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
                <li>Keep the business profile current because every saved record now feeds the live oversight and owner dashboards.</li>
            </ul>
        </article>

        <article class="panel mb-4">
            <p class="section-kicker mb-2">Fraud control</p>
            <h2 class="h4 mb-4">What the scoring engine cross-checks</h2>
            <div class="business-card mb-3">
                <strong class="d-block mb-2">Stock versus profit</strong>
                <p class="mb-0 text-muted">Inventory values that are far from reported monthly profit reduce the readiness score and raise a fraud watch signal.</p>
            </div>
            <div class="business-card mb-3">
                <strong class="d-block mb-2">Mobile money versus revenue</strong>
                <p class="mb-0 text-muted">The engine compares declared digital inflows against the revenue band to flag unlikely reporting patterns.</p>
            </div>
            <div class="business-card">
                <strong class="d-block mb-2">Receipt trust</strong>
                <p class="mb-0 text-muted">More receipts and higher receipt coverage increase confidence in the record and improve the credit percentage.</p>
            </div>
        </article>

        <article class="panel mb-4">
            <p class="section-kicker mb-2">Data integrity</p>
            <h2 class="h4 mb-4">What changed in this flow</h2>
            <div class="business-card mb-3">
                <strong class="d-block mb-2">No placeholder accounts</strong>
                <p class="mb-0 text-muted">The interface no longer exposes account credentials. Authentication and registrations now depend on the database only.</p>
            </div>
            <div class="business-card mb-3">
                <strong class="d-block mb-2">Live portfolio impact</strong>
                <p class="mb-0 text-muted">Every saved business now affects the dashboard metrics, stock watch, credit analytics, and government view in real time.</p>
            </div>
            <div class="business-card">
                <strong class="d-block mb-2">Owner-ready records</strong>
                <p class="mb-0 text-muted">Each business can now support database-backed stock logs, documents, monthly sales history, and credit drafts in the owner workspace.</p>
            </div>
        </article>

        <article class="panel">
            <p class="section-kicker mb-2">Recent submissions</p>
            <h2 class="h4 mb-4">Latest registrations in the registry</h2>
            <div class="registration-feed" data-registration-feed>
                Recent registrations will appear here when available.
            </div>
        </article>
    </div>
</section>