<section class="row g-4" data-role-workspace>
    <div class="col-lg-8">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                    <p class="section-kicker mb-2">Role workspace</p>
                    <h2 class="h3 mb-2" data-workspace-title>Checking your current session</h2>
                    <p class="text-muted mb-0" data-workspace-description>Sign in with one of the seeded demo accounts to unlock a role-based dashboard.</p>
                </div>
                <span class="pill-note pill-note-muted align-self-start" data-auth-session-status>Checking session...</span>
            </div>

            <div class="row g-3 mb-4" data-role-metrics>
                <div class="col-sm-6 col-xl-3">
                    <div class="metric-tile">
                        <span class="section-kicker mb-2">Awaiting login</span>
                        <strong>--</strong>
                    </div>
                </div>
            </div>

            <div class="row g-3" data-role-actions>
                <div class="col-md-6">
                    <div class="business-card h-100">
                        <strong class="d-block mb-2">No active session</strong>
                        <p class="mb-3 text-muted">Open the login page and authenticate with a seeded role account to load your action cards.</p>
                        <a class="btn btn-outline-success btn-sm" href="?page=login">Go to login</a>
                    </div>
                </div>
            </div>
        </article>
    </div>

    <div class="col-lg-4">
        <article class="panel mb-4">
            <p class="section-kicker mb-2">Current access</p>
            <h2 class="h4 mb-4">Signed-in account</h2>
            <div class="auth-profile-card" data-current-user-card>
                <strong class="d-block mb-2">Not signed in</strong>
                <p class="mb-3 text-muted">Use a seeded account to populate this workspace with role-aware content.</p>
                <a class="btn btn-outline-success btn-sm" href="?page=login">Go to login</a>
            </div>
        </article>

        <article class="panel">
            <p class="section-kicker mb-2">Role notes</p>
            <h2 class="h4 mb-4">Operating guidance</h2>
            <div class="registration-feed" data-role-notes>
                Sign in to load the role-specific notes for this account.
            </div>
        </article>
    </div>
</section>