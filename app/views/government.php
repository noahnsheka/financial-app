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
            <?php foreach ($data['watchlist'] as $item): ?>
                <div class="watchlist-item">
                    <strong class="d-block mb-2"><?php echo e($item['title']); ?></strong>
                    <p class="mb-0 text-muted"><?php echo e($item['detail']); ?></p>
                </div>
            <?php endforeach; ?>
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
                Sign in to load the live government categories.
            </div>
        </article>
    </div>

    <div class="col-lg-8">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">District registry</p>
                    <h2 class="h4 mb-1">Live district readiness and fraud watch</h2>
                    <p class="text-muted mb-0">Use this table to decide which districts need verification support, digital onboarding, or lender engagement next.</p>
                </div>
                <span class="pill-note align-self-start" data-government-district-count>Waiting for live data</span>
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
                            <td colspan="5" class="text-muted">Sign in to load the live district analytics.</td>
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
            <h2 class="h4 mb-3">Live actions the government team can take next</h2>
            <div class="row g-3" data-government-interventions>
                <div class="col-12 text-muted">Sign in to load intervention guidance from the live registry.</div>
            </div>
        </article>
    </div>
</section>