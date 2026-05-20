<section class="row g-4">
    <div class="col-lg-8">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Onboarding form</p>
                    <h2 class="h4 mb-1">Capture the business details needed for the MVP</h2>
                    <p class="text-muted mb-0">TIN remains optional for now, but businesses with valid TINs will be better positioned for future tax verification and government support services.</p>
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
                    <div class="form-text">Leave blank for demo onboarding. When provided, the record is marked as ready for future tax verification.</div>
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
                    <label class="form-label" for="location_description">Location description</label>
                    <input class="form-control" id="location_description" name="location_description" type="text" placeholder="Trading center, market lane, or village cluster">
                </div>
                <div class="col-12">
                    <label class="form-label" for="notes">Notes</label>
                    <textarea class="form-control" id="notes" name="notes" rows="4" placeholder="Add anything useful for the pilot, such as supplier relationships, seasonal issues, or tax follow-up needs."></textarea>
                </div>
                <div class="col-12">
                    <div class="demo-switch">
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" id="is_demo_account" name="is_demo_account" type="checkbox" data-demo-toggle>
                            <label class="form-check-label fw-semibold" for="is_demo_account">Register as a demo account</label>
                        </div>
                        <p class="mb-0 text-muted small" data-demo-note>Demo accounts can be created without a TIN so the team can showcase onboarding and credit flows before the tax integration is live.</p>
                    </div>
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
            <p class="section-kicker mb-2">TIN strategy</p>
            <h2 class="h4 mb-4">Keep the tax lookup path open</h2>
            <ul class="list-check compact-list mb-0">
                <li>Allow TIN collection now, even if live verification is added later.</li>
                <li>Use demo mode whenever you need a clean showcase account without waiting for tax validation.</li>
                <li>Prioritize valid TINs for businesses that are most likely to move into formal loan programs first.</li>
            </ul>
        </article>

        <article class="panel mb-4">
            <p class="section-kicker mb-2">Demo accounts</p>
            <h2 class="h4 mb-4">Seeded access accounts for the showcase</h2>
            <?php foreach ($data['demoAccounts'] as $account): ?>
                <div class="business-card mb-3">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                        <div>
                            <strong class="d-block"><?php echo e($account['displayName']); ?></strong>
                            <span class="text-muted small"><?php echo e($account['role']); ?></span>
                        </div>
                        <span class="pill-note">No TIN required</span>
                    </div>
                    <div class="small mb-1"><strong>Username:</strong> <?php echo e($account['username']); ?></div>
                    <div class="small mb-2"><strong>Password:</strong> <?php echo e($account['password']); ?></div>
                    <p class="mb-0 text-muted small"><?php echo e($account['note']); ?></p>
                </div>
            <?php endforeach; ?>
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