<section class="row g-4">
    <div class="col-lg-7">
        <article class="panel mb-4">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Secure entry</p>
                    <h2 class="h4 mb-1">Sign in as an official or business owner</h2>
                    <p class="text-muted mb-0">Officials and linked business owners see different post-login workspaces, but they enter through the same live authentication flow.</p>
                </div>
                <span class="pill-note pill-note-muted align-self-start">Live auth</span>
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
                    <small class="text-muted">Use a live or self-created account. Credentials are no longer exposed in the interface.</small>
                </div>
            </form>
        </article>

        <article class="panel" id="register-account">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Create access</p>
                    <h2 class="h4 mb-1">Create a business owner account</h2>
                    <p class="text-muted mb-0">Self-registration now provisions a business owner profile and links it to one managed business record so the owner can monitor performance and save updates after sign-in.</p>
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
                <div class="col-12">
                    <hr class="my-1">
                </div>
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
                        <option value="">Choose a district</option>
                        <?php foreach ($data['registrationForm']['districts'] as $district): ?>
                            <option value="<?php echo e($district); ?>"><?php echo e($district); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label" for="register_sector">Business sector</label>
                    <select class="form-select" id="register_sector" name="sector" required>
                        <option value="">Choose a sector</option>
                        <?php foreach ($data['registrationForm']['sectors'] as $sector): ?>
                            <option value="<?php echo e($sector); ?>"><?php echo e($sector); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label" for="register_monthly_revenue_band">Monthly revenue band</label>
                    <select class="form-select" id="register_monthly_revenue_band" name="monthly_revenue_band">
                        <option value="">Select revenue band</option>
                        <?php foreach ($data['registrationForm']['revenueBands'] as $band): ?>
                            <option value="<?php echo e($band); ?>"><?php echo e($band); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label" for="register_employee_count">Employee count</label>
                    <input class="form-control" id="register_employee_count" name="employee_count" type="number" min="1" value="1">
                </div>
                <div class="col-12">
                    <hr class="my-1">
                </div>
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
                    <small class="text-muted">Official accounts should still be provisioned by the programme team. Self-registration is for business owners and links one managed business profile immediately.</small>
                </div>
            </form>
        </article>
    </div>

    <div class="col-lg-5">
        <article class="panel mb-4">
            <p class="section-kicker mb-2">Access guidance</p>
            <h2 class="h4 mb-4">How sign-in now works</h2>
            <div class="business-card mb-3">
                <strong class="d-block mb-2">Protected credentials</strong>
                <p class="mb-0 text-muted">The app no longer publishes passwords or quick-fill buttons. Authentication runs against the database-backed account store only.</p>
            </div>
            <div class="business-card mb-3">
                <strong class="d-block mb-2">Business owner self-registration</strong>
                <p class="mb-0 text-muted">Owners can create an account from this page and receive one linked business profile immediately.</p>
            </div>
            <div class="business-card">
                <strong class="d-block mb-2">Official accounts</strong>
                <p class="mb-0 text-muted">Government, lender, and field accounts should be provisioned by the programme team and authenticated directly against the live backend.</p>
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
                <p class="mb-0 text-muted">A private business-health view, linked profile details, and editable account adjustments that persist after the session ends.</p>
            </div>
        </article>
    </div>
</section>