<section class="row g-3 mb-3">
    <?php foreach ($data['scoreBreakdown'] as $signal): ?>
        <div class="col-md-6 col-xl-3">
            <article class="panel h-100">
                <p class="section-kicker mb-2"><?php echo e($signal['weight']); ?></p>
                <h2 class="h5 mb-3"><?php echo e($signal['name']); ?></h2>
                <p class="text-muted mb-0"><?php echo e($signal['description']); ?></p>
            </article>
        </div>
    <?php endforeach; ?>
</section>

<section class="row g-3 mb-3">
    <div class="col-lg-7">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">Credit trend</p>
                    <h2 class="h4 mb-1">The score improves as records become more complete</h2>
                    <p class="text-muted mb-0">This chart now reflects the live scoring pipeline data returned by the backend.</p>
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
            <h2 class="h4 mb-3">Configured lending channels</h2>

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
                        <?php foreach ($data['loanPrograms'] as $program): ?>
                            <tr>
                                <td>
                                    <strong class="d-block"><?php echo e($program['provider']); ?></strong>
                                    <span class="text-muted small"><?php echo e($program['requirement']); ?></span>
                                </td>
                                <td><?php echo e($program['size']); ?></td>
                                <td><span class="pill-note"><?php echo e($program['status']); ?></span></td>
                            </tr>
                        <?php endforeach; ?>
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
                    <h2 class="h4 mb-1">Signals that now drive the credit percentage</h2>
                    <p class="text-muted mb-0">Signed-in users see live scoring categories built from receipts, stock, mobile money, profit consistency, and identity readiness.</p>
                </div>
                <span class="pill-note align-self-start">Live model</span>
            </div>
            <div class="row g-3" data-credit-live-metrics>
                <div class="col-12 text-muted">Sign in to load live credit analytics.</div>
            </div>
        </article>
    </div>

    <div class="col-lg-5">
        <article class="panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                    <p class="section-kicker mb-2">Credit-ready businesses</p>
                    <h2 class="h4 mb-1">Who could move into the next facility cohort</h2>
                    <p class="text-muted mb-0">This shortlist updates from the live registry and highlights businesses that have the best evidence for underwriting.</p>
                </div>
                <span class="pill-note align-self-start">Live shortlist</span>
            </div>
            <div class="registration-feed" data-credit-shortlist>
                Sign in to load the live credit shortlist.
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
                    <p class="text-muted mb-0">When a live business becomes credit ready, the signed-in owner can submit a NIN here for the NIRA or NITA verification workflow.</p>
                </div>
                <span class="pill-note align-self-start">Owner action</span>
            </div>
            <div data-credit-registration-content>
                Businesses that cross the readiness threshold will expose the NIN registration flow here for the signed-in owner.
            </div>
        </article>
    </div>
</section>