<section class="row g-4">
    <div class="col-lg-7">
        <article class="panel mb-4">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Secure entry</p>
                    <h2 class="h4 mb-1">Sign in with a seeded access account</h2>
                    <p class="text-muted mb-0">Use one of the seeded accounts to open a workspace tailored to that role.</p>
                </div>
                <span class="pill-note pill-note-muted align-self-start">Demo auth enabled</span>
            </div>

            <form class="row g-3" data-login-form>
                <div class="col-md-6">
                    <label class="form-label" for="login_username">Username</label>
                    <input class="form-control" id="login_username" name="username" type="text" placeholder="gov.officer" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label" for="login_password">Password</label>
                    <input class="form-control" id="login_password" name="password" type="password" placeholder="GovDemo123!" required>
                </div>
                <div class="col-12">
                    <div class="form-status" data-login-message></div>
                </div>
                <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center">
                    <button class="btn btn-warning btn-lg px-4" type="submit" data-login-submit>Sign in</button>
                    <small class="text-muted">Use the quick-fill accounts on the right if you are testing the login flow.</small>
                </div>
            </form>
        </article>

        <article class="panel" id="register-account">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Create access</p>
                    <h2 class="h4 mb-1">Create an account to unlock the live platform</h2>
                    <p class="text-muted mb-0">New self-registered accounts start with field access so the user can onboard businesses, review the registry, and open a workspace after sign-in.</p>
                </div>
                <span class="pill-note pill-note-muted align-self-start">Field access by default</span>
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
                    <div class="form-status" data-register-message></div>
                </div>
                <div class="col-12 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center">
                    <button class="btn btn-outline-success btn-lg px-4" type="submit" data-register-submit>Create account</button>
                    <small class="text-muted">Once created, the account is signed in immediately and can open the protected sections.</small>
                </div>
            </form>
        </article>
    </div>

    <div class="col-lg-5">
        <article class="panel mb-4">
            <p class="section-kicker mb-2">Quick fill</p>
            <h2 class="h4 mb-4">Use the seeded demo identities</h2>
            <div class="registration-feed">
                <?php foreach ($data['demoAccounts'] as $account): ?>
                    <div class="feed-item">
                        <strong class="d-block mb-2"><?php echo e($account['displayName']); ?></strong>
                        <div class="text-muted small mb-2"><?php echo e($account['role']); ?></div>
                        <div class="small mb-1"><strong>Username:</strong> <?php echo e($account['username']); ?></div>
                        <div class="small mb-3"><strong>Password:</strong> <?php echo e($account['password']); ?></div>
                        <button
                            class="btn btn-outline-success btn-sm"
                            type="button"
                            data-demo-credential
                            data-username="<?php echo e($account['username']); ?>"
                            data-password="<?php echo e($account['password']); ?>"
                        >
                            Use this account
                        </button>
                    </div>
                <?php endforeach; ?>
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
            <div class="business-card">
                <strong class="d-block mb-2">Field agent</strong>
                <p class="mb-0 text-muted">Business onboarding, demo-mode registrations, and follow-up on incomplete profiles.</p>
            </div>
        </article>
    </div>
</section>